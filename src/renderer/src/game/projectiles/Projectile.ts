import { GameObjects, Scene } from 'phaser';
import { HealthManager } from '../managers';
import { LivingEntity } from '../entities/living';

export abstract class Projectile {
  scene: Scene;
  x: number;
  y: number;
  name: string;
  id: string;
  texture: string;
  vx: number;
  vy: number;
  lifetime: number;
  damage: number;
  speed: number;
  sprite: GameObjects.Sprite;

  healthManager: HealthManager;

  constructor(
    scene: Scene,
    vx: number,
    vy: number,
    damage: number,
    maxHp: number = damage,
    lifetime: number,
    speed = 200,
    texture: string = 'projectile'
  ) {
    this.scene = scene;
    this.name = 'projcetile';
    this.id = 'projectile';
    this.texture = texture;
    this.vx = vx;
    this.vy = vy;
    this.lifetime = lifetime;
    this.damage = damage;
    this.speed = speed;
    this.sprite = scene.add.sprite(0, 0, texture);

    this.healthManager = new HealthManager(this, maxHp);

    (this.sprite as Phaser.GameObjects.Sprite & { entity: Projectile }).entity =
      this;

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