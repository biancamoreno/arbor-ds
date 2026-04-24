import { createVariant } from '../../../../ecosystem/styled-system/core/variant/create-variant';
import type { Token } from '../../../../ecosystem/styled-system/system/types';
import type { Theme } from '../../../../ecosystem/styled-system/tokens';
import type { PressFeedbackVariant } from '../interfaces';

export function backgroundColorVariants(variant: PressFeedbackVariant) {
  return createVariant<{ backgroundColor?: string }, PressFeedbackVariant>(
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
