import { createVariant } from '../../../../styled-system/core/variant/create-variant';
import type { Token } from '../../../../styled-system/system/types';
import type { Theme } from '../../../../styled-system/tokens';
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
