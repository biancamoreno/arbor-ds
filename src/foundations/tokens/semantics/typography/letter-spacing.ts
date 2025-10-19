import { letterSpacing as primitiveLetterSpacing } from '../../primitives';

export const letterSpacing = {
  /**
   * value: 0px
   */
  default: primitiveLetterSpacing[0],
  /**
   * value: -0.45px
   */
  nSmall: primitiveLetterSpacing['negative0.45'],
  /**
   * value: -0.50px
   */
  nSmaller: primitiveLetterSpacing['negative0.5'],
  /**
   * value: -0.65px
   */
  nSmallest: primitiveLetterSpacing['negative0.65'],
};
