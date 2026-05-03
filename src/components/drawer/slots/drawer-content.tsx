import React, { useEffect, useRef, useState } from 'react';
import { Portal, FocusScope, DismissableLayer } from '../../../ecosystem/primitives';
import { Flex } from '../../core';
import { transition } from '../../../ecosystem/utils/functions';
import { useDrawerContext } from '../context/drawer-context';
import type { DrawerContentProps } from '../interfaces/DrawerProps';
import type { DrawerPlacement } from '../context/drawer-context';

const widthMap = { small: '320px', medium: '420px', large: '560px' } as const;
const heightMap = { small: '240px', medium: '320px', large: '420px' } as const;

function getPanelStyle(placement: DrawerPlacement, size: NonNullable<DrawerContentProps['size']>): React.CSSProperties {
  const shared: React.CSSProperties = { position: 'fixed', display: 'flex', flexDirection: 'column', outline: 'none' };

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

const SLIDE_HIDDEN: Record<DrawerPlacement, string> = {
  right: 'translateX(100%)',
  left: 'translateX(-100%)',
  bottom: 'translateY(100%)',
  top: 'translateY(-100%)',
};

export function DrawerContent({ children, size = 'medium' }: DrawerContentProps) {
  const { open, setOpen, placement, titleId } = useDrawerContext();

  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (open) {
      setMounted(true);
      frameRef.current = requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [open]);

  if (!mounted) return null;

  return (
    <Portal>
      <DismissableLayer onDismiss={() => setOpen(false)} disableOutsideClick>
        <FocusScope trapped autoFocus restoreFocus>
          <Flex
            as="aside"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            zIndex="modal"
            gap="small"
            padding="large"
            backgroundColor="surface.raised"
            boxShadow="xl"
            style={{
              ...getPanelStyle(placement, size),
              transform: visible ? 'translate(0)' : SLIDE_HIDDEN[placement],
              transition: transition(['transform'], 'normal', 'decelerate'),
            }}
          >
            {children}
          </Flex>
        </FocusScope>
      </DismissableLayer>
    </Portal>
  );
}
