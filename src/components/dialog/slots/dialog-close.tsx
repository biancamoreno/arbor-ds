import React from 'react';
import { Clickable } from '../../core';
import { useDialogContext } from '../context/dialog-context';
import type { DialogCloseProps } from '../interfaces/DialogProps';

type AnyProps = Record<string, unknown>;

export function DialogClose({ children, label = 'Fechar' }: DialogCloseProps) {
  const { setOpen } = useDialogContext();
  const close = () => setOpen(false);

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
