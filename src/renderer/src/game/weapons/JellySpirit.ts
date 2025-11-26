import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { Weapon } from './Weapon';
import { Game } from '../scenes/Game';

export class JellySpirit extends Weapon {
  private damages = [90, 90, 90, 140, 140];
  private cooldowns = [10, 7, 7, 7, 7];
  private explosionRadius = [80, 80, 110, 110, 110];

  constructor(scene: Scene, player: Player) {
    super(scene, '곰젤리의 원혼', '주기적으로 폭탄을 소환한다', player, 0, 0, 10, 90);
  }

  attack(): void {
    if (!(this.scene instanceof Game)) return;

    const damageMultiplier = 1 + (this.player.damageBonus ?? 0);
    const damage = this.damages[this.level - 1] * damageMultiplier;
    const radius = this.explosionRadius[this.level - 1];
    const bombCount = this.level >= 5 ? 2 : 1;

    for (let i = 0; i < bombCount; i++) {
      this.spawnBomb(damage, radius);
    }
  }

  protected onLevelUp(_player: Player): void {
    this.cooldown = this.cooldowns[this.level - 1];
  }

  private spawnBomb(damage: number, radius: number) {
    const enemies = this.scene.enemyManager.enemiesGroup.getChildren();
    let targetX = this.player.x;
    let targetY = this.player.y;

    if (enemies.length > 0) {
      const target = enemies[Math.floor(Math.random() * enemies.length)] as Phaser.GameObjects.Sprite;
      targetX = target.x;
      targetY = target.y;
    }

    this.scene.time.delayedCall(500, () => {
      const r2 = radius * radius;
      this.scene.enemyManager.enemiesGroup
        .getChildren()
        .forEach((sprite) => {
          const enemy = sprite as Phaser.GameObjects.Sprite & { entity: any };
          const dx = enemy.x - targetX;
          const dy = enemy.y - targetY;
          if (dx * dx + dy * dy <= r2) {
            enemy.entity.healthManager.takeDamage(damage);
          }
        });
    });
  }
}

