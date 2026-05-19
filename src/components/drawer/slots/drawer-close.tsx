import React from 'react';
import { Clickable, Icon } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useDrawerContext } from '../context/drawer-context';
import type { DrawerCloseProps } from '../interfaces/DrawerProps';

type DrawerSlots =
  | 'overlay'
  | 'content'
  | 'header'
  | 'body'
  | 'footer'
  | 'title'
  | 'description'
  | 'close';

type ChildClickProps = { onClick?: (event: React.MouseEvent) => void };

export function DrawerClose({ children, accessibilityLabel = 'Fechar' }: DrawerCloseProps) {
  const { setOpen } = useDrawerContext();
  const slots = useSlotRecipe<DrawerSlots>('drawer', {});

  if (children) {
    const child = children as React.ReactElement<ChildClickProps>;
    const childOnClick = child.props.onClick;
    return React.cloneElement(child, {
      onClick: (event: React.MouseEvent) => {
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
