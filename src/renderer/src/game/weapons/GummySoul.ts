import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { GummySoulBomb } from '../projectiles';
import { Game } from '../scenes/Game';
import { isEnemySprite } from '../types/typeGuards';
import { Weapon } from './Weapon';

export class GummySoul extends Weapon {
  player: Player;
  private explosionRadius = 80;

  constructor(scene: Scene, player: Player) {
    super(
      scene,
      '곰젤리의 원혼',
      '10초마다 곰젤리영혼(폭탄) 소환하여 펑!',
      'gummy_soul',
      player,
      10,
      90,
      220,
      5
    );
    this.player = player;
  }

  protected onLevelUp(): void {
    switch (this.level) {
      case 1:
        this.cooldown = 10;
        this.damage = 90;
        this.explosionRadius = 80;
        break;
      case 2:
        this.cooldown = 7;
        break;
      case 3:
        this.explosionRadius = 120;
        break;
      case 4:
        this.damage = 140;
        break;
      case 5:
        break;
    }
  }

  attack(): void {
    if (!(this.scene instanceof Game) || !this.speed || !this.lifetime) return;

    const enemies = this.scene.enemyManager.enemiesGroup
      .getChildren()
      .filter(isEnemySprite);

    if (enemies.length === 0) return;

    const count = this.level >= 5 ? 2 : 1;
    const damage = this.getDamage();

    for (let i = 0; i < count; i++) {
      const target = enemies[Phaser.Math.Between(0, enemies.length - 1)];

      const dx = target.x - this.player.x;
      const dy = target.y - this.player.y;
      const len = Math.hypot(dx, dy) || 1;

      const proj = new GummySoulBomb(
        this.scene,
        this.player.x,
        this.player.y,
        (dx / len) * this.speed,
        (dy / len) * this.speed,
        damage,
        this.speed,
        this.lifetime,
        this.explosionRadius
      );

      this.scene.projectileManager.add(proj.sprite);
    }
  }
}
