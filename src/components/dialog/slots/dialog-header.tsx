import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import type { DialogHeaderProps } from '../interfaces/DialogProps';

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
 * Cabeçalho do Dialog — agrupa `Dialog.Title` e `Dialog.Description`.
 * Anatomia themable via slot recipe `dialog.header`.
 */
export function DialogHeader({ children }: DialogHeaderProps) {
  const slots = useSlotRecipe<DialogSlots>('dialog', {});
  return <Box {...(slots.header as Record<string, unknown>)}>{children}</Box>;
}
