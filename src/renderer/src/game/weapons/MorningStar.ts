import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { Game } from '../scenes/Game';
import { isEnemySprite } from '../types/typeGuards';
import { Weapon } from './Weapon';

export class MorningStar extends Weapon {
  player: Player;
  private slamRadius = 80;
  private shockwaveRadius = 140;
  private shockwaveDamage = 40;
  private reach = 110;

  constructor(scene: Scene, player: Player) {
    super(
      scene,
      '모닝스타',
      '눈 앞의 적을 내리찍으며 공격',
      'morning_star',
      player,
      1,
      30
    );
    this.player = player;
  }

  protected onLevelUp(): void {
    switch (this.level) {
      case 1:
        this.cooldown = 1;
        this.damage = 30;
        break;
      case 2:
        this.cooldown = 1 / 1.2;
        this.damage = 45;
        break;
      case 3:
        this.damage = 60;
        break;
      case 4:
        this.damage = 75;
        break;
      case 5:
        this.damage = 90;
        break;
    }
  }

  attack(): void {
    if (!(this.scene instanceof Game)) return;

    const pointer = this.scene.input.activePointer;
    const dx = pointer.worldX - this.player.x;
    const dy = pointer.worldY - this.player.y;
    const len = Math.hypot(dx, dy) || 1;

    const impactX = this.player.x + (dx / len) * this.reach;
    const impactY = this.player.y + (dy / len) * this.reach;

    this.dealAreaDamage(impactX, impactY, this.slamRadius, this.damage);

    if (this.level >= 5) {
      this.dealAreaDamage(
        impactX,
        impactY,
        this.shockwaveRadius,
        Math.floor(this.shockwaveDamage * (this.player.damageMultiplier ?? 1))
      );
    }
  }

  private dealAreaDamage(x: number, y: number, radius: number, damage: number) {
    const game = this.scene as Game;
    const radiusSq = radius * radius;

    game.enemyManager.enemiesGroup.getChildren().forEach((enemySprite) => {
      if (!isEnemySprite(enemySprite)) return;

      const dx = enemySprite.x - x;
      const dy = enemySprite.y - y;

      if (dx * dx + dy * dy <= radiusSq) {
        enemySprite.entity.healthManager.takeDamage(damage);
      }
    });
  }
}
