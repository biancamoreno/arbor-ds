import { lineHeight as primitiveLineHeight } from '../../primitives';

export const lineHeight = {
  /** value: 12px */
  xxsmall: primitiveLineHeight[12],
  /** value: 20px */
  xsmall: primitiveLineHeight[20],
  /** value: 24px */
  small: primitiveLineHeight[24],
  /** value: 28px */
  medium: primitiveLineHeight[28],
  /** value: 32px */
  large: primitiveLineHeight[32],
  /** value: 36px */
  xlarge: primitiveLineHeight[36],
  /** value: 44px — proporção ~1.1 sobre fontSize.displaySmall (40px). */
  displaySmall: primitiveLineHeight[44],
  /** value: 56px — proporção ~1.17 sobre fontSize.displayMedium (48px). */
  displayMedium: primitiveLineHeight[56],
  /** value: 64px — proporção ~1.07 sobre fontSize.displayLarge (60px). */
  displayLarge: primitiveLineHeight[64],
  /** value: 76px — proporção ~1.05 sobre fontSize.displayHero (72px). */
  displayHero: primitiveLineHeight[76],
};
