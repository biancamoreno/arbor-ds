import React from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { TooltipProps } from '../interfaces';

function getPlacementStyle(placement: NonNullable<TooltipProps['placement']>) {
  switch (placement) {
    case 'right':
      return {
        top: '50%',
        left: 'calc(100% + 8px)',
        transform: 'translateY(-50%)',
      };
    case 'bottom':
      return {
        top: 'calc(100% + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
      };
    case 'left':
      return {
        top: '50%',
        right: 'calc(100% + 8px)',
        transform: 'translateY(-50%)',
      };
    case 'top':
    default:
      return {
        bottom: 'calc(100% + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
      };
  }
}

export function Tooltip({
  children,
  content,
  placement = 'top',
  trigger = 'hover',
  open,
  defaultOpen = false,
  disabled = false,
  maxWidth = 240,
}: TooltipProps) {
  const theme = useTheme();
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = !disabled && (open ?? internalOpen);

  const show = () => {
    if (open === undefined) {
      setInternalOpen(true);
    }
  };

  const hide = () => {
    if (open === undefined) {
      setInternalOpen(false);
    }
  };

  const toggle = () => {
    if (open === undefined) {
      setInternalOpen((value) => !value);
    }
  };

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={trigger === 'hover' ? show : undefined}
      onMouseLeave={trigger === 'hover' ? hide : undefined}
      onClick={trigger === 'click' ? toggle : undefined}
    >
      {children}
      {isOpen && (
        <span
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
            ...getPlacementStyle(placement),
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
}

export default Tooltip;
