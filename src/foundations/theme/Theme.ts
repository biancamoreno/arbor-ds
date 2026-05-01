import type { BaseTheme } from './base-theme';
import type { ThemeLightColors } from '../tokens/semantics/color/themeLightColors';

export type ThemeColors = ThemeLightColors;

export type ArborTheme = BaseTheme & {
  mode: string;
  colors: ThemeColors;
};
