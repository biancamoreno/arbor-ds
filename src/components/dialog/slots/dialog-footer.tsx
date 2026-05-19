import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import type { DialogFooterProps } from '../interfaces/DialogProps';

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
 * Rodapé do Dialog — agrupa ações (confirmar/cancelar). Layout default:
 * flex row + gap + justify flex-end (consumidor inverte ordem se quiser).
 * Anatomia themable via slot recipe `dialog.footer`.
 */
export function DialogFooter({ children }: DialogFooterProps) {
  const slots = useSlotRecipe<DialogSlots>('dialog', {});
  return <Box {...(slots.footer as Record<string, unknown>)}>{children}</Box>;
}
