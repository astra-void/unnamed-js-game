import { Player } from '../entities/living';
import { Item } from './Item';

export class BrokenGlasses extends Item {
  private sizeBonuses = [0.05, 0.1, 0.125, 0.15, 0.2];

  constructor() {
    super('부러진 안경', '투사체 크기가 증가한다', 'broken_glasses_icon');
  }

  applyEffect(player: Player): void {
    this.recalc(player);
  }

  protected onLevelUp(player: Player): void {
    this.recalc(player);
  }

  private recalc(player: Player) {
    player.projectileScaleBonus = this.sizeBonuses[this.level - 1];
  }
}

