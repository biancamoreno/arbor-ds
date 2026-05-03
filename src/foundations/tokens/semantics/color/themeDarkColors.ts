import { color as primitiveColor } from '../../primitives';

const darkBrandPrimary = primitiveColor.aqua['40'];
const darkBrandHover = primitiveColor.aqua['50'];
const darkBrandActive = primitiveColor.aqua['70'];

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
    translucent: 'rgba(20, 20, 20, 0.85)',
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
    interactive: darkBrandPrimary,
    disabled: primitiveColor.neutral['70'],
  },
  interactive: {
    default: darkBrandPrimary,
    hover: darkBrandHover,
    active: darkBrandActive,
    disabled: primitiveColor.neutral['70'],
  },
  brand: {
    primary: primitiveColor.aqua['50'],
    secondary: primitiveColor.ocean['40'],
    accent: primitiveColor.emerald['40'],
    onPrimary: primitiveColor.neutral['100'],
    onSecondary: primitiveColor.neutral['100'],
    subtle: primitiveColor.aqua['30'],
    soft: primitiveColor.aqua['40'],
    base: primitiveColor.aqua['50'],
    strong: primitiveColor.aqua['60'],
  },
  feedback: {
    info: {
      subtle: primitiveColor.ocean['20'],
      base: primitiveColor.ocean['40'],
      strong: primitiveColor.ocean['60'],
    },
    success: {
      subtle: primitiveColor.emerald['20'],
      base: primitiveColor.emerald['40'],
      strong: primitiveColor.emerald['60'],
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
  shadow: {
    color: primitiveColor.neutral['100'],
  },
  focus: {
    ring: darkBrandPrimary,
  },
};

export type ThemeDarkColors = typeof themeDarkColors;
