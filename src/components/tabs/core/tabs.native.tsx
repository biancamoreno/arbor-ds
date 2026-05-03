import React, { useId, useMemo } from 'react';
import { Box, Flex, Clickable, Text } from '../../core';
import { useControllableState } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
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
        focusNext: noop,
        focusPrev: noop,
        focusFirst: noop,
        focusLast: noop,
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
        accessibilityRole="tablist"
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
  const { activeValue, setActive, orientation, baseId } = useTabsContext();
  const { variant, size } = useTabsListContext();
  const isActive = activeValue === value;
  const triggerId = `${baseId}-tab-trigger-${value}`;

  const slots = useSlotRecipe<TabsSlots>('tabs', {
    variant,
    size,
    orientation,
    state: isActive ? 'active' : 'inactive',
  });

  const handleClick: React.MouseEventHandler<HTMLElement> = () => {
    if (disabled) return;
    setActive(value);
  };

  return (
    <Clickable
      nativeID={triggerId}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive, disabled: !!disabled }}
      onClick={handleClick}
      disabled={disabled}
      flex={flex}
      {...slots.trigger}
      className={className}
      style={style}
    >
      <Text as="span" color={isActive ? 'text.primary' : 'text.secondary'} fontWeight={isActive ? 'medium' : 'regular'}>
        {children}
      </Text>
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
 * Tabs em React Native — paridade com web pós-RFC-0038.
 *
 * - Mesma slot recipe `tabs` (variants underline/pill themable).
 * - `Tabs.List` recebe `accessibilityRole='tablist'`.
 * - `Tabs.Trigger` via `Clickable.native` com `accessibilityRole='tab'` +
 *   `accessibilityState={{ selected, disabled }}`.
 * - `Tabs.Content` usa `accessibilityLabelledBy` (RN não tem `tabpanel`).
 * - Sem keyboard nav (touch-only); pseudos `_hover/_focusVisible` são
 *   no-ops naturais em RN.
 *
 * @see {@link TabsRootProps}
 * @see RFC-0038
 */
export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export default Tabs;
