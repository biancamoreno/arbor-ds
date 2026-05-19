import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import type { DrawerHeaderProps } from '../interfaces/DrawerProps';

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
 * Cabeçalho do Drawer — agrupa `Drawer.Title` e `Drawer.Description`.
 * Anatomia themable via slot recipe `drawer.header`.
 */
export function DrawerHeader({ children }: DrawerHeaderProps) {
  const slots = useSlotRecipe<DrawerSlots>('drawer', {});
  return <Box {...(slots.header as Record<string, unknown>)}>{children}</Box>;
}
