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
  private swingArc = Math.PI / 2.2;

  private createSwingEffect(
    angle: number,
    duration: number,
    impactX: number,
    impactY: number
  ) {
    const swing = this.scene.add.graphics();
    swing.setDepth(10);
    swing.lineStyle(14, 0xffd166, 0.85);
    swing.beginPath();
    swing.arc(
      this.player.x,
      this.player.y,
      this.reach,
      angle - this.swingArc / 2,
      angle + this.swingArc / 2
    );
    swing.strokePath();
    swing.closePath();

    swing.lineStyle(6, 0xffffff, 0.9);
    swing.beginPath();
    swing.arc(
      this.player.x,
      this.player.y,
      this.reach * 0.9,
      angle - this.swingArc / 2.3,
      angle + this.swingArc / 2.3
    );
    swing.strokePath();
    swing.closePath();

    swing.setAlpha(0.95);

    this.scene.tweens.add({
      targets: swing,
      alpha: { from: 0.95, to: 0 },
      scale: 1.05,
      duration,
      ease: 'Cubic.easeOut',
      onComplete: () => swing.destroy()
    });

    const slamFlash = this.scene.add.graphics({ x: impactX, y: impactY });
    slamFlash.setDepth(11);
    slamFlash.fillStyle(0xfff6cf, 0.95);
    slamFlash.fillCircle(0, 0, this.slamRadius * 0.2);
    slamFlash.lineStyle(4, 0xffffff, 0.9);
    slamFlash.strokeCircle(0, 0, this.slamRadius * 0.25);
    slamFlash.setAlpha(0);

    this.scene.tweens.add({
      targets: slamFlash,
      alpha: { from: 0.8, to: 0 },
      scale: { from: 0.6, to: 1.4 },
      duration: duration * 0.7,
      ease: 'Quad.easeOut',
      delay: duration * 0.65,
      onComplete: () => slamFlash.destroy()
    });
  }

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

    const target = this.scene.inputManager.getAimWorldPoint(
      this.player.x,
      this.player.y
    );
    const dx = target.x - this.player.x;
    const dy = target.y - this.player.y;
    const len = Math.hypot(dx, dy) || 1;

    const impactX = this.player.x + (dx / len) * this.reach;
    const impactY = this.player.y + (dy / len) * this.reach;
    const attackAngle = Math.atan2(dy, dx);
    const swingDuration = Math.min(Math.max(this.cooldown * 600, 140), 320);

    this.createSwingEffect(attackAngle, swingDuration, impactX, impactY);

    this.scene.time.delayedCall(swingDuration * 0.6, () => {
      this.dealAreaDamage(impactX, impactY, this.slamRadius, this.damage);

      if (this.level >= 5) {
        this.dealAreaDamage(
          impactX,
          impactY,
          this.shockwaveRadius,
          Math.floor(this.shockwaveDamage * (this.player.damageMultiplier ?? 1))
        );
      }
    });
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
