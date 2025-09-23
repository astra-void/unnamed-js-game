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
          let found = false;
          for (const item of this.player.itemManager.items.values()) {
            if (item.constructor === ingredientCtor && item.isMaxLevel) {
              found = true;
              break;
            }
          }
          return found;
        }
        if (this.isWeaponConstructor(ingredientCtor)) {
          let found = false;
          for (const weapon of this.player.weaponManager.weapons.values()) {
            if (weapon.constructor === ingredientCtor && weapon.isMaxLevel) {
              found = true;
              break;
            }
          }
          return found;
        }
        return false;
      });
    });
  }

  getRecipesWithMaxLevelItem(maxLevelInstance: Item | Weapon): FusionRecipe[] {
    const instanceConstructor = maxLevelInstance.constructor;

    return this.recipes.filter((recipe) => {
      const hasThisIngredient = recipe.ingredients.some(
        (ing) => ing.ctor === instanceConstructor
      );
      if (!hasThisIngredient) return false;

      return recipe.ingredients.every((ingredientCtor) => {
        if (ingredientCtor.ctor === instanceConstructor) return true;

        if (this.isItemConstructor(ingredientCtor)) {
          let found = false;
          for (const item of this.player.itemManager.items.values()) {
            if (item.constructor === ingredientCtor && item.isMaxLevel) {
              found = true;
              break;
            }
          }
          return found;
        }
        if (this.isWeaponConstructor(ingredientCtor)) {
          let found = false;
          for (const weapon of this.player.weaponManager.weapons.values()) {
            if (weapon.constructor === ingredientCtor && weapon.isMaxLevel) {
              found = true;
              break;
            }
          }
          return found;
        }
        return false;
      });
    });
  }

  canFuse(recipe: FusionRecipe): boolean {
    return recipe.ingredients.every((ingredientCtor) => {
      if (this.isItemConstructor(ingredientCtor)) {
        let found = false;
        for (const item of this.player.itemManager.items.values()) {
          if (item.constructor === ingredientCtor && item.isMaxLevel) {
            found = true;
            break;
          }
        }
        return found;
      }
      if (this.isWeaponConstructor(ingredientCtor)) {
        let found = false;
        for (const weapon of this.player.weaponManager.weapons.values()) {
          if (weapon.constructor === ingredientCtor && weapon.isMaxLevel) {
            found = true;
            break;
          }
        }
        return found;
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
        let itemToRemove: Item | undefined;
        this.player.itemManager.items.forEach((item, key) => {
          if (item.constructor === ingredientCtor && item.isMaxLevel) {
            itemToRemove = item;
            this.player.itemManager.items.delete(key);
            itemToRemove.removeEffect?.(this.player);
          }
        });
      } else if (this.isWeaponConstructor(ingredientCtor)) {
        let weaponToRemove: Weapon | undefined;
        this.player.weaponManager.weapons.forEach((weapon, key) => {
          if (weapon.constructor === ingredientCtor && weapon.isMaxLevel) {
            weaponToRemove = weapon;
            this.player.weaponManager.weapons.delete(key);
            weaponToRemove.destroy();
          }
        });
      }
    });

    let result: Item | Weapon;

    if (this.isItemConstructor(recipe.result)) {
      const NewItem = recipe.result as ItemConstructor;
      result = new NewItem();
      this.player.itemManager.addItem(result);
      result.applyEffect?.(this.player);
    } else {
      const NewWeapon = recipe.result as WeaponConstructor;
      result = new NewWeapon(this.player.scene, this.player);
      this.player.weaponManager.addWeapon(result);
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
