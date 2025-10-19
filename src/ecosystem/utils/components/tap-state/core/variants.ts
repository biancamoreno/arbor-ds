/* eslint-disable @typescript-eslint/no-explicit-any */
import { createVariant, type Token, type Theme } from '../../../..';
import { type TapStateProps } from '../interfaces';

export function backgroundColorVariants(variant: TapStateProps['variant']) {
  return createVariant<{ backgroundColor?: string }, TapStateProps['variant']>(
    variant,
    {},
    {
      default: {
        backgroundColor: 'overlay.dark',
      },
      highlight: {
        backgroundColor: 'overlay.bright',
      },
    },
  ) as {
    backgroundColor: Token<Theme['colors']>;
  };
}
