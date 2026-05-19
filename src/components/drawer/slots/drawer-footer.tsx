import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import type { DrawerFooterProps } from '../interfaces/DrawerProps';

type DrawerSlots =
  | 'overlay'
  | 'content'
  | 'header'
  | 'body'
  | 'footer'
  | 'title'
  | 'description'
  | 'close';

/**
 * Rodapé do Drawer — agrupa ações (aplicar/cancelar/avançar). Layout default:
 * flex row + gap + justify flex-end. Anatomia themable via `drawer.footer`.
 */
export function DrawerFooter({ children }: DrawerFooterProps) {
  const slots = useSlotRecipe<DrawerSlots>('drawer', {});
  return <Box {...(slots.footer as Record<string, unknown>)}>{children}</Box>;
}
