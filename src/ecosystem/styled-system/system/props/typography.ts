import type * as CSS from 'csstype';
import { type Theme } from '../../tokens';
import { type ResponsiveValue, type Token } from '../types';

export interface TypographyProps {
  /**
   * The CSS `font-weight` property
   */
  fontWeight?: ResponsiveValue<Token<Theme['fontWeights']> | number>;
  /**
   * The CSS `line-height` property
   */
  lineHeight?: ResponsiveValue<Token<Theme['lineHeights']> | string>;
  /**
   * The CSS `letter-spacing` property
   */
  letterSpacing?: ResponsiveValue<CSS.Property.LetterSpacing | number>;

  /**
   * The CSS `font-size` property
   */
  fontSize?: ResponsiveValue<Token<Theme['fontSizes']> | number>;
  /**
   * The CSS `font-family` property
   */
  fontFamily?: ResponsiveValue<Token<Theme['fonts']>>;
  /**
   * The CSS `text-align` property
   */
  textAlign?: ResponsiveValue<CSS.Property.TextAlign>;
  /**
   * The CSS `font-style` property
   */
  fontStyle?: ResponsiveValue<CSS.Property.FontStyle>;
  /**
   * The CSS `word-break` property
   */
  wordBreak?: ResponsiveValue<CSS.Property.WordBreak>;
  /**
   * The CSS `overflow-wrap` property
   */
  overflowWrap?: ResponsiveValue<CSS.Property.OverflowWrap>;
  /**
   * The CSS `text-overflow` property
   */
  textOverflow?: ResponsiveValue<CSS.Property.TextOverflow>;
  /**
   * The CSS `text-transform` property
   */
  textTransform?: ResponsiveValue<CSS.Property.TextTransform>;
  /**
   * The CSS `white-space` property
   */
  whiteSpace?: ResponsiveValue<CSS.Property.WhiteSpace>;
  /**
   * Used to visually truncate a text after a number of lines.
   */
  noOfLines?: ResponsiveValue<number>;
  /**
   * If `true`, it clamps truncate a text after one line.
   */
  isTruncated?: ResponsiveValue<boolean>;
  /**
   * The property sets the kind of decoration that is used on text in an element, such as an underline or overline.
   */
  textDecorationLine?: ResponsiveValue<CSS.Property.TextDecorationLine>;
}
