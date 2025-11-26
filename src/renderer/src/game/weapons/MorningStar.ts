import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { Weapon } from './Weapon';
import { Game } from '../scenes/Game';

export class MorningStar extends Weapon {
  private damages = [30, 45, 60, 75, 90];
  private slamRadius = 48;
  private shockwaveRadius = 120;
  private shockwaveDamage = 40;

  constructor(scene: Scene, player: Player) {
    super(scene, '모닝스타', '근접 내려찍기 공격', player, 0, 0, 1, 30);
  }

  attack(): void {
    if (!(this.scene instanceof Game)) return;

    const damageMultiplier = 1 + (this.player.damageBonus ?? 0);
    const currentDamage = this.damages[this.level - 1] * damageMultiplier;

    const pointer = this.scene.input.activePointer;
    const dx = pointer.worldX - this.player.x;
    const dy = pointer.worldY - this.player.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const targetX = this.player.x + (dx / len) * 60;
    const targetY = this.player.y + (dy / len) * 60;

    this.damageCircle(targetX, targetY, this.slamRadius, currentDamage);

    if (this.level >= 5) {
      this.damageCircle(
        targetX,
        targetY,
        this.shockwaveRadius,
        this.shockwaveDamage * damageMultiplier
      );
    }
  }

  protected onLevelUp(_player: Player): void {
    if (this.level >= 2) {
      this.cooldown = 1 / 1.2;
    }
  }

  private damageCircle(
    x: number,
    y: number,
    radius: number,
    damage: number
  ) {
    const enemies = this.scene.enemyManager.enemiesGroup
      .getChildren()
      .map((c) => c as Phaser.GameObjects.Sprite & { entity: any });

    const r2 = radius * radius;
    for (const enemy of enemies) {
      const dx = enemy.x - x;
      const dy = enemy.y - y;
      if (dx * dx + dy * dy <= r2) {
        enemy.entity.healthManager.takeDamage(damage);
      }
    }
  }
}

