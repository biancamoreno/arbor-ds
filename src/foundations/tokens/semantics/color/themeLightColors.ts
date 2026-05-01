import { color as primitiveColor } from '../../primitives';

const lightBrandPrimary = primitiveColor.aqua['60'];
const lightBrandHover = primitiveColor.aqua['80'];
const lightBrandActive = primitiveColor.aqua['100'];

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
    translucent: 'rgba(255, 255, 255, 0.85)',
  },
  border: {
    default: primitiveColor.neutral['30'],
    subtle: primitiveColor.neutral['20'],
    strong: primitiveColor.neutral['50'],
    interactive: lightBrandPrimary,
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
    interactive: lightBrandPrimary,
    disabled: primitiveColor.neutral['30'],
  },
  interactive: {
    default: lightBrandPrimary,
    hover: lightBrandHover,
    active: lightBrandActive,
    disabled: primitiveColor.neutral['30'],
  },
  brand: {
    primary: lightBrandPrimary,
    secondary: primitiveColor.ocean['60'],
    accent: primitiveColor.emerald['60'],
    onPrimary: primitiveColor.neutral.white,
    onSecondary: primitiveColor.neutral.white,
    subtle: primitiveColor.aqua['20'],
    soft: primitiveColor.aqua['40'],
    base: lightBrandPrimary,
    strong: lightBrandHover,
  },
  feedback: {
    success: {
      subtle: primitiveColor.emerald['10'],
      base: primitiveColor.emerald['60'],
      strong: primitiveColor.emerald['80'],
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
  shadow: {
    color: primitiveColor.neutral['100'],
  },
  focus: {
    ring: lightBrandPrimary,
  },
};

export type ThemeLightColors = typeof themeLightColors;
