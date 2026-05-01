import React from 'react';
import { Clickable } from '../../core';
import { mergeRefs } from '../../../ecosystem/utils/functions';
import { useMenuContext } from '../context/menu-context';
import type { MenuTriggerProps } from '../interfaces/MenuProps';

type AnyProps = Record<string, unknown> & { ref?: React.Ref<HTMLElement> };

export function MenuTrigger({ children, asChild = false }: MenuTriggerProps) {
  const { isOpen, open, close, triggerRef } = useMenuContext();

  const child = children as React.ReactElement<AnyProps>;
  const childOnClick = (child.props as AnyProps).onClick as ((e: React.MouseEvent) => void) | undefined;

  const onClick = (e: React.MouseEvent) => {
    childOnClick?.(e);
    if (isOpen) close();
    else open();
  };

  const triggerProps: AnyProps = {
    'aria-haspopup': 'menu',
    'aria-expanded': isOpen,
    onClick,
  };

  if (asChild) {
    const childRef = (child as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref;
    return React.cloneElement(child, {
      ...triggerProps,
      ref: mergeRefs<HTMLElement>(triggerRef, childRef),
    } as AnyProps);
  }

  return (
    <Clickable as="button" type="button" {...triggerProps} innerRef={triggerRef}>
      {children}
    </Clickable>
  );
}
