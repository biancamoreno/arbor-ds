import React, { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Animated, Easing, type LayoutChangeEvent } from 'react-native';
import { Box, Flex, Clickable, Text } from '../../core';
import { useControllableState } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion.native';
import {
  TabsContext,
  TabsListContext,
  useTabsContext,
  useTabsListContext,
} from '../context/tabs-context';
import type {
  TabsIndicatorPosition,
  TabsRootProps,
  TabsListProps,
  TabsSize,
  TabsTriggerProps,
  TabsContentProps,
} from '../interfaces';
import type { TextVariant } from '../../core/text/interfaces/TextVariant';

const LABEL_VARIANT_BY_SIZE: Record<TabsSize, TextVariant> = {
  xsmall: 'caption',
  small: 'bodySmall',
  medium: 'bodyMedium',
  large: 'bodyLarge',
  xlarge: 'subheading',
};

type TabsSlots = 'root' | 'list' | 'trigger' | 'triggerContent' | 'content' | 'indicator';

const STANDARD_EASING = Easing.bezier(0.16, 1, 0.3, 1);
const INDICATOR_DURATION = 160;

function resolveAliasColor(colors: Record<string, unknown>, alias: string | undefined): string | undefined {
  if (!alias) return undefined;
  return alias.split('.').reduce<unknown>(
    (acc, key) => (acc as Record<string, unknown> | undefined)?.[key],
    colors,
  ) as string | undefined;
}

function resolveIndicatorPosition(
  position: TabsIndicatorPosition | undefined,
  orientation: 'horizontal' | 'vertical',
): TabsIndicatorPosition {
  if (position) return position;
  return orientation === 'horizontal' ? 'bottom' : 'right';
}

type ContentLayout = { x: number; y: number; w: number; h: number };

interface TabsListLayoutValue {
  /**
   * Reporta o layout do container interno (slot `triggerContent`) relativo
   * ao trigger. O TabsList soma com o layout do trigger para obter a posição
   * ABSOLUTA na list (que é onde o indicator vive).
   */
  reportContentLayout: (value: string, layout: ContentLayout) => void;
  /** Reporta o layout do botão clicável inteiro relativo à list. */
  reportTriggerLayout: (value: string, layout: ContentLayout) => void;
}

const TabsListLayoutContext = createContext<TabsListLayoutValue>({
  reportContentLayout: () => {},
  reportTriggerLayout: () => {},
});

const noop = () => {};

function TabsRoot({
  children,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  orientation = 'horizontal',
  className,
  style,
}: TabsRootProps) {
  const baseId = useId();
  const [activeValue, setActiveValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });

  const slots = useSlotRecipe<TabsSlots>('tabs', { orientation });

  return (
    <TabsContext.Provider
      value={{
        activeValue,
        setActive: setActiveValue,
        registerTrigger: noop,
        unregisterTrigger: noop,
        registerContent: noop,
        focusNext: noop,
        focusPrev: noop,
        focusFirst: noop,
        focusLast: noop,
        orientation,
        baseId,
        getTriggerNode: () => null,
        getContentNode: () => null,
        contentVersion: 0,
      }}
    >
      <Flex {...slots.root} className={className} style={style}>
        {children}
      </Flex>
    </TabsContext.Provider>
  );
}

