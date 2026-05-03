import React, { useCallback, useId, useMemo, useRef } from 'react';
import { Box, Flex, Clickable } from '../../core';
import { useControllableState } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { transition } from '../../../foundations/theme/transition';
import {
  TabsContext,
  TabsListContext,
  useTabsContext,
  useTabsListContext,
} from '../context/tabs-context';
import type {
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from '../interfaces';

type TabsSlots = 'root' | 'list' | 'trigger' | 'content';

const TRIGGER_TRANSITION = transition(['color', 'background-color', 'border-color'], 'fast');

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

  const registerTrigger = useCallback(
    (value: string, ref: React.RefObject<HTMLButtonElement | null>) => {
      triggerRefs.current.set(value, ref);
    },
    [],
  );

  const unregisterTrigger = useCallback((value: string) => {
    triggerRefs.current.delete(value);
  }, []);

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
        focusNext,
        focusPrev,
        focusFirst,
        focusLast,
        orientation,
        baseId,
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
  className,
  style,
}: TabsListProps) {
  const { orientation } = useTabsContext();
  const slots = useSlotRecipe<TabsSlots>('tabs', { variant, size, orientation });
  const listContextValue = useMemo(() => ({ variant, size }), [variant, size]);

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
        {...slots.list}
        className={className}
        style={style}
      >
        {renderedChildren}
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
  const { activeValue, setActive, registerTrigger, unregisterTrigger, focusNext, focusPrev, focusFirst, focusLast, orientation, baseId } =
    useTabsContext();
  const { variant, size } = useTabsListContext();
  const isActive = activeValue === value;
  const ref = useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    registerTrigger(value, ref);
    return () => unregisterTrigger(value);
  }, [value, registerTrigger, unregisterTrigger]);

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
      style={{ whiteSpace: 'nowrap', transition: TRIGGER_TRANSITION, ...style }}
    >
      {children}
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
 * Anatomia (`root`, `list`, `trigger`, `content`) + axes (`variant`, `size`,
 * `orientation`, `state`) resolvidos pela slot recipe `tabs` — override
 * completo via `createTheme`.
 *
 * `variant` (underline | pill) e `size` (SP-1 completo) vivem em `Tabs.List`
 * — decisão de identidade do grupo, não do trigger individual.
 *
 * Web: keyboard nav `ArrowUp`/`ArrowDown`/`ArrowLeft`/`ArrowRight` (de
 * acordo com `orientation`), `Home`/`End` (DOM-order via
 * `compareDocumentPosition`). Foco visível WCAG 2.4.7 no Trigger e no
 * Content (sem `outline: none`). Native: touch-only.
 *
 * @example
 * <Tabs defaultValue="overview">
 *   <Tabs.List variant="underline" size="medium">
 *     <Tabs.Trigger value="overview">Visão geral</Tabs.Trigger>
 *     <Tabs.Trigger value="reviews">Avaliações</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="overview">…</Tabs.Content>
 *   <Tabs.Content value="reviews">…</Tabs.Content>
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
