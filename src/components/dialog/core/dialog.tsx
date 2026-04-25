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

export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
});
