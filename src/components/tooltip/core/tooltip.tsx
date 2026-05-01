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

export const Tooltip = Object.assign(TooltipRoot, {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});
