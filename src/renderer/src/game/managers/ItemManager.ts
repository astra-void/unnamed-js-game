import { Player } from '../entities/living';
import { Item } from '../items';

export class ItemManager {
  player: Player;
  scene: Phaser.Scene;
  items = new Map<string, Item>();

  constructor(player: Player, scene: Phaser.Scene) {
    this.player = player;
    this.scene = scene;
  }

  add(item: Item): void {
    this.items.set(item.name, item);
  }

  remove(item: Item): void {
    this.items.delete(item.name);
  }

  find(name: string): Item | undefined {
    return this.items.get(name);
  }

  update(time: number, delta: number) {
    this.items.forEach((i) => i.update(this.player, time, delta));
  }

  clear() {
    this.items.clear();
  }
}
