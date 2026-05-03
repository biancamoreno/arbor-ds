import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Portal } from '../../../ecosystem/primitives';
import { Box } from '../../core';
import { transition } from '../../../ecosystem/utils/functions';
import { useTooltipContext } from '../context/tooltip-context';
import type { TooltipPlacement } from '../context/tooltip-context';

type TooltipContentProps = {
  children: React.ReactNode;
  placement?: TooltipPlacement;
  maxWidth?: string | number;
};

type Position = { top: number; left: number };

const OFFSET = 8;
const EXIT_MS = 150;

function computePosition(rect: DOMRect, placement: TooltipPlacement): Position {
  switch (placement) {
    case 'right':
      return { top: rect.top + rect.height / 2, left: rect.right + OFFSET };
    case 'bottom':
      return { top: rect.bottom + OFFSET, left: rect.left + rect.width / 2 };
    case 'left':
      return { top: rect.top + rect.height / 2, left: rect.left - OFFSET };
    case 'top':
    default:
      return { top: rect.top - OFFSET, left: rect.left + rect.width / 2 };
  }
}

function getBaseTransform(placement: TooltipPlacement): string {
  switch (placement) {
    case 'right': return 'translate(0, -50%)';
    case 'bottom': return 'translate(-50%, 0)';
    case 'left': return 'translate(-100%, -50%)';
    case 'top':
    default: return 'translate(-50%, -100%)';
  }
}

function getTransformOrigin(placement: TooltipPlacement): string {
  switch (placement) {
    case 'right': return 'left center';
    case 'bottom': return 'top center';
    case 'left': return 'right center';
    case 'top':
    default: return 'bottom center';
  }
}

export function TooltipContent({ children, placement = 'top', maxWidth = 240 }: TooltipContentProps) {
  const { open, tooltipId, triggerRef } = useTooltipContext();
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (open) {
      setMounted(true);
      frameRef.current = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frameRef.current);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(t);
  }, [open]);

  useLayoutEffect(() => {
    if (!mounted) {
      setPosition(null);
      return;
    }
    const update = () => {
      const trigger = triggerRef.current;
      if (!trigger || typeof trigger.getBoundingClientRect !== 'function') return;
      setPosition(computePosition(trigger.getBoundingClientRect(), placement));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [mounted, placement, triggerRef]);

  if (!mounted || !position) return null;

  const baseTransform = getBaseTransform(placement);
  const scaleTransform = visible ? 'scale(1)' : 'scale(0.95)';

  return (
    <Portal>
      <Box
        as="span"
        id={tooltipId}
        role="tooltip"
        aria-hidden={!open || undefined}
        position="fixed"
        zIndex="tooltip"
        borderRadius="small"
        backgroundColor="text.primary"
        color="text.inverse"
        fontSize="xsmall"
        pointerEvents="none"
        opacity={visible ? 1 : 0}
        boxShadow="xl"
        style={{
          top: position.top,
          left: position.left,
          maxWidth,
          padding: '8px 12px',
          lineHeight: 1.4,
          whiteSpace: 'nowrap',
          transformOrigin: getTransformOrigin(placement),
          transition: transition(['opacity', 'transform'], 'fast', 'decelerate'),
          transitionDelay: visible ? '300ms' : '0ms',
          transform: `${baseTransform} ${scaleTransform}`,
        }}
      >
        {children}
      </Box>
    </Portal>
  );
}
