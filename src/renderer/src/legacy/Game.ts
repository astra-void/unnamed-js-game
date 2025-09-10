import { Player, Projectile, Enemy } from './entities';
import { Knife } from '../game/entities/item/weapons';
import { GameOver, HealthBar } from './ui';
import { UIManager } from './ui/UIManager';
import { checkCollision, distance } from './utils';

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player: Player;
  projectiles: Projectile[];
  enemies: Enemy[];
  gameOver: boolean;
  lastTime: number;
  spawnTimer: number;
  keys: Record<string, boolean> = {};
  mouseX: number = 0;
  mouseY: number = 0;
  ui: UIManager;
  paused = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.player = new Player(
      this.canvas.width / 2,
      this.canvas.height / 2,
      200,
      6,
      200,
      0,
      1,
      [new Knife(this)],
      this
    );
    this.projectiles = [];
    this.enemies = [];
    this.gameOver = false;
    this.lastTime = 0;
    this.spawnTimer = 2;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    // UI Init
    this.ui = new UIManager();
    this.ui.addCanvasUI(new HealthBar(this.player));

    window.addEventListener('keydown', (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      this.keys[key] = true;
    });
    window.addEventListener('keyup', (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      this.keys[key] = false;
    });
  }

  start() {
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  stop() {}

  togglePause() {
    this.paused = !this.paused;
  }

  loop(timestamp: number) {
    if (this.paused) {
      requestAnimationFrame(this.loop);
      return;
    }

    if (this.lastTime === 0) {
      this.lastTime = timestamp;
    }

    const dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    if (!this.gameOver) {
      this.update(dt);
      this.draw();
      requestAnimationFrame(this.loop);
    } else {
      this.ui.addCanvasUI(new GameOver(this.canvas));
      this.ui.draw(this.ctx);
    }
  }

  update(dt: number) {
    if (this.paused) return;

    this.player.update(dt);
    this.ui.update(dt);

    this.projectiles.forEach((p) => p.update(dt));

    // Enemy spawn
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = 1;
      this.spawnEnemy();
    }

    // Enemy update + Player collision
    this.enemies.forEach((enemy) => {
      enemy.update(dt);
    });

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      for (let j = this.projectiles.length - 1; j >= 0; j--) {
        const proj = this.projectiles[j];

        if (proj.hp <= 0 || proj.lifetime <= 0) {
          this.projectiles.splice(j, 1);
        }

        if (distance(enemy, proj) < enemy.radius + proj.radius) {
          enemy.takeDamage(proj.damage);
          proj.takeDamage(enemy.damage);

          if (enemy.hp <= 0) {
            this.enemies.splice(i, 1);
            this.player.gainExp(5);
          }
        }
      }

      if (checkCollision(this.player, enemy)) {
        this.player.takeDamage(enemy.damage);
        enemy.takeDamage(enemy.damage);
        if (enemy.hp <= 0) this.enemies.splice(i, 1);
        if (this.player.hp <= 0) this.gameOver = true;
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.draw(this.ctx);
    this.ui.draw(this.ctx);

    this.enemies.forEach((e) => e.draw(this.ctx));
    this.projectiles.forEach((p) => p.draw(this.ctx));
  }

  spawnEnemy() {
    const side = Math.random() < 0.5 ? 0 : this.canvas.width;
    const y = Math.random() * this.canvas.height;
    this.enemies.push(new Enemy(side, y, 50, 8, 200, 10, this.player));
  }
}
