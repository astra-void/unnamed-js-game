import Phaser, { Scene } from 'phaser';
import { Player } from '../entities/living';
import { BombardFireZone } from '../instances';
import { Game } from '../scenes/Game';
import { isEnemySprite } from '../types/typeGuards';
import { Weapon } from './Weapon';

export class JellyBombard extends Weapon {
  player: Player;
  private explosionRadius = 90;
  private burnDamage = 45;
  private burnDuration = 5000;

  constructor(scene: Scene, player: Player) {
    super(
      scene,
      '젤리 폭격',
      '20초마다, 적이 있는 지점에 미사일 3회 포격',
      'jelly_bombard',
      player,
      20,
      100
    );
    this.player = player;
  }

  protected onLevelUp(): void {
    switch (this.level) {
      case 1:
        this.cooldown = 20;
        this.damage = 100;
        this.explosionRadius = 90;
        break;
      case 2:
        this.cooldown = 15;
        break;
      case 3:
        this.damage = 300;
        break;
      case 4:
        this.explosionRadius = 130;
        break;
      case 5:
        break;
    }
  }

  attack(): void {
    if (!(this.scene instanceof Game)) return;

    const enemies = this.scene.enemyManager.enemiesGroup
      .getChildren()
      .filter(isEnemySprite);

    if (enemies.length === 0) return;

    for (let i = 0; i < 3; i++) {
      const target = enemies[i % enemies.length];
      const impactX = target.x + Phaser.Math.Between(-15, 15);
      const impactY = target.y + Phaser.Math.Between(-15, 15);

      this.applyExplosion(impactX, impactY, this.damage);

      if (this.level >= 5) {
        const burnDamage = Math.floor(
          this.burnDamage * (this.player.damageMultiplier ?? 1)
        );

        const zone = new BombardFireZone(
          this.scene,
          impactX,
          impactY,
          this.explosionRadius,
          burnDamage,
          this.burnDuration
        );

        this.scene.instanceManager.add(zone.sprite);
      }
    }
  }

  private applyExplosion(x: number, y: number, damage: number) {
    if (!(this.scene instanceof Game)) return;

    const radiusSq = this.explosionRadius * this.explosionRadius;

    this.scene.enemyManager.enemiesGroup
      .getChildren()
      .filter(isEnemySprite)
      .forEach((enemy) => {
        const dx = enemy.x - x;
        const dy = enemy.y - y;

        if (dx * dx + dy * dy <= radiusSq) {
          enemy.entity.healthManager.takeDamage(damage);
        }
      });
  }
}
