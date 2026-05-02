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

/**
 * @platform shared
 *
 * Compound de drawer (painel lateral). `Drawer.Root` controla a abertura via
 * `isOpen`/`onClose` e o lado pelo `placement` (`'left'`/`'right'`/`'top'`/
 * `'bottom'`, default `'right'`). `Trigger` abre, `Overlay` é o backdrop,
 * `Content` é o painel montado em `Portal`, `Close` fecha programaticamente.
 *
 * @example
 * <Drawer placement="right">
 *   <Drawer.Trigger>Filtros</Drawer.Trigger>
 *   <Drawer.Overlay />
 *   <Drawer.Content>
 *     <Drawer.Title>Filtros</Drawer.Title>
 *     ...
 *     <Drawer.Close>Fechar</Drawer.Close>
 *   </Drawer.Content>
 * </Drawer>
 *
 * @see {@link DrawerRootProps}
 */
export const Drawer = Object.assign(DrawerRoot, {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Title: DrawerTitle,
  Close: DrawerClose,
});
