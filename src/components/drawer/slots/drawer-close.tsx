import React from 'react';
import { Clickable } from '../../core';
import { useDrawerContext } from '../context/drawer-context';
import type { DrawerCloseProps } from '../interfaces/DrawerProps';

type AnyProps = Record<string, unknown>;

export function DrawerClose({ children, label = 'Fechar' }: DrawerCloseProps) {
  const { setOpen } = useDrawerContext();
  const handleClose = () => setOpen(false);

  if (children) {
    return React.cloneElement(children as React.ReactElement<AnyProps>, { onClick: handleClose });
  }

  return (
    <Clickable
      as="button"
      type="button"
      aria-label={label}
      onClick={handleClose}
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
