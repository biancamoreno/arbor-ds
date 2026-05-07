import { color as primitiveColor } from '../../primitives';
import { makeColorScale, type ColorScale } from './scale';

const brandScale = makeColorScale(primitiveColor.aqua);
const grayScale = makeColorScale({
  10: primitiveColor.neutral[10],
  20: primitiveColor.neutral[20],
  30: primitiveColor.neutral[30],
  40: primitiveColor.neutral[40],
  50: primitiveColor.neutral[50],
  60: primitiveColor.neutral[60],
  70: primitiveColor.neutral[70],
  80: primitiveColor.neutral[80],
  90: primitiveColor.neutral[90],
  100: primitiveColor.neutral[100],
  110: primitiveColor.neutral[110],
  120: primitiveColor.neutral[120],
});
const infoScale = makeColorScale(primitiveColor.ocean);
const successScale = makeColorScale({
  10: primitiveColor.emerald[10],
  20: primitiveColor.emerald[20],
  30: primitiveColor.emerald[30],
  40: primitiveColor.emerald[40],
  50: primitiveColor.emerald[50],
  60: primitiveColor.emerald[60],
  70: primitiveColor.emerald[70],
  80: primitiveColor.emerald[80],
  90: primitiveColor.emerald[90],
  100: primitiveColor.emerald[100],
  110: primitiveColor.emerald[110],
  120: primitiveColor.emerald[120],
});
const warningScale = makeColorScale({
  10: primitiveColor.orange[10],
  20: primitiveColor.orange[20],
  30: primitiveColor.orange[30],
  40: primitiveColor.orange[40],
  50: primitiveColor.orange[50],
  60: primitiveColor.orange[60],
  70: primitiveColor.orange[70],
  80: primitiveColor.orange[80],
  90: primitiveColor.orange[90],
  100: primitiveColor.orange[100],
  110: primitiveColor.orange[110],
  120: primitiveColor.orange[120],
});
const criticalScale = makeColorScale({
  10: primitiveColor.red[10],
  20: primitiveColor.red[20],
  30: primitiveColor.red[30],
  40: primitiveColor.red[40],
  50: primitiveColor.red[50],
  60: primitiveColor.red[60],
  70: primitiveColor.red[70],
  80: primitiveColor.red[80],
  90: primitiveColor.red[90],
  100: primitiveColor.red[100],
  110: primitiveColor.red[110],
  120: primitiveColor.red[120],
});

export const themeLightColors = {
  background: {
    default: primitiveColor.neutral.white,
    contrast: primitiveColor.sandstone[10],
    subtle: primitiveColor.sandstone[10],
    interactive: primitiveColor.sandstone[20],
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
  surface: {
    default: primitiveColor.neutral.white,
    highlight: primitiveColor.sandstone[10],
    raised: primitiveColor.neutral.white,
    translucent: 'rgba(255, 255, 255, 0.85)',
  },
  border: {
    default: primitiveColor.neutral[30],
    subtle: primitiveColor.neutral[20],
    strong: primitiveColor.neutral[50],
    interactive: brandScale.solid,
  },
  text: {
    primary: primitiveColor.neutral[100],
    secondary: primitiveColor.neutral[60],
    tertiary: primitiveColor.neutral[40],
    inverse: primitiveColor.neutral.white,
    disabled: primitiveColor.neutral[30],
  },
  icon: {
    primary: primitiveColor.neutral[100],
    secondary: primitiveColor.neutral[60],
    interactive: brandScale.solid,
    disabled: primitiveColor.neutral[30],
  },
  interactive: {
    default: brandScale.solid,
    hover: brandScale.solidHover,
    active: brandScale.textContrast,
    disabled: primitiveColor.neutral[30],
  },
  brand: brandScale,
  gray: grayScale,
  feedback: {
    info: infoScale,
    success: successScale,
    warning: warningScale,
    critical: criticalScale,
  },
  shadow: {
    color: primitiveColor.neutral[100],
  },
  focus: {
    ring: brandScale.solid,
  },
} satisfies {
  background: Record<string, string>;
  surface: Record<string, string>;
  border: Record<string, string>;
  text: Record<string, string>;
  icon: Record<string, string>;
  interactive: Record<string, string>;
  brand: ColorScale;
  gray: ColorScale;
  feedback: {
    info: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    critical: ColorScale;
  };
  shadow: Record<string, string>;
  focus: Record<string, string>;
};

export type ThemeLightColors = typeof themeLightColors;
