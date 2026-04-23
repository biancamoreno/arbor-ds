import React from 'react';
import { Clickable } from '../../core';
import { usePopoverContext } from '../context/popover-context';
import type { PopoverTriggerProps } from '../interfaces/PopoverProps';

type AnyProps = Record<string, unknown>;

export function PopoverTrigger({ children, asChild = false }: PopoverTriggerProps) {
  const { open, isOpen, titleId } = usePopoverContext();

  const child = children as React.ReactElement<AnyProps>;
  const childOnClick = child.props.onClick as ((e: React.MouseEvent) => void) | undefined;

  const triggerProps: AnyProps = {
    'aria-haspopup': 'dialog',
    'aria-expanded': isOpen,
    'aria-controls': titleId,
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
