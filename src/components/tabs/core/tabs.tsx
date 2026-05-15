import React, { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Box, Flex, Clickable, Text } from '../../core';
import { useControllableState } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion';
import { transition } from '../../../foundations/theme/transition';
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

// Text variant por size — diferencia hierarquia tipográfica entre as 5 escalas.
const LABEL_VARIANT_BY_SIZE: Record<TabsSize, TextVariant> = {
  xsmall: 'caption',
  small: 'bodySmall',
  medium: 'bodyMedium',
  large: 'bodyLarge',
  xlarge: 'subheading',
};

type TabsSlots = 'root' | 'list' | 'trigger' | 'triggerContent' | 'content' | 'indicator';

const INDICATOR_TRANSITION = transition(
  ['transform', 'width', 'height', 'opacity'],
  'normal',
  'standard',
);

function resolveIndicatorPosition(
  position: TabsIndicatorPosition | undefined,
  orientation: 'horizontal' | 'vertical',
): TabsIndicatorPosition {
  if (position) return position;
  return orientation === 'horizontal' ? 'bottom' : 'right';
}

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

  const triggerRefs = useRef<Map<string, React.RefObject<HTMLButtonElement | null>>>(new Map());
  const contentNodes = useRef<Map<string, HTMLElement>>(new Map());
  const [contentVersion, setContentVersion] = useState(0);

  const registerTrigger = useCallback(
    (value: string, ref: React.RefObject<HTMLButtonElement | null>) => {
      triggerRefs.current.set(value, ref);
    },
    [],
  );

  const unregisterTrigger = useCallback((value: string) => {
    triggerRefs.current.delete(value);
  }, []);

  const registerContent = useCallback((value: string, node: HTMLElement | null) => {
    if (node) {
      contentNodes.current.set(value, node);
    } else {
      contentNodes.current.delete(value);
    }
    // Força o TabsIndicator a re-medir agora que o nó está disponível.
    setContentVersion((v) => v + 1);
  }, []);

  const getTriggerNode = useCallback(
    (value: string) => triggerRefs.current.get(value)?.current ?? null,
    [],
  );

  const getContentNode = useCallback(
    (value: string) => contentNodes.current.get(value) ?? null,
    [],
  );

  const getSortedKeys = useCallback(() => {
    const keys = Array.from(triggerRefs.current.keys());
    return keys.sort((a, b) => {
      const refA = triggerRefs.current.get(a)?.current;
      const refB = triggerRefs.current.get(b)?.current;
      if (!refA || !refB) return 0;
      const pos = refA.compareDocumentPosition(refB);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });
  }, []);

  const focusAt = useCallback((value: string | undefined) => {
    if (!value) return;
    triggerRefs.current.get(value)?.current?.focus();
  }, []);

  const focusNext = useCallback(
    (fromValue: string) => {
      const keys = getSortedKeys();
      if (keys.length === 0) return;
      const idx = keys.indexOf(fromValue);
      focusAt(keys[(idx + 1) % keys.length]);
    },
    [getSortedKeys, focusAt],
  );

  const focusPrev = useCallback(
    (fromValue: string) => {
      const keys = getSortedKeys();
      if (keys.length === 0) return;
      const idx = keys.indexOf(fromValue);
      focusAt(keys[(idx - 1 + keys.length) % keys.length]);
    },
    [getSortedKeys, focusAt],
  );

  const focusFirst = useCallback(() => {
    const keys = getSortedKeys();
    focusAt(keys[0]);
  }, [getSortedKeys, focusAt]);

  const focusLast = useCallback(() => {
    const keys = getSortedKeys();
    focusAt(keys[keys.length - 1]);
  }, [getSortedKeys, focusAt]);

  const slots = useSlotRecipe<TabsSlots>('tabs', { orientation });

  return (
    <TabsContext.Provider
      value={{
        activeValue,
        setActive: setActiveValue,
        registerTrigger,
        unregisterTrigger,
        registerContent,
        focusNext,
        focusPrev,
        focusFirst,
        focusLast,
        orientation,
        baseId,
        getTriggerNode,
        getContentNode,
        contentVersion,
      }}
    >
      <Flex {...slots.root} className={className} style={style}>
        {children}
      </Flex>
    </TabsContext.Provider>
  );
}

