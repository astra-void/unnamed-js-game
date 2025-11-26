import { Player } from '../entities/living';
import { Item } from './Item';

export class JellyCrown extends Item {
  private bonusRates = [0.05, 0.1, 0.15, 0.2, 0.25];

  constructor() {
    super('곰젤리 왕관', '최대 체력이 증가한다', [
      'crown_1',
      'crown_2',
      'crown_3',
      'crown_4',
      'crown_5'
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
    const bonus = this.bonusRates[this.level - 1];

    const newMaxHp = Math.floor(player.healthManager.baseMaxHp * (1 + bonus));

    player.healthManager.maxHp = newMaxHp;

    player.healthManager.heal(Number.POSITIVE_INFINITY);
  }
}