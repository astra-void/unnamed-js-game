import { Item } from '../items';
import { Weapon } from '../weapons';
import { Player } from '../entities/living';
import { FusionRecipe } from '../fusion/CraftingRecipe';
import { ItemConstructor, WeaponConstructor } from '../types/constructors';

export class FusionManager {
  player: Player;
  recipes: FusionRecipe[];

  constructor(player: Player, recipes: FusionRecipe[]) {
    this.player = player;
    this.recipes = recipes;
  }

  getAvailableFusionsForMaxLevel(): FusionRecipe[] {
    return this.recipes.filter((recipe) => {
      return recipe.ingredients.every((ingredientCtor) => {
        if (this.isItemConstructor(ingredientCtor)) {
          const item = this.player.items.find(
            (i) => i.constructor === ingredientCtor && i.isMaxLevel
          );
          return item !== undefined;
        }
        if (this.isWeaponConstructor(ingredientCtor)) {
          const weapon = this.player.weapons.find(
            (w) => w.constructor === ingredientCtor && w.isMaxLevel
          );
          return weapon !== undefined;
        }
        return false;
      });
    });
  }

  getRecipesWithMaxLevelItem(maxLevelInstance: Item | Weapon): FusionRecipe[] {
    const instanceConstructor = maxLevelInstance.constructor;

    return this.recipes.filter((recipe) => {
      const hasThisIngredient = recipe.ingredients.some(
        (ing) => ing === instanceConstructor
      );
      if (!hasThisIngredient) return false;

      return recipe.ingredients.every((ingredientCtor) => {
        if (ingredientCtor === instanceConstructor) return true;

        if (this.isItemConstructor(ingredientCtor)) {
          return this.player.items.some(
            (i) => i.constructor === ingredientCtor && i.isMaxLevel
          );
        }
        if (this.isWeaponConstructor(ingredientCtor)) {
          return this.player.weapons.some(
            (w) => w.constructor === ingredientCtor && w.isMaxLevel
          );
        }
        return false;
      });
    });
  }

  canFuse(recipe: FusionRecipe): boolean {
    return recipe.ingredients.every((ingredientCtor) => {
      if (this.isItemConstructor(ingredientCtor)) {
        return this.player.items.some(
          (i) => i.constructor === ingredientCtor && i.isMaxLevel
        );
      }
      if (this.isWeaponConstructor(ingredientCtor)) {
        return this.player.weapons.some(
          (w) => w.constructor === ingredientCtor && w.isMaxLevel
        );
      }
      return false;
    });
  }

  fuse(recipe: FusionRecipe): Item | Weapon | null {
    if (!this.canFuse(recipe)) {
      return null;
    }

    recipe.ingredients.forEach((ingredientCtor) => {
      if (this.isItemConstructor(ingredientCtor)) {
        const idx = this.player.items.findIndex(
          (i) => i.constructor === ingredientCtor && i.isMaxLevel
        );
        if (idx !== -1) {
          /*
          const item = this.player.items.splice(idx, 1)[0];
          item.removeEffect?.(this.player);
          */
          // DEBUG
        }
      } else if (this.isWeaponConstructor(ingredientCtor)) {
        const idx = this.player.weapons.findIndex(
          (w) => w.constructor === ingredientCtor && w.isMaxLevel
        );
        if (idx !== -1) {
          const weapon = this.player.weapons.splice(idx, 1)[0];
          weapon.destroy();
        }
      }
    });

    let result: Item | Weapon;

    if (this.isItemConstructor(recipe.result)) {
      const NewItem = recipe.result as ItemConstructor;
      result = new NewItem(this.player);
      this.player.items.push(result);
      result.applyEffect?.(this.player);
    } else {
      const NewWeapon = recipe.result as WeaponConstructor;
      result = new NewWeapon(this.player.scene, this.player);
      this.player.weapons.push(result);
    }

    return result;
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
