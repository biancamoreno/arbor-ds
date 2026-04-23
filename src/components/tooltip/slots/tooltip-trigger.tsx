import React from 'react';
import { Box } from '../../core';
import { useTooltipContext } from '../context/tooltip-context';

type TooltipTriggerProps = {
  children: React.ReactElement;
  asChild?: boolean;
};

type AnyProps = Record<string, unknown>;

export function TooltipTrigger({ children, asChild = true }: TooltipTriggerProps) {
  const { open, close, tooltipId } = useTooltipContext();

  const child = children as React.ReactElement<AnyProps>;

  const triggerProps: AnyProps = {
    'aria-describedby': tooltipId,
    onMouseEnter: (e: React.MouseEvent) => {
      (child.props.onMouseEnter as ((e: React.MouseEvent) => void) | undefined)?.(e);
      open();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      (child.props.onMouseLeave as ((e: React.MouseEvent) => void) | undefined)?.(e);
      close();
    },
    onFocus: (e: React.FocusEvent) => {
      (child.props.onFocus as ((e: React.FocusEvent) => void) | undefined)?.(e);
      open();
    },
    onBlur: (e: React.FocusEvent) => {
      (child.props.onBlur as ((e: React.FocusEvent) => void) | undefined)?.(e);
      close();
    },
  };

  if (asChild) {
    return React.cloneElement(child, triggerProps);
  }

  return (
    <Box as="span" display="inline-flex" {...(triggerProps as Record<string, unknown>)}>
      {children}
    </Box>
  );
}
