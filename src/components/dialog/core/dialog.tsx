import { useCallback } from 'react';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { DialogContext } from '../context/dialog-context';
import { DialogTrigger } from '../slots/dialog-trigger';
import { DialogOverlay } from '../slots/dialog-overlay';
import { DialogContent } from '../slots/dialog-content';
import { DialogTitle } from '../slots/dialog-title';
import { DialogDescription } from '../slots/dialog-description';
import { DialogClose } from '../slots/dialog-close';
import type { DialogRootProps } from '../interfaces/DialogProps';

function DialogRoot({ isOpen: isOpenProp, defaultOpen = false, onClose, children }: DialogRootProps) {
  const [isOpen, setIsOpen] = useControllableState({
    value: isOpenProp,
    defaultValue: defaultOpen,
    onChange: (v) => {
      if (!v) onClose?.();
    },
  });

  const titleId = useLayoutId('dialog-title');
  const descriptionId = useLayoutId('dialog-desc');

  const open = useCallback(() => setIsOpen(true), [setIsOpen]);
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <DialogContext.Provider value={{ isOpen, open, close, titleId, descriptionId }}>
      {children}
    </DialogContext.Provider>
  );
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
