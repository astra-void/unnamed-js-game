import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { Game } from '../scenes/Game';
import { isEnemySprite } from '../types/typeGuards';
import { Weapon } from './Weapon';

export class GummyStaff extends Weapon {
  player: Player;
  private headCount = 3;
  private orbitRadius = 90;
  private rotationTime = 3;
  private currentAngle = 0;
  private headHitRadius = 28;
  private headSprites: Phaser.GameObjects.Sprite[] = [];
  private headPositions: { x: number; y: number }[] = [];

  constructor(scene: Scene, player: Player) {
    super(
      scene,
      '곰젤리의 지팡이',
      '주변에 곰젤리 머리를 소환하여 주변을 돔',
      'gummy_staff',
      player,
      0.15,
      50
    );
    this.player = player;

    this.createHeadSprites();
    this.updateOrbit(0);

    this.scene.events.on('update', this.handleUpdate, this);
  }

  protected onLevelUp(): void {
    switch (this.level) {
      case 1:
        this.cooldown = this.rotationTime / 20;
        this.damage = 50;
        break;
      case 2:
        this.damage = 75;
        break;
      case 3:
        this.rotationTime = 2;
        this.cooldown = this.rotationTime / 20;
        break;
      case 4:
        this.headCount = 4;
        break;
      case 5:
        this.damage = 100;
        this.rotationTime = 1.5;
        this.cooldown = this.rotationTime / 20;
        break;
    }

    this.syncHeadCount();
  }

  attack(): void {
    if (!(this.scene instanceof Game)) return;

    const damage = this.getDamage();
    const radiusSq = this.headHitRadius * this.headHitRadius;
    const enemies = this.scene.enemyManager.enemiesGroup
      .getChildren()
      .filter(isEnemySprite);

    if (!this.headPositions.length) {
      this.updateOrbit(0);
    }

    this.headPositions.forEach(({ x: hx, y: hy }) => {
      enemies.forEach((enemySprite) => {
        const dx = enemySprite.x - hx;
        const dy = enemySprite.y - hy;

        if (dx * dx + dy * dy <= radiusSq) {
          enemySprite.entity.healthManager.takeDamage(damage);
        }
      });
    });
  }

  private createHeadSprites() {
    this.headSprites = new Array(this.headCount)
      .fill(null)
      .map(() =>
        this.scene.add
          .sprite(this.player.x, this.player.y, 'head')
          .setScale(1)
          .setDepth(1)
      );
  }

  private syncHeadCount() {
    if (this.headSprites.length < this.headCount) {
      const diff = this.headCount - this.headSprites.length;
      for (let i = 0; i < diff; i++) {
        this.headSprites.push(
          this.scene.add
            .sprite(this.player.x, this.player.y, 'head')
            .setScale(1)
            .setDepth(1)
        );
      }
    } else if (this.headSprites.length > this.headCount) {
      const excess = this.headSprites.splice(this.headCount);
      excess.forEach((sprite) => sprite.destroy());
    }
  }

  private handleUpdate(_time: number, delta: number) {
    this.updateOrbit(delta);
  }

  private updateOrbit(delta: number) {
    this.syncHeadCount();

    const rotationSpeed = (Math.PI * 2) / this.rotationTime;
    const deltaSeconds = delta / 1000;
    this.currentAngle =
      (this.currentAngle + rotationSpeed * deltaSeconds) % (Math.PI * 2);

    this.headPositions = new Array(this.headCount);

    for (let i = 0; i < this.headCount; i++) {
      const angle = this.currentAngle + (i * (Math.PI * 2)) / this.headCount;
      const hx = this.player.x + Math.cos(angle) * this.orbitRadius;
      const hy = this.player.y + Math.sin(angle) * this.orbitRadius;

      this.headPositions[i] = { x: hx, y: hy };

      const head = this.headSprites[i];
      if (head) {
        head.setPosition(hx, hy);
        head.setVisible(true);
      }
    }
  }

  destroy(): void {
    this.headSprites.forEach((sprite) => sprite.destroy());
    this.scene.events.off('update', this.handleUpdate, this);
    super.destroy();
  }
}
