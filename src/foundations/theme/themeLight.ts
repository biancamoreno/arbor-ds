import {
  themeLightColors,
} from '../tokens';
import { text } from '../tokens/components';
import { baseTheme } from './base-theme';

export const themeLight = {
  ...baseTheme,
  colors: {
    ...themeLightColors,
  },
  components: {
    text
  }
};

export type ThemeLight = typeof themeLight;
