import { LivingEntity } from "../living";
import { Projectile } from "./Projectile";

export class KnifeProjectile extends Projectile {
  constructor(x: number, y: number, dirX: number, dirY: number, damage: number, speed: number, lifetime: number) {
    const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
    super(x, y, (dirX / len) * speed, (dirY / len) * speed, lifetime, 5, damage, speed);
  }

  onHit(target: LivingEntity): void {
    target.hp -= this.damage;
  }

  update(dt: number): void {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.lifetime -= dt;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "sliver";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}