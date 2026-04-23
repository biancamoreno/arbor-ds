import React from 'react';
import { Portal, DismissableLayer } from '../../../ecosystem/primitives';
import { Box } from '../../core';
import { useMenuContext } from '../context/menu-context';
import type { MenuContentProps } from '../interfaces/MenuProps';

export function MenuContent({ children, label }: MenuContentProps) {
  const { isOpen, close, setActiveIndex, activeIndex, itemCount } = useMenuContext();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((activeIndex + 1) % itemCount);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((activeIndex - 1 + itemCount) % itemCount);
    } else if (e.key === 'Tab') {
      close();
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <DismissableLayer onDismiss={close}>
        <Box
          as="ul"
          role="menu"
          aria-label={label}
          onKeyDown={handleKeyDown}
          position="fixed"
          zIndex="popover"
          borderRadius="medium"
          backgroundColor="surface.raised"
          paddingY="tiny"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '180px',
            margin: 0,
            listStyle: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            outline: 'none',
          }}
        >
          {children}
        </Box>
      </DismissableLayer>
    </Portal>
  );
}
