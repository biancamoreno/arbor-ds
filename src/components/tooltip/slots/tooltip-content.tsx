import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Portal } from '../../../ecosystem/primitives';
import { Box, Text } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion';
import { useTooltipContext } from '../context/tooltip-context';
import type { TooltipPlacement } from '../context/tooltip-context';
import {
  computePosition,
  resolvePlacement,
  clampPosition,
  getTransform,
  getTransformOrigin,
  type Position,
} from '../utils/position';

type TooltipContentProps = {
  children: React.ReactNode;
  placement?: TooltipPlacement;
  maxWidth?: string | number;
};

type TooltipSlots = 'content';

type ThemeWithTooltip = {
  motion?: { duration?: Record<string, string> };
  components?: {
    tooltip?: {
      offset?: number;
    };
  };
  sizes?: { tooltip?: { maxWidth?: string } };
};

const SCALE_FROM = 0.95;
const TRANSITION_MS = 120;

function resolveDuration(theme: ThemeWithTooltip, alias: string | undefined, fallbackMs: number): number {
  if (!alias) return fallbackMs;
  const value = theme.motion?.duration?.[alias];
  if (!value) return fallbackMs;
  const match = /^(\d+)ms$/.exec(value);
  return match ? Number(match[1]) : fallbackMs;
}

export function TooltipContent({ children, placement: requestedPlacement = 'top', maxWidth }: TooltipContentProps) {
  const { open, tooltipId, triggerRef, delay: delayOverride } = useTooltipContext();
  const theme = useTheme() as unknown as ThemeWithTooltip;
  const slots = useSlotRecipe<TooltipSlots>('tooltip', {});
  const reducedMotion = usePrefersReducedMotion();

  const tooltipCfg = theme.components?.tooltip ?? {};
  const offset = tooltipCfg.offset ?? 8;
  // Delays vêm do tema global de motion (`slow` p/ show, `instant` p/ hide).
  // Override pontual via prop `delay` (TooltipRootProps).
  const showDelay = delayOverride ?? resolveDuration(theme, 'slow', 240);
  const hideDelay = resolveDuration(theme, 'instant', 50);
  const exitMs = TRANSITION_MS;
  const enterMs = TRANSITION_MS;
  const scaleFrom = SCALE_FROM;
  const themeMaxWidth = theme.sizes?.tooltip?.maxWidth ?? '240px';

  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState<TooltipPlacement>(requestedPlacement);
  const [position, setPosition] = useState<Position | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (open) {
      setMounted(true);
      frameRef.current = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frameRef.current);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), exitMs);
    return () => clearTimeout(t);
  }, [open, exitMs]);

  useLayoutEffect(() => {
    if (!mounted) {
      setPosition(null);
      return;
    }
    let cancelled = false;
    let rafId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let observedNode: HTMLElement | null = null;

    const attachObserver = () => {
      if (resizeObserver || typeof ResizeObserver === 'undefined') return;
      const node = contentRef.current;
      if (!node || node === observedNode) return;
      resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(node);
      observedNode = node;
    };

    function update() {
      if (cancelled) return;
      const trigger = triggerRef.current;
      if (!trigger || typeof trigger.getBoundingClientRect !== 'function') return;
      const triggerRect = trigger.getBoundingClientRect();

      const content = contentRef.current;
      const contentSize = content
        ? { width: content.offsetWidth || content.getBoundingClientRect().width, height: content.offsetHeight || content.getBoundingClientRect().height }
        : { width: 0, height: 0 };

      const viewport = {
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
      };

      const hasSize = contentSize.width > 0 && contentSize.height > 0;
      const resolved = hasSize
        ? resolvePlacement(triggerRect, contentSize, requestedPlacement, offset, viewport)
        : requestedPlacement;
      setPlacement(resolved);

      const raw = computePosition(triggerRect, resolved, offset);
      const clamped = hasSize ? clampPosition(raw, resolved, contentSize, viewport) : raw;
      setPosition(clamped);

      // Anexa o ResizeObserver assim que `contentRef` materializa no DOM.
      attachObserver();

      // 1ª passada: contentRef ainda não montou → re-mede no próximo frame.
      if (!hasSize) {
        rafId = requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [mounted, requestedPlacement, offset, triggerRef]);

  if (!mounted || !position) return null;

  const transitionStr = reducedMotion
    ? 'none'
    : `opacity ${enterMs}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${enterMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;
  const transitionDelayMs = visible ? showDelay : hideDelay;
  const transform = getTransform(placement, reducedMotion ? 1 : (visible ? 1 : scaleFrom));

  return (
    <Portal>
      <Box
        as="div"
        id={tooltipId}
        role="tooltip"
        aria-hidden={!open || undefined}
        zIndex="tooltip"
        innerRef={contentRef as React.RefObject<HTMLDivElement>}
        {...(slots.content as Record<string, unknown>)}
        style={{
          top: position.top,
          left: position.left,
          maxWidth: maxWidth ?? themeMaxWidth,
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          opacity: visible ? 1 : 0,
          transformOrigin: getTransformOrigin(placement),
          transition: transitionStr,
          transitionDelay: `${transitionDelayMs}ms`,
          transform,
        }}
      >
        {typeof children === 'string' || typeof children === 'number'
          ? <Text as="span" variant="bodySmall">{children}</Text>
          : children}
      </Box>
    </Portal>
  );
}
