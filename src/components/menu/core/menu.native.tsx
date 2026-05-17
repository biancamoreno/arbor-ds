import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  Animated,
  Dimensions,
  ScrollView,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { Box, Icon, Text } from '../../core';
import type { IconName } from '../../core/icon/interfaces/IconProps';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion.native';
import { MenuContext, useMenuContext, type MenuContextValue } from '../context/menu-context';
import type {
  MenuRootProps,
  MenuTriggerProps,
  MenuContentProps,
  MenuItemProps,
  MenuItemSelectEvent,
  MenuLabelProps,
} from '../interfaces/MenuProps';

type MenuSlots = 'content' | 'item' | 'label' | 'separator';

type ThemeShape = {
  components?: {
    menu?: {
      offset?: number;
      maxWidth?: string;
      item?: {
        iconSize?: string;
        colors?: {
          text?: string;
          textDisabled?: string;
          icon?: string;
          criticalText?: string;
          criticalIcon?: string;
        };
      };
    };
  };
};

function renderItemAdornment(
  icon: IconName | React.ReactElement | undefined,
  size: string,
  color: string | undefined,
): React.ReactNode {
  if (icon == null) return null;
  if (typeof icon === 'string') {
    return <Icon name={icon} size={size as never} {...(color ? { color } : {})} decorative />;
  }
  return icon;
}

const TRANSITION_MS = 160;
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

type NativeMenuLayout = {
  registerTrigger: (ref: React.RefObject<View | null>) => void;
  itemsRef: React.MutableRefObject<Array<View | null>>;
  registerItem: (view: View | null) => () => void;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  scrollViewRef: React.MutableRefObject<ScrollView | null>;
};

const NativeMenuLayoutContext = React.createContext<NativeMenuLayout | null>(null);

function useNativeMenuLayout(): NativeMenuLayout {
  const ctx = React.useContext(NativeMenuLayoutContext);
  if (!ctx) throw new Error('Menu compound (native) deve estar dentro de Menu.Root');
  return ctx;
}

function MenuRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom',
  offset,
  accessibilityLabel,
  accessibilityHint: _accessibilityHint,
  children,
}: MenuRootProps) {
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const [activeIndex, setActiveIndex] = useState(-1);
  const itemsRef = useRef<Array<View | null>>([]);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const contentId = useLayoutId('menu');
  const triggerRef = useRef<View | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      setOpenState(next);
      if (next) {
        setActiveIndex(0);
      } else {
        setActiveIndex(-1);
        itemsRef.current = [];
      }
    },
    [setOpenState],
  );

  const registerItem = useCallback((view: View | null): (() => void) => {
    itemsRef.current.push(view);
    const idx = itemsRef.current.length - 1;
    return () => {
      itemsRef.current[idx] = null;
    };
  }, []);

  const registerTrigger = useCallback((ref: React.RefObject<View | null>) => {
    triggerRef.current = ref.current;
  }, []);

  const value = useMemo<MenuContextValue>(
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

  const layoutValue = useMemo<NativeMenuLayout>(
    () => ({ registerTrigger, itemsRef, registerItem, activeIndex, setActiveIndex, scrollViewRef }),
    [registerTrigger, registerItem, activeIndex],
  );

  return (
    <MenuContext.Provider value={value}>
      <NativeMenuLayoutContext.Provider value={layoutValue}>
        {children}
      </NativeMenuLayoutContext.Provider>
    </MenuContext.Provider>
  );
}

MenuRoot.displayName = 'Menu.Root';

function MenuTrigger({ children }: MenuTriggerProps) {
  const { open, setOpen, contentId } = useMenuContext();
  const { registerTrigger } = useNativeMenuLayout();
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
      accessibilityLabelledBy={open ? contentId : undefined}
    >
      {children}
    </Pressable>
  );
}

MenuTrigger.displayName = 'Menu.Trigger';

