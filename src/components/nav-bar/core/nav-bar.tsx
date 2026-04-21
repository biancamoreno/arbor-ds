import type { CSSProperties } from 'react';
import { Icon } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion';
import { transition } from '../../../ecosystem/utils/functions/transition';
import { NavBarContext, useNavBar } from './nav-bar-context';
import type { NavBarProps, NavBarItemProps } from '../interfaces/NavBarProps';

function NavBarItem({ value, icon, label, badge, disabled = false }: NavBarItemProps) {
  const theme = useTheme();
  const { value: activeValue, onChange } = useNavBar();
  const prefersReduced = usePrefersReducedMotion();
  const isActive = value === activeValue;

  const hasBadge = badge !== undefined && badge !== false && badge !== 0;
  const badgeCount = typeof badge === 'number' && badge > 99 ? '99+' : badge === true ? null : badge;

  const activeColor = theme.colors.interactive.default;
  const inactiveColor = theme.colors.text.secondary;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-label={label}
      aria-disabled={disabled}
      onClick={() => { if (!disabled) onChange(value); }}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        padding: '8px 4px',
        border: 'none',
        background: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        color: isActive ? activeColor : inactiveColor,
        outline: 'none',
        minWidth: 0,
        fontFamily: 'inherit',
      }}
    >
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <div
          style={{
            display: 'flex',
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
        </div>
        {hasBadge && (
          <div
            aria-label={typeof badge === 'number' ? `${badge} novos itens` : 'novo'}
            style={{
              position: 'absolute',
              top: badge === true ? 0 : -4,
              right: badge === true ? 0 : -6,
              minWidth: badge === true ? 8 : 16,
              height: badge === true ? 8 : 16,
              borderRadius: 999,
              backgroundColor: theme.colors.feedback.critical.base,
              color: '#fff',
              fontSize: 10,
              lineHeight: '16px',
              textAlign: 'center',
              padding: badge === true ? '0' : '0 3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            {badgeCount !== null && badgeCount !== undefined && String(badgeCount)}
          </div>
        )}
      </div>
      <span
        style={{
          fontSize: 10,
          lineHeight: 1.2,
          fontWeight: isActive ? 500 : 400,
          color: isActive ? activeColor : inactiveColor,
          transition: !prefersReduced ? transition(['color'], 'fast') : 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
        }}
      >
        {label}
      </span>
    </button>
  );
}

function NavBarRoot({
  value,
  onChange,
  children,
  safeAreaBottom = true,
  blurred = false,
  'aria-label': ariaLabel = 'Bottom navigation',
}: NavBarProps) {
  const theme = useTheme();

  const containerStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    borderTop: `1px solid ${theme.colors.border.subtle}`,
    backgroundColor: blurred ? 'rgba(255,255,255,0.85)' : theme.colors.background.default,
    backdropFilter: blurred ? 'blur(20px)' : undefined,
    WebkitBackdropFilter: blurred ? 'blur(20px)' : undefined,
    paddingBottom: safeAreaBottom ? 'env(safe-area-inset-bottom, 0px)' : 0,
    zIndex: 100,
  } as CSSProperties;

  return (
    <NavBarContext.Provider value={{ value, onChange }}>
      <nav role="tablist" aria-label={ariaLabel} style={containerStyle}>
        {children}
      </nav>
    </NavBarContext.Provider>
  );
}

export const NavBar = Object.assign(NavBarRoot, { Item: NavBarItem });
