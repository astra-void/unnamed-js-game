import { Player } from '../entities/living';
import { Item } from './Item';

export class BrokenGlasses extends Item {
  private bonusRates = [0.05, 0.1, 0.125, 0.15, 0.2];

  constructor() {
    super('부러진 안경', '공격범위 5/10/12.5/15/20% 증가', [
      'broken_glasses_1',
      'broken_glasses_2',
      'broken_glasses_3',
      'broken_glasses_4',
      'broken_glasses_5'
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
    player.projectileSizeMultiplier = 1 + bonus;
  }
}