function MenuContent({ children }: MenuContentProps) {
  const { open, setOpen, contentId, triggerRef, placement, offset: offsetOverride, accessibilityLabel } = useMenuContext();
  const { scrollViewRef } = useNativeMenuLayout();
  const theme = useTheme() as unknown as ThemeShape;
  const slots = useSlotRecipe<MenuSlots>('menu', {});
  const reducedMotion = usePrefersReducedMotion();

  const menuCfg = theme.components?.menu ?? {};
  const offset = offsetOverride ?? menuCfg.offset ?? 6;
  const themeMaxWidth = parsePxOrNumber(menuCfg.maxWidth, 320);

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
  const menuSize = size ?? { width: 0, height: 0 };

  let top = trigger.y;
  let left = trigger.x;

  if (placement === 'bottom') {
    top = trigger.y + trigger.height + offset;
    left = trigger.x;
  } else if (placement === 'top') {
    top = trigger.y - offset - menuSize.height;
    left = trigger.x;
  } else if (placement === 'left') {
    top = trigger.y;
    left = trigger.x - offset - menuSize.width;
  } else {
    top = trigger.y;
    left = trigger.x + trigger.width + offset;
  }

  if (menuSize.height > 0) {
    if (placement === 'bottom' && top + menuSize.height > viewport.height - VIEWPORT_MARGIN) {
      top = trigger.y - offset - menuSize.height;
    } else if (placement === 'top' && top < VIEWPORT_MARGIN) {
      top = trigger.y + trigger.height + offset;
    }
  }
  if (menuSize.width > 0) {
    if (placement === 'right' && left + menuSize.width > viewport.width - VIEWPORT_MARGIN) {
      left = trigger.x - offset - menuSize.width;
    } else if (placement === 'left' && left < VIEWPORT_MARGIN) {
      left = trigger.x + trigger.width + offset;
    }
  }

  if (menuSize.width > 0 && menuSize.height > 0) {
    left = Math.max(VIEWPORT_MARGIN, Math.min(viewport.width - VIEWPORT_MARGIN - menuSize.width, left));
    top = Math.max(VIEWPORT_MARGIN, Math.min(viewport.height - VIEWPORT_MARGIN - menuSize.height, top));
  }

  const isMeasuring = menuSize.width === 0 || menuSize.height === 0;
  const maxHeight = viewport.height - VIEWPORT_MARGIN * 2;

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
        // Sem `accessibilityLabel` — o scrim não é um botão, é o gesto de fechar
        // ao tocar fora. Screen reader anuncia apenas o conteúdo do menu via
        // `accessibilityRole="menu"` no `Animated.View` filho.
        style={{ flex: 1 }}
      >
        <Animated.View
          accessibilityRole="menu"
          accessibilityLabel={accessibilityLabel}
          nativeID={contentId}
          onLayout={handleLayout}
          style={{
            position: 'absolute',
            top: isMeasuring ? -9999 : top,
            left: isMeasuring ? -9999 : left,
            maxWidth: Math.min(themeMaxWidth, viewport.width - VIEWPORT_MARGIN * 2),
            maxHeight,
            opacity: isMeasuring ? 0 : opacity,
          }}
        >
          <Pressable onPress={() => {}}>
            <Box {...(slots.content as Record<string, unknown>)}>
              <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            </Box>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

MenuContent.displayName = 'Menu.Content';

function MenuItem({
  children,
  onSelect,
  disabled = false,
  tone = 'default',
  startIcon,
  endIcon,
}: MenuItemProps) {
  const { setOpen } = useMenuContext();
  const { registerItem, itemsRef, activeIndex, setActiveIndex, scrollViewRef } = useNativeMenuLayout();
  const theme = useTheme() as unknown as ThemeShape;
  const ref = useRef<View | null>(null);
  const indexRef = useRef<number>(-1);

  useLayoutEffect(() => {
    const cleanup = registerItem(ref.current);
    indexRef.current = itemsRef.current.length - 1;
    return cleanup;
  }, [registerItem, itemsRef]);

  const isActive = activeIndex === indexRef.current && indexRef.current !== -1;

  // U10: scroll-to-active — quando o item vira active, mede sua posição
  // dentro do ScrollView e ajusta o scroll (`measureLayout` em RN não tem
  // analogue web). Idempotente: se item já visível, scroll não muda.
  useEffect(() => {
    if (!isActive || !ref.current || !scrollViewRef.current) return;
    const scrollNode = scrollViewRef.current as unknown as View;
    ref.current.measureLayout(
      scrollNode as unknown as number,
      (_x: number, y: number) => {
        scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 16), animated: true });
      },
      () => {
        // measureLayout falha silenciosamente se o item desmontar — sem ação.
      },
    );
  }, [isActive, scrollViewRef]);

  const slots = useSlotRecipe<MenuSlots>('menu', {
    state: disabled ? 'disabled' : 'idle',
    tone,
  });

  const handleSelect = (): boolean => {
    if (disabled) return true;
    let prevented = false;
    const event: MenuItemSelectEvent = {
      preventDefault() {
        prevented = true;
      },
      get defaultPrevented() {
        return prevented;
      },
    };
    onSelect?.(event);
    return prevented;
  };

  const handlePress = () => {
    const prevented = handleSelect();
    if (!prevented && !disabled) setOpen(false);
  };

  const handleFocus = () => {
    if (indexRef.current !== -1) setActiveIndex(indexRef.current);
  };

  // Native: cor do Text não herda do parent View (diferente do CSS web).
  // Lê o alias do tema (override de produto via `createTheme({ components:
  // { menu: { item: { colors: { text: '...' } } } } })`) e passa como prop
  // `color` — engine resolve. Mantém paridade web↔native.
  const itemCfg = theme.components?.menu?.item;
  const itemColors = itemCfg?.colors;
  const textColorAlias = disabled
    ? itemColors?.textDisabled
    : tone === 'critical'
      ? itemColors?.criticalText
      : itemColors?.text;
  const iconSize = itemCfg?.iconSize ?? 'small';
  const iconColorAlias = disabled
    ? itemColors?.textDisabled
    : tone === 'critical'
      ? itemColors?.criticalIcon
      : itemColors?.icon;

  const start = renderItemAdornment(startIcon, iconSize, iconColorAlias);
  const end = renderItemAdornment(endIcon, iconSize, iconColorAlias);
  const hasAdornments = start !== null || end !== null;

  // Children string → wrapper `<Text variant="bodyMedium">` (paridade web).
  const label = typeof children === 'string' ? (
    <Text as="span" variant="bodyMedium" {...(textColorAlias ? { color: textColorAlias } : {})}>
      {children}
    </Text>
  ) : (
    children
  );

  return (
    <Pressable
      ref={ref as unknown as React.Ref<View>}
      onPress={handlePress}
      onFocus={handleFocus}
      disabled={disabled}
      accessibilityRole="menuitem"
      accessibilityState={{ disabled, selected: isActive }}
    >
      <Box {...(slots.item as Record<string, unknown>)}>
        {hasAdornments ? (
          <>
            {start}
            <Box flexGrow={1} display="flex" alignItems="center">
              {label}
            </Box>
            {end}
          </>
        ) : (
          label
        )}
      </Box>
    </Pressable>
  );
}

