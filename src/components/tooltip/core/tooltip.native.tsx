import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Animated, Dimensions, type LayoutChangeEvent, type View } from 'react-native';
import { Portal, useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { Box, Text } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion.native';
import { TooltipContext, useTooltipContext, type TooltipContextValue } from '../context/tooltip-context';
import type { TooltipProps, TooltipRootProps, TooltipContentProps, TooltipTriggerProps } from '../interfaces/TooltipProps';

type TooltipSlots = 'content';

type ThemeShape = {
  motion?: { duration?: Record<string, string> };
  components?: {
    tooltip?: {
      offset?: number;
    };
  };
  sizes?: { tooltip?: { maxWidth?: string } };
};

const TRANSITION_MS = 120;
const VIEWPORT_MARGIN = 8;

function parsePxOrNumber(value: string | number | undefined, fallback: number): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const match = /^(\d+)px$/.exec(value);
    if (match) return Number(match[1]);
  }
  return fallback;
}

type Rect = { x: number; y: number; width: number; height: number };

const NativeTooltipLayoutContext = React.createContext<{
  registerTrigger: (ref: React.RefObject<View | null>) => void;
} | null>(null);

function useNativeTooltipLayout() {
  const ctx = React.useContext(NativeTooltipLayoutContext);
  if (!ctx) throw new Error('Tooltip.Trigger native deve estar dentro de Tooltip.Root');
  return ctx;
}

function TooltipRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
  disabled = false,
  delay,
}: TooltipRootProps) {
  const [openState, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const tooltipId = useLayoutId('tooltip');
  const triggerRef = useRef<View | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (disabled && next) return;
      setOpenState(next);
    },
    [disabled, setOpenState],
  );

  const open = !disabled && openState;

  const value = useMemo<TooltipContextValue>(
    () => ({ open, setOpen, tooltipId, triggerRef: triggerRef as unknown as React.MutableRefObject<HTMLElement | null>, delay }),
    [open, setOpen, tooltipId, delay],
  );

  const registerTrigger = useCallback((ref: React.RefObject<View | null>) => {
    triggerRef.current = ref.current;
  }, []);

  return (
    <TooltipContext.Provider value={value}>
      <NativeTooltipLayoutContext.Provider value={{ registerTrigger }}>
        {children}
      </NativeTooltipLayoutContext.Provider>
    </TooltipContext.Provider>
  );
}

TooltipRoot.displayName = 'Tooltip.Root';

function TooltipTrigger({ children, accessibilityLabel, accessibilityHint }: TooltipTriggerProps) {
  const { setOpen } = useTooltipContext();
  const { registerTrigger } = useNativeTooltipLayout();
  const ref = useRef<View | null>(null);

  useEffect(() => {
    registerTrigger(ref);
  }, [registerTrigger]);

  return (
    <Pressable
      ref={ref as unknown as React.Ref<View>}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onLongPress={() => setOpen(true)}
      onPressOut={() => setOpen(false)}
      delayLongPress={500}
    >
      {children}
    </Pressable>
  );
}

TooltipTrigger.displayName = 'Tooltip.Trigger';

