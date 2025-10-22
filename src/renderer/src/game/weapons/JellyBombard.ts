import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { TestProjectile } from '../entities/projectiles';
import { Game } from '../scenes/Game';
import { getVelocityCoords } from '../utils/distance';
import { Weapon } from './Weapon';

export class JellyBombard extends Weapon {
  player: Player;

  constructor(scene: Scene, player: Player) {
    super(
      scene,
      '젤리 폭격',
      '20초마다, 적이 있는 지점에 미사일 3회 포격',
      'jelly_bombard',
      player,
      0,
      0,
      0.1,
      10,
      300,
      3
    );
    this.player = player;
  }

  use?(): void {}

  attack(): void {
    if (!this.speed || !this.lifetime) return;

    const pointer = this.scene.input.activePointer;
    const { vx, vy } = getVelocityCoords(
      pointer.worldX,
      pointer.worldY,
      this.player.x,
      this.player.y,
      this.speed
    );

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
