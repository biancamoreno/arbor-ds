import { type BaseTheme } from './base-theme';
import { type ThemeLight } from './themeLight';

export type ArborTheme = BaseTheme & {
  colors: ThemeLight['colors'];
  components: ThemeLight['components'];
};
