import type { Entity } from "./types";

export class Bullet implements Entity {
  radius = 5;
  x: number;
  y: number;
  vx: number;
  vy: number;

  constructor(x: number, y: number, vx: number, vy: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  update(dt: number) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "cyan";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
