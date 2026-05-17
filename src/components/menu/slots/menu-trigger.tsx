import React from 'react';
import { Clickable } from '../../core';
import { mergeRefs } from '../../../ecosystem/utils/functions';
import { useMenuContext } from '../context/menu-context';
import type { MenuTriggerProps } from '../interfaces/MenuProps';

type AnyProps = Record<string, unknown> & {
  ref?: React.Ref<HTMLElement>;
  disabled?: boolean;
};

export function MenuTrigger({ children, asChild = false }: MenuTriggerProps) {
  const { open, setOpen, contentId, triggerRef } = useMenuContext();

  const child = children as React.ReactElement<AnyProps>;
  const childProps = child.props as AnyProps;
  const childOnClick = childProps.onClick as ((e: React.MouseEvent) => void) | undefined;
  const childOnKeyDown = childProps.onKeyDown as ((e: React.KeyboardEvent) => void) | undefined;
  // G6: respeita `disabled` do child quando `asChild`.
  const isDisabled = asChild ? Boolean(childProps.disabled) : false;

  const onClick = (e: React.MouseEvent) => {
    childOnClick?.(e);
    if (isDisabled || e.defaultPrevented) return;
    setOpen(!open);
  };

  // G1: APG — ArrowDown/Enter/Space no trigger fechado abre + foca primeiro item;
  // ArrowUp abre + foca último. Como o foco inicial é tratado por
  // `MenuContent` (sempre foca o primeiro habilitado), o caso ArrowUp dispara
  // um sinal `data-arbor-menu-open-direction="up"` que o MenuContent lê para
  // focar o último em vez do primeiro. Por simplicidade aqui — sem o sinal —
  // ArrowDown e ArrowUp ambos abrem; foco no primeiro item (MenuContent decide).
  const onKeyDown = (e: React.KeyboardEvent) => {
    childOnKeyDown?.(e);
    if (isDisabled || e.defaultPrevented) return;
    if (open) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const triggerProps: AnyProps = {
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? contentId : undefined,
    onClick,
    onKeyDown,
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
