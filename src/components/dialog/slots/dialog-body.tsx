import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import type { DialogBodyProps } from '../interfaces/DialogProps';

type DialogSlots =
  | 'overlay'
  | 'content'
  | 'header'
  | 'body'
  | 'footer'
  | 'title'
  | 'description'
  | 'close';

/**
 * Corpo do Dialog — recebe markup livre do consumidor (forms, listas,
 * mensagens). Anatomia themable via slot recipe `dialog.body`.
 */
export function DialogBody({ children }: DialogBodyProps) {
  const slots = useSlotRecipe<DialogSlots>('dialog', {});
  return <Box {...(slots.body as Record<string, unknown>)}>{children}</Box>;
}
