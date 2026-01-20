import { opacity as primitiveOpacity, color as primitiveColor } from '../../primitives';

export const themeLightColors = {
  adaptive: {
    a: primitiveOpacity.color.black['16'],
    b: primitiveOpacity.color.black['20'],
    c: primitiveColor.adaptive.tabBar.retail,
    d: primitiveColor.adaptive.header.retail,
    e: primitiveColor.neutral['100'],
  },
  background: {
    a: primitiveColor.neutral.white,
    b: primitiveColor.sandstone['10'],
    c: primitiveColor.sandstone['20'],
    d: primitiveColor.neutral['100'],
  },
  border: {
    a: primitiveOpacity.color.black['16'],
    b: primitiveOpacity.color.white['36'],
  },
  brand: {
    a: primitiveColor.aqua['20'],
    b: primitiveColor.aqua['40'],
    c: primitiveColor.aqua['60'],
    d: primitiveColor.aqua['80'],
  },
  content: {
    a: primitiveColor.neutral['100'],
    b: primitiveColor.neutral['60'],
    c: primitiveColor.neutral['40'],
    d: primitiveColor.neutral.white,
  },
  feedback: {
    success: {
      a: primitiveColor.aqua['10'],
      b: primitiveColor.aqua['60'],
      c: primitiveColor.aqua['70'],
    },
    warning: {
      a: primitiveColor.orange['10'],
      b: primitiveColor.orange['90'],
      c: primitiveColor.orange['100'],
    },
    critical: {
      a: primitiveColor.red['10'],
      b: primitiveColor.red['60'],
      c: primitiveColor.red['70'],
    },
  },
  gradient: {
    a: primitiveColor.neutral.white,
    b: primitiveColor.lime['60'],
    c: primitiveColor.aqua['60'],
  },
  highlight: {
    a: primitiveColor.neutral['100'],
    b: primitiveColor.lime['60'],
  },
  opacity: {
    bright: {
      weakest: primitiveOpacity.color.white['16'],
      weaker: primitiveOpacity.color.white['24'],
      weak: primitiveOpacity.color.white['44'],
      strong: primitiveOpacity.color.white['56'],
      stronger: primitiveOpacity.color.white['72'],
      strongest: primitiveOpacity.color.white['92'],
    },
    dark: {
      weakest: primitiveOpacity.color.black['8'],
      weaker: primitiveOpacity.color.black['16'],
      weak: primitiveOpacity.color.black['28'],
      strong: primitiveOpacity.color.black['40'],
      stronger: primitiveOpacity.color.black['68'],
      strongest: primitiveOpacity.color.black['80'],
    },
  },
};

export type ThemeLightColors = typeof themeLightColors;
