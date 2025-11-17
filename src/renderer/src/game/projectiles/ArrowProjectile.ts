import { Scene } from 'phaser';
import { LivingEntity } from '../entities/living';
import { Projectile } from './Projectile';

export class ArrowProjectile extends Projectile {
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
    super(scene, x, y, vx, vy, damage, 5, lifetime, speed, 'arrow_projectile');

    const scale = 0.1;
    this.sprite.setScale(scale);

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.allowRotation = true;
    body.setSize(this.sprite.displayWidth, this.sprite.displayHeight, true);

    const angle = Phaser.Math.RadToDeg(Math.atan2(vy, vx));
    this.sprite.setAngle(angle + 90);
  }

  onHit(target: LivingEntity): void {
    target.healthManager.takeDamage(this.damage);
    this.healthManager.takeDamage(this.damage);
  }
}
