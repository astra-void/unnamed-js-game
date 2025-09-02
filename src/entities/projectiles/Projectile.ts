import { Entity } from "../Entity";

export abstract class Projectile extends Entity {
  vx: number;
  vy: number;
  lifetime: number;
  radius: number;
  damage: number;
  speed: number;

  constructor(x: number, y: number, vx: number, vy: number, lifetime: number, radius: number, damage: number, speed: number) {
    super(x, y);
    this.vx = vx;
    this.vy = vy;
    this.lifetime = lifetime;
    this.radius = radius;
    this.damage = damage;
    this.speed = speed;
  }

  abstract update(dt: number): void;
  abstract onHit(target: Entity): void;
}
