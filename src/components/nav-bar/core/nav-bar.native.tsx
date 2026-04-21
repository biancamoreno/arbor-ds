import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { Icon } from '../../core';
import { NavBarContext, useNavBar } from './nav-bar-context';
import type { NavBarProps, NavBarItemProps } from '../interfaces/NavBarProps';

function getSafeAreaBottom(): number {
  // fallback para o valor típico de iPhones com notch/Dynamic Island
  if (Platform.OS === 'ios') return 34;
  return 0;
}

function NavBarItem({ value, icon, label, badge, disabled = false }: NavBarItemProps) {
  const { value: activeValue, onChange } = useNavBar();
  const isActive = value === activeValue;

  const activeColor = '#18736A';
  const inactiveColor = '#6B7280';

  const hasBadge = badge !== undefined && badge !== false && badge !== 0;
  const badgeCount = typeof badge === 'number' && badge > 99 ? '99+' : badge === true ? null : badge;

  return (
    <TouchableOpacity
      onPress={() => { if (!disabled) onChange(value); }}
      disabled={disabled}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive, disabled }}
      accessibilityLabel={label}
      style={{
        flex: 1,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        paddingVertical: 8,
        paddingHorizontal: 4,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <View style={{ position: 'relative' }}>
        <Icon
          name={icon}
          size={22}
          color={isActive ? activeColor : inactiveColor}
          decorative
        />
        {hasBadge && (
          <View
            style={{
              position: 'absolute',
              top: badge === true ? 0 : -4,
              right: badge === true ? 0 : -6,
              minWidth: badge === true ? 8 : 16,
              height: badge === true ? 8 : 16,
              borderRadius: 999,
              backgroundColor: '#E53E3E',
              alignItems: 'center' as const,
              justifyContent: 'center' as const,
              paddingHorizontal: badge === true ? 0 : 3,
            }}
          >
            {badgeCount !== null && (
              <Text style={{ color: '#fff', fontSize: 9, lineHeight: 12, fontWeight: '600' }}>
                {String(badgeCount)}
              </Text>
            )}
          </View>
        )}
      </View>
      <Text
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
    </TouchableOpacity>
  );
}

function NavBarRoot({
  value,
  onChange,
  children,
  safeAreaBottom = true,
  'aria-label': ariaLabel = 'Bottom navigation',
}: NavBarProps) {
  const bottomInset = safeAreaBottom ? getSafeAreaBottom() : 0;

  return (
    <NavBarContext.Provider value={{ value, onChange }}>
      <View
        accessibilityRole="tablist"
        accessibilityLabel={ariaLabel}
        style={{
          flexDirection: 'row' as const,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: bottomInset,
        }}
      >
        {children}
      </View>
    </NavBarContext.Provider>
  );
}

export const NavBar = Object.assign(NavBarRoot, { Item: NavBarItem });
