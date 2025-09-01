import { Bullet } from "./bullet";
import { bullets, canvas, keys } from "../main";
import type { Entity } from "./types";

export class Player implements Entity {
    x = canvas.width / 2;
    y = canvas.height / 2
    radius = 16;
    speed = 200; // pixels per second
    hp = 100;
    exp = 0;
    level = 1;
    fireCooldown = 0; // seconds

    update(dt: number) {
        if (keys["ArrowUp"] || keys["w"]) this.y -= this.speed * dt;
        if (keys["ArrowDown"] || keys["s"]) this.y += this.speed * dt;
        if (keys["ArrowLeft"] || keys["a"]) this.x -= this.speed * dt;
        if (keys["ArrowRight"] || keys["d"]) this.x += this.speed * dt;

        this.fireCooldown -= dt;
        if (this.fireCooldown <= 0) {
            this.fireCooldown = 1;
            bullets.push(new Bullet(this.x, this.y, 0, -300));
        }
    };

    gainExp(amount: number) {
        this.exp += amount;
        if (this.exp >= this.level * 10) {
            this.exp = 0;
            this.level++;
            console.log(`lvl up; current level: ${this.level}`);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}