import { keys } from "../../main";
import type { Weapon } from "../item";
import { LivingEntity } from "./LivingEntity";

export class Player extends LivingEntity {
    radius: number;
    speed: number;
    exp: number;
    level: number;
    weapons: Weapon[];

    constructor(x: number, y: number, maxHp: number, radius = 16, speed = 200, exp = 0, level = 1, weapons: Weapon[]) {
        super(x, y, maxHp);
        this.radius = radius;
        this.speed = speed;
        this.exp = exp;
        this.level = level;
        this.weapons = weapons;
    }

    update(dt: number): void {
        if (keys["ArrowUp"] || keys["w"]) this.y -= this.speed * dt;
        if (keys["ArrowDown"] || keys["s"]) this.y += this.speed * dt;
        if (keys["ArrowLeft"] || keys["a"]) this.x -= this.speed * dt;
        if (keys["ArrowRight"] || keys["d"]) this.x += this.speed * dt;

        /* TODO: WEAPONS FIRE LOGIC HERE
        if (this.fireCooldown <= 0) {
            this.fireCooldown = 0.5;
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const speed = 200;
            const vx = (dx / len) * speed;
            const vy = (dy / len) * speed;
            for (const weapon of this.weapons) {
                
            }
        } 
        */
    }

    gainExp(amount: number) {
        this.exp += amount;
        if (this.exp >= this.level * 10) {
            this.exp = 0;
            this.level++;
            console.log(`level up current level: ${this.level}`); // PLACEHOLDER: TEMP
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "red";
        ctx.fillRect(this.x - 20, this.y - 40, 40 * (this.hp / 100), 5);
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x - 20, this.y - 40, 40, 5);
    }
}