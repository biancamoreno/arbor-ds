import type { StyleProps } from '../system/system.types';

type RecipeVariants<V extends Record<string, Record<string, StyleProps>>> = {
  [K in keyof V]?: keyof V[K];
};

export type TypedRecipeConfig<V extends Record<string, Record<string, StyleProps>>> = {
  base?: StyleProps;
  variants?: V;
  compoundVariants?: Array<{
    conditions: Partial<RecipeVariants<V>>;
    style: StyleProps;
  }>;
  defaultVariants?: RecipeVariants<V>;
};

export function defineRecipe<V extends Record<string, Record<string, StyleProps>>>(
  config: TypedRecipeConfig<V>,
): TypedRecipeConfig<V> {
  return config;
}
