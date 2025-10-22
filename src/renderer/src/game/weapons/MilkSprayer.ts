import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { TestProjectile } from '../entities/projectiles';
import { Game } from '../scenes/Game';
import { getVelocityCoords } from '../utils/distance';
import { Weapon } from './Weapon';

export class MilkSprayer extends Weapon {
  player: Player;

  constructor(scene: Scene, player: Player) {
    super(
      scene,
      '우유 분무기',
      '일정시간마다 전방 부채꼴 범위에 우유를 흩뿌려 데미지를 주고 맞은 적의 방어력 감소',
      'milk_sprayer',
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
