import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { Weapon } from './Weapon';
import { Game } from '../scenes/Game';

export class JellyBombardment extends Weapon {
  private damages = [100, 100, 300, 300, 300];
  private cooldowns = [20, 15, 15, 15, 15];
  private radii = [60, 60, 60, 90, 90];

  constructor(scene: Scene, player: Player) {
    super(scene, '젤리 폭격', '적 위치에 포격', player, 0, 0, 20, 100);
  }

  attack(): void {
    if (!(this.scene instanceof Game)) return;

    const damageMultiplier = 1 + (this.player.damageBonus ?? 0);
    const damage = this.damages[this.level - 1] * damageMultiplier;
    const radius = this.radii[this.level - 1];

    for (let i = 0; i < 3; i++) {
      this.scene.time.delayedCall(i * 200, () => {
        const target = this.pickTarget();
        if (!target) return;
        this.dealExplosion(target.x, target.y, radius, damage);

        if (this.level >= 5) {
          this.createFireZone(target.x, target.y, radius);
        }
      });
    }
  }

  protected onLevelUp(_player: Player): void {
    this.cooldown = this.cooldowns[this.level - 1];
  }

  private pickTarget() {
    const enemies = this.scene.enemyManager.enemiesGroup.getChildren();
    if (enemies.length === 0) return null;
    return enemies[Math.floor(Math.random() * enemies.length)] as Phaser.GameObjects.Sprite;
  }

  private dealExplosion(x: number, y: number, radius: number, damage: number) {
    const r2 = radius * radius;
    this.scene.enemyManager.enemiesGroup.getChildren().forEach((sprite) => {
      const enemy = sprite as Phaser.GameObjects.Sprite & { entity: any };
      const dx = enemy.x - x;
      const dy = enemy.y - y;
      if (dx * dx + dy * dy <= r2) {
        enemy.entity.healthManager.takeDamage(damage);
      }
    });
  }

  private createFireZone(x: number, y: number, radius: number) {
    const damagePerTick = 45 * (1 + (this.player.damageBonus ?? 0));
    for (let i = 1; i <= 5; i++) {
      this.scene.time.delayedCall(i * 1000, () => {
        this.dealExplosion(x, y, radius, damagePerTick);
      });
    }
  }
}

