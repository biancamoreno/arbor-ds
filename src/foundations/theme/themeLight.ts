import { themeLightColors } from '../tokens';
import { text } from '../tokens/components';
import { baseTheme } from './base-theme';

export const themeLight = {
  ...baseTheme,
  mode: 'light' as const,
  colors: {
    ...themeLightColors,
  },
  components: {
    text,
  },
} as const;

export type ThemeLight = typeof themeLight;
