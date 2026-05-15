import React, { useCallback, useMemo, useRef } from 'react';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { Box } from '../../core';
import { TooltipContext, type TooltipContextValue } from '../context/tooltip-context';
import { TooltipTrigger } from '../slots/tooltip-trigger';
import { TooltipContent } from '../slots/tooltip-content';
import type { TooltipProps, TooltipRootProps } from '../interfaces/TooltipProps';

function TooltipRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
  disabled = false,
  delay,
  // a11y RN (accessibilityLabel/Hint) é responsabilidade do `.native.tsx`
  // No web, descrição do tooltip já chega ao leitor de tela via `aria-describedby`
  // injetado pelo `TooltipTrigger`.
  accessibilityLabel: _accessibilityLabel,
  accessibilityHint: _accessibilityHint,
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
    () => ({ open, setOpen, tooltipId, triggerRef, delay }),
    [open, setOpen, tooltipId, delay],
  );

  return (
    <TooltipContext.Provider value={value}>
      <Box as="span" display="inline-flex">
        {children}
      </Box>
    </TooltipContext.Provider>
  );
}

TooltipRoot.displayName = 'Tooltip.Root';

/**
 * @platform shared
 *
 * Tooltip — descrição curta exibida ao foco/hover. API plana (recomendada
 * para 95% dos casos) — children é o trigger, `label` é o conteúdo:
 *
 * @example
 * <Tooltip label="Excluir item">
 *   <IconButton accessibilityLabel="Excluir" icon="Trash" />
 * </Tooltip>
 *
 * Para placement custom ou content multi-linha rico, passe `placement` ou
 * use o compound:
 *
 * @example
 * <Tooltip.Root>
 *   <Tooltip.Trigger>
 *     <IconButton accessibilityLabel="Excluir" icon="Trash" />
 *   </Tooltip.Trigger>
 *   <Tooltip.Content placement="right">
 *     <Text variant="bodySmall" fontWeight="semibold">Excluir</Text> item permanentemente
 *   </Tooltip.Content>
 * </Tooltip.Root>
 *
 * Para conteúdo rico ou interativo, prefira `Popover`. Nomenclatura canônica
 * `open` (RFC-0013/RFC-0030).
 *
 * @see {@link TooltipProps} para API plana
 * @see {@link TooltipRootProps} para API compound
 */
function TooltipFlat({ label, placement, maxWidth, children, ...rootProps }: TooltipProps) {
  if (label !== undefined) {
    return (
      <TooltipRoot {...rootProps}>
        <TooltipTrigger>{children as React.ReactElement}</TooltipTrigger>
        <TooltipContent placement={placement} maxWidth={maxWidth}>{label}</TooltipContent>
      </TooltipRoot>
    );
  }
  return <TooltipRoot {...rootProps}>{children}</TooltipRoot>;
}

TooltipFlat.displayName = 'Tooltip';

export const Tooltip = Object.assign(TooltipFlat, {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});
