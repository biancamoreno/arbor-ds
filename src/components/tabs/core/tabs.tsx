import React, { useCallback, useRef } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Box, Flex, Clickable } from '../../core';
import { useControllableState } from '../../../ecosystem/primitives';
import { transition } from '../../../ecosystem/utils/functions';
import { TabsContext, useTabsContext } from '../context/tabs-context';
import type {
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from '../interfaces';

function TabsRoot({
  children,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  orientation = 'horizontal',
  style,
  ...props
}: TabsRootProps) {
  const [activeValue, setActiveValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });

  const triggerRefs = useRef<Map<string, React.RefObject<HTMLButtonElement | null>>>(new Map());

  const registerTrigger = useCallback((value: string, ref: React.RefObject<HTMLButtonElement | null>) => {
    triggerRefs.current.set(value, ref);
  }, []);

  const unregisterTrigger = useCallback((value: string) => {
    triggerRefs.current.delete(value);
  }, []);

  const getSortedKeys = () => Array.from(triggerRefs.current.keys());

  const focusNext = useCallback((fromValue: string) => {
    const keys = getSortedKeys();
    const idx = keys.indexOf(fromValue);
    triggerRefs.current.get(keys[(idx + 1) % keys.length])?.current?.focus();
  }, []);

  const focusPrev = useCallback((fromValue: string) => {
    const keys = getSortedKeys();
    const idx = keys.indexOf(fromValue);
    triggerRefs.current.get(keys[(idx - 1 + keys.length) % keys.length])?.current?.focus();
  }, []);

  return (
    <TabsContext.Provider
      value={{ activeValue, setActive: setActiveValue, registerTrigger, unregisterTrigger, focusNext, focusPrev, orientation }}
    >
      <Flex
        {...props}
        flexDirection={orientation === 'vertical' ? 'row' : 'column'}
        style={style}
      >
        {children}
      </Flex>
    </TabsContext.Provider>
  );
}

function TabsList({ children, variant = 'underline', fullWidth = false, style, ...props }: TabsListProps) {
  const theme = useTheme();
  const { orientation } = useTabsContext();

  return (
    <Flex
      role="tablist"
      aria-orientation={orientation}
      {...props}
      flexDirection={orientation === 'vertical' ? 'column' : 'row'}
      gap="2px"
      flexShrink={0}
      style={{
        borderBottom: variant === 'underline' && orientation === 'horizontal'
          ? `1px solid ${theme.colors.border.subtle}`
          : 'none',
        borderRight: variant === 'underline' && orientation === 'vertical'
          ? `1px solid ${theme.colors.border.subtle}`
          : 'none',
        flexWrap: orientation === 'horizontal' ? 'wrap' : undefined,
        ...style,
      }}
    >
      {fullWidth
        ? React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<TabsTriggerProps>, {
                  style: { flex: 1, ...(child.props as TabsTriggerProps).style },
                })
              : child
          )
        : children}
    </Flex>
  );
}

function TabsTrigger({ children, value, size = 'md', disabled, style, ...props }: TabsTriggerProps) {
  const theme = useTheme();
  const { activeValue, setActive, registerTrigger, unregisterTrigger, focusNext, focusPrev, orientation } =
    useTabsContext();
  const isActive = activeValue === value;
  const ref = useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    registerTrigger(value, ref);
    return () => unregisterTrigger(value);
  }, [value, registerTrigger, unregisterTrigger]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    if (e.key === nextKey) { e.preventDefault(); focusNext(value); }
    if (e.key === prevKey) { e.preventDefault(); focusPrev(value); }
  };

  return (
    <Clickable
      as="button"
      innerRef={ref}
      type="button"
      role="tab"
      id={`tab-trigger-${value}`}
      aria-selected={isActive}
      aria-controls={`tab-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => { if (!disabled) setActive(value); }}
      onKeyDown={handleKeyDown}
      {...props}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      gap="6px"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.5 : 1}
      style={{
        padding: size === 'sm' ? '8px 12px' : '10px 16px',
        border: 'none',
        borderBottom: `2px solid ${isActive ? theme.colors.brand.base : 'transparent'}`,
        borderRadius: 0,
        backgroundColor: 'transparent',
        color: isActive ? theme.colors.text.primary : theme.colors.text.secondary,
        fontSize: size === 'sm' ? theme.fontSizes.xsmall : theme.fontSizes.small,
        fontWeight: isActive ? theme.fontWeights.medium : theme.fontWeights.regular,
        whiteSpace: 'nowrap',
        transition: transition(['color', 'border-color'], 'fast'),
        ...style,
      }}
    >
      {children}
    </Clickable>
  );
}

function TabsContent({ children, value, style, ...props }: TabsContentProps) {
  const { activeValue } = useTabsContext();
  if (activeValue !== value) return null;

  return (
    <Box
      role="tabpanel"
      id={`tab-panel-${value}`}
      aria-labelledby={`tab-trigger-${value}`}
      tabIndex={0}
      {...props}
      color="text.primary"
      padding="medium"
      style={{ paddingLeft: 0, paddingRight: 0, outline: 'none', ...style }}
    >
      {children}
    </Box>
  );
}

export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export default Tabs;