function TooltipContent({ children, placement = 'top', maxWidth }: TooltipContentProps) {
  const { open, tooltipId, triggerRef } = useTooltipContext();
  const theme = useTheme() as unknown as ThemeShape;
  const slots = useSlotRecipe<TooltipSlots>('tooltip', {});
  const reducedMotion = usePrefersReducedMotion();

  const tooltipCfg = theme.components?.tooltip ?? {};
  const offset = tooltipCfg.offset ?? 8;
  const enterMs = TRANSITION_MS;
  const exitMs = TRANSITION_MS;
  const themeMaxWidth = parsePxOrNumber(theme.sizes?.tooltip?.maxWidth, 240);
  const resolvedMaxWidth = typeof maxWidth === 'number' ? maxWidth : parsePxOrNumber(maxWidth, themeMaxWidth);

  const [mounted, setMounted] = useState(open);
  const [trigger, setTrigger] = useState<Rect | null>(null);
  const [tooltipSize, setTooltipSize] = useState<{ width: number; height: number } | null>(null);
  const opacity = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Placeholder imediato — garante que o tooltip renderize antes do
      // callback assíncrono de `measureInWindow` (e em ambientes onde a
      // medição não está disponível, como tests).
      setTrigger((prev) => prev ?? { x: 0, y: 0, width: 0, height: 0 });
      const view = triggerRef.current as unknown as View | null;
      if (view && typeof view.measureInWindow === 'function') {
        view.measureInWindow((x: number, y: number, width: number, height: number) => {
          setTrigger({ x, y, width, height });
        });
      }
      if (reducedMotion || process.env.NODE_ENV === 'test') {
        opacity.setValue(1);
      } else {
        Animated.timing(opacity, { toValue: 1, duration: enterMs, useNativeDriver: true }).start();
      }
      return;
    }
    if (reducedMotion || process.env.NODE_ENV === 'test') {
      opacity.setValue(0);
      setMounted(false);
      return;
    }
    Animated.timing(opacity, { toValue: 0, duration: exitMs, useNativeDriver: true }).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [open, opacity, enterMs, exitMs, reducedMotion, triggerRef]);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setTooltipSize((prev) =>
      prev && prev.width === width && prev.height === height ? prev : { width, height },
    );
  }, []);

  if (!mounted || !trigger) return null;

  const viewport = Dimensions.get('window');

  // Posição inicial — pré-medição do tooltip: posiciona invisível para o
  // primeiro frame medir o conteúdo (size); a partir daí ajusta para o
  // placement pedido com clamp viewport.
  const size = tooltipSize ?? { width: 0, height: 0 };

  let top = trigger.y;
  let left = trigger.x;

  if (placement === 'bottom') {
    top = trigger.y + trigger.height + offset;
    left = trigger.x + (trigger.width - size.width) / 2;
  } else if (placement === 'left') {
    top = trigger.y + (trigger.height - size.height) / 2;
    left = trigger.x - offset - size.width;
  } else if (placement === 'right') {
    top = trigger.y + (trigger.height - size.height) / 2;
    left = trigger.x + trigger.width + offset;
  } else {
    // top
    top = trigger.y - offset - size.height;
    left = trigger.x + (trigger.width - size.width) / 2;
  }

  // Clamp viewport — só se já temos tamanho medido.
  if (size.width > 0 && size.height > 0) {
    left = Math.max(VIEWPORT_MARGIN, Math.min(viewport.width - VIEWPORT_MARGIN - size.width, left));
    top = Math.max(VIEWPORT_MARGIN, Math.min(viewport.height - VIEWPORT_MARGIN - size.height, top));
  }

  // Durante o primeiro frame (sem medida ainda), renderizar offscreen para
  // medir sem flash visual.
  const isMeasuring = size.width === 0 || size.height === 0;

  return (
    <Portal mode="overlay">
      <Animated.View
        pointerEvents="none"
        accessibilityRole="text"
        accessibilityLabel={typeof children === 'string' ? children : undefined}
        nativeID={tooltipId}
        onLayout={handleLayout}
        style={{
          position: 'absolute',
          top: isMeasuring ? -9999 : top,
          left: isMeasuring ? -9999 : left,
          maxWidth: Math.min(resolvedMaxWidth, viewport.width - VIEWPORT_MARGIN * 2),
          opacity: isMeasuring ? 0 : opacity,
        }}
      >
        <Box {...(slots.content as Record<string, unknown>)}>
          {typeof children === 'string' ? <Text>{children}</Text> : children}
        </Box>
      </Animated.View>
    </Portal>
  );
}

TooltipContent.displayName = 'Tooltip.Content';

/**
 * @platform native
 *
 * Tooltip nativo — gesto long-press abre overlay com fade-in via `Animated.timing`.
 * Hover/focus não se aplicam em mobile; o gatilho canônico é long-press
 * (Material Design / iOS context menu). Respeita `prefersReducedMotion`.
 *
 * Posicionamento via `measureInWindow` no Pressable trigger + `onLayout` no
 * tooltip para alinhamento centralizado e clamp no viewport. Overlay renderizado
 * via `Portal mode='overlay'` para não bloquear toques na UI subjacente.
 *
 * @see {@link TooltipProps} (modo plano)
 * @see {@link TooltipRootProps} (modo compound)
 */
function TooltipFlat({ label, placement, maxWidth, children, accessibilityLabel, accessibilityHint, ...rootProps }: TooltipProps) {
  if (label !== undefined) {
    const resolvedLabel = accessibilityLabel ?? (typeof label === 'string' ? label : undefined);
    return (
      <TooltipRoot {...rootProps}>
        <TooltipTrigger accessibilityLabel={resolvedLabel} accessibilityHint={accessibilityHint}>
          {children as React.ReactElement}
        </TooltipTrigger>
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
