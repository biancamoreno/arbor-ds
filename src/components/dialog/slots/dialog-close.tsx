import React from 'react';
import { Clickable, Icon } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useDialogContext } from '../context/dialog-context';
import type { DialogCloseProps } from '../interfaces/DialogProps';

type DialogSlots = 'overlay' | 'content' | 'title' | 'description' | 'close';
type ChildClickProps = { onClick?: (event: React.MouseEvent) => void };

export function DialogClose({ children, accessibilityLabel = 'Fechar' }: DialogCloseProps) {
  const { setOpen } = useDialogContext();
  const slots = useSlotRecipe<DialogSlots>('dialog', {});

  if (children) {
    const child = children as React.ReactElement<ChildClickProps>;
    const childOnClick = child.props.onClick;
    return React.cloneElement(child, {
      onClick: (event: React.MouseEvent) => {
        // Compor: chama o handler original do filho ANTES de fechar. Se o
        // filho fizer `event.preventDefault()`, o dialog não fecha — útil
        // para "Salvar e fechar" decidirem dinamicamente.
        childOnClick?.(event);
        if (event.defaultPrevented) return;
        setOpen(false);
      },
    });
  }

  return (
    <Clickable
      as="button"
      type="button"
      onClick={() => setOpen(false)}
      aria-label={accessibilityLabel}
      {...(slots.close as Record<string, unknown>)}
    >
      <Icon name="X" size="small" decorative />
    </Clickable>
  );
}
