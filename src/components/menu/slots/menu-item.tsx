import React, { useEffect, useRef } from 'react';
import { Flex } from '../../core';
import { useMenuContext } from '../context/menu-context';
import type { MenuItemProps } from '../interfaces/MenuProps';

export function MenuItem({ children, onSelect, disabled = false }: MenuItemProps) {
  const { setOpen, activeIndex, setActiveIndex, registerItem } = useMenuContext();
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
      setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onSelect?.();
      setOpen(false);
    }
  };

  const handleFocus = () => {
    if (indexRef.current !== -1) {
      setActiveIndex(indexRef.current);
    }
  };

  return (
    <Flex
      as="li"
      innerRef={itemRef}
      role="menuitem"
      aria-disabled={disabled || undefined}
      tabIndex={isActive ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      alignItems="center"
      paddingX="small"
      paddingY="tiny"
      fontSize="small"
      color={disabled ? 'text.disabled' : 'text.primary'}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      outline="none"
    >
      {children}
    </Flex>
  );
}
