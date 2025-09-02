import { Player, Projectile, Enemy } from "./entities";
import { checkCollision, distance } from "./utils";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player: Player;
  projectiles: Projectile[];
  enemies: Enemy[];
  gameOver: boolean;
  lastTime: number;
  spawnTimer: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.player = new Player(this.canvas.width / 2, this.canvas.height / 2, 100, 6, 200, 0, 1, []);
    this.projectiles = [];
    this.enemies = [];
    this.gameOver = false;
    this.lastTime = 0;
    this.spawnTimer = 2;

    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  loop(timestamp: number) {
    const dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    if (!this.gameOver) {
      this.update(dt);
      this.draw();
      requestAnimationFrame(this.loop);
    } else {
      this.drawGameOver();
    }
  }

  update(dt: number) {
    this.player.update(dt);

    // All projectiles update
    this.projectiles.forEach(p => p.update(dt));

    // Enemy spawn
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = 2;
      this.spawnEnemy();
    }

    // Enemy update + Player collision
    this.enemies.forEach(enemy => {
      enemy.update(dt);
      if (checkCollision(this.player, enemy)) {
        this.player.takeDamage(enemy.damage);
        enemy.takeDamage(enemy.hp);
        if (this.player.hp <= 0) this.gameOver = true;
      }
    });

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      for (let j = this.projectiles.length - 1; j >= 0; j--) {
        const enemy = this.enemies[i];
        const proj = this.projectiles[j];
        if (distance(enemy, proj) < enemy.radius + proj.radius) {
          enemy.takeDamage(proj.damage);
          this.projectiles.splice(j, 1);
          if (enemy.hp <= 0) {
            this.enemies.splice(i, 1);
            this.player.gainExp(5);
          }
          break;
        }
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.draw(this.ctx);
    this.enemies.forEach(e => e.draw(this.ctx));
    this.projectiles.forEach(p => p.draw(this.ctx));
  }

  spawnEnemy() {
    const side = Math.random() < 0.5 ? 0 : this.canvas.width;
    const y = Math.random() * this.canvas.height;
    this.enemies.push(new Enemy(side, y, 50, 8, 200, 10, this.player));
  }

  drawGameOver() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "white";
    this.ctx.font = "30px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2);
  }
}
