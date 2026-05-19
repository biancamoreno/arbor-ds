import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useDialogContext } from '../context/dialog-context';
import type { DialogDescriptionProps } from '../interfaces/DialogProps';

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
 * Descrição do Dialog (referenciada por `aria-describedby`). Tipografia e cor
 * themables via `dialog.description.typography.*` / `dialog.colors.description`.
 */
export function DialogDescription({ children }: DialogDescriptionProps) {
  const { descriptionId } = useDialogContext();
  const slots = useSlotRecipe<DialogSlots>('dialog', {});

  return (
    <Box as="p" id={descriptionId} {...(slots.description as Record<string, unknown>)}>
      {children}
    </Box>
  );
}
