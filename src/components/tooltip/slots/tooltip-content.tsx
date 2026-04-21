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

  const placementStyle = getPlacementStyle(placement);

  // Animação de scale relativa ao placement para não conflitar com translateX/Y do posicionamento
  const scaleTransform = isOpen ? 'scale(1)' : 'scale(0.95)';

  return (
    <span
      id={tooltipId}
      role="tooltip"
      aria-hidden={!isOpen || undefined}
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
        opacity: isOpen ? 1 : 0,
        transformOrigin: 'center',
        transition: 'opacity 0.1s ease, transform 0.1s cubic-bezier(0, 0, 0.2, 1)',
        transitionDelay: isOpen ? '300ms' : '0ms',
        ...placementStyle,
        // Combina transform de posicionamento com scale
        transform: placementStyle.transform
          ? `${placementStyle.transform} ${scaleTransform}`
          : scaleTransform,
      }}
    >
      {children}
    </span>
  );
}
