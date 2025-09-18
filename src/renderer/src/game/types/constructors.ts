import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { Weapon } from '../weapons';
import { Item } from '../items';

export interface WeaponConstructor {
  new (scene: Scene, player: Player): Weapon;
  prototype: Weapon;
}

export interface ItemConstructor {
  new (player: Player): Item;
  prototype: Item;
}
