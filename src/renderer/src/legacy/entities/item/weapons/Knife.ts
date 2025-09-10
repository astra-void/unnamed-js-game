import type { Game } from '../../../../legacy/Game';
import { KnifeProjectile } from '../../../../game/entities/projectiles';
import { Weapon } from '../Weapon';

export class Knife extends Weapon {
  constructor(game: Game) {
    super('Knife', game, 1, 5, 0.25, 10, 50, 5);
  }

  use?(): void {} /* empty */

  attack(x: number, y: number): void {
    if (!this.speed || !this.lifetime) return;

    const dx = this.game.mouseX - this.game.player.x;
    const dy = this.game.mouseY - this.game.player.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const speed = 200;
    const vx = (dx / len) * speed;
    const vy = (dy / len) * speed;

    this.game.projectiles.push(
      new KnifeProjectile(x, y, vx, vy, this.damage, this.speed, this.lifetime)
    );
  }

  levelUp(): boolean {
    if (this.level < this.maxLevel) {
      this.level++;

      /**
       * 대충 여기 안에다가 레벌입 로직 넣어라
       */

      return true;
    } else {
      return false;
    }
  }
}
