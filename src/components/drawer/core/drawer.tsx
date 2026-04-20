import { useCallback } from 'react';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { DrawerContext } from '../context/drawer-context';
import { DrawerTrigger } from '../slots/drawer-trigger';
import { DrawerOverlay } from '../slots/drawer-overlay';
import { DrawerContent } from '../slots/drawer-content';
import { DrawerTitle } from '../slots/drawer-title';
import { DrawerClose } from '../slots/drawer-close';
import type { DrawerRootProps } from '../interfaces/DrawerProps';

function DrawerRoot({
  isOpen: isOpenProp,
  defaultOpen = false,
  onClose,
  placement = 'right',
  children,
}: DrawerRootProps) {
  const [isOpen, setIsOpen] = useControllableState({
    value: isOpenProp,
    defaultValue: defaultOpen,
    onChange: (v) => {
      if (!v) onClose?.();
    },
  });

  const titleId = useLayoutId('drawer-title');
  const open = useCallback(() => setIsOpen(true), [setIsOpen]);
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <DrawerContext.Provider value={{ isOpen, open, close, placement, titleId }}>
      {children}
    </DrawerContext.Provider>
  );
}

export const Drawer = Object.assign(DrawerRoot, {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Title: DrawerTitle,
  Close: DrawerClose,
});
