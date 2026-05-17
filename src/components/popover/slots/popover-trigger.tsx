import React from 'react';
import { Box } from '../../core';
import { mergeRefs } from '../../../ecosystem/utils/functions';
import { usePopoverContext } from '../context/popover-context';
import type { PopoverTriggerProps } from '../interfaces/PopoverProps';

type AnyProps = Record<string, unknown> & { ref?: React.Ref<HTMLElement> };

export function PopoverTrigger({ children, asChild = true }: PopoverTriggerProps) {
  const { open, setOpen, contentId, triggerRef } = usePopoverContext();

  const child = children as React.ReactElement<AnyProps>;
  const childOnClick = (child.props as AnyProps).onClick as ((e: React.MouseEvent) => void) | undefined;

  const triggerProps: AnyProps = {
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': contentId,
    onClick: (e: React.MouseEvent) => {
      childOnClick?.(e);
      setOpen(!open);
    },
  };

  if (asChild) {
    const childRef = (child as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref;
    return React.cloneElement(child, {
      ...triggerProps,
      ref: mergeRefs<HTMLElement>(triggerRef, childRef),
    } as AnyProps);
  }

  return (
    <Box as="span" display="inline-flex" innerRef={triggerRef} {...(triggerProps as Record<string, unknown>)}>
      {children}
    </Box>
  );
}
