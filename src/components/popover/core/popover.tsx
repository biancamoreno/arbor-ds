import { useCallback, useMemo, useRef } from 'react';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { PopoverContext, type PopoverContextValue } from '../context/popover-context';
import { PopoverTrigger } from '../slots/popover-trigger';
import { PopoverContent } from '../slots/popover-content';
import { PopoverClose } from '../slots/popover-close';
import type { PopoverRootProps } from '../interfaces/PopoverProps';

function PopoverRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom',
  offset,
  accessibilityLabel,
  // `accessibilityHint` é exposta no contrato cross-platform; no web a
  // descrição rica fica no próprio conteúdo, então a prop não é usada aqui
  // (consumo em `popover.native.tsx`).
  accessibilityHint: _accessibilityHint,
  children,
}: PopoverRootProps) {
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const contentId = useLayoutId('popover');
  const triggerRef = useRef<HTMLElement | null>(null);
  const setOpen = useCallback((next: boolean) => setOpenState(next), [setOpenState]);

  const value = useMemo<PopoverContextValue>(
    () => ({ open, setOpen, contentId, triggerRef, placement, offset, accessibilityLabel }),
    [open, setOpen, contentId, placement, offset, accessibilityLabel],
  );

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
}

/**
 * @platform shared
 *
 * Popover — painel não-modal ancorado ao trigger. Diferente de `Dialog`, não
 * bloqueia interação com a UI subjacente: clicar fora apenas fecha (via
 * `DismissableLayer`). Usa `open`/`onOpenChange` (RFC-0013/RFC-0030).
 *
 * Posiciona-se relativo ao trigger via `placement` (`top`/`bottom`/`left`/
 * `right`, default `bottom`) com flip automático quando não cabe no viewport
 * e clamp para manter o painel dentro da tela. O foco permanece no trigger
 * ao abrir (sem auto-focus dentro do popover — comportamento sutil para
 * popovers informativos); ao fechar, o foco retorna ao trigger via
 * `FocusScope restoreFocus`. Para popovers com formulário, o consumidor
 * pode setar `autoFocus` no primeiro input.
 *
 * @example
 * <Popover>
 *   <Popover.Trigger asChild>
 *     <Button variant="ghost">Detalhes</Button>
 *   </Popover.Trigger>
 *   <Popover.Content>
 *     <Text variant="bodyMedium">Conteúdo do popover</Text>
 *     <Popover.Close />
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
