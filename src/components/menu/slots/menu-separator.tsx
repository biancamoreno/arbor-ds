import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';

type MenuSlots = 'content' | 'item' | 'label' | 'separator';

export function MenuSeparator() {
  const slots = useSlotRecipe<MenuSlots>('menu', {});

  return (
    <Box
      as="div"
      role="separator"
      {...(slots.separator as Record<string, unknown>)}
    />
  );
}
