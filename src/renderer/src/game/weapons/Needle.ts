import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { NeedleProjectile } from '../projectiles';
import { Game } from '../scenes/Game';
import { Weapon } from './Weapon';

export class Needle extends Weapon {
  player: Player;
  stunEnabled?: boolean = false;

  constructor(scene: Scene, player: Player) {
    super(
      scene,
      '바늘',
      '바늘을 날려 짧은 범위에 일반 데미지와 스턴을 부여한다',
      'needle',
      player,
      0.5,
      35,
      300,
      1
    );
    this.player = player;
  }

  use?(): void {}

  protected onLevelUp(): void {
    switch (this.level) {
      case 1:
        this.cooldown = 0.5;
        break;

      case 2:
        this.damage = 40;
        this.cooldown = 1.5;
        break;

      case 3:
        this.damage = 50;
        this.cooldown = 1;
        break;

      case 4:
        this.stunEnabled = true;
        this.cooldown = 1.25;
        break;

      case 5:
        this.cooldown = 1.5;
        break;
    }
  }

  attack(): void {
    if (!this.speed || !this.lifetime) return;

    const pointer = this.scene.input.activePointer;

    const baseDx = pointer.worldX - this.player.x;
    const baseDy = pointer.worldY - this.player.y;
    const baseAngle = Math.atan2(baseDy, baseDx);

    const count = this.level === 5 ? 2 : 1;
    const damage = this.getDamage();
    const size = this.getProjectileScale();

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
        damage,
        this.speed,
        this.lifetime,
        this,
        size
      );

      if (this.scene instanceof Game)
        this.scene.projectileManager.add(proj.sprite);
    }
  }
}
