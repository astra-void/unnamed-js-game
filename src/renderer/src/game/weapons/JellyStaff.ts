import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { Weapon } from './Weapon';
import { Game } from '../scenes/Game';

interface OrbitingHead {
  sprite: Phaser.GameObjects.Arc;
  angle: number;
}

export class JellyStaff extends Weapon {
  private heads: OrbitingHead[] = [];
  private damageLevels = [50, 75, 75, 75, 100];
  private rotationPeriods = [3, 3, 2, 2, 1.5];
  private radius = 70;

  constructor(scene: Scene, player: Player) {
    super(scene, '곰젤리의 지팡이', '곰젤리 머리가 주위를 돈다', player, 0, 0, 0.2, 50);
    this.setupHeads();
  }

  attack(): void {
    // damage is handled in update()
  }

  update(dt: number): void {
    if (!(this.scene instanceof Game)) return;

    const headCount = this.level >= 4 ? 4 : 3;
    if (this.heads.length !== headCount) {
      this.resetHeads(headCount);
    }

    const damageMultiplier = 1 + (this.player.damageBonus ?? 0);
    const damage = this.damageLevels[this.level - 1] * damageMultiplier;
    const rotationSpeed = (Math.PI * 2) / this.rotationPeriods[this.level - 1];

    this.heads.forEach((head, index) => {
      head.angle += rotationSpeed * dt;
      const angle = head.angle + (index * Math.PI * 2) / this.heads.length;
      head.sprite.x = this.player.x + Math.cos(angle) * this.radius;
      head.sprite.y = this.player.y + Math.sin(angle) * this.radius;

      this.scene.enemyManager.enemiesGroup.getChildren().forEach((sprite) => {
        const enemy = sprite as Phaser.GameObjects.Sprite & { entity: any };
        const dx = enemy.x - head.sprite.x;
        const dy = enemy.y - head.sprite.y;
        if (dx * dx + dy * dy <= 20 * 20) {
          enemy.entity.healthManager.takeDamage(damage);
        }
      });
    });
  }

  private setupHeads() {
    this.resetHeads(3);
  }

  private resetHeads(count: number) {
    this.heads.forEach((h) => h.sprite.destroy());
    this.heads = [];
    for (let i = 0; i < count; i++) {
      const sprite = this.scene.add.circle(this.player.x, this.player.y, 10, 0x00ffcc).setDepth(1);
      this.heads.push({ sprite, angle: 0 });
    }
  }
}

