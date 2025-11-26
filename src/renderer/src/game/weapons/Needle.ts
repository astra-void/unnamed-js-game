import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { Weapon } from './Weapon';
import { NeedleProjectile } from '../entities/projectiles';
import { Game } from '../scenes/Game';

export class Needle extends Weapon {
  private damages = [35, 40, 50, 50, 50];
  private cooldowns = [0.5, 0.666, 1, 1.2, 1.2];

  constructor(scene: Scene, player: Player) {
    super(scene, '바늘', '짧은 사거리 투척', player, 0, 0, 0.5, 35, 300, 2);
  }

  attack(): void {
    if (!(this.scene instanceof Game)) return;

    const pointer = this.scene.input.activePointer;
    const dx = pointer.worldX - this.player.x;
    const dy = pointer.worldY - this.player.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    const speed = 300;
    const vx = (dx / len) * speed;
    const vy = (dy / len) * speed;

    const damageMultiplier = 1 + (this.player.damageBonus ?? 0);
    const damage = this.damages[this.level - 1] * damageMultiplier;
    const projectileCount = this.level >= 5 ? 2 : 1;

    for (let i = 0; i < projectileCount; i++) {
      const proj = new NeedleProjectile(
        this.scene,
        this.player.x,
        this.player.y,
        vx,
        vy,
        damage,
        1.5
      );
      proj.sprite.setScale(1 + (this.player.projectileScaleBonus ?? 0));
      this.scene.projectileManager.add(proj.sprite);
    }
  }

  protected onLevelUp(_player: Player): void {
    this.cooldown = this.cooldowns[this.level - 1];
  }
}

