import React from 'react';
import { Clickable } from '../../core';
import { usePopoverContext } from '../context/popover-context';
import type { PopoverCloseProps } from '../interfaces/PopoverProps';

type AnyProps = Record<string, unknown>;

export function PopoverClose({ children, label = 'Fechar' }: PopoverCloseProps) {
  const { close } = usePopoverContext();

  if (children) {
    return React.cloneElement(children as React.ReactElement<AnyProps>, { onClick: close });
  }

  return (
    <Clickable
      as="button"
      type="button"
      aria-label={label}
      onClick={close}
      color="text.secondary"
      fontSize="medium"
      cursor="pointer"
      padding={0}
      backgroundColor="transparent"
      style={{ lineHeight: 1 }}
    >
      ✕
    </Clickable>
  );
}
