import { Scene } from 'phaser';
import { Player } from '../entities/living';
import { Item } from '../items';
import { Weapon } from '../weapons';

export interface WeaponConstructor {
  new (scene: Scene, player: Player): Weapon;
  prototype: Weapon;
}

export interface ItemConstructor {
  new (): Item;
  prototype: Item;
}