function TabsList({
  children,
  variant = 'underline',
  size = 'medium',
  fullWidth = false,
  indicatorPosition,
  className,
  style,
}: TabsListProps) {
  const { activeValue, orientation } = useTabsContext();
  const resolvedPosition = resolveIndicatorPosition(indicatorPosition, orientation);
  const slots = useSlotRecipe<TabsSlots>('tabs', {
    variant,
    size,
    orientation,
    indicatorPosition: resolvedPosition,
  });
  const listContextValue = useMemo(
    () => ({ variant, size, indicatorPosition: resolvedPosition }),
    [variant, size, resolvedPosition],
  );
  const reducedMotion = usePrefersReducedMotion();
  const theme = useTheme();
  const isPill = variant === 'pill';

  const triggerLayoutsRef = useRef(new Map<string, ContentLayout>());
  // content layout aqui é ABSOLUTO na list (já com offset do trigger somado).
  const contentLayoutsRef = useRef(new Map<string, ContentLayout>());
  const xy = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const widthAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [tick, setTick] = useState(0);

  const reportTriggerLayout = useCallback((value: string, layout: ContentLayout) => {
    triggerLayoutsRef.current.set(value, layout);
    setTick((n) => n + 1);
  }, []);

  const reportContentLayout = useCallback((value: string, layout: ContentLayout) => {
    contentLayoutsRef.current.set(value, layout);
    setTick((n) => n + 1);
  }, []);

  // thickness themable: alias → borderWidths.<alias> (= 2px para 'thin').
  const thicknessAlias = (theme.components as Record<string, { indicator?: { thickness?: string } } | undefined>).tabs?.indicator?.thickness;
  const borderWidths = (theme as unknown as { borderWidths?: Record<string, number> }).borderWidths;
  const thickness: number = (thicknessAlias ? borderWidths?.[thicknessAlias] : undefined) ?? 2;

  useEffect(() => {
    const contentLayout = contentLayoutsRef.current.get(activeValue);
    if (!contentLayout) return;

    let targetXY: { x: number; y: number };
    let targetWidth: number;
    let targetHeight: number;
    if (isPill) {
      targetXY = { x: contentLayout.x, y: contentLayout.y };
      targetWidth = contentLayout.w;
      targetHeight = contentLayout.h;
    } else if (resolvedPosition === 'top') {
      targetXY = { x: contentLayout.x, y: 0 };
      targetWidth = contentLayout.w;
      targetHeight = thickness;
    } else if (resolvedPosition === 'bottom') {
      targetXY = { x: contentLayout.x, y: 0 };
      targetWidth = contentLayout.w;
      targetHeight = thickness;
    } else if (resolvedPosition === 'left') {
      targetXY = { x: 0, y: contentLayout.y };
      targetWidth = thickness;
      targetHeight = contentLayout.h;
    } else {
      // right
      targetXY = { x: 0, y: contentLayout.y };
      targetWidth = thickness;
      targetHeight = contentLayout.h;
    }

    if (reducedMotion || process.env.NODE_ENV === 'test') {
      xy.setValue(targetXY);
      widthAnim.setValue(targetWidth);
      heightAnim.setValue(targetHeight);
      opacityAnim.setValue(1);
      return;
    }

    Animated.parallel([
      Animated.timing(xy, { toValue: targetXY, duration: INDICATOR_DURATION, easing: STANDARD_EASING, useNativeDriver: false }),
      Animated.timing(widthAnim, { toValue: targetWidth, duration: INDICATOR_DURATION, easing: STANDARD_EASING, useNativeDriver: false }),
      Animated.timing(heightAnim, { toValue: targetHeight, duration: INDICATOR_DURATION, easing: STANDARD_EASING, useNativeDriver: false }),
      Animated.timing(opacityAnim, { toValue: 1, duration: INDICATOR_DURATION, easing: STANDARD_EASING, useNativeDriver: true }),
    ]).start();
  }, [activeValue, isPill, resolvedPosition, thickness, reducedMotion, xy, widthAnim, heightAnim, opacityAnim, tick]);

  const renderedChildren = fullWidth
    ? React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ flex?: number }>, { flex: 1 })
          : child,
      )
    : children;

  // Cor themable via component token (`tabs.indicator.color`).
  const indicatorColorAlias = (theme.components as Record<string, { indicator?: { color?: string } } | undefined>).tabs?.indicator?.color;
  const indicatorColor = resolveAliasColor(theme.colors as Record<string, unknown>, indicatorColorAlias) ?? theme.colors.brand.solid;

  // borderRadius themable.
  const radiusConfig = (theme.components as Record<string, { indicator?: { borderRadius?: { underline?: string; pill?: string } } } | undefined>).tabs?.indicator?.borderRadius;
  const radiiTokens = (theme as unknown as { radii?: Record<string, number | string> }).radii;
  const radiusAlias = isPill ? radiusConfig?.pill : radiusConfig?.underline;
  const resolvedRadius = (() => {
    if (!radiusAlias) return isPill ? 9999 : 0;
    if (radiusAlias === 'full') return 9999;
    if (radiusAlias === 'none') return 0;
    const value = radiiTokens?.[radiusAlias];
    return typeof value === 'number' ? value : isPill ? 9999 : 0;
  })();

  // Posicionamento estático (top/bottom/left/right).
  let staticPosition: { top?: number; bottom?: number; left?: number; right?: number };
  if (isPill) {
    staticPosition = { top: 0, left: 0 };
  } else if (resolvedPosition === 'top') {
    staticPosition = { top: 0, left: 0 };
  } else if (resolvedPosition === 'bottom') {
    staticPosition = { bottom: 0, left: 0 };
  } else if (resolvedPosition === 'left') {
    staticPosition = { top: 0, left: 0 };
  } else {
    staticPosition = { top: 0, right: 0 };
  }

  return (
    <TabsListContext.Provider value={listContextValue}>
      <TabsListLayoutContext.Provider value={{ reportContentLayout, reportTriggerLayout }}>
        <Flex
          accessibilityRole="tablist"
          {...slots.list}
          className={className}
          style={style}
        >
          {renderedChildren}
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              backgroundColor: indicatorColor,
              borderRadius: resolvedRadius,
              opacity: opacityAnim,
              width: widthAnim,
              height: heightAnim,
              transform: [{ translateX: xy.x }, { translateY: xy.y }],
              ...staticPosition,
            }}
          />
        </Flex>
      </TabsListLayoutContext.Provider>
    </TabsListContext.Provider>
  );
}

