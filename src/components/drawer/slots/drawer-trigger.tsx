import React from 'react';
import { useDrawerContext } from '../context/drawer-context';
import type { DrawerTriggerProps } from '../interfaces/DrawerProps';

type AnyProps = Record<string, unknown>;

export function DrawerTrigger({ children, asChild = false }: DrawerTriggerProps) {
  const { open } = useDrawerContext();

  if (asChild) {
    const child = children as React.ReactElement<AnyProps>;
    const childOnClick = child.props.onClick as ((e: React.MouseEvent) => void) | undefined;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        childOnClick?.(e);
        open();
      },
    });
  }

  return (
    <button type="button" onClick={open}>
      {children}
    </button>
  );
}
