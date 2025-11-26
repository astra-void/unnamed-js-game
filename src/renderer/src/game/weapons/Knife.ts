import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { Weapon } from './Weapon';
import { KnifeProjectile } from '../entities/projectiles';
import { Game } from '../scenes/Game';

export class Knife extends Weapon {
  player: Player;

  constructor(scene: Scene, player: Player) {
    super(scene, 'Knife', 'its knife', player, 0, 0, 0.25, 10, 200, 5);
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

    const damageMultiplier = 1 + (this.player.damageBonus ?? 0);
    const proj = new KnifeProjectile(
      this.scene,
      this.player.x,
      this.player.y,
      vx,
      vy,
      this.damage * damageMultiplier,
      this.speed,
      this.lifetime
    );
    proj.sprite.setScale(1 + (this.player.projectileScaleBonus ?? 0));
    if (this.scene instanceof Game)
      this.scene.projectileManager.add(proj.sprite);
  }
}
