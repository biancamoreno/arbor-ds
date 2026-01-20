
import type { ResponsiveValue, Token } from '../types';
import type { ArborTheme } from '../../../../foundations';

export interface BackgroundProps {
  /**
   * The CSS `background` property
   */
  background?: ResponsiveValue<Token<ArborTheme['colors']>>;
  /**
   * The CSS `background` property
   */
  bg?: ResponsiveValue<Token<ArborTheme['colors']>>;
  /**
   * The CSS `background-color` property
   */
  backgroundColor?: ResponsiveValue<Token<ArborTheme['colors']>>;
}
