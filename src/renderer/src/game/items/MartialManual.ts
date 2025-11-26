import { Player } from '../entities/living';
import { Item } from './Item';

export class MartialManual extends Item {
  private damageBonuses = [0.05, 0.075, 0.1, 0.125, 0.15];

  constructor() {
    super('무공비급서', '공격력이 증가한다', 'martial_manual_icon');
  }

  applyEffect(player: Player): void {
    this.recalc(player);
  }

  protected onLevelUp(player: Player): void {
    this.recalc(player);
  }

  private recalc(player: Player) {
    player.damageBonus = this.damageBonuses[this.level - 1];
  }
}

