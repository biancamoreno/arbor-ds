import { useTheme } from '../adapters';
import type { RecipeConfig } from '../../../foundations/theme/types';
import type { StyleProps } from '../system/system.types';

function isRecipeConfig(value: RecipeConfig | object): value is RecipeConfig {
  return !('slots' in value);
}

export function useRecipe(recipeName: string, props: Record<string, unknown>): StyleProps {
  const theme = useTheme();
  const entry = theme.components?.[recipeName];

  if (!entry || typeof entry !== 'object' || !isRecipeConfig(entry)) return {} as StyleProps;

  const recipe = entry as RecipeConfig;
  const { base = {}, variants = {}, compoundVariants = [], defaultVariants = {} } = recipe;

  let result: Record<string, unknown> = { ...base };

  for (const [variantKey, variantMap] of Object.entries(variants)) {
    const value = (props[variantKey] ?? defaultVariants[variantKey]) as string | undefined;
    if (value !== undefined && variantMap[value]) {
      result = { ...result, ...variantMap[value] };
    }
  }

  for (const cv of compoundVariants) {
    const matches = Object.entries(cv.conditions).every(([k, v]) => {
      return (props[k] ?? defaultVariants[k]) === v;
    });
    if (matches) {
      result = { ...result, ...cv.style };
    }
  }

  return result as StyleProps;
}
