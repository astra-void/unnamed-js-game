import { Player } from '../entities/living';
import { HealingChocolate } from '../instances';
import { Game } from '../scenes/Game';
import { Item } from './Item';

export class ChocolateChip extends Item {
  private cooldowns = [16, 14, 12, 10, 10];
  private healAmounts = [10, 14, 18, 21, 20];
  private timer = 0;

  constructor() {
    super('초콜릿 칩', '주기적으로 회복 아이템을 생성한다', [
      'chocolate_chip_1',
      'chocolate_chip_2',
      'chocolate_chip_3',
      'chocolate_chip_4',
      'chocolate_chip_5'
    ]);
  }

  applyEffect(_player: Player): void {
    this.timer = 0;
  }
  removeEffect(_player: Player): void {}

  protected onLevelUp(_player: Player): void {
    this.timer = 0;
  }

  update(player: Player, _time: number, delta: number): void {
    this.timer += delta / 1000;

    if (this.timer >= this.cooldowns[this.level - 1]) {
      this.timer = 0;

      const scene = player.scene as Game;
      const count = this.level === 5 ? 2 : 1;

      for (let i = 0; i < count; i++) {
        const x = player.x + Phaser.Math.Between(-400, 400);
        const y = player.y + Phaser.Math.Between(-400, 400);

        const healObj = new HealingChocolate(
          scene,
          x,
          y,
          this.healAmounts[this.level - 1],
          15000
        );
        scene.instanceManager.add(healObj);
      }
    }
  }
}
