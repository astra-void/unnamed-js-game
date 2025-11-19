import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { NeedleProjectile } from '../projectiles';
import { Game } from '../scenes/Game';
import { Weapon } from './Weapon';

export class Needle extends Weapon {
  player: Player;

  constructor(scene: Scene, player: Player) {
    super(scene, '바늘', '바늘임', 'needle', player, 1, 10, 300, 1);
    this.player = player;
  }

  use?(): void {}

  attack(): void {
    if (!this.speed || !this.lifetime) return;

    const pointer = this.scene.input.activePointer;

    const baseDx = pointer.worldX - this.player.x;
    const baseDy = pointer.worldY - this.player.y;

    const baseAngle = Math.atan2(baseDy, baseDx);

    const count = this.level;

    const spread = Phaser.Math.DegToRad(12);

    const start = -(count - 1) / 2;

    for (let i = 0; i < count; i++) {
      const offset = start + i;
      const angle = baseAngle + offset * spread;

      const vx = Math.cos(angle) * this.speed;
      const vy = Math.sin(angle) * this.speed;

      const proj = new NeedleProjectile(
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
}
