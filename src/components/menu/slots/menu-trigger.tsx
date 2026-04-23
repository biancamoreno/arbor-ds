import React from 'react';
import { Clickable } from '../../core';
import { useMenuContext } from '../context/menu-context';
import type { MenuTriggerProps } from '../interfaces/MenuProps';

type AnyProps = Record<string, unknown>;

export function MenuTrigger({ children, asChild = false }: MenuTriggerProps) {
  const { open, isOpen } = useMenuContext();

  const child = children as React.ReactElement<AnyProps>;
  const childOnClick = child.props.onClick as ((e: React.MouseEvent) => void) | undefined;

  const triggerProps: AnyProps = {
    'aria-haspopup': 'menu',
    'aria-expanded': isOpen,
    onClick: (e: React.MouseEvent) => {
      childOnClick?.(e);
      open();
    },
  };

  if (asChild) {
    return React.cloneElement(child, triggerProps);
  }

  return (
    <Clickable as="button" type="button" {...triggerProps}>
      {children}
    </Clickable>
  );
}