function TabsTrigger({
  children,
  value,
  disabled,
  className,
  style,
  flex,
}: TabsTriggerProps & { flex?: number }) {
  const { activeValue, setActive, orientation, baseId } = useTabsContext();
  const { variant, size, indicatorPosition } = useTabsListContext();
  const { reportTriggerLayout, reportContentLayout } = useContext(TabsListLayoutContext);
  const isActive = activeValue === value;
  const triggerId = `${baseId}-tab-trigger-${value}`;
  // Cache do offset do trigger para somar com o offset do container interno
  // (que vem relativo ao trigger, não à list).
  const triggerOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const slots = useSlotRecipe<TabsSlots>('tabs', {
    variant,
    size,
    orientation,
    indicatorPosition,
    state: isActive ? 'active' : 'inactive',
  });

  const handleClick: React.MouseEventHandler<HTMLElement> = () => {
    if (disabled) return;
    setActive(value);
  };

  const handleTriggerLayout = (e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    triggerOffsetRef.current = { x, y };
    reportTriggerLayout(value, { x, y, w: width, h: height });
  };

  const handleContentLayout = (e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    // Soma offset do trigger → posição ABSOLUTA na list.
    reportContentLayout(value, {
      x: triggerOffsetRef.current.x + x,
      y: triggerOffsetRef.current.y + y,
      w: width,
      h: height,
    });
  };

  // Native não cascateia color do parent View para o Text filho — passamos explícito.
  // Pill ativo é texto sobre brand.solid → text.inverse; outros casos seguem state.
  const textColor =
    variant === 'pill' && isActive ? 'text.inverse' : isActive ? 'text.primary' : 'text.secondary';

  return (
    <Clickable
      nativeID={triggerId}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive, disabled: !!disabled }}
      onClick={handleClick}
      onLayout={handleTriggerLayout}
      disabled={disabled}
      flex={flex}
      {...slots.trigger}
      className={className}
      style={style}
    >
      <Box {...slots.triggerContent} onLayout={handleContentLayout}>
        {React.Children.map(children, (child) =>
          typeof child === 'string' || typeof child === 'number'
            ? <Text as="span" variant={LABEL_VARIANT_BY_SIZE[size]} color={textColor}>{child}</Text>
            : child,
        )}
      </Box>
    </Clickable>
  );
}

function TabsContent({ children, value, className, style }: TabsContentProps) {
  const { activeValue, baseId } = useTabsContext();
  const slots = useSlotRecipe<TabsSlots>('tabs');
  if (activeValue !== value) return null;

  return (
    <Box
      accessibilityLabelledBy={`${baseId}-tab-trigger-${value}`}
      {...slots.content}
      className={className}
      style={style}
    >
      {children}
    </Box>
  );
}

TabsRoot.displayName = 'Tabs.Root';
TabsList.displayName = 'Tabs.List';
TabsTrigger.displayName = 'Tabs.Trigger';
TabsContent.displayName = 'Tabs.Content';

/**
 * @platform native
 *
 * Tabs em React Native — paridade com web.
 *
 * - Mesma slot recipe `tabs` (slots `root`/`list`/`trigger`/`triggerContent`/
 *   `content`/`indicator`; axes `variant`/`size`/`orientation`/
 *   `indicatorPosition`/`state`).
 * - `Tabs.Trigger` envolve `children` num **container interno** (slot
 *   `triggerContent`) — composição livre. `onLayout` desse container reporta
 *   coords (somadas ao offset do trigger pai) para posição ABSOLUTA na list.
 * - O `Animated.View` indicator desliza entre containers via
 *   `Animated.parallel(translate + width + height + opacity)`. Cor/thickness/
 *   borderRadius lidos de `theme.components.tabs.indicator.*` (themable).
 * - **Underline**: barra fina, position top/bottom/left/right.
 * - **Pill**: bloco cobrindo o container interno.
 * - `usePrefersReducedMotion` corta a animação. Sem keyboard nav (touch-only).
 *
 * @see {@link TabsRootProps}
 * @see RFC-0042 PCV-28
 */
export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export default Tabs;
