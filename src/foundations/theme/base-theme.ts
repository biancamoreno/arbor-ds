import { createBreakpoints } from '../../ecosystem/styled-system/core/breakpoints';
import {
  borderRadius,
  borderWidth,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  spacing,
  opacity,
  zIndex,
} from '../tokens';

export const baseTheme = {
  borders: borderWidth,
  borderWidths: borderWidth,
  radii: borderRadius,
  sizes: spacing,
  space: spacing,
  opacity,
  lineHeights: lineHeight,
  fontWeights: fontWeight,
  fontSizes: fontSize,
  fonts: fontFamily,
  zIndices: zIndex,
  breakpoints: createBreakpoints({
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }),
};

export type BaseTheme = typeof baseTheme;
