import React from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useDrawerContext } from '../context/drawer-context';
import type { DrawerCloseProps } from '../interfaces/DrawerProps';

type AnyProps = Record<string, unknown>;

export function DrawerClose({ children, label = 'Fechar' }: DrawerCloseProps) {
  const { close } = useDrawerContext();
  const theme = useTheme();

  if (children) {
    return React.cloneElement(children as React.ReactElement<AnyProps>, { onClick: close });
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={close}
      style={{
        border: 'none',
        background: 'transparent',
        color: theme.colors.text.secondary,
        cursor: 'pointer',
        fontSize: theme.fontSizes.medium,
        lineHeight: 1,
        padding: 0,
      }}
    >
      ✕
    </button>
  );
}