function TabsIndicator({
  listRef,
}: {
  listRef: React.RefObject<HTMLElement | null>;
}) {
  const { activeValue, getContentNode, contentVersion } = useTabsContext();
  const { variant, indicatorPosition } = useTabsListContext();
  const slots = useSlotRecipe<TabsSlots>('tabs', { variant, indicatorPosition });
  const theme = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number; ready: boolean }>({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    ready: false,
  });

  // thickness themable: alias (`'thin'`) → resolve em `theme.borderWidths.thin` (= 2px).
  const thicknessAlias = (theme.components as Record<string, { indicator?: { thickness?: string } } | undefined>).tabs?.indicator?.thickness;
  const borderWidths = (theme as unknown as { borderWidths?: Record<string, number> }).borderWidths;
  const thickness = (thicknessAlias && borderWidths?.[thicknessAlias]) ?? 2;

  useLayoutEffect(() => {
    if (!activeValue) return;
    const list = listRef.current;
    if (!list) return;

    let alive = true;
    let rafId = 0;

    const measure = () => {
      if (!alive) return;
      const content = getContentNode(activeValue);
      if (!content) {
        // Container interno ainda não registrou — tentar próximo frame.
        rafId = requestAnimationFrame(measure);
        return;
      }
      const t = content.getBoundingClientRect();
      const l = list.getBoundingClientRect();
      setRect({
        x: t.left - l.left,
        y: t.top - l.top,
        w: t.width,
        h: t.height,
        ready: true,
      });
    };

    // Tentativa imediata + uma de fallback no próximo frame.
    measure();

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        alive = false;
        cancelAnimationFrame(rafId);
      };
    }

    const ro = new ResizeObserver(measure);
    ro.observe(list);
    const content = getContentNode(activeValue);
    if (content) ro.observe(content);
    window.addEventListener('resize', measure);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [activeValue, variant, indicatorPosition, getContentNode, listRef, contentVersion]);

  const isPill = variant === 'pill';

  // Posicionamento estático (top/bottom/left/right) — eixo perpendicular fica com `auto`.
  let positionStyle: React.CSSProperties;
  if (isPill) {
    positionStyle = {
      top: 0,
      left: 0,
      width: `${rect.w}px`,
      height: `${rect.h}px`,
      transform: `translate(${rect.x}px, ${rect.y}px)`,
    };
  } else if (indicatorPosition === 'top') {
    positionStyle = {
      top: 0,
      left: 0,
      width: `${rect.w}px`,
      height: `${thickness}px`,
      transform: `translateX(${rect.x}px)`,
    };
  } else if (indicatorPosition === 'bottom') {
    positionStyle = {
      bottom: 0,
      left: 0,
      width: `${rect.w}px`,
      height: `${thickness}px`,
      transform: `translateX(${rect.x}px)`,
    };
  } else if (indicatorPosition === 'left') {
    positionStyle = {
      top: 0,
      left: 0,
      width: `${thickness}px`,
      height: `${rect.h}px`,
      transform: `translateY(${rect.y}px)`,
    };
  } else {
    // right
    positionStyle = {
      top: 0,
      right: 0,
      width: `${thickness}px`,
      height: `${rect.h}px`,
      transform: `translateY(${rect.y}px)`,
    };
  }

  return (
    <Box
      aria-hidden
      {...slots.indicator}
      style={{
        ...positionStyle,
        opacity: rect.ready ? 1 : 0,
        transition: reducedMotion ? 'none' : INDICATOR_TRANSITION,
      }}
    />
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
  const { orientation } = useTabsContext();
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
  const listRef = useRef<HTMLDivElement>(null);

  const renderedChildren = fullWidth
    ? React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ flex?: number }>, { flex: 1 })
          : child,
      )
    : children;

  return (
    <TabsListContext.Provider value={listContextValue}>
      <Flex
        role="tablist"
        aria-orientation={orientation}
        innerRef={listRef}
        {...slots.list}
        className={className}
        style={style}
      >
        {renderedChildren}
        <TabsIndicator listRef={listRef} />
      </Flex>
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
  const {
    activeValue,
    setActive,
    registerTrigger,
    unregisterTrigger,
    registerContent,
    focusNext,
    focusPrev,
    focusFirst,
    focusLast,
    orientation,
    baseId,
  } = useTabsContext();
  const { variant, size, indicatorPosition } = useTabsListContext();
  const isActive = activeValue === value;
  const ref = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    registerTrigger(value, ref);
    return () => unregisterTrigger(value);
  }, [value, registerTrigger, unregisterTrigger]);

  // Callback ref síncrono no container interno — registra/desregistra antes
  // do TabsIndicator.useLayoutEffect rodar, garantindo medição no primeiro paint.
  const contentRefCallback = useCallback(
    (node: HTMLElement | null) => {
      registerContent(value, node);
    },
    [value, registerContent],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    if (e.key === nextKey) { e.preventDefault(); focusNext(value); return; }
    if (e.key === prevKey) { e.preventDefault(); focusPrev(value); return; }
    if (e.key === 'Home')  { e.preventDefault(); focusFirst(); return; }
    if (e.key === 'End')   { e.preventDefault(); focusLast(); return; }
  };

  const slots = useSlotRecipe<TabsSlots>('tabs', {
    variant,
    size,
    orientation,
    indicatorPosition,
    state: isActive ? 'active' : 'inactive',
  });

  return (
    <Clickable
      as="button"
      innerRef={ref}
      type="button"
      role="tab"
      id={`${baseId}-tab-trigger-${value}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-tab-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => { if (!disabled) setActive(value); }}
      onKeyDown={handleKeyDown}
      flex={flex}
      {...slots.trigger}
      className={className}
      style={{ whiteSpace: 'nowrap', ...style }}
    >
      <Box as="span" innerRef={contentRefCallback} {...slots.triggerContent}>
        {React.Children.map(children, (child) =>
          typeof child === 'string' || typeof child === 'number'
            ? <Text as="span" variant={LABEL_VARIANT_BY_SIZE[size]}>{child}</Text>
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
      role="tabpanel"
      id={`${baseId}-tab-panel-${value}`}
      aria-labelledby={`${baseId}-tab-trigger-${value}`}
      tabIndex={0}
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
 * @platform shared
 *
 * Compound de tabs (abas).
 *
 * Anatomia (`root`, `list`, `trigger`, `triggerContent`, `content`,
 * `indicator`) + axes (`variant`, `size`, `orientation`, `indicatorPosition`,
 * `state`) resolvidos pela slot recipe `tabs` — override completo via
 * `createTheme`.
 *
 * `Tabs.Trigger` envolve `children` num **container interno** (slot
 * `triggerContent`, `inline-flex + gap`) que aceita composição livre — texto,
 * ícones, badges, contadores, qualquer node. O **indicador de estado ativo**
 * (slot `indicator`) acompanha **este container**, não o button (que tem
 * padding). Resultado: a barra/pill abraça o conteúdo, não a área clicável.
 *
 * O Indicator é único por List e desliza entre os containers via
 * `ResizeObserver` + `transform`:
 *
 * - **underline**: barra fina (cor/thickness/borderRadius themables via
 *   `tabs.indicator.*`) na posição configurada por `indicatorPosition`
 *   (top | bottom | left | right).
 * - **pill**: bloco do tamanho do container interno (segmented control).
 *
 * Animação: `transform + width + height + opacity` com motion canônico
 * `normal` (160ms) + `standard` (`cubic-bezier(0.16, 1, 0.3, 1)`). Primeira
 * renderização faz fade-in (opacity 0→1) já posicionado no trigger ativo.
 * `prefers-reduced-motion` corta a animação.
 *
 * Registro do container via **callback ref síncrono** (não via querySelector
 * por data-attribute): garante que o TabsIndicator.useLayoutEffect encontra
 * o node mesmo no primeiro paint. Fallback `requestAnimationFrame` retry
 * cobre qualquer race condition.
 *
 * Web: keyboard nav `ArrowUp`/`ArrowDown`/`ArrowLeft`/`ArrowRight` (de
 * acordo com `orientation`), `Home`/`End` (DOM-order via
 * `compareDocumentPosition`). Foco visível WCAG 2.4.7 no Trigger e no
 * Content. Native: touch-only.
 *
 * @example
 * <Tabs defaultValue="inbox">
 *   <Tabs.List variant="underline">
 *     <Tabs.Trigger value="inbox">
 *       <Icon name="Mail" size="small" decorative />
 *       Caixa de entrada
 *       <Badge tone="info">12</Badge>
 *     </Tabs.Trigger>
 *     <Tabs.Trigger value="sent">Enviados</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="inbox">…</Tabs.Content>
 * </Tabs>
 *
 * @see {@link TabsRootProps}
 */
export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export default Tabs;
