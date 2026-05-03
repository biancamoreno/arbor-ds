import { useCallback, useMemo } from 'react';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { DrawerContext, type DrawerContextValue } from '../context/drawer-context';
import { DrawerTrigger } from '../slots/drawer-trigger';
import { DrawerOverlay } from '../slots/drawer-overlay';
import { DrawerContent } from '../slots/drawer-content';
import { DrawerTitle } from '../slots/drawer-title';
import { DrawerClose } from '../slots/drawer-close';
import type { DrawerRootProps } from '../interfaces/DrawerProps';

function DrawerRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = 'right',
  children,
}: DrawerRootProps) {
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const titleId = useLayoutId('drawer-title');
  const setOpen = useCallback((next: boolean) => setOpenState(next), [setOpenState]);

  const value = useMemo<DrawerContextValue>(
    () => ({ open, setOpen, placement, titleId }),
    [open, setOpen, placement, titleId],
  );

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

/**
 * @platform shared
 *
 * Compound de drawer (painel lateral). `Drawer.Root` controla a abertura via
 * `open`/`onOpenChange` e o lado pelo `placement` (`'left'`/`'right'`/`'top'`/
 * `'bottom'`, default `'right'`). `Trigger` abre, `Overlay` é o backdrop,
 * `Content` é o painel montado em `Portal`, `Close` fecha programaticamente.
 * Usa nomenclatura canônica `open` (RFC-0013/RFC-0030).
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
