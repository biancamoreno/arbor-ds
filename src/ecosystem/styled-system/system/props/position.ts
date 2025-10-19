import type * as CSS from 'csstype';
import { type Theme } from '../../tokens';
import { type ResponsiveValue, type Token } from '../types';

export interface PositionProps {
  /**
   * The CSS `z-index` property
   */
  zIndex?: ResponsiveValue<Token<Theme['zIndices']>> | ResponsiveValue<CSS.Property.ZIndex>;
  /**
   * The CSS `top` property
   */
  top?: ResponsiveValue<Token<Theme['sizes']> | number>;
  /**
   * The CSS `right` property
   */
  right?: ResponsiveValue<Token<Theme['sizes']> | number>;
  /**
   * The CSS `bottom` property
   */
  bottom?: ResponsiveValue<Token<Theme['sizes']> | number>;
  /**
   * The CSS `left` property
   */
  left?: ResponsiveValue<Token<Theme['sizes']> | number>;
  /**
   * The CSS `position` property
   */
  pos?: ResponsiveValue<CSS.Property.Position>;
  /**
   * The CSS `position` property
   */
  position?: ResponsiveValue<CSS.Property.Position>;
}
