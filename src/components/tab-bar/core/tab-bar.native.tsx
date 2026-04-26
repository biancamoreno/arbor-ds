import { Platform } from 'react-native';
import { Box, Flex, Text, Icon, Clickable } from '../../core';
import { TabBarContext, useTabBar } from './tab-bar-context';
import type { TabBarProps, TabBarItemProps } from '../interfaces/TabBarProps';

function getSafeAreaBottom(): number {
  if (Platform.OS === 'ios') return 34;
  return 0;
}

function TabBarItem({ value, icon, label, badge, disabled = false }: TabBarItemProps) {
  const { value: activeValue, onChange } = useTabBar();
  const isActive = value === activeValue;

  const activeColor = '#18736A';
  const inactiveColor = '#6B7280';

  const hasBadge = badge !== undefined && badge !== false && badge !== 0;
  const badgeCount = typeof badge === 'number' && badge > 99 ? '99+' : badge === true ? null : badge;

  return (
    <Clickable
      onClick={() => { if (!disabled) onChange(value); }}
      disabled={disabled}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive, disabled }}
      accessibilityLabel={label}
      flex={1}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      style={{
        paddingVertical: 8,
        paddingHorizontal: 4,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Box position="relative">
        <Icon
          name={icon}
          size={22}
          color={isActive ? activeColor : inactiveColor}
          decorative
        />
        {hasBadge && (
          <Flex
            position="absolute"
            alignItems="center"
            justifyContent="center"
            borderRadius="full"
            style={{
              top: badge === true ? 0 : -4,
              right: badge === true ? 0 : -6,
              minWidth: badge === true ? 8 : 16,
              height: badge === true ? 8 : 16,
              backgroundColor: '#E53E3E',
              paddingHorizontal: badge === true ? 0 : 3,
            }}
          >
            {badgeCount !== null && (
              <Text
                as="span"
                style={{ color: '#fff', fontSize: 9, lineHeight: 12, fontWeight: '600' }}
              >
                {String(badgeCount)}
              </Text>
            )}
          </Flex>
        )}
      </Box>
      <Text
        as="span"
        numberOfLines={1}
        style={{
          fontSize: 10,
          marginTop: 4,
          fontWeight: isActive ? '500' : '400',
          color: isActive ? activeColor : inactiveColor,
        }}
      >
        {label}
      </Text>
    </Clickable>
  );
}

function TabBarRoot({
  value,
  onChange,
  children,
  safeAreaBottom = true,
  'aria-label': ariaLabel = 'Bottom navigation',
}: TabBarProps) {
  const bottomInset = safeAreaBottom ? getSafeAreaBottom() : 0;

  return (
    <TabBarContext.Provider value={{ value, onChange }}>
      <Flex
        accessibilityRole="tablist"
        accessibilityLabel={ariaLabel}
        backgroundColor="surface.default"
        borderTopWidth={1}
        borderTopStyle="solid"
        borderTopColor="border.subtle"
        style={{ paddingBottom: bottomInset }}
      >
        {children}
      </Flex>
    </TabBarContext.Provider>
  );
}

export const TabBar = Object.assign(TabBarRoot, { Item: TabBarItem });
