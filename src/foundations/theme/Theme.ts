import type { ThemeLight } from './themeLight';
import type { ThemeDark } from './themeDark';

export type ArborTheme = (ThemeLight | ThemeDark) & {
  mode: 'light' | 'dark';
  colors: ThemeLight['colors'];
  components: ThemeLight['components'];
};
