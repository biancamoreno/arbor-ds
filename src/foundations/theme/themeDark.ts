import { themeDarkColors } from '../tokens';
import { text } from '../tokens/components';
import { baseTheme } from './base-theme';

export const themeDark = {
  ...baseTheme,
  mode: 'dark' as const,
  colors: {
    ...themeDarkColors,
  },
  components: {
    text,
  },
} as const;

export type ThemeDark = typeof themeDark;
