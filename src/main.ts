import type { Bullet } from "./entities/bullet";
import { Enemy } from "./entities/enemy";
import { Player } from "./entities/player";
import "./style.css";
import { distance } from "./utils";

export const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

export const keys: Record<string, boolean> = {};
export const bullets: Bullet[] = [];
export const enemies: Enemy[] = [];
let lastTime = 0;
let spawnTimer = 0;

export const player = new Player();

window.addEventListener('keydown', (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function update(dt: number) {
  player.update(dt);

  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    spawnTimer = 2;
    const side = Math.random() < 0.5 ? 0 : canvas.width;
    const y = Math.random() * canvas.height;
    enemies.push(new Enemy(side, y, player));
  }

  enemies.forEach((e) => e.update(dt));
  bullets.forEach((b) => b.update(dt));

  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (distance(enemies[i], bullets[j]) < enemies[i].radius + bullets[j].radius) {
        enemies[i].hp--;
        bullets.splice(j, 1);
        if (enemies[i].hp <= 0) {
          enemies.splice(i, 1);
          player.gainExp(5);
        }
        break;
      }
    }
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw(ctx);
  enemies.forEach((e) => e.draw(ctx));
  bullets.forEach((b) => b.draw(ctx));
}

function gameLoop(timestamp: number) {
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  
  update(dt);
  render();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);