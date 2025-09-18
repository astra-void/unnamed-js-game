import { Item } from '../items';
import { Weapon } from '../weapons';
import { Player } from '../entities/living';
import { FusionRecipe } from './CraftingRecipe';
import { ItemConstructor, WeaponConstructor } from '../types/constructors';

// TODO: make it works......

export class FusionManager {
  player: Player;
  recipes: FusionRecipe[];

  constructor(player: Player, recipes: FusionRecipe[]) {
    this.player = player;
    this.recipes = recipes;
  }

  canFuse(recipe: FusionRecipe): boolean {
    return recipe.ingredients.every((Ctor) => {
      if (this.isItemConstructor(Ctor)) {
        return this.player.items.some((i) => i instanceof Ctor);
      }
      if (this.isWeaponConstructor(Ctor)) {
        return this.player.weapons.some((w) => w instanceof Ctor);
      }
      return false;
    });
  }

  fuse(recipe: FusionRecipe): Item | Weapon | null {
    if (!this.canFuse(recipe)) return null;

    recipe.ingredients.forEach((Ctor) => {
      if (this.isItemConstructor(Ctor)) {
        const idx = this.player.items.findIndex((i) => i instanceof Ctor);
        if (idx !== -1) this.player.items.splice(idx, 1);
      } else if (this.isWeaponConstructor(Ctor)) {
        const idx = this.player.weapons.findIndex((w) => w instanceof Ctor);
        if (idx !== -1) this.player.weapons.splice(idx, 1);
      }
    });

    if (this.isItemConstructor(recipe.result)) {
      const NewItem = recipe.result as ItemConstructor;
      const newItem = new NewItem(this.player);
      this.player.items.push(newItem);
      return newItem;
    } else if (this.isWeaponConstructor(recipe.result)) {
      const NewWeapon = recipe.result as WeaponConstructor;
      const newWeapon = new NewWeapon(this.player.scene, this.player);
      this.player.weapons.push(newWeapon);
      return newWeapon;
    }

    return null;
  }

  private isItemConstructor(ctor: unknown): ctor is ItemConstructor {
    if (typeof ctor !== 'function') return false;
    return ctor.prototype instanceof Item;
  }

  private isWeaponConstructor(ctor: unknown): ctor is WeaponConstructor {
    if (typeof ctor !== 'function') return false;
    return ctor.prototype instanceof Weapon;
  }
}
