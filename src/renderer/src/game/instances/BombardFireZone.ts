import { Entity } from '../entities/Entity';
import { Game } from '../scenes/Game';
import { isEnemySprite } from '../types/typeGuards';

export class BombardFireZone extends Entity {
  private duration: number;
  private elapsed = 0;
  private tickInterval = 1000;
  private tickTimer = 0;
  private radius: number;
  private damagePerTick: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    radius: number,
    damagePerTick: number,
    duration = 5000
  ) {
    super(scene, x, y, 'bombard_fire_zone');
    this.radius = radius;
    this.damagePerTick = damagePerTick;
    this.duration = duration;
    this.sprite.setScale((radius * 2) / 32);
  }

  update(_time: number, delta: number): void {
    if (!(this.scene instanceof Game)) return;

    this.elapsed += delta;
    this.tickTimer += delta;

    if (this.elapsed >= this.duration) {
      this.destroy();
      return;
    }

    if (this.tickTimer < this.tickInterval) return;
    this.tickTimer = 0;

    const radiusSq = this.radius * this.radius;

    this.scene.enemyManager.enemiesGroup
      .getChildren()
      .filter(isEnemySprite)
      .forEach((enemy) => {
        const dx = enemy.x - this.x;
        const dy = enemy.y - this.y;

        if (dx * dx + dy * dy <= radiusSq) {
          enemy.entity.healthManager.takeDamage(this.damagePerTick);
        }
      });
  }
}
