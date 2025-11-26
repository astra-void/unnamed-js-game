import { Scene } from 'phaser';
import { Game } from '../scenes/Game';
import { isEnemySprite } from '../types/typeGuards';
import { Projectile } from './Projectile';

export class GummySoulBomb extends Projectile {
  private explosionRadius: number;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number,
    speed: number,
    lifetime: number,
    explosionRadius: number
  ) {
    super(
      scene,
      x,
      y,
      vx,
      vy,
      damage,
      damage,
      lifetime,
      speed,
      'gummy_soul_bomb',
      0.7
    );
    this.explosionRadius = explosionRadius;
  }

  private explode() {
    if (this.destroyed) return;

    if (this.scene instanceof Game) {
      const radiusSq = this.explosionRadius * this.explosionRadius;
      this.scene.enemyManager.enemiesGroup
        .getChildren()
        .forEach((enemySprite) => {
          if (!isEnemySprite(enemySprite)) return;

          const dx = enemySprite.x - this.x;
          const dy = enemySprite.y - this.y;

          if (dx * dx + dy * dy <= radiusSq) {
            enemySprite.entity.healthManager.takeDamage(this.damage);
          }
        });
    }

    this.destroy();
  }

  onHit(): void {
    this.explode();
  }

  update(_time: number, delta: number): void {
    if (this.destroyed) return;

    const dt = delta / 1000;
    this.lifetime -= dt;

    if (this.lifetime <= 0) {
      this.explode();
    }
  }
}
