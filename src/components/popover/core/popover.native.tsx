import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  Animated,
  Dimensions,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { Box, Clickable, Icon } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion.native';
import { PopoverContext, usePopoverContext, type PopoverContextValue } from '../context/popover-context';
import type {
  PopoverRootProps,
  PopoverTriggerProps,
  PopoverContentProps,
  PopoverCloseProps,
} from '../interfaces/PopoverProps';

type PopoverSlots = 'content' | 'close';

type ThemeShape = {
  components?: { popover?: { offset?: number; maxWidth?: string } };
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

const NativePopoverLayoutContext = React.createContext<{
  registerTrigger: (ref: React.RefObject<View | null>) => void;
} | null>(null);

function useNativePopoverLayout() {
  const ctx = React.useContext(NativePopoverLayoutContext);
  if (!ctx) throw new Error('Popover.Trigger native deve estar dentro de Popover.Root');
  return ctx;
}

function PopoverRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom',
  offset,
  accessibilityLabel,
  accessibilityHint: _accessibilityHint,
  children,
}: PopoverRootProps) {
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const contentId = useLayoutId('popover');
  const triggerRef = useRef<View | null>(null);
  const setOpen = useCallback((next: boolean) => setOpenState(next), [setOpenState]);

  const registerTrigger = useCallback((ref: React.RefObject<View | null>) => {
    triggerRef.current = ref.current;
  }, []);

  const value = useMemo<PopoverContextValue>(
    () => ({
      open,
      setOpen,
      contentId,
      triggerRef: triggerRef as unknown as React.MutableRefObject<HTMLElement | null>,
      placement,
      offset,
      accessibilityLabel,
    }),
    [open, setOpen, contentId, placement, offset, accessibilityLabel],
  );

  return (
    <PopoverContext.Provider value={value}>
      <NativePopoverLayoutContext.Provider value={{ registerTrigger }}>
        {children}
      </NativePopoverLayoutContext.Provider>
    </PopoverContext.Provider>
  );
}

PopoverRoot.displayName = 'Popover.Root';

function PopoverTrigger({ children }: PopoverTriggerProps) {
  const { open, setOpen } = usePopoverContext();
  const { registerTrigger } = useNativePopoverLayout();
  const ref = useRef<View | null>(null);

  useEffect(() => {
    registerTrigger(ref);
  }, [registerTrigger]);

  return (
    <Pressable
      ref={ref as unknown as React.Ref<View>}
      onPress={() => setOpen(!open)}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
    >
      {children}
    </Pressable>
  );
}

PopoverTrigger.displayName = 'Popover.Trigger';

