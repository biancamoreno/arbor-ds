import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useDrawerContext } from '../context/drawer-context';
import type { DrawerDescriptionProps } from '../interfaces/DrawerProps';

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
 * Descrição do Drawer (referenciada por `aria-describedby`). Tipografia e
 * cor themables via `drawer.description.typography.*` / `drawer.colors.description`.
 */
export function DrawerDescription({ children }: DrawerDescriptionProps) {
  const { descriptionId } = useDrawerContext();
  const slots = useSlotRecipe<DrawerSlots>('drawer', {});
  return (
    <Box as="p" id={descriptionId} {...(slots.description as Record<string, unknown>)}>
      {children}
    </Box>
  );
}
