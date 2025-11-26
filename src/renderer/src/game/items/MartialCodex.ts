import { Player } from '../entities/living';
import { Item } from './Item';

export class MartialCodex extends Item {
  constructor() {
    super('무공비급서', 'asdf', [
      'martial_codex_1',
      'martial_codex_2',
      'martial_codex_3',
      'martial_codex_4',
      'martial_codex_5'
    ]);
  }

  applyEffect(_player: Player): void {}
  removeEffect(_player: Player): void {}

  update(_player: Player, _time: number, _delta: number): void {}
}