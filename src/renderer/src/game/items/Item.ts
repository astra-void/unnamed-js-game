import { GAME_CONFIG } from '../constants';
import { Player } from '../entities/living';

export abstract class Item {
  name: string;
  description: string;
  texture: string;
  level: number;

  constructor(name: string, description: string, texture: string) {
    this.name = name;
    this.description = description;
    this.texture = texture;
    this.level = 1;
  }

  get isMaxLevel() {
    return this.level >= GAME_CONFIG.MAX_ITEM_LEVEL;
  }

  abstract applyEffect(player: Player): void;

  levelUp(player: Player) {
    if (!this.isMaxLevel) {
      this.level++;
      this.onLevelUp(player);
    }
  }

  protected onLevelUp(_player: Player): void {}

  update(_player: Player, _time: number, _delta: number): void {}
}
