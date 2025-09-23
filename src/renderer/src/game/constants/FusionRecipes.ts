import { FusionRecipe } from '../fusion';
import { ChocolateChip, JellyCrown } from '../items';
import { Knife } from '../weapons';

export const FUSION_RECIPES: FusionRecipe[] = [
  {
    id: 'test',
    name: 'Jelly Crown Fusion',
    ingredients: [
      { ctor: Knife, count: 1 },
      { ctor: ChocolateChip, count: 1 }
    ],
    result: JellyCrown
  }
] as const;
