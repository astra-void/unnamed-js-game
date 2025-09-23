import { Player } from '../entities/living';
import { Item } from '../items';

export class ItemManager {
  player: Player;
  scene: Phaser.Scene;
  items: Item[] = [];

  constructor(player: Player, scene: Phaser.Scene) {
    this.player = player;
    this.scene = scene;
  }

  addItem(item: Item) {
    this.items.push(item);
  }

  removeItem(item: Item) {
    this.items = this.items.filter((i) => i !== item);
  }

  findItem(name: string) {
    return this.items.find((i) => i.name === name);
  }

  update(time: number, delta: number) {
    this.items.forEach((i) => i.update(this.player, time, delta));
  }

  clear() {
    this.items = [];
  }
}
