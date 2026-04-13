import { color as primitiveColor } from '../../primitives';

export const themeLightColors = {
  background: {
    default: primitiveColor.neutral.white,
    contrast: primitiveColor.sandstone['10'],
    subtle: primitiveColor.sandstone['10'],
    interactive: primitiveColor.sandstone['20'],
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
  surface: {
    default: primitiveColor.neutral.white,
    highlight: primitiveColor.sandstone['10'],
    raised: primitiveColor.neutral.white,
  },
  border: {
    default: primitiveColor.neutral['30'],
    subtle: primitiveColor.neutral['20'],
    strong: primitiveColor.neutral['50'],
    interactive: primitiveColor.aqua['60'],
  },
  text: {
    primary: primitiveColor.neutral['100'],
    secondary: primitiveColor.neutral['60'],
    tertiary: primitiveColor.neutral['40'],
    inverse: primitiveColor.neutral.white,
    disabled: primitiveColor.neutral['30'],
  },
  icon: {
    primary: primitiveColor.neutral['100'],
    secondary: primitiveColor.neutral['60'],
    interactive: primitiveColor.aqua['60'],
    disabled: primitiveColor.neutral['30'],
  },
  interactive: {
    default: primitiveColor.aqua['60'],
    hover: primitiveColor.aqua['80'],
    active: primitiveColor.aqua['100'],
    disabled: primitiveColor.neutral['30'],
  },
  brand: {
    subtle: primitiveColor.aqua['20'],
    soft: primitiveColor.aqua['40'],
    base: primitiveColor.aqua['60'],
    strong: primitiveColor.aqua['80'],
  },
  feedback: {
    success: {
      subtle: primitiveColor.aqua['10'],
      base: primitiveColor.aqua['60'],
      strong: primitiveColor.aqua['80'],
    },
    warning: {
      subtle: primitiveColor.orange['10'],
      base: primitiveColor.orange['70'],
      strong: primitiveColor.orange['90'],
    },
    critical: {
      subtle: primitiveColor.red['10'],
      base: primitiveColor.red['60'],
      strong: primitiveColor.red['80'],
    },
  },
  status: {
    info: primitiveColor.ocean['60'],
    notice: primitiveColor.yellow['60'],
    highlight: primitiveColor.rose['60'],
  },
};

export type ThemeLightColors = typeof themeLightColors;
