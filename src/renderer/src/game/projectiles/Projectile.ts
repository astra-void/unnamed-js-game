import { Scene } from 'phaser';
import { LivingEntity } from '../entities/living';
import { HealthManager } from '../managers';

export abstract class Projectile extends LivingEntity {
  vx: number;
  vy: number;
  lifetime: number;
  damage: number;
  speed: number;
  destroyed: boolean = false;

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
    texture: string = 'projectile',
    size: number = 1
  ) {
    super(scene, x, y, 'projectile', 'projectile', texture);
    this.vx = vx;
    this.vy = vy;
    this.lifetime = lifetime;
    this.damage = damage;
    this.speed = speed;

    this.healthManager = new HealthManager(this, maxHp);

    (this.sprite as Phaser.GameObjects.Sprite & { entity: Projectile }).entity =
      this;

    scene.physics.add.existing(this.sprite);
    this.sprite.setScale(size);

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(vx, vy);
    body.setCollideWorldBounds(false);
  }

  update(_time: number, delta: number): void {
    if (this.destroyed) return;

    const dt = delta / 1000;
    this.lifetime -= dt;

    if (this.lifetime <= 0) {
      this.destroy();
    }
  }

  abstract onHit(target: LivingEntity): void;

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
  }
}
