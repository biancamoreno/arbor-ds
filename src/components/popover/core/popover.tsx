import { useCallback, useRef } from 'react';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { PopoverContext } from '../context/popover-context';
import { PopoverTrigger } from '../slots/popover-trigger';
import { PopoverContent } from '../slots/popover-content';
import { PopoverClose } from '../slots/popover-close';
import type { PopoverRootProps } from '../interfaces/PopoverProps';

function PopoverRoot({ isOpen: isOpenProp, defaultOpen = false, onClose, children }: PopoverRootProps) {
  const [isOpen, setIsOpen] = useControllableState({
    value: isOpenProp,
    defaultValue: defaultOpen,
    onChange: (v) => {
      if (!v) onClose?.();
    },
  });

  const titleId = useLayoutId('popover');
  const triggerRef = useRef<HTMLElement | null>(null);
  const open = useCallback(() => setIsOpen(true), [setIsOpen]);
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <PopoverContext.Provider value={{ isOpen, open, close, titleId, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
}

/**
 * @platform shared
 *
 * Compound de popover — painel não-modal ancorado ao trigger. Diferente de
 * `Dialog`, não bloqueia interação com a UI subjacente: clicar fora apenas
 * fecha (via `DismissableLayer`). `Popover.Root` mantém `isOpen`/`onClose`
 * controlado ou uncontrolled. `Trigger` ancora o conteúdo; `Content` é o
 * painel posicionado próximo ao trigger e montado em `Portal`; `Close` fecha
 * programaticamente.
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
