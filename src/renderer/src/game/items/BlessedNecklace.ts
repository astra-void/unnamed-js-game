import { Player } from '../entities/living';
import { Item } from './Item';

export class BlessedNecklace extends Item {
  private bonusRates = [0, 0.05, 0.075, 0.1, 0.15];

  constructor() {
    super('무언가의 축복이 담긴 목걸이', '공격 속도가 증가한다', [
      'blessed_necklace_1',
      'blessed_necklace_2',
      'blessed_necklace_3',
      'blessed_necklace_4',
      'blessed_necklace_5'
    ]);
  }

  applyEffect(player: Player): void {
    this.recalc(player);
  }

  removeEffect(_player: Player): void {}

  protected onLevelUp(player: Player): void {
    this.recalc(player);
  }

  private recalc(player: Player) {
    const bonus = this.bonusRates[this.level - 1] ?? 0;
    player.attackSpeedMultiplier = 1 + bonus;
  }
}