MenuItem.displayName = 'Menu.Item';

function MenuLabel({ children }: MenuLabelProps) {
  const slots = useSlotRecipe<MenuSlots>('menu', {});
  const theme = useTheme() as unknown as {
    components?: {
      menu?: {
        label?: {
          colors?: { text?: string };
          typography?: { fontSize?: string; fontWeight?: string; letterSpacing?: string };
        };
      };
    };
  };
  const labelCfg = theme.components?.menu?.label;
  const colorAlias = labelCfg?.colors?.text;
  const typo = labelCfg?.typography ?? {};

  // Native: Text não herda fontSize/color do parent View. Aplica tipografia
  // themada (`menu.label.typography.*`) e cor (`menu.label.colors.text`)
  // diretamente como props para o Text, garantindo paridade web↔native.
  return (
    <Box accessibilityRole="none" {...(slots.label as Record<string, unknown>)}>
      {typeof children === 'string' ? (
        <Text
          as="span"
          {...(typo.fontSize ? { fontSize: typo.fontSize as never } : {})}
          {...(typo.fontWeight ? { fontWeight: typo.fontWeight as never } : {})}
          {...(typo.letterSpacing ? { letterSpacing: typo.letterSpacing as never } : {})}
          {...(colorAlias ? { color: colorAlias } : {})}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Box>
  );
}

MenuLabel.displayName = 'Menu.Label';

function MenuSeparator() {
  const slots = useSlotRecipe<MenuSlots>('menu', {});
  return <Box accessibilityRole="none" {...(slots.separator as Record<string, unknown>)} />;
}

MenuSeparator.displayName = 'Menu.Separator';

/**
 * @platform native
 *
 * Menu nativo — `Pressable` trigger + `Modal transparent` para o conteúdo,
 * posicionado relativo ao trigger via `measureInWindow` + `onLayout` (medição
 * em 2 passos: render offscreen → reposiciona). Flipa para o eixo oposto se o
 * `placement` pedido não couber e clampa dentro do viewport. Lista interna em
 * `ScrollView` quando os itens excedem o viewport.
 *
 * Em RN, `Modal` é o único caminho confiável para sobrepor a tela; isso faz
 * com que toques na UI subjacente fiquem bloqueados enquanto o menu está
 * aberto (limitação prática da plataforma). Toque no scrim fecha o menu.
 *
 * Foco de teclado é menos relevante em mobile — items recebem `accessibilityState`
 * `selected` para screen readers. Registro de itens via `useLayoutEffect` para
 * que `indexRef` esteja correto antes do primeiro paint.
 *
 * @see {@link MenuRootProps}
 */
export const Menu = Object.assign(MenuRoot, {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  Separator: MenuSeparator,
  Label: MenuLabel,
});
