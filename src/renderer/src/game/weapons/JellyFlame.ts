import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { Game } from '../scenes/Game';
import { isEnemySprite } from '../types/typeGuards';
import { Weapon } from './Weapon';

export class JellyFlame extends Weapon {
  player: Player;
  private radius = 110;
  private aura?: Phaser.GameObjects.Sprite;

  constructor(scene: Scene, player: Player) {
    super(
      scene,
      '젤리의 성화',
      '자신을 중심으로하여 원형태의 도트딜지대 형성',
      'jelly_flame',
      player,
      0.5,
      30
    );
    this.player = player;

    this.createAura();
    this.updateAuraVisual();

    this.scene.events.on('update', this.handleUpdate, this);
  }

  protected onLevelUp(): void {
    switch (this.level) {
      case 1:
        this.damage = 30;
        this.cooldown = 0.5;
        break;
      case 3:
        this.damage = 40;
        break;
      case 5:
        this.damage = 50;
        this.radius = 130;
        break;
    }

    this.updateAuraVisual();
  }

  attack(): void {
    if (!(this.scene instanceof Game)) return;

    const radiusSq = this.radius * this.radius;

    this.updateAuraVisual();

    this.scene.enemyManager.enemiesGroup
      .getChildren()
      .filter(isEnemySprite)
      .forEach((enemy) => {
        const dx = enemy.x - this.player.x;
        const dy = enemy.y - this.player.y;

        if (dx * dx + dy * dy <= radiusSq) {
          enemy.entity.healthManager.takeDamage(this.damage);
        }
      });
  }

  private createAura() {
    this.aura = this.scene.add
      .sprite(this.player.x, this.player.y, 'jelly_flame_zone')
      .setAlpha(0.4)
      .setDepth(0.5);

    this.updateAuraVisual();
  }

  private updateAuraVisual() {
    if (!this.aura) return;

    this.aura.setDisplaySize(this.radius * 2, this.radius * 2);
    this.aura.setPosition(this.player.x, this.player.y);
  }

  private handleUpdate() {
    this.updateAuraVisual();
  }

  destroy(): void {
    this.aura?.destroy();
    this.scene.events.off('update', this.handleUpdate, this);
    super.destroy();
  }
}
