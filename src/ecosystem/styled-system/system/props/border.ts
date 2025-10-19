import type * as CSS from 'csstype';
import { type Theme } from '../../tokens';
import { type ResponsiveValue, type Token } from '../types';

export interface BorderProps {
  /**
   * The CSS `border` property
   */
  border?: ResponsiveValue<Token<Theme['borders']>>;
  /**
   * The CSS `border-width` property
   */
  borderWidth?: ResponsiveValue<Token<Theme['borderWidths']> | number>;
  /**
   * The CSS `border-style` property
   */
  borderStyle?: ResponsiveValue<CSS.Property.BorderStyle>;
  /**
   * The CSS `border-color` property
   */
  borderColor?: ResponsiveValue<Token<Theme['colors']>>;
  /**
   * The CSS `border-radius` property
   */
  borderRadius?: ResponsiveValue<Token<Theme['radii']> | number>;
  /**
   * The CSS `border-radius` property
   */
  rounded?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * The CSS `border-top` property
   */
  borderTop?: ResponsiveValue<Token<Theme['borders']>>;
  borderBlockStart?: ResponsiveValue<CSS.Property.BorderBlockStart | number>;
  /**
   * The CSS `border-top-width` property
   */
  borderTopWidth?: ResponsiveValue<Token<Theme['borders']>>;
  borderBlockStartWidth?: ResponsiveValue<CSS.Property.BorderBlockStartWidth | number>;
  /**
   * The CSS `border-bottom-width` property
   */
  borderBottomWidth?: ResponsiveValue<CSS.Property.BorderWidth | number>;
  borderBlockEndWidth?: ResponsiveValue<CSS.Property.BorderBlockEndWidth | number>;
  /**
   * The CSS `border-left-width` property
   */
  borderLeftWidth?: ResponsiveValue<CSS.Property.BorderWidth | number>;
  borderStartWidth?: ResponsiveValue<CSS.Property.BorderWidth | number>;
  borderInlineStartWidth?: ResponsiveValue<CSS.Property.BorderInlineStartWidth | number>;
  /**
   * The CSS `border-right-width` property
   */
  borderRightWidth?: ResponsiveValue<CSS.Property.BorderWidth | number>;
  borderEndWidth?: ResponsiveValue<CSS.Property.BorderWidth | number>;
  borderInlineEndWidth?: ResponsiveValue<CSS.Property.BorderInlineEndWidth | number>;
  /**
   * The CSS `border-top-style` property
   */
  borderTopStyle?: ResponsiveValue<CSS.Property.BorderTopStyle>;
  borderBlockStartStyle?: ResponsiveValue<CSS.Property.BorderBlockStartStyle>;
  /**
   * The CSS `border-bottom-style` property
   */
  borderBottomStyle?: ResponsiveValue<CSS.Property.BorderBottomStyle>;
  borderBlockEndStyle?: ResponsiveValue<CSS.Property.BorderBlockEndStyle>;
  /**
   * The CSS `border-left-style` property
   */
  borderLeftStyle?: ResponsiveValue<CSS.Property.BorderLeftStyle>;
  borderStartStyle?: ResponsiveValue<CSS.Property.BorderInlineStartStyle>;
  borderInlineStartStyle?: ResponsiveValue<CSS.Property.BorderInlineStartStyle>;
  /**
   * The CSS `border-right-styles` property
   */
  borderRightStyle?: ResponsiveValue<CSS.Property.BorderRightStyle>;
  borderEndStyle?: ResponsiveValue<CSS.Property.BorderInlineEndStyle>;
  borderInlineEndStyle?: ResponsiveValue<CSS.Property.BorderInlineEndStyle>;
  /**
   * The CSS `border-top-color` property
   */
  borderTopColor?: ResponsiveValue<Token<Theme['colors']>>;
  borderBlockStartColor?: ResponsiveValue<Token<Theme['colors']>>;
  /**
   * The CSS `border-bottom-color` property
   */
  borderBottomColor?: ResponsiveValue<Token<Theme['colors']>>;
  borderBlockEndColor?: ResponsiveValue<Token<Theme['colors']>>;
  /**
   * The CSS `border-left-color` property
   */
  borderLeftColor?: ResponsiveValue<Token<Theme['colors']>>;
  borderStartColor?: ResponsiveValue<Token<Theme['colors']>>;
  borderInlineStartColor?: ResponsiveValue<Token<Theme['colors']>>;
  /**
   * The CSS `border-right-color` property
   */
  borderRightColor?: ResponsiveValue<Token<Theme['colors']>>;
  borderEndColor?: ResponsiveValue<Token<Theme['colors']>>;
  borderInlineEndColor?: ResponsiveValue<Token<Theme['colors']>>;
  /**
   * The CSS `border-right` property
   */
  borderRight?: ResponsiveValue<Token<Theme['borders']>>;
  borderEnd?: ResponsiveValue<Token<Theme['borders']>>;
  borderInlineEnd?: ResponsiveValue<Token<Theme['borders']>>;
  /**
   * The CSS `border-bottom` property
   */
  borderBottom?: ResponsiveValue<Token<Theme['borders']>>;
  borderBlockEnd?: ResponsiveValue<Token<Theme['borders']>>;
  /**
   * The CSS `border-left` property
   */
  borderLeft?: ResponsiveValue<Token<Theme['borders']>>;
  borderStart?: ResponsiveValue<Token<Theme['borders']>>;
  borderInlineStart?: ResponsiveValue<Token<Theme['borders']>>;
  /**
   * The CSS `border-top-radius` property
   */
  borderTopRadius?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * The CSS `border-top-radius` property
   */
  roundedTop?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * The CSS `border-right-radius` property
   */
  borderRightRadius?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * The CSS `border-right-radius` property
   */
  roundedRight?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * When direction is `ltr`, `roundedEnd` is equivalent to `borderRightRadius`.
   * When direction is `rtl`, `roundedEnd` is equivalent to `borderLeftRadius`.
   */
  roundedEnd?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * When direction is `ltr`, `borderInlineEndRadius` is equivalent to `borderRightRadius`.
   * When direction is `rtl`, `borderInlineEndRadius` is equivalent to `borderLeftRadius`.
   */
  borderInlineEndRadius?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * When direction is `ltr`, `borderEndRadius` is equivalent to `borderRightRadius`.
   * When direction is `rtl`, `borderEndRadius` is equivalent to `borderLeftRadius`.
   */
  borderEndRadius?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * The CSS `border-bottom-radius` property
   */
  borderBottomRadius?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * The CSS `border-bottom-radius` property
   */
  roundedBottom?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * The CSS `border-left-radius` property
   */
  borderLeftRadius?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * The CSS `border-left-radius` property
   */
  roundedLeft?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * When direction is `ltr`, `roundedEnd` is equivalent to `borderRightRadius`.
   * When direction is `rtl`, `roundedEnd` is equivalent to `borderLeftRadius`.
   */
  roundedStart?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * When direction is `ltr`, `borderInlineStartRadius` is equivalent to `borderLeftRadius`.
   * When direction is `rtl`, `borderInlineStartRadius` is equivalent to `borderRightRadius`.
   */
  borderInlineStartRadius?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * When direction is `ltr`, `borderStartRadius` is equivalent to `borderLeftRadius`.
   * When direction is `rtl`, `borderStartRadius` is equivalent to `borderRightRadius`.
   */
  borderStartRadius?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * The CSS `border-top-left-radius` property
   */
  borderTopLeftRadius?: ResponsiveValue<Token<Theme['radii']> | number>;
  borderTopStartRadius?: ResponsiveValue<Token<Theme['radii']>>;
  borderStartStartRadius?: ResponsiveValue<CSS.Property.BorderStartStartRadius | number>;
  /**
   * The CSS `border-top-left-radius` property
   */
  roundedTopLeft?: ResponsiveValue<Token<Theme['radii']>>;
  roundedTopStart?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * The CSS `border-top-right-radius` property
   */
  borderTopRightRadius?: ResponsiveValue<Token<Theme['radii']> | number>;
  borderTopEndRadius?: ResponsiveValue<Token<Theme['radii']>>;
  borderStartEndRadius?: ResponsiveValue<CSS.Property.BorderStartEndRadius | number>;
  /**
   * The CSS `border-top-right-radius` property
   */
  roundedTopRight?: ResponsiveValue<Token<Theme['radii']>>;
  roundedTopEnd?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * The CSS `border-bottom-left-radius` property
   */
  borderBottomLeftRadius?: ResponsiveValue<Token<Theme['radii']> | number>;
  borderBottomStartRadius?: ResponsiveValue<Token<Theme['radii']>>;
  borderEndStartRadius?: ResponsiveValue<CSS.Property.BorderEndStartRadius | number>;
  /**
   * The CSS `border-bottom-left-radius` property
   */
  roundedBottomLeft?: ResponsiveValue<Token<Theme['radii']>>;
  roundedBottomStart?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * The CSS `border-bottom-right-radius` property
   */
  borderBottomRightRadius?: ResponsiveValue<Token<Theme['radii']> | number>;
  borderBottomEndRadius?: ResponsiveValue<Token<Theme['radii']>>;
  borderEndEndRadius?: ResponsiveValue<CSS.Property.BorderEndEndRadius | number>;
  /**
   * The CSS `border-bottom-right-radius` property
   */
  roundedBottomRight?: ResponsiveValue<Token<Theme['radii']>>;
  roundedBottomEnd?: ResponsiveValue<Token<Theme['radii']>>;
  /**
   * The CSS `border-right` and `border-left` property
   */
  borderX?: ResponsiveValue<Token<Theme['borders']>>;
  borderInline?: ResponsiveValue<Token<Theme['borders']>>;
  /**
   * The CSS `border-top` and `border-bottom` property
   */
  borderY?: ResponsiveValue<Token<Theme['borders']>>;
  borderBlock?: ResponsiveValue<Token<Theme['borders']>>;
}
