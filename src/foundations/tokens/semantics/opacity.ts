import { opacity as primitiveOpacity } from '../primitives';

export const opacity = {
  none: primitiveOpacity.layer[0],
  lightest: primitiveOpacity.layer[8],
  lighter: primitiveOpacity.layer[16],
  light: primitiveOpacity.layer[24],
  medium: primitiveOpacity.layer[40],
  strong: primitiveOpacity.layer[56],
  stronger: primitiveOpacity.layer[72],
  strongest: primitiveOpacity.layer[88],
  solid: primitiveOpacity.layer[100],
};
