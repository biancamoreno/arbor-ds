import { useCallback, useMemo, useRef } from 'react';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { Box } from '../../core';
import { TooltipContext, type TooltipContextValue } from '../context/tooltip-context';
import { TooltipTrigger } from '../slots/tooltip-trigger';
import { TooltipContent } from '../slots/tooltip-content';
import type { TooltipRootProps } from '../interfaces/TooltipProps';

function TooltipRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
  disabled = false,
}: TooltipRootProps) {
  const [openState, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const tooltipId = useLayoutId('tooltip');
  const triggerRef = useRef<HTMLElement | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (disabled && next) return;
      setOpenState(next);
    },
    [disabled, setOpenState],
  );

  const open = !disabled && openState;

  const value = useMemo<TooltipContextValue>(
    () => ({ open, setOpen, tooltipId, triggerRef }),
    [open, setOpen, tooltipId],
  );

  return (
    <TooltipContext.Provider value={value}>
      <Box as="span" display="inline-flex">
        {children}
      </Box>
    </TooltipContext.Provider>
  );
}

/**
 * @platform shared
 *
 * Compound de tooltip — descrição curta exibida ao foco/hover do trigger.
 * `Tooltip.Root` controla a abertura via `open`/`onOpenChange` e respeita
 * `disabled` (não abre quando true). `Trigger` envolve o controle alvo
 * (botão, input, ícone clicável); `Content` é o painel pequeno ancorado ao
 * trigger e montado em `Portal`. Para conteúdo rico ou interativo, prefira
 * `Popover`. Usa nomenclatura canônica `open` (RFC-0013/RFC-0030).
 *
 * @example
 * <Tooltip>
 *   <Tooltip.Trigger><IconButton aria-label="Excluir"><Icon name="Trash" /></IconButton></Tooltip.Trigger>
 *   <Tooltip.Content>Excluir item permanentemente</Tooltip.Content>
 * </Tooltip>
 *
 * @see {@link TooltipRootProps}
 */
export const Tooltip = Object.assign(TooltipRoot, {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});
