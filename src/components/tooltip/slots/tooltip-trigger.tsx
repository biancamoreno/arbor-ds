import React from 'react';
import { Box } from '../../core';
import { mergeRefs } from '../../../ecosystem/utils/functions';
import { useTooltipContext } from '../context/tooltip-context';

type TooltipTriggerProps = {
  children: React.ReactElement;
  asChild?: boolean;
};

type AnyProps = Record<string, unknown> & { ref?: React.Ref<HTMLElement> };

export function TooltipTrigger({ children, asChild = true }: TooltipTriggerProps) {
  const { setOpen, tooltipId, triggerRef } = useTooltipContext();

  const child = children as React.ReactElement<AnyProps>;

  const triggerProps: AnyProps = {
    'aria-describedby': tooltipId,
    onMouseEnter: (e: React.MouseEvent) => {
      (child.props.onMouseEnter as ((e: React.MouseEvent) => void) | undefined)?.(e);
      setOpen(true);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      (child.props.onMouseLeave as ((e: React.MouseEvent) => void) | undefined)?.(e);
      setOpen(false);
    },
    onFocus: (e: React.FocusEvent) => {
      (child.props.onFocus as ((e: React.FocusEvent) => void) | undefined)?.(e);
      setOpen(true);
    },
    onBlur: (e: React.FocusEvent) => {
      (child.props.onBlur as ((e: React.FocusEvent) => void) | undefined)?.(e);
      setOpen(false);
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
