import { LivingEntity } from "../living";

export abstract class Projectile extends LivingEntity {
  vx: number;
  vy: number;
  lifetime: number;
  radius: number;
  damage: number;
  speed: number;

  /**
   * 
   * @param x 
   * @param y 
   * @param vx 
   * @param vy 
   * @param damage 
   * @param hp 
   * @param lifetime 
   * @param radius 
   * @param speed 
   * @constructor
   */
  constructor(x: number, y: number, vx: number, vy: number,  damage: number, hp: number = damage, lifetime: number, radius: number, speed: number) {
    super(x, y, hp);
    this.vx = vx;
    this.vy = vy;
    this.lifetime = lifetime;
    this.radius = radius;
    this.damage = damage;
    this.speed = speed;
  }

  update(dt: number): void {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.lifetime -= dt;

    if (this.lifetime <= 0) this.hp = 0;
  }
  abstract onHit(target: LivingEntity): void;
}
