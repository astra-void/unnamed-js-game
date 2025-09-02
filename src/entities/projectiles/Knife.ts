import type { LivingEntity } from "../living";
import { Projectile } from "./Projectile";

export class KnifeProjectile extends Projectile {
  constructor(x: number, y: number, radius: number, damage: number, speed: number, direction: number) {
    super(x, y, radius, damage, speed, direction);
    this.damage = damage;
  }

  onHit(target: LivingEntity): void {
    target.hp -= this.damage;
  }

  draw(ctx: CanvasRenderingContext2D): void {
      
  }
}