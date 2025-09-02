import { Entity } from "../Entity";

export abstract class Projectile extends Entity {
  radius: number;
  damage: number;
  speed: number;
  direction: number;

  constructor(x: number, y: number, radius: number, damage: number, speed: number, direction: number) {
    super(x, y);
    this.radius = radius;
    this.damage = damage;
    this.speed = speed;
    this.direction = direction;
  }

  update(): void {
    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;
  }

  abstract onHit(target: Entity): void;
}
