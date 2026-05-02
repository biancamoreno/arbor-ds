import { useCallback, useRef } from 'react';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { Box } from '../../core';
import { TooltipContext } from '../context/tooltip-context';
import { TooltipTrigger } from '../slots/tooltip-trigger';
import { TooltipContent } from '../slots/tooltip-content';
import type { TooltipRootProps } from '../interfaces/TooltipProps';

function TooltipRoot({
  isOpen: isOpenProp,
  defaultOpen = false,
  onOpenChange,
  children,
  disabled = false,
}: TooltipRootProps) {
  const [isOpen, setIsOpen] = useControllableState({
    value: isOpenProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const tooltipId = useLayoutId('tooltip');
  const triggerRef = useRef<HTMLElement | null>(null);
  const open = useCallback(() => { if (!disabled) setIsOpen(true); }, [disabled, setIsOpen]);
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <TooltipContext.Provider value={{ isOpen: !disabled && isOpen, open, close, tooltipId, triggerRef }}>
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
 * `Tooltip.Root` controla a abertura via `isOpen`/`onOpenChange` e respeita
 * `disabled` (não abre quando true). `Trigger` envolve o controle alvo
 * (botão, input, ícone clicável); `Content` é o painel pequeno ancorado ao
 * trigger e montado em `Portal`. Para conteúdo rico ou interativo, prefira
 * `Popover`.
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
