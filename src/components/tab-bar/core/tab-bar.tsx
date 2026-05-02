import type { CSSProperties } from 'react';
import { Clickable, Box, Flex, Text, Icon } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion';
import { transition } from '../../../ecosystem/utils/functions/transition';
import { TabBarContext, useTabBar } from './tab-bar-context';
import type { TabBarProps, TabBarItemProps } from '../interfaces/TabBarProps';

function TabBarItem({ value, icon, label, badge, disabled = false }: TabBarItemProps) {
  const theme = useTheme();
  const { value: activeValue, onChange } = useTabBar();
  const prefersReduced = usePrefersReducedMotion();
  const isActive = value === activeValue;

  const hasBadge = badge !== undefined && badge !== false && badge !== 0;
  const badgeCount = typeof badge === 'number' && badge > 99 ? '99+' : badge === true ? null : badge;

  const activeColor = theme.colors.interactive.default;
  const inactiveColor = theme.colors.text.secondary;

  return (
    <Clickable
      as="button"
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-label={label}
      aria-disabled={disabled}
      onClick={() => { if (!disabled) onChange(value); }}
      flex={1}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.4 : 1}
      outline="none"
      minWidth={0}
      style={{
        gap: 4,
        padding: '8px 4px',
        color: isActive ? activeColor : inactiveColor,
        fontFamily: 'inherit',
        background: 'transparent',
      }}
    >
      <Box position="relative" display="inline-flex">
        <Box
          display="flex"
          style={{
            transform: isActive ? 'scale(1.12)' : 'scale(1)',
            transition: !prefersReduced ? transition(['transform'], 'fast') : 'none',
          }}
        >
          <Icon
            name={icon}
            size={22}
            color={isActive ? activeColor : inactiveColor}
            decorative
          />
        </Box>
        {hasBadge && (
          <Flex
            aria-label={typeof badge === 'number' ? `${badge} novos itens` : 'novo'}
            position="absolute"
            alignItems="center"
            justifyContent="center"
            borderRadius="full"
            backgroundColor="feedback.critical.base"
            color="text.inverse"
            style={{
              top: badge === true ? 0 : -4,
              right: badge === true ? 0 : -6,
              minWidth: badge === true ? 8 : 16,
              height: badge === true ? 8 : 16,
              fontSize: 10,
              lineHeight: '16px',
              textAlign: 'center',
              padding: badge === true ? '0' : '0 3px',
              boxSizing: 'border-box',
            }}
          >
            {badgeCount !== null && badgeCount !== undefined && String(badgeCount)}
          </Flex>
        )}
      </Box>
      <Text
        as="span"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        style={{
          fontSize: 10,
          lineHeight: 1.2,
          fontWeight: isActive ? 500 : 400,
          color: isActive ? activeColor : inactiveColor,
          transition: !prefersReduced ? transition(['color'], 'fast') : 'none',
          overflow: 'hidden',
          maxWidth: '100%',
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
  blurred = false,
  'aria-label': ariaLabel = 'Bottom navigation',
}: TabBarProps) {
  const theme = useTheme();

  const containerStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    borderTop: `1px solid ${theme.colors.border.subtle}`,
    backgroundColor: blurred ? theme.colors.surface.translucent : theme.colors.background.default,
    backdropFilter: blurred ? 'blur(20px)' : undefined,
    WebkitBackdropFilter: blurred ? 'blur(20px)' : undefined,
    paddingBottom: safeAreaBottom ? 'env(safe-area-inset-bottom, 0px)' : 0,
    zIndex: 100,
  } as CSSProperties;

  return (
    <TabBarContext.Provider value={{ value, onChange }}>
      <Flex as="nav" role="tablist" aria-label={ariaLabel} alignItems="stretch" style={containerStyle}>
        {children}
      </Flex>
    </TabBarContext.Provider>
  );
}

/**
 * @platform shared
 *
 * Bottom tab bar — barra de navegação inferior (padrão mobile, mas também
 * usável em web). `TabBar.Root` controla `value` (item ativo) e
 * `onChange(value)`. `TabBar.Item` é cada aba clicável (ícone + label) com
 * `value` único; quando `value` casa com o do `Root`, fica ativa
 * (`aria-selected`). Em mobile, posicione fixo no rodapé via container do
 * app.
 *
 * @example
 * <TabBar value={tab} onChange={setTab}>
 *   <TabBar.Item value="home" icon="Home">Início</TabBar.Item>
 *   <TabBar.Item value="search" icon="Search">Buscar</TabBar.Item>
 *   <TabBar.Item value="profile" icon="User">Perfil</TabBar.Item>
 * </TabBar>
 *
 * @see {@link TabBarRootProps}
 */
export const TabBar = Object.assign(TabBarRoot, { Item: TabBarItem });
