import { useCallback, useMemo } from 'react';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { DialogContext, type DialogContextValue } from '../context/dialog-context';
import { DialogTrigger } from '../slots/dialog-trigger';
import { DialogOverlay } from '../slots/dialog-overlay';
import { DialogContent } from '../slots/dialog-content';
import { DialogTitle } from '../slots/dialog-title';
import { DialogDescription } from '../slots/dialog-description';
import { DialogClose } from '../slots/dialog-close';
import type { DialogRootProps } from '../interfaces/DialogProps';

function DialogRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onClose,
  children,
}: DialogRootProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: (next) => {
      onOpenChange?.(next);
      if (!next) onClose?.();
    },
  });

  const titleId = useLayoutId('dialog-title');
  const descriptionId = useLayoutId('dialog-desc');

  const handleSetOpen = useCallback((next: boolean) => setOpen(next), [setOpen]);

  const value = useMemo<DialogContextValue>(
    () => ({ open, setOpen: handleSetOpen, titleId, descriptionId }),
    [open, handleSetOpen, titleId, descriptionId],
  );

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

/**
 * @platform shared
 *
 * Compound de diálogo modal (RFC-0014). `Dialog.Root` mantém `open`/`setOpen`
 * controlado ou uncontrolled e gera IDs (`titleId`/`descriptionId`) que
 * `Dialog.Content` usa para `aria-labelledby`/`aria-describedby`. `Trigger`
 * é o controle que abre o diálogo; `Overlay` é o backdrop dismissable;
 * `Content` é o painel modal montado em `Portal`; `Close` fecha
 * programaticamente. Usa nomenclatura canônica `open` (não `isOpen`) — ver
 * RFC-0014.
 *
 * @example
 * <Dialog>
 *   <Dialog.Trigger>Abrir</Dialog.Trigger>
 *   <Dialog.Overlay />
 *   <Dialog.Content>
 *     <Dialog.Title>Confirmar exclusão</Dialog.Title>
 *     <Dialog.Description>Esta ação é irreversível.</Dialog.Description>
 *     <Dialog.Close>Cancelar</Dialog.Close>
 *   </Dialog.Content>
 * </Dialog>
 *
 * @see {@link DialogRootProps}
 */
export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
});
