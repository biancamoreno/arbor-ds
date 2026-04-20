import { themeDarkColors } from '../tokens';
import { baseTheme } from './base-theme';

export const themeDark = {
  ...baseTheme,
  mode: 'dark' as const,
  colors: {
    ...themeDarkColors,
  },
} as const;

export type ThemeDark = typeof themeDark;
