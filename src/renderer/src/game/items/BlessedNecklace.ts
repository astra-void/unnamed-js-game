import { Player } from '../entities/living';
import { Item } from './Item';

export class BlessedNecklace extends Item {
  private speedBonuses = [0, 0.05, 0.075, 0.1, 0.15];

  constructor() {
    super('무언가의 축복이 담긴 목걸이', '공격 속도가 증가한다', 'blessed_necklace_icon');
  }

  applyEffect(player: Player): void {
    this.recalc(player);
  }

  protected onLevelUp(player: Player): void {
    this.recalc(player);
  }

  private recalc(player: Player) {
    player.attackSpeedBonus = this.speedBonuses[this.level - 1];
  }
}

