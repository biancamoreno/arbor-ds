import React from 'react';
import { Clickable } from '../../core';
import { mergeRefs } from '../../../ecosystem/utils/functions';
import { usePopoverContext } from '../context/popover-context';
import type { PopoverTriggerProps } from '../interfaces/PopoverProps';

type AnyProps = Record<string, unknown> & { ref?: React.Ref<HTMLElement> };

export function PopoverTrigger({ children, asChild = false }: PopoverTriggerProps) {
  const { isOpen, close, open, titleId, triggerRef } = usePopoverContext();

  const child = children as React.ReactElement<AnyProps>;
  const childOnClick = (child.props as AnyProps).onClick as ((e: React.MouseEvent) => void) | undefined;

  const onClick = (e: React.MouseEvent) => {
    childOnClick?.(e);
    if (isOpen) close();
    else open();
  };

  const triggerProps: AnyProps = {
    'aria-haspopup': 'dialog',
    'aria-expanded': isOpen,
    'aria-controls': titleId,
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
