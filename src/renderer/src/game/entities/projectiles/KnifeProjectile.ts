import { Scene } from 'phaser';
import { LivingEntity } from '../living/LivingEntity';
import { Projectile } from './Projectile';

export class KnifeProjectile extends Projectile {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number,
    speed: number = 300,
    lifetime: number = 2
  ) {
    super(scene, x, y, vx, vy, damage, 5, lifetime, speed, 'knife_projectile');
  }

  onHit(target: LivingEntity): void {
    target.healthManager.takeDamage(this.damage);
    this.healthManager.takeDamage(this.damage);
  }
}
