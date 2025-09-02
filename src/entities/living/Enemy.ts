import { LivingEntity } from "./LivingEntity";

export class Enemy extends LivingEntity {
    radius: number;
    speed: number;
    damage: number;
    target: LivingEntity;
    
    constructor(x: number, y: number, maxHp: number, radius = 12, speed = 200, damage: number, target: LivingEntity) {
        super(x, y, maxHp);
        this.radius = radius;
        this.speed = speed;
        this.damage = damage;
        this.target = target;
    }

    update(dt: number): void {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.hypot(dx, dy);

        this.x += (dx / dist) * this.speed * dt;
        this.y += (dy / dist) * this.speed * dt;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'rgb(255, 0, 0)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill;
    }
}