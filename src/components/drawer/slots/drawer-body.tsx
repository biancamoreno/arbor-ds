import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import type { DrawerBodyProps } from '../interfaces/DrawerProps';

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
 * Corpo do Drawer — markup livre do consumidor (forms, navegação, listas).
 * `flex: 1` empurra footer para a base do painel quando body cresce.
 */
export function DrawerBody({ children }: DrawerBodyProps) {
  const slots = useSlotRecipe<DrawerSlots>('drawer', {});
  return <Box {...(slots.body as Record<string, unknown>)}>{children}</Box>;
}
