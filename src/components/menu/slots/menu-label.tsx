import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import type { MenuLabelProps } from '../interfaces/MenuProps';

type MenuSlots = 'content' | 'item' | 'label' | 'separator';

/**
 * Cabeçalho não-interativo de seção dentro do Menu. Tipografia, padding e cor
 * são 100% themables via `menu.label.*` no token + recipe — produto override
 * via `createTheme({ components: { menu: { label: { typography: {...}, ... } } } })`.
 */
export function MenuLabel({ children }: MenuLabelProps) {
  const slots = useSlotRecipe<MenuSlots>('menu', {});

  return (
    <Box
      as="div"
      role="presentation"
      {...(slots.label as Record<string, unknown>)}
    >
      {children}
    </Box>
  );
}
