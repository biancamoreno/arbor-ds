import { useTheme } from '../adapters';
import type { SlotRecipeConfig } from '../../../foundations/theme/types';
import type { StyleProps } from '../system/system.types';

function isSlotRecipeConfig(value: object): value is SlotRecipeConfig {
  return 'slots' in value;
}

export function useSlotRecipe<S extends string = string>(
  recipeName: string,
  props: Record<string, unknown> = {},
): Partial<Record<S, StyleProps>> {
  const theme = useTheme();
  const entry = theme.recipes?.[recipeName];

  if (!entry || typeof entry !== 'object' || !isSlotRecipeConfig(entry)) {
    return {} as Partial<Record<S, StyleProps>>;
  }

  const recipe = entry as SlotRecipeConfig;
  const { slots, base = {}, variants = {}, compoundVariants = [], defaultVariants = {} } = recipe;

  const result: Record<string, Record<string, unknown>> = {};
  for (const slot of slots) {
    result[slot] = { ...((base[slot] as Record<string, unknown>) ?? {}) };
  }

  for (const [variantKey, variantMap] of Object.entries(variants)) {
    const value = (props[variantKey] ?? defaultVariants[variantKey]) as string | undefined;
    if (value !== undefined && variantMap[value]) {
      for (const [slot, slotStyles] of Object.entries(variantMap[value])) {
        result[slot] = { ...(result[slot] ?? {}), ...(slotStyles as Record<string, unknown>) };
      }
    }
  }

  for (const cv of compoundVariants) {
    const matches = Object.entries(cv.conditions).every(([k, v]) => {
      return (props[k] ?? defaultVariants[k]) === v;
    });
    if (matches) {
      for (const [slot, slotStyles] of Object.entries(cv.style)) {
        result[slot] = { ...(result[slot] ?? {}), ...(slotStyles as Record<string, unknown>) };
      }
    }
  }

  return result as unknown as Partial<Record<S, StyleProps>>;
}
