import React from 'react';
import { Clickable } from '../../core';
import { mergeRefs } from '../../../ecosystem/utils/functions';
import { useDrawerContext } from '../context/drawer-context';
import type { DrawerTriggerProps } from '../interfaces/DrawerProps';

type AnyProps = Record<string, unknown> & {
  ref?: React.Ref<HTMLElement>;
  disabled?: boolean;
};

export function DrawerTrigger({ children, asChild = false }: DrawerTriggerProps) {
  const { open, setOpen, contentId, triggerRef } = useDrawerContext();

  const child = children as React.ReactElement<AnyProps>;
  const childProps = child.props as AnyProps;
  const childOnClick = childProps.onClick as ((e: React.MouseEvent) => void) | undefined;
  const childOnKeyDown = childProps.onKeyDown as ((e: React.KeyboardEvent) => void) | undefined;
  const isDisabled = asChild ? Boolean(childProps.disabled) : false;

  const onClick = (e: React.MouseEvent) => {
    childOnClick?.(e);
    if (isDisabled || e.defaultPrevented) return;
    setOpen(true);
  };

  // Enter/Space ativam — button HTML já faz, cloneElement garante mesmo
  // quando o child é um wrapper customizado.
  const onKeyDown = (e: React.KeyboardEvent) => {
    childOnKeyDown?.(e);
    if (isDisabled || e.defaultPrevented || open) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const triggerProps: AnyProps = {
    'aria-haspopup': 'dialog',
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
