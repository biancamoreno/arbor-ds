import { borderRadius as primitiveBorderRadius } from '../../primitives';

export const borderRadius = {
  none: primitiveBorderRadius[0],
  nano: primitiveBorderRadius[4],
  micro: primitiveBorderRadius[8],
  small: primitiveBorderRadius[16],
  medium: primitiveBorderRadius[20],
  large: primitiveBorderRadius[40],
  full: primitiveBorderRadius[1000],
};
