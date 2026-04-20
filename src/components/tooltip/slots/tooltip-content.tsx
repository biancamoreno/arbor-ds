import React from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useTooltipContext } from '../context/tooltip-context';
import type { TooltipPlacement } from '../context/tooltip-context';

type TooltipContentProps = {
  children: React.ReactNode;
  placement?: TooltipPlacement;
  maxWidth?: string | number;
};

function getPlacementStyle(placement: TooltipPlacement): React.CSSProperties {
  switch (placement) {
    case 'right':
      return { top: '50%', left: 'calc(100% + 8px)', transform: 'translateY(-50%)' };
    case 'bottom':
      return { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' };
    case 'left':
      return { top: '50%', right: 'calc(100% + 8px)', transform: 'translateY(-50%)' };
    case 'top':
    default:
      return { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' };
  }
}

export function TooltipContent({ children, placement = 'top', maxWidth = 240 }: TooltipContentProps) {
  const { isOpen, tooltipId } = useTooltipContext();
  const theme = useTheme();

  if (!isOpen) return null;

  return (
    <span
      id={tooltipId}
      role="tooltip"
      style={{
        position: 'absolute',
        zIndex: theme.zIndices.tooltip,
        maxWidth,
        padding: '8px 12px',
        borderRadius: theme.radii.small,
        backgroundColor: theme.colors.text.primary,
        color: theme.colors.text.inverse,
        fontSize: theme.fontSizes.xsmall,
        lineHeight: 1.4,
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.14)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        ...getPlacementStyle(placement),
      }}
    >
      {children}
    </span>
  );
}
