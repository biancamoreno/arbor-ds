import React from 'react';
import { Box } from '../../core';
import { transition } from '../../../ecosystem/utils/functions';
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

  const placementStyle = getPlacementStyle(placement);
  const scaleTransform = isOpen ? 'scale(1)' : 'scale(0.95)';

  return (
    <Box
      as="span"
      id={tooltipId}
      role="tooltip"
      aria-hidden={!isOpen || undefined}
      position="absolute"
      zIndex="tooltip"
      borderRadius="small"
      backgroundColor="text.primary"
      color="text.inverse"
      fontSize="xsmall"
      pointerEvents="none"
      opacity={isOpen ? 1 : 0}
      boxShadow="xl"
      style={{
        maxWidth,
        padding: '8px 12px',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        transformOrigin: 'center',
        transition: transition(['opacity', 'transform'], 'fast', 'decelerate'),
        transitionDelay: isOpen ? '300ms' : '0ms',
        ...placementStyle,
        transform: placementStyle.transform
          ? `${placementStyle.transform} ${scaleTransform}`
          : scaleTransform,
      }}
    >
      {children}
    </Box>
  );
}
