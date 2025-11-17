import { Player } from '../entities/living';
import { Item } from './Item';

export class ChocolateChip extends Item {
  private cooldowns = [60, 55, 50, 45, 40];
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

  update(_player: Player, _time: number, delta: number): void {
    this.timer += delta / 1000;
    if (this.timer >= this.cooldowns[this.level - 1]) {
      this.timer = 0;
      // TODO: 실제 회복 오브젝트 스폰 로직 추가
      console.log('Spawn chocolate heal item');
    }
  }
}
