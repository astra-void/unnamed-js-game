import { Scene } from 'phaser';
import { LivingEntity } from '../living/LivingEntity';

export abstract class Projectile extends LivingEntity {
  vx: number;
  vy: number;
  lifetime: number;
  damage: number;
  speed: number;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number,
    maxHp: number = damage,
    lifetime: number,
    speed = 200,
    texture: string = 'projectile'
  ) {
    super(scene, x, y, texture, maxHp);
    this.vx = vx;
    this.vy = vy;
    this.lifetime = lifetime;
    this.damage = damage;
    this.speed = speed;

    scene.physics.add.existing(this.sprite);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(vx, vy);
    body.setCollideWorldBounds(false);
  }

  update(_time: number, delta: number): void {
    const dt = delta / 1000;
    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.destroy();
    }
  }

  abstract onHit(target: LivingEntity): void;

  destroy() {
    this.sprite.destroy();
  }
}
