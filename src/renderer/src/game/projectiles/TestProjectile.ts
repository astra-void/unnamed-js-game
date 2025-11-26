import { Scene } from 'phaser';
import { LivingEntity } from '../entities/living';
import { Projectile } from './Projectile';

export class TestProjectile extends Projectile {
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
    super(scene, x, y, vx, vy, damage, 7, lifetime, speed, 'projectile');
  }

  onHit(target: LivingEntity): void {
    target.healthManager.takeDamage(this.damage);
    this.healthManager.takeDamage(this.damage);
  }
}
