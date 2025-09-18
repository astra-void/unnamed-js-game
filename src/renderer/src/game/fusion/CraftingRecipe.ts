import { ItemConstructor, WeaponConstructor } from '../types/constructors';

export interface FusionRecipe {
  id: string;
  name: string;
  ingredients: (ItemConstructor | WeaponConstructor)[];
  result: ItemConstructor | WeaponConstructor;
}
