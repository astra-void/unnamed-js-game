import { ItemConstructor, WeaponConstructor } from '../types/constructors';

export interface FusionIngredient {
  ctor: ItemConstructor | WeaponConstructor;
  count: number;
}

export interface FusionRecipe {
  id: string;
  name: string;
  ingredients: FusionIngredient[];
  result: ItemConstructor | WeaponConstructor;
}
