import type * as CSS from 'csstype';
import { type Theme } from '../../tokens';
import { type Length, type ResponsiveValue, type Token } from '../types';

export interface LayoutProps {
  /**
   * The CSS `display` property
   */
  display?: ResponsiveValue<CSS.Property.Display>;
  /**
   * The CSS `width` property
   */
  width?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.Width | number>;
  /**
   * The CSS `width` property
   */
  w?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.Width | number>;
  inlineSize?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.InlineSize | number>;
  /**
   * The CSS `width` and `height` property
   */
  boxSize?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.Width | number>;
  /**
   * The CSS `max-width` property
   */
  maxWidth?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.MaxWidth | number>;
  /**
   * The CSS `max-width` property
   */
  maxW?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.MaxWidth | number>;
  maxInlineSize?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.MaxInlineSize | number>;
  /**
   * The CSS `min-width` property
   */
  minWidth?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.MinWidth | number>;
  /**
   * The CSS `min-width` property
   */
  minW?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.MinWidth | number>;
  minInlineSize?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.MinInlineSize | number>;
  /**
   * The CSS `height` property
   */
  height?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.Height | number>;
  /**
   * The CSS `height` property
   */
  maxHeight?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.MaxHeight | number>;
  /**
   * The CSS `max-height` property
   */
  maxH?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.MaxHeight | number>;
  maxBlockSize?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.MaxBlockSize | number>;
  /**
   * The CSS `min-height` property
   */
  minHeight?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.MinHeight | number>;
  /**
   * The CSS `min-height` property
   */
  minH?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.MinHeight | number>;
  minBlockSize?: ResponsiveValue<Token<Theme['sizes']> | CSS.Property.MinBlockSize | number>;
  /**
   * The CSS `vertical-align` property
   */
  verticalAlign?: ResponsiveValue<CSS.Property.VerticalAlign<Length>>;
  /**
   * The CSS `overflow` property
   */
  overflow?: ResponsiveValue<CSS.Property.Overflow>;
  /**
   * The CSS `overflow-x` property
   */
  overflowX?: ResponsiveValue<CSS.Property.OverflowX>;
  /**
   * The CSS `overflow-y` property
   */
  overflowY?: ResponsiveValue<CSS.Property.OverflowY>;
  /**
   * The CSS `box-sizing` property
   */
  boxSizing?: ResponsiveValue<CSS.Property.BoxSizing>;
  /**
   * The CSS `box-decoration` property
   */
  boxDecorationBreak?: ResponsiveValue<CSS.Property.BoxDecorationBreak>;
  /**
   * The CSS `float` property
   */
  float?: ResponsiveValue<CSS.Property.Float>;
  /**
   * The CSS `object-fit` property
   */
  objectFit?: ResponsiveValue<CSS.Property.ObjectFit>;
  /**
   * The CSS `object-position` property
   */
  objectPosition?: ResponsiveValue<CSS.Property.ObjectPosition<Length>>;
  /**
   * The CSS `overscroll-behavior` property
   */
  overscrollBehavior?: ResponsiveValue<CSS.Property.OverscrollBehavior>;
  /**
   * The CSS `overscroll-behavior` property
   */
  overscroll?: ResponsiveValue<CSS.Property.OverscrollBehavior>;
  /**
   * The CSS `overscroll-behavior-x` property
   */
  overscrollBehaviorX?: ResponsiveValue<CSS.Property.OverscrollBehaviorX>;
  /**
   * The CSS `overscroll-behavior-x` property
   */
  overscrollX?: ResponsiveValue<CSS.Property.OverscrollBehaviorX>;
  /**
   * The CSS `overscroll-behavior-y` property
   */
  overscrollBehaviorY?: ResponsiveValue<CSS.Property.OverscrollBehaviorY>;
  /**
   * The CSS `overscroll-behavior-y` property
   */
  overscrollY?: ResponsiveValue<CSS.Property.OverscrollBehaviorY>;
  /**
   * The CSS `visibility` property
   */
  visibility?: ResponsiveValue<CSS.Property.Visibility>;
  /**
   * The CSS `isolation` property
   */
  isolation?: ResponsiveValue<CSS.Property.Isolation>;
}
