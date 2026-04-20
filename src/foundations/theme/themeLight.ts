import { themeLightColors } from '../tokens';
import { baseTheme } from './base-theme';

export const themeLight = {
  ...baseTheme,
  mode: 'light' as const,
  colors: {
    ...themeLightColors,
  },
} as const;

export type ThemeLight = typeof themeLight;
