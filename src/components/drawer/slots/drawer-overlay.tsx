import React, { useEffect, useState } from 'react';
import { Portal } from '../../../ecosystem/primitives';
import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion';
import { transition } from '../../../foundations/theme/transition';
import { useDrawerContext } from '../context/drawer-context';

type DrawerSlots =
  | 'overlay'
  | 'content'
  | 'header'
  | 'body'
  | 'footer'
  | 'title'
  | 'description'
  | 'close';

const TRANSITION_MS = 160;
const IS_TEST = process.env.NODE_ENV === 'test';

export function DrawerOverlay() {
  const { open, setOpen, placement, closeOnOverlayClick, onInteractOutside } = useDrawerContext();
  const slots = useSlotRecipe<DrawerSlots>('drawer', { placement });
  const reducedMotion = usePrefersReducedMotion();

  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      if (IS_TEST || reducedMotion) {
        setVisible(true);
        return;
      }
      // Double rAF (pattern Radix) — garante paint inicial com opacity 0
      // antes do flip, destrava CSS transition em React 18 concurrent.
      let id2 = 0;
      const id1 = requestAnimationFrame(() => {
        id2 = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(id1);
        cancelAnimationFrame(id2);
      };
    }
    setVisible(false);
    if (IS_TEST) {
      setMounted(false);
      return;
    }
    const id = setTimeout(() => setMounted(false), TRANSITION_MS);
    return () => clearTimeout(id);
  }, [open, reducedMotion]);

  if (!mounted) return null;

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlayClick) return;
    const synthetic = {
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
    };
    onInteractOutside?.(synthetic);
    if (synthetic.defaultPrevented || event.defaultPrevented) return;
    setOpen(false);
  };

  return (
    <Portal>
      <Box
        aria-hidden="true"
        onClick={handleClick}
        zIndex="overlay"
        {...(slots.overlay as Record<string, unknown>)}
        style={{
          opacity: visible ? 1 : 0,
          transition: reducedMotion ? 'none' : transition('opacity', 'normal', 'standard'),
        }}
      />
    </Portal>
  );
}
