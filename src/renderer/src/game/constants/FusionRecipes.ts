import { FusionRecipe } from '../fusion';
import { ChocolateChip, JellyCrown } from '../items';
import { Knife } from '../weapons';

export const FUSION_RECIPES: FusionRecipe[] = [
  {
    id: 'test',
    ingredients: [Knife, ChocolateChip],
    name: 'test',
    result: JellyCrown
  }
] as const;
