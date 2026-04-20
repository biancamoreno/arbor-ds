import type { StyleProps } from '../system/system.types';

type SlotVariants<
  Slots extends string,
  V extends Record<string, Record<string, Partial<Record<Slots, StyleProps>>>>,
> = {
  [K in keyof V]?: keyof V[K];
};

export type TypedSlotRecipeConfig<
  Slots extends string,
  V extends Record<string, Record<string, Partial<Record<Slots, StyleProps>>>>,
> = {
  slots: readonly Slots[];
  base?: Partial<Record<Slots, StyleProps>>;
  variants?: V;
  defaultVariants?: SlotVariants<Slots, V>;
};

export function defineSlotRecipe<
  Slots extends string,
  V extends Record<string, Record<string, Partial<Record<Slots, StyleProps>>>>,
>(config: TypedSlotRecipeConfig<Slots, V>): TypedSlotRecipeConfig<Slots, V> {
  return config;
}
