import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useDrawerContext } from '../context/drawer-context';
import type { DrawerTitleProps } from '../interfaces/DrawerProps';

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
 * Cabeçalho do Drawer. Tipografia (fontSize/fontWeight/lineHeight/letterSpacing)
 * e cor são 100% themables via `drawer.title.typography.*` / `drawer.colors.title`.
 */
export function DrawerTitle({ children }: DrawerTitleProps) {
  const { titleId } = useDrawerContext();
  const slots = useSlotRecipe<DrawerSlots>('drawer', {});
  return (
    <Box as="h2" id={titleId} {...(slots.title as Record<string, unknown>)}>
      {children}
    </Box>
  );
}
