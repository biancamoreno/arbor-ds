import { useCallback, useMemo, useRef } from 'react';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { PopoverContext, type PopoverContextValue } from '../context/popover-context';
import { PopoverTrigger } from '../slots/popover-trigger';
import { PopoverContent } from '../slots/popover-content';
import { PopoverClose } from '../slots/popover-close';
import type { PopoverRootProps } from '../interfaces/PopoverProps';

function PopoverRoot({ open: openProp, defaultOpen = false, onOpenChange, children }: PopoverRootProps) {
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const titleId = useLayoutId('popover');
  const triggerRef = useRef<HTMLElement | null>(null);
  const setOpen = useCallback((next: boolean) => setOpenState(next), [setOpenState]);

  const value = useMemo<PopoverContextValue>(
    () => ({ open, setOpen, titleId, triggerRef }),
    [open, setOpen, titleId],
  );

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
}

/**
 * @platform shared
 *
 * Compound de popover — painel não-modal ancorado ao trigger. Diferente de
 * `Dialog`, não bloqueia interação com a UI subjacente: clicar fora apenas
 * fecha (via `DismissableLayer`). `Popover.Root` mantém `open`/`onOpenChange`
 * controlado ou uncontrolled. `Trigger` ancora o conteúdo; `Content` é o
 * painel posicionado próximo ao trigger e montado em `Portal`; `Close` fecha
 * programaticamente. Usa nomenclatura canônica `open` (RFC-0013/RFC-0030).
 *
 * @example
 * <Popover>
 *   <Popover.Trigger>Detalhes</Popover.Trigger>
 *   <Popover.Content>
 *     ...
 *     <Popover.Close>Fechar</Popover.Close>
 *   </Popover.Content>
 * </Popover>
 *
 * @see {@link PopoverRootProps}
 */
export const Popover = Object.assign(PopoverRoot, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
});
