import React from 'react';
import { Portal, FocusScope, DismissableLayer } from '../../../ecosystem/primitives';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useDrawerContext } from '../context/drawer-context';
import type { DrawerContentProps } from '../interfaces/DrawerProps';
import type { DrawerPlacement } from '../context/drawer-context';

const widthMap = { sm: '320px', md: '420px', lg: '560px' } as const;
const heightMap = { sm: '240px', md: '320px', lg: '420px' } as const;

function getPanelStyle(placement: DrawerPlacement, size: NonNullable<DrawerContentProps['size']>): React.CSSProperties {
  const shared: React.CSSProperties = {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    outline: 'none',
  };

  if (placement === 'bottom') {
    return { ...shared, bottom: 0, left: 0, right: 0, width: '100%', height: heightMap[size], borderRadius: '24px 24px 0 0' };
  }
  if (placement === 'top') {
    return { ...shared, top: 0, left: 0, right: 0, width: '100%', height: heightMap[size], borderRadius: '0 0 24px 24px' };
  }
  if (placement === 'left') {
    return { ...shared, left: 0, top: 0, bottom: 0, width: widthMap[size], height: '100%', borderRadius: '0 24px 24px 0' };
  }
  return { ...shared, right: 0, top: 0, bottom: 0, width: widthMap[size], height: '100%', borderRadius: '24px 0 0 24px' };
}

export function DrawerContent({ children, size = 'md' }: DrawerContentProps) {
  const { isOpen, close, placement, titleId } = useDrawerContext();
  const theme = useTheme();

  if (!isOpen) return null;

  return (
    <Portal>
      <DismissableLayer onDismiss={close} disableOutsideClick>
        <FocusScope trapped autoFocus restoreFocus>
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            style={{
              ...getPanelStyle(placement, size),
              zIndex: theme.zIndices.modal,
              gap: theme.space.small,
              padding: theme.space.large,
              backgroundColor: theme.colors.surface.raised,
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.16)',
            }}
          >
            {children}
          </aside>
        </FocusScope>
      </DismissableLayer>
    </Portal>
  );
}
