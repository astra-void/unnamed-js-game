import { Player } from '../entities/living';
import { Item } from './Item';

export class MartialCodex extends Item {
  constructor() {
    super('', '', ['', '', '', '', '']);
  }

  applyEffect(_player: Player): void {}
  removeEffect(_player: Player): void {}

  update(_player: Player, _time: number, _delta: number): void {}
}
