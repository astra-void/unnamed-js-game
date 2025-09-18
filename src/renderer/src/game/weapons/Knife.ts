import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { Weapon } from './Weapon';
import { KnifeProjectile } from '../entities/projectiles';
import { Game } from '../scenes/Game';

export class Knife extends Weapon {
  player: Player;

  constructor(scene: Scene, player: Player) {
    super(scene, 'Knife', 'its knife', player, 0, 0, 0.25, 10, 1, 200, 5);
    this.player = player;
  }

  use?(): void {} /* empty */

  attack(): void {
    if (!this.speed || !this.lifetime) return;

    const pointer = this.scene.input.activePointer;
    const dx = pointer.worldX - this.player.x;
    const dy = pointer.worldY - this.player.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    const vx = (dx / len) * this.speed;
    const vy = (dy / len) * this.speed;

    const proj = new KnifeProjectile(
      this.scene,
      this.player.x,
      this.player.y,
      vx,
      vy,
      this.damage,
      this.speed,
      this.lifetime
    );
    if (this.scene instanceof Game) this.scene.projectileManager.add(proj.sprite);
  }

  levelUp(): boolean {
    if (!this.isMaxLevel) {
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
