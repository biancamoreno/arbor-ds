import React from 'react';
import { Clickable, Icon } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { usePopoverContext } from '../context/popover-context';
import type { PopoverCloseProps } from '../interfaces/PopoverProps';

type AnyProps = Record<string, unknown>;
type PopoverSlots = 'content' | 'close';

export function PopoverClose({ children, accessibilityLabel = 'Fechar' }: PopoverCloseProps) {
  const { setOpen } = usePopoverContext();
  const slots = useSlotRecipe<PopoverSlots>('popover', {});
  const handleClose = () => setOpen(false);

  if (children) {
    return React.cloneElement(children as React.ReactElement<AnyProps>, { onClick: handleClose });
  }

  return (
    <Clickable
      as="button"
      type="button"
      aria-label={accessibilityLabel}
      onClick={handleClose}
      {...(slots.close as Record<string, unknown>)}
    >
      <Icon name="X" size="small" decorative />
    </Clickable>
  );
}
