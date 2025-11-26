import { Scene } from 'phaser';
import { Enemy, LivingEntity } from '../entities/living';
import { Needle } from '../weapons';
import { Projectile } from './Projectile';

export class NeedleProjectile extends Projectile {
  weapon: Needle;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number,
    speed: number = 300,
    lifetime: number,
    weapon: Needle,
    sizeMultipler = 1
  ) {
    super(
      scene,
      x,
      y,
      vx,
      vy,
      damage,
      5,
      lifetime,
      speed,
      'needle_projectile',
      0.15 * sizeMultipler
    );
    this.weapon = weapon;

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.allowRotation = true;
    body.setSize(this.sprite.displayWidth, this.sprite.displayHeight, true);

    const angle = Phaser.Math.RadToDeg(Math.atan2(vy, vx));
    this.sprite.setAngle(angle + 90);
  }

  onHit(target: LivingEntity): void {
    target.healthManager.takeDamage(this.damage);

    if (this.weapon.stunEnabled && 'applyStun' in target) {
      (target as Enemy).applyStun(1000);
    }

    this.healthManager.takeDamage(this.damage);
  }
}
