import { type Theme } from '../../tokens';
import { type ResponsiveValue, type Token } from '../types';

export interface ColorProps {
  /**
   * The CSS `color` property
   */
  color?: ResponsiveValue<Token<Theme['colors']>>;
  /**
   * The CSS `fill` property for icon svgs and paths
   */
  fill?: ResponsiveValue<Token<Theme['colors']>>;
  /**
   * The CSS `stroke` property for icon svgs and paths
   */
  stroke?: ResponsiveValue<Token<Theme['colors']>>;
}
