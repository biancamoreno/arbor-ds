import { type Theme } from '../../tokens';
import { type ResponsiveValue, type Token } from '../types';
import { system } from 'styled-system';

export const customSpace = system({
  marginInline: {
    property: 'marginInline',
    scale: 'space',
  },
  paddingInline: {
    property: 'paddingInline',
    scale: 'space',
  },
});

export interface SpaceProps {
  /**
   * Margin on top, left, bottom and right
   */
  m?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Margin on top, left, bottom and right
   */
  margin?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Margin on top
   */
  mt?: ResponsiveValue<Token<Theme['space']> | number>;
  marginBlockStart?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Margin on top
   */
  marginTop?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Margin on right
   */
  mr?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * When direction is `ltr`, `marginInlineEnd` is equivalent to `marginRight`.
   * When direction is `rtl`, `marginInlineEnd` is equivalent to `marginLeft`.
   */
  marginInlineEnd?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * When direction is `ltr`, `marginEnd` is equivalent to `marginRight`.
   * When direction is `rtl`, `marginEnd` is equivalent to `marginLeft`.
   */
  marginEnd?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * When direction is `ltr`, `me` is equivalent to `marginRight`.
   * When direction is `rtl`, `me` is equivalent to `marginLeft`.
   */
  me?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Margin on right
   */
  marginRight?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Margin on bottom
   */
  mb?: ResponsiveValue<Token<Theme['space']> | number>;
  marginBlockEnd?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Margin on bottom
   */
  marginBottom?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Margin on left
   */
  ml?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * When direction is `ltr`, `marginInlineStart` is equivalent to `marginLeft`.
   * When direction is `rtl`, `marginInlineStart` is equivalent to `marginRight`.
   */
  marginInlineStart?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * When direction is `ltr`, `marginStart` is equivalent to `marginLeft`.
   * When direction is `rtl`, `marginStart` is equivalent to `marginRight`.
   */
  marginStart?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * When direction is `ltr`, `ms` is equivalent to `marginLeft`.
   * When direction is `rtl`, `ms` is equivalent to `marginRight`.
   */
  ms?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Margin on left
   */
  marginLeft?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Margin on left and right
   */
  mx?: ResponsiveValue<Token<Theme['space']> | number>;
  marginInline?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Margin on left and right
   */
  marginX?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Margin on top and bottom
   */
  my?: ResponsiveValue<Token<Theme['space']> | number>;
  marginBlock?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Margin on top and bottom
   */
  marginY?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Padding on top, left, bottom and right
   */
  p?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Padding on top, left, bottom and right
   */
  padding?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Padding on top
   */
  pt?: ResponsiveValue<Token<Theme['space']> | number>;
  paddingBlockStart?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Padding on top
   */
  paddingTop?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Padding on right
   */
  pr?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * When direction is `ltr`, `paddingInlineEnd` is equivalent to `paddingRight`.
   * When direction is `rtl`, `paddingInlineEnd` is equivalent to `paddingLeft`.
   */
  paddingInlineEnd?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * When direction is `ltr`, `paddingEnd` is equivalent to `paddingRight`.
   * When direction is `rtl`, `paddingEnd` is equivalent to `paddingLeft`.
   */
  paddingEnd?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * When direction is `ltr`, `pe` is equivalent to `paddingRight`.
   * When direction is `rtl`, `pe` is equivalent to `paddingLeft`.
   */
  pe?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Padding on right
   */
  paddingRight?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Padding on bottom
   */
  pb?: ResponsiveValue<Token<Theme['space']> | number>;
  paddingBlockEnd?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Padding on bottom
   */
  paddingBottom?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Padding on left
   */
  pl?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * When direction is `ltr`, `paddingInlineStart` is equivalent to `paddingLeft`.
   * When direction is `rtl`, `paddingInlineStart` is equivalent to `paddingRight`.
   */
  paddingInlineStart?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * When direction is `ltr`, `paddingStart` is equivalent to `paddingLeft`.
   * When direction is `rtl`, `paddingStart` is equivalent to `paddingRight`.
   */
  paddingStart?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * When direction is `ltr`, `ps` is equivalent to `paddingLeft`.
   * When direction is `rtl`, `ps` is equivalent to `paddingRight`.
   */
  ps?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Padding on left
   */
  paddingLeft?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Padding on left and right
   */
  px?: ResponsiveValue<Token<Theme['space']> | number>;
  paddingInline?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Padding on left and right
   */
  paddingX?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Padding on top and bottom
   */
  py?: ResponsiveValue<Token<Theme['space']> | number>;
  paddingBlock?: ResponsiveValue<Token<Theme['space']> | number>;
  /**
   * Padding on top and bottom
   */
  paddingY?: ResponsiveValue<Token<Theme['space']> | number>;
}
