import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { TestProjectile } from '../entities/projectiles';
import { Game } from '../scenes/Game';
import { Weapon } from './Weapon';

export class Test2 extends Weapon {
  player: Player;

  constructor(scene: Scene, player: Player) {
    super(scene, 'Test2', 'second test weapon', player, 0, 0, 0.1, 10, 300, 3);
    this.player = player;
  }

  use?(): void {}

  attack(): void {
    if (!this.speed || !this.lifetime) return;

    const pointer = this.scene.input.activePointer;
    const dx = pointer.worldX - this.player.x;
    const dy = pointer.worldY - this.player.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    const vx = (dx / len) * this.speed;
    const vy = (dy / len) * this.speed;

    const proj = new TestProjectile(
      this.scene,
      this.player.x,
      this.player.y,
      vx,
      vy,
      this.damage,
      this.speed,
      this.lifetime
    );
    if (this.scene instanceof Game)
      this.scene.projectileManager.add(proj.sprite);
  }
}
