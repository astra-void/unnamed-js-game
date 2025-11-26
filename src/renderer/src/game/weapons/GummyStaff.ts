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
  }

  attack(): void {
    if (!(this.scene instanceof Game)) return;

    const step = (2 * Math.PI * this.cooldown) / this.rotationTime;
    this.currentAngle = (this.currentAngle + step) % (Math.PI * 2);

    const damage = this.getDamage();
    const radiusSq = this.headHitRadius * this.headHitRadius;
    const enemies = this.scene.enemyManager.enemiesGroup
      .getChildren()
      .filter(isEnemySprite);

    for (let i = 0; i < this.headCount; i++) {
      const angle = this.currentAngle + (i * (Math.PI * 2)) / this.headCount;
      const hx = this.player.x + Math.cos(angle) * this.orbitRadius;
      const hy = this.player.y + Math.sin(angle) * this.orbitRadius;

      enemies.forEach((enemySprite) => {
        const dx = enemySprite.x - hx;
        const dy = enemySprite.y - hy;

        if (dx * dx + dy * dy <= radiusSq) {
          enemySprite.entity.healthManager.takeDamage(damage);
        }
      });
    }
  }
}
