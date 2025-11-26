import { Player } from '../entities/living';
import { Game } from '../scenes/Game';
import { Item } from './Item';

export class CreamCloak extends Item {
  private slowRates = [0.25, 0.3, 0.35, 0.4, 0.5];
  private radius = 160;

  constructor() {
    super('슈크림 망토', '주변 적의 속도를 감소시킨다', 'cream_cloak_icon');
  }

  applyEffect(_player: Player): void {}
  removeEffect(_player: Player): void {}

  update(player: Player, _time: number, _delta: number): void {
    if (!(player.scene instanceof Game)) return;
    const slow = this.slowRates[this.level - 1];
    const enemies =
      player.scene.enemyManager.enemiesGroup.getChildren() as Phaser.GameObjects.Sprite[];
    for (const enemy of enemies) {
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      if (dx * dx + dy * dy <= this.radius * this.radius) {
        const body = enemy.body as Phaser.Physics.Arcade.Body;
        body.velocity.scale(1 - slow);
      }
    }
  }
}
