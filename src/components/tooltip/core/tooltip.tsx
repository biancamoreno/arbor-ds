import { useCallback } from 'react';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
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
  const open = useCallback(() => { if (!disabled) setIsOpen(true); }, [disabled, setIsOpen]);
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <TooltipContext.Provider value={{ isOpen: !disabled && isOpen, open, close, tooltipId }}>
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        {children}
      </span>
    </TooltipContext.Provider>
  );
}

export const Tooltip = Object.assign(TooltipRoot, {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});
