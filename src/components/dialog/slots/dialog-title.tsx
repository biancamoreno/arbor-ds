import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useDialogContext } from '../context/dialog-context';
import type { DialogTitleProps } from '../interfaces/DialogProps';

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
 * Cabeçalho do Dialog. Tipografia (fontSize/fontWeight/lineHeight/letterSpacing)
 * e cor são 100% themables via `dialog.title.typography.*` / `dialog.colors.title`.
 */
export function DialogTitle({ children }: DialogTitleProps) {
  const { titleId } = useDialogContext();
  const slots = useSlotRecipe<DialogSlots>('dialog', {});

  return (
    <Box as="h2" id={titleId} {...(slots.title as Record<string, unknown>)}>
      {children}
    </Box>
  );
}
