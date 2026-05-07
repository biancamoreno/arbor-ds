import type { StyleProps } from '../../ecosystem/styled-system/system/system.types';

type AnyStyleProps = StyleProps;

export type RecipeConfig = {
  base?: AnyStyleProps;
  variants?: Record<string, Record<string, AnyStyleProps>>;
  compoundVariants?: Array<{
    conditions: Record<string, unknown>;
    style: AnyStyleProps;
  }>;
  defaultVariants?: Record<string, unknown>;
};

export type SlotRecipeConfig = {
  slots: readonly string[];
  base?: Partial<Record<string, AnyStyleProps>>;
  variants?: Record<string, Record<string, Record<string, AnyStyleProps>>>;
  compoundVariants?: Array<{
    conditions: Record<string, unknown>;
    style: Partial<Record<string, AnyStyleProps>>;
  }>;
  defaultVariants?: Record<string, unknown>;
};

export type ThemeRecipes = {
  text?: RecipeConfig;
  button?: RecipeConfig;
  field?: SlotRecipeConfig;
  input?: SlotRecipeConfig;
  checkbox?: SlotRecipeConfig;
  radio?: SlotRecipeConfig;
  switch?: SlotRecipeConfig;
  select?: SlotRecipeConfig;
  dialog?: SlotRecipeConfig;
  drawer?: SlotRecipeConfig;
  tooltip?: SlotRecipeConfig;
  badge?: RecipeConfig;
  alert?: SlotRecipeConfig;
  accordion?: SlotRecipeConfig;
  card?: SlotRecipeConfig;
  chip?: SlotRecipeConfig;
  tag?: SlotRecipeConfig;
  avatar?: SlotRecipeConfig;
  tabs?: SlotRecipeConfig;
  toast?: SlotRecipeConfig;
  [key: string]: RecipeConfig | SlotRecipeConfig | undefined;
};
