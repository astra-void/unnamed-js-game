import { Player } from '../entities/living';
import { Item } from './Item';

export class ChocolateChip extends Item {
  private cooldowns = [16, 14, 12, 10, 10];
  private healAmounts = [10, 14, 18, 21, 20];
  private timer = 0;

  constructor() {
    super('초콜릿 칩', '주기적으로 회복 아이템을 생성한다', 'choco_chip_icon');
  }

  applyEffect(_player: Player): void {
    this.timer = 0;
  }
  removeEffect(_player: Player): void {}

  update(_player: Player, _time: number, delta: number): void {
    this.timer += delta / 1000;
    if (this.timer >= this.cooldowns[this.level - 1]) {
      this.timer = 0;
      const healTicks = this.level >= 5 ? 2 : 1;
      const heal = this.healAmounts[this.level - 1];

      for (let i = 0; i < healTicks; i++) {
        _player.healthManager.heal(heal);
      }
    }
  }
}
