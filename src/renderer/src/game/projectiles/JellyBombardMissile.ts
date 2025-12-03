import { Scene } from 'phaser';
import { BombardFireZone } from '../instances';
import { Game } from '../scenes/Game';
import { isEnemySprite } from '../types/typeGuards';
import { Projectile } from './Projectile';

interface BurnOptions {
  damagePerTick: number;
  duration: number;
}

export class JellyBombardMissile extends Projectile {
  private target: Phaser.Math.Vector2;
  private explosionRadius: number;
  private burnOptions?: BurnOptions;
  private arrivalThreshold: number;
  private reticle?: Phaser.GameObjects.Sprite;

  constructor(
    scene: Scene,
    startX: number,
    startY: number,
    targetX: number,
    targetY: number,
    damage: number,
    explosionRadius: number,
    speed = 320,
    lifetime = 4,
    burnOptions?: BurnOptions
  ) {
    const direction = new Phaser.Math.Vector2(
      targetX - startX,
      targetY - startY
    )
      .normalize()
      .scale(speed);

    super(
      scene,
      startX,
      startY,
      direction.x,
      direction.y,
      damage,
      damage,
      lifetime,
      speed,
      'jelly_bombard_missile',
      1
    );

    this.target = new Phaser.Math.Vector2(targetX, targetY);
    this.explosionRadius = explosionRadius;
    this.arrivalThreshold = Math.max(12, speed * 0.05);
    this.burnOptions = burnOptions;

    this.createReticle();
  }

  private createReticle() {
    this.reticle = this.scene.add.sprite(
      this.target.x,
      this.target.y,
      'jelly_bombard_reticle'
    );
    this.reticle.setDepth(0.2).setAlpha(0.85);
    this.reticle.setScale(this.explosionRadius / 60);

    this.scene.tweens.add({
      targets: this.reticle,
      scale: {
        from: this.reticle.scale,
        to: this.reticle.scale * 1.1
      },
      alpha: { from: 0.85, to: 0.35 },
      duration: 500,
      yoyo: true,
      repeat: -1
    });
  }

  private detonate() {
    if (this.destroyed) return;

    this.spawnExplosionEffect();
    this.applyExplosionDamage();
    this.spawnBurnZone();

    this.reticle?.destroy();
    this.destroy();
  }

  private spawnExplosionEffect() {
    const explosion = this.scene.add.sprite(
      this.x,
      this.y,
      'jelly_bombard_explosion'
    );
    explosion
      .setScale(this.explosionRadius / 64)
      .setAlpha(0.9)
      .setDepth(0.6);

    this.scene.tweens.add({
      targets: explosion,
      scale: (this.explosionRadius / 64) * 1.2,
      alpha: 0,
      duration: 350,
      ease: 'Cubic.easeOut',
      onComplete: () => explosion.destroy()
    });
  }

  private applyExplosionDamage() {
    if (!(this.scene instanceof Game)) return;

    const radiusSq = this.explosionRadius * this.explosionRadius;

    this.scene.enemyManager.enemiesGroup
      .getChildren()
      .filter(isEnemySprite)
      .forEach((enemy) => {
        const dx = enemy.x - this.x;
        const dy = enemy.y - this.y;

        if (dx * dx + dy * dy <= radiusSq) {
          enemy.entity.healthManager.takeDamage(this.damage);
        }
      });
  }

  private spawnBurnZone() {
    if (!(this.scene instanceof Game)) return;
    if (!this.burnOptions) return;

    const zone = new BombardFireZone(
      this.scene,
      this.x,
      this.y,
      this.explosionRadius,
      this.burnOptions.damagePerTick,
      this.burnOptions.duration
    );

    this.scene.instanceManager.add(zone.sprite);
  }

  onHit(): void {
    this.detonate();
  }

  update(_time: number, delta: number): void {
    if (this.destroyed) return;

    const dt = delta / 1000;
    this.lifetime -= dt;

    const distanceToTarget = Phaser.Math.Distance.BetweenPoints(
      this,
      this.target
    );

    if (distanceToTarget <= this.arrivalThreshold || this.lifetime <= 0) {
      this.detonate();
      return;
    }
  }

  destroy(): void {
    if (this.destroyed) return;

    this.reticle?.destroy();
    super.destroy();
  }
}
