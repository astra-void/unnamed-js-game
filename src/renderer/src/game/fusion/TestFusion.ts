import { Player } from '../entities/living';
import { Item } from '../items';

export class TestFusion extends Item {
  constructor() {
    super('Test Fusion', 'for test;;;;;;;', 'jelly_crown_icon');
  }

  applyEffect(_player: Player): void {}
  removeEffect(_player: Player): void {}

  protected onLevelUp(_player: Player): void {
    console.log('yo');
  }
}
