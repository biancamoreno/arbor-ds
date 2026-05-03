import React from 'react';
import { Clickable } from '../../core';
import { useDrawerContext } from '../context/drawer-context';
import type { DrawerTriggerProps } from '../interfaces/DrawerProps';

type AnyProps = Record<string, unknown>;

export function DrawerTrigger({ children, asChild = false }: DrawerTriggerProps) {
  const { setOpen } = useDrawerContext();
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