function PopoverContent({ children }: PopoverContentProps) {
  const { open, setOpen, contentId, triggerRef, placement, offset: offsetOverride, accessibilityLabel } = usePopoverContext();
  const theme = useTheme() as unknown as ThemeShape;
  const slots = useSlotRecipe<PopoverSlots>('popover', {});
  const reducedMotion = usePrefersReducedMotion();

  const popoverCfg = theme.components?.popover ?? {};
  const offset = offsetOverride ?? popoverCfg.offset ?? 8;
  const themeMaxWidth = parsePxOrNumber(popoverCfg.maxWidth, 360);

  const [mounted, setMounted] = useState(open);
  const [trigger, setTrigger] = useState<Rect | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const opacity = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;

  useEffect(() => {
    if (open) {
      setMounted(true);
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
        Animated.timing(opacity, { toValue: 1, duration: TRANSITION_MS, useNativeDriver: true }).start();
      }
      return;
    }
    if (reducedMotion || process.env.NODE_ENV === 'test') {
      opacity.setValue(0);
      setMounted(false);
      return;
    }
    Animated.timing(opacity, { toValue: 0, duration: TRANSITION_MS, useNativeDriver: true }).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [open, opacity, reducedMotion, triggerRef]);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) =>
      prev && prev.width === width && prev.height === height ? prev : { width, height },
    );
  }, []);

  if (!mounted || !trigger) return null;

  const viewport = Dimensions.get('window');
  const popoverSize = size ?? { width: 0, height: 0 };

  let top = trigger.y;
  let left = trigger.x;

  if (placement === 'bottom') {
    top = trigger.y + trigger.height + offset;
    left = trigger.x + (trigger.width - popoverSize.width) / 2;
  } else if (placement === 'top') {
    top = trigger.y - offset - popoverSize.height;
    left = trigger.x + (trigger.width - popoverSize.width) / 2;
  } else if (placement === 'left') {
    top = trigger.y + (trigger.height - popoverSize.height) / 2;
    left = trigger.x - offset - popoverSize.width;
  } else {
    top = trigger.y + (trigger.height - popoverSize.height) / 2;
    left = trigger.x + trigger.width + offset;
  }

  // Flip se não couber no eixo escolhido.
  if (popoverSize.height > 0) {
    if (placement === 'bottom' && top + popoverSize.height > viewport.height - VIEWPORT_MARGIN) {
      top = trigger.y - offset - popoverSize.height;
    } else if (placement === 'top' && top < VIEWPORT_MARGIN) {
      top = trigger.y + trigger.height + offset;
    }
  }
  if (popoverSize.width > 0) {
    if (placement === 'right' && left + popoverSize.width > viewport.width - VIEWPORT_MARGIN) {
      left = trigger.x - offset - popoverSize.width;
    } else if (placement === 'left' && left < VIEWPORT_MARGIN) {
      left = trigger.x + trigger.width + offset;
    }
  }

  // Clamp viewport.
  if (popoverSize.width > 0 && popoverSize.height > 0) {
    left = Math.max(VIEWPORT_MARGIN, Math.min(viewport.width - VIEWPORT_MARGIN - popoverSize.width, left));
    top = Math.max(VIEWPORT_MARGIN, Math.min(viewport.height - VIEWPORT_MARGIN - popoverSize.height, top));
  }

  const isMeasuring = popoverSize.width === 0 || popoverSize.height === 0;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => setOpen(false)}
    >
      <Pressable
        onPress={() => setOpen(false)}
        accessibilityLabel="close"
        style={{ flex: 1 }}
      >
        <Animated.View
          accessibilityRole="none"
          accessibilityLabel={accessibilityLabel}
          nativeID={contentId}
          onLayout={handleLayout}
          style={{
            position: 'absolute',
            top: isMeasuring ? -9999 : top,
            left: isMeasuring ? -9999 : left,
            maxWidth: Math.min(themeMaxWidth, viewport.width - VIEWPORT_MARGIN * 2),
            opacity: isMeasuring ? 0 : opacity,
          }}
        >
          {/* Pressable interno absorve toque para não fechar quando o usuário interage com o conteúdo. */}
          <Pressable onPress={() => {}}>
            <Box {...(slots.content as Record<string, unknown>)}>
              {children}
            </Box>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

PopoverContent.displayName = 'Popover.Content';

function PopoverClose({ children, accessibilityLabel = 'Fechar' }: PopoverCloseProps) {
  const { setOpen } = usePopoverContext();
  const slots = useSlotRecipe<PopoverSlots>('popover', {});
  const handleClose = () => setOpen(false);

  if (children) {
    return React.cloneElement(children as React.ReactElement<{ onPress?: () => void }>, {
      onPress: handleClose,
    });
  }

  return (
    <Clickable
      onClick={handleClose}
      accessibilityLabel={accessibilityLabel}
      {...(slots.close as Record<string, unknown>)}
    >
      <Icon name="X" size="small" decorative />
    </Clickable>
  );
}

PopoverClose.displayName = 'Popover.Close';

/**
 * @platform native
 *
 * Popover nativo — `Pressable` trigger + `Modal transparent` para o conteúdo,
 * posicionado relativo ao trigger via `measureInWindow` + `onLayout` para
 * medição em 2 passos (render offscreen → reposiciona). Flipa para o eixo
 * oposto se o `placement` pedido não couber e clampa dentro do viewport.
 *
 * Em RN, `Modal` é o único caminho confiável para sobrepor a tela; isso faz
 * com que toques na UI subjacente fiquem bloqueados enquanto o popover está
 * aberto (diferente do web, onde clique fora apenas fecha e não bloqueia).
 * Limitação prática da plataforma. Toque no scrim fecha o popover; toque no
 * conteúdo é absorvido.
 *
 * @see {@link PopoverRootProps}
 */
export const Popover = Object.assign(PopoverRoot, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
});
