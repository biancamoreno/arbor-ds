import { color as primitiveColor } from '../../primitives';
import { makeDarkColorScale, type ColorScale } from './scale';

const brandScale = makeDarkColorScale(primitiveColor.forestGreen);
const grayScale = makeDarkColorScale({
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
const infoScale = makeDarkColorScale(primitiveColor.ocean);
const successScale = makeDarkColorScale({
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
const warningScale = makeDarkColorScale({
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
const criticalScale = makeDarkColorScale({
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

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace(/^#/, '');
  const full = cleaned.length === 3
    ? cleaned.split('').map((c) => c + c).join('')
    : cleaned;
  const num = Number.parseInt(full, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const themeDarkColors = {
  background: {
    default: primitiveColor.neutral[100],
    contrast: primitiveColor.neutral[80],
    subtle: primitiveColor.neutral[100],
    muted: primitiveColor.neutral[110],
    interactive: primitiveColor.neutral[70],
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  surface: {
    default: primitiveColor.neutral[90],
    highlight: primitiveColor.neutral[80],
    raised: primitiveColor.neutral[70],
    translucent: 'rgba(20, 20, 20, 0.85)',
  },
  border: {
    default: primitiveColor.neutral[70],
    subtle: primitiveColor.neutral[80],
    strong: primitiveColor.neutral[50],
    interactive: brandScale.border,
  },
  text: {
    primary: primitiveColor.neutral.white,
    secondary: primitiveColor.neutral[40],
    tertiary: primitiveColor.neutral[50],
    inverse: primitiveColor.neutral[100],
    disabled: primitiveColor.neutral[70],
  },
  icon: {
    primary: primitiveColor.neutral.white,
    secondary: primitiveColor.neutral[50],
    interactive: brandScale.solid,
    disabled: primitiveColor.neutral[70],
  },
  interactive: {
    default: brandScale.solid,
    hover: brandScale.solidHover,
    active: brandScale.text,
    disabled: primitiveColor.neutral[70],
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
    ringGlow: hexToRgba(brandScale.solid, 0.25),
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

export type ThemeDarkColors = typeof themeDarkColors;
