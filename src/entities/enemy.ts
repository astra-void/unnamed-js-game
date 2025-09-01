import type { Player } from "./player";
import type { Entity } from "./types";

export class Enemy implements Entity {
  radius = 12;
  speed = 80;
  hp = 3;
  x: number;
  y: number;
  private target: Player;

  constructor(x: number, y: number, target: Player) {
    this.x = x;
    this.y = y;
    this.target = target;
  }

  update(dt: number) {
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    this.x += (dx / len) * this.speed * dt;
    this.y += (dy / len) * this.speed * dt;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}