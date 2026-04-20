import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useMenuContext } from '../context/menu-context';
import type { MenuItemProps } from '../interfaces/MenuProps';

export function MenuItem({ children, onSelect, disabled = false }: MenuItemProps) {
  const { close, activeIndex, setActiveIndex, registerItem } = useMenuContext();
  const theme = useTheme();
  const indexRef = useRef<number>(-1);
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    indexRef.current = registerItem();
  }, [registerItem]);

  const isActive = activeIndex === indexRef.current;

  useEffect(() => {
    if (isActive && itemRef.current) {
      itemRef.current.focus();
    }
  }, [isActive]);

  const handleClick = () => {
    if (!disabled) {
      onSelect?.();
      close();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onSelect?.();
      close();
    }
  };

  const handleFocus = () => {
    if (indexRef.current !== -1) {
      setActiveIndex(indexRef.current);
    }
  };

  return (
    <li
      ref={itemRef}
      role="menuitem"
      aria-disabled={disabled || undefined}
      tabIndex={isActive ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: `${theme.space.tiny} ${theme.space.small}`,
        fontSize: theme.fontSizes.small,
        color: disabled ? theme.colors.text.disabled : theme.colors.text.primary,
        cursor: disabled ? 'not-allowed' : 'pointer',
        outline: 'none',
      }}
    >
      {children}
    </li>
  );
}
