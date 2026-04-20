import React from 'react';
import { Portal, DismissableLayer } from '../../../ecosystem/primitives';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useMenuContext } from '../context/menu-context';
import type { MenuContentProps } from '../interfaces/MenuProps';

export function MenuContent({ children, label }: MenuContentProps) {
  const { isOpen, close, setActiveIndex, activeIndex, itemCount } = useMenuContext();
  const theme = useTheme();

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
        <ul
          role="menu"
          aria-label={label}
          onKeyDown={handleKeyDown}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: theme.zIndices.popover,
            minWidth: '180px',
            margin: 0,
            padding: `${theme.space.tiny} 0`,
            listStyle: 'none',
            borderRadius: theme.radii.medium,
            backgroundColor: theme.colors.surface.raised,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            outline: 'none',
          }}
        >
          {children}
        </ul>
      </DismissableLayer>
    </Portal>
  );
}
