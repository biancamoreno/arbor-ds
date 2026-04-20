import React from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { usePopoverContext } from '../context/popover-context';
import type { PopoverCloseProps } from '../interfaces/PopoverProps';

type AnyProps = Record<string, unknown>;

export function PopoverClose({ children, label = 'Fechar' }: PopoverCloseProps) {
  const { close } = usePopoverContext();
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
