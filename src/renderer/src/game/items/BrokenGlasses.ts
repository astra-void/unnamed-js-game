import { Player } from '../entities/living';
import { Item } from './Item';

export class BrokenGlasses extends Item {
  constructor() {
    super('부러진 안경', '공격범위 5/10/12.5/15/20% 증가', [
      'broken_glasses_1',
      'broken_glasses_2',
      'broken_glasses_3',
      'broken_glasses_4',
      'broken_glasses_5'
    ]);
  }

  applyEffect(_player: Player): void {}
  removeEffect(_player: Player): void {}

  update(_player: Player, _time: number, _delta: number): void {}
}
