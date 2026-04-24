import React from 'react';
import { Clickable } from '../../core';
import { useDialogContext } from '../context/dialog-context';
import type { DialogTriggerProps } from '../interfaces/DialogProps';

type AnyProps = Record<string, unknown>;

export function DialogTrigger({ children, asChild = false }: DialogTriggerProps) {
  const { setOpen } = useDialogContext();
  const handleOpen = () => setOpen(true);

  if (asChild) {
    const child = children as React.ReactElement<AnyProps>;
    const childOnClick = child.props.onClick as ((e: React.MouseEvent) => void) | undefined;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        childOnClick?.(e);
        handleOpen();
      },
    });
  }

  return (
    <Clickable as="button" type="button" onClick={handleOpen}>
      {children}
    </Clickable>
  );
}
