import { useEffect, useRef, useState } from 'react';
import { Portal } from '../../../ecosystem/primitives';
import { Box } from '../../core';
import { transition } from '../../../ecosystem/utils/functions';
import { useDrawerContext } from '../context/drawer-context';
import type { DrawerOverlayProps } from '../interfaces/DrawerProps';

export function DrawerOverlay({ style }: DrawerOverlayProps) {
  const { isOpen, close } = useDrawerContext();

  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      frameRef.current = requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <Portal>
      <Box
        aria-hidden="true"
        onClick={close}
        position="fixed"
        zIndex="overlay"
        backgroundColor="background.overlay"
        opacity={visible ? 1 : 0}
        style={{
          inset: 0,
          transition: transition(['opacity'], 'normal'),
          ...style,
        }}
      />
    </Portal>
  );
}
