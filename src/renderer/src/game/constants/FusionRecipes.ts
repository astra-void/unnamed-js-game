import { FusionRecipe } from '../fusion';
import { ChocolateChip, JellyCrown } from '../items';

export const FUSION_RECIPES: FusionRecipe[] = [
  {
    id: 'test',
    name: 'Jelly Crown Fusion',
    ingredients: [{ ctor: ChocolateChip, count: 1 }],
    result: JellyCrown
  }
] as const;
