import { opacity as primitiveOpacity, color as primitiveColor } from '../../primitives';

export const themeLightColors = {
  background: {
    default: primitiveColor.neutral.white,
    subtle: primitiveColor.sandstone['10'],
    muted: primitiveColor.sandstone['20'],
    inverse: primitiveColor.neutral['100'],
  },
  border: {
    default: primitiveOpacity.color.black['16'],
    inverse: primitiveOpacity.color.white['36'],
  },
  brand: {
    subtle: primitiveColor.aqua['20'],
    soft: primitiveColor.aqua['40'],
    base: primitiveColor.aqua['60'],
    strong: primitiveColor.aqua['80'],
  },
  content: {
    primary: primitiveColor.neutral['100'],
    secondary: primitiveColor.neutral['60'],
    tertiary: primitiveColor.neutral['40'],
    inverse: primitiveColor.neutral.white,
  },
  feedback: {
    success: {
      subtle: primitiveColor.aqua['10'],
      base: primitiveColor.aqua['60'],
      strong: primitiveColor.aqua['70'],
    },
    warning: {
      subtle: primitiveColor.orange['10'],
      base: primitiveColor.orange['90'],
      strong: primitiveColor.orange['100'],
    },
    critical: {
      subtle: primitiveColor.red['10'],
      base: primitiveColor.red['60'],
      strong: primitiveColor.red['70'],
    },
  },
  highlight: {
    primary: primitiveColor.neutral['100'],
    secondary: primitiveColor.neutral['60'],
  },
  opacity: {
    light: {
      subtle: primitiveOpacity.color.white['16'],
      soft: primitiveOpacity.color.white['24'],
      medium: primitiveOpacity.color.white['44'],
      strong: primitiveOpacity.color.white['56'],
      stronger: primitiveOpacity.color.white['72'],
      strongest: primitiveOpacity.color.white['92'],
    },
    dark: {
      subtle: primitiveOpacity.color.black['8'],
      soft: primitiveOpacity.color.black['16'],
      medium: primitiveOpacity.color.black['28'],
      strong: primitiveOpacity.color.black['40'],
      stronger: primitiveOpacity.color.black['68'],
      strongest: primitiveOpacity.color.black['80'],
    },
  },
};

export type ThemeLightColors = typeof themeLightColors;
