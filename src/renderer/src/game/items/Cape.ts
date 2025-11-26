import { Enemy, Player } from '../entities/living';
import { Game } from '../scenes/Game';
import { isEnemySprite } from '../types/typeGuards';
import { Item } from './Item';

export class Cape extends Item {
  private slowRates = [0.25, 0.3, 0.35, 0.4, 0.5];
  private radius = 120;

  private slowedEnemies = new Set<Enemy>();

  constructor() {
    super('슈크림 망토', '주변 적의 속도를 감소시킨다', [
      'cape_1',
      'cape_2',
      'cape_3',
      'cape_4',
      'cape_5'
    ]);
  }

  applyEffect(_player: Player): void {}
  removeEffect(_player: Player): void {}

  update(player: Player, _time: number, _delta: number): void {
    if (!(player.scene instanceof Game)) return;

    const slow = this.slowRates[this.level - 1];
    const radiusSq = this.radius * this.radius;

    const enemies = player.scene.enemyManager.enemiesGroup.getChildren();
    const currentSlowed = new Set<Enemy>();

    for (const sprite of enemies) {
      if (!isEnemySprite(sprite)) continue;
      const enemy = sprite.entity;

      const dx = sprite.x - player.x;
      const dy = sprite.y - player.y;

      if (dx * dx + dy * dy <= radiusSq) {
        enemy.speedMultiplier = 1 - slow;
        currentSlowed.add(enemy);
      }
    }

    for (const enemy of this.slowedEnemies) {
      if (!currentSlowed.has(enemy)) {
        enemy.speedMultiplier = 1;
      }
    }

    this.slowedEnemies = currentSlowed;
  }
}