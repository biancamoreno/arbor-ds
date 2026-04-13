import { color as primitiveColor } from '../../primitives';

export const themeDarkColors = {
  background: {
    default: primitiveColor.neutral['100'],
    contrast: primitiveColor.neutral['80'],
    subtle: primitiveColor.neutral['100'],
    interactive: primitiveColor.neutral['70'],
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  surface: {
    default: primitiveColor.neutral['90'],
    highlight: primitiveColor.neutral['80'],
    raised: primitiveColor.neutral['70'],
  },
  border: {
    default: primitiveColor.neutral['70'],
    subtle: primitiveColor.neutral['80'],
    strong: primitiveColor.neutral['50'],
    interactive: primitiveColor.aqua['60'],
  },
  text: {
    primary: primitiveColor.neutral.white,
    secondary: primitiveColor.neutral['40'],
    tertiary: primitiveColor.neutral['50'],
    inverse: primitiveColor.neutral['100'],
    disabled: primitiveColor.neutral['70'],
  },
  icon: {
    primary: primitiveColor.neutral.white,
    secondary: primitiveColor.neutral['50'],
    interactive: primitiveColor.aqua['40'],
    disabled: primitiveColor.neutral['70'],
  },
  interactive: {
    default: primitiveColor.aqua['40'],
    hover: primitiveColor.aqua['50'],
    active: primitiveColor.aqua['70'],
    disabled: primitiveColor.neutral['70'],
  },
  brand: {
    subtle: primitiveColor.aqua['30'],
    soft: primitiveColor.aqua['40'],
    base: primitiveColor.aqua['50'],
    strong: primitiveColor.aqua['60'],
  },
  feedback: {
    success: {
      subtle: primitiveColor.aqua['20'],
      base: primitiveColor.aqua['40'],
      strong: primitiveColor.aqua['60'],
    },
    warning: {
      subtle: primitiveColor.orange['20'],
      base: primitiveColor.orange['50'],
      strong: primitiveColor.orange['70'],
    },
    critical: {
      subtle: primitiveColor.red['20'],
      base: primitiveColor.red['50'],
      strong: primitiveColor.red['70'],
    },
  },
  status: {
    info: primitiveColor.ocean['40'],
    notice: primitiveColor.yellow['40'],
    highlight: primitiveColor.rose['40'],
  },
};

export type ThemeDarkColors = typeof themeDarkColors;
