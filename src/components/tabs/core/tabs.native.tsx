import React, { createContext, useContext, useId } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Box, Flex, Clickable, Text } from '../../core';
import { useControllableState } from '../../../ecosystem/primitives';
import type {
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from '../interfaces';


interface TabsNativeContextValue {
  activeValue: string;
  setActive: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
  baseId: string;
}

const TabsNativeContext = createContext<TabsNativeContextValue>({
  activeValue: '',
  setActive: () => {},
  orientation: 'horizontal',
  baseId: '',
});

const useTabsNativeContext = () => useContext(TabsNativeContext);

function TabsRoot({
  children,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  orientation = 'horizontal',
  style,
  ...props
}: TabsRootProps) {
  const baseId = useId();
  const [activeValue, setActiveValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <TabsNativeContext.Provider
      value={{ activeValue, setActive: setActiveValue, orientation, baseId }}
    >
      <Flex
        {...(props as object)}
        flexDirection={orientation === 'vertical' ? 'row' : 'column'}
        style={style}
      >
        {children}
      </Flex>
    </TabsNativeContext.Provider>
  );
}

function TabsList({ children, fullWidth = false, style, ...props }: TabsListProps) {
  const { orientation } = useTabsNativeContext();
  const theme = useTheme();

  return (
    <Flex
      {...(props as object)}
      accessibilityRole="tablist"
      flexDirection={orientation === 'vertical' ? 'column' : 'row'}
      gap="2px"
      flexShrink={0}
      style={{
        borderBottomWidth: orientation === 'horizontal' ? 1 : 0,
        borderRightWidth: orientation === 'vertical' ? 1 : 0,
        borderColor: theme.colors.border.subtle,
        borderStyle: 'solid',
        ...style,
      }}
    >
      {fullWidth
        ? React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<TabsTriggerProps>, {
                  style: { flex: 1, ...(child.props as TabsTriggerProps).style },
                })
              : child,
          )
        : children}
    </Flex>
  );
}

function TabsTrigger({ children, value, size = 'medium', disabled, onClick, style, ...props }: TabsTriggerProps) {
  const theme = useTheme();
  const { activeValue, setActive, baseId } = useTabsNativeContext();
  const isActive = activeValue === value;
  const triggerId = `${baseId}-trigger-${value}`;

  const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
    if (disabled) return;
    setActive(value);
    onClick?.(e as React.MouseEvent<HTMLButtonElement>);
  };

  return (
    <Clickable
      {...(props as object)}
      nativeID={triggerId}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive, disabled: !!disabled }}
      onClick={handleClick}
      disabled={disabled}
      display="flex"
      alignItems="center"
      justifyContent="center"
      style={{
        paddingHorizontal: size === 'small' ? 12 : 16,
        paddingVertical: size === 'small' ? 8 : 10,
        borderBottomWidth: 2,
        borderBottomColor: isActive ? theme.colors.brand.base : 'transparent',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <Text
        as="span"
        style={{
          color: isActive ? theme.colors.text.primary : theme.colors.text.secondary,
          fontSize: size === 'small' ? 12 : 14,
          fontWeight: isActive ? '500' : '400',
        }}
      >
        {children}
      </Text>
    </Clickable>
  );
}

function TabsContent({ children, value, style, ...props }: TabsContentProps) {
  const { activeValue, baseId } = useTabsNativeContext();
  if (activeValue !== value) return null;

  return (
    <Box
      {...(props as object)}
      accessibilityLabelledBy={`${baseId}-trigger-${value}`}
      color="text.primary"
      padding="medium"
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
 * `Tabs` em React Native — versão simplificada do compound web:
 * - Sem navegação por teclado (paradigma touch-only).
 * - `Tabs.List` recebe `accessibilityRole='tablist'`.
 * - `Tabs.Trigger` via `Clickable.native` com `accessibilityRole='tab'` +
 *   `accessibilityState={{ selected, disabled }}`.
 * - `Tabs.Content` usa `accessibilityLabelledBy` apontando para o `nativeID`
 *   do trigger ativo (RN não tem role `tabpanel`).
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
