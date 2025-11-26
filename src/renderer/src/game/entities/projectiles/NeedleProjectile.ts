import { Scene } from 'phaser';
import { LivingEntity } from '../living/LivingEntity';
import { Projectile } from './Projectile';

export class NeedleProjectile extends Projectile {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number,
    lifetime: number = 2
  ) {
    super(scene, x, y, vx, vy, damage, 5, lifetime, Math.sqrt(vx * vx + vy * vy), 'projectile');
  }

  onHit(target: LivingEntity): void {
    const body = target.sprite.body as Phaser.Physics.Arcade.Body;
    const originalVelocity = body.velocity.clone();
    body.setVelocity(0, 0);
    this.scene.time.delayedCall(400, () => {
      body.setVelocity(originalVelocity.x, originalVelocity.y);
    });
  }
}

