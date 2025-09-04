import { LivingEntity } from "../living";
import { Projectile } from "./Projectile";

export class TestProjectile extends Projectile {
    /**
     * 
     * @param x 
     * @param y 
     * @param vx 
     * @param vy 
     * @param damage 
     * @param speed 
     * @param lifetime 
     * @constructor
     */
    constructor(x: number, y: number, vx: number, vy: number, damage: number, speed: number, lifetime: number) {
        super(x, y, vx, vy, damage, undefined, lifetime, 7, speed);
    }

    onHit(target: LivingEntity): void {
        target.hp -= this.damage;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 90);
        ctx.fill();
    }
}