import React, { useEffect, useRef, useState } from 'react';
import { Portal, FocusScope, DismissableLayer } from '../../../ecosystem/primitives';
import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion';
import { transition } from '../../../foundations/theme/transition';
import { useDrawerContext } from '../context/drawer-context';
import type { DrawerPlacement } from '../context/drawer-context';
import type { DrawerContentProps } from '../interfaces/DrawerProps';

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

const SLIDE_HIDDEN: Record<DrawerPlacement, string> = {
  right: 'translateX(100%)',
  left: 'translateX(-100%)',
  bottom: 'translateY(100%)',
  top: 'translateY(-100%)',
};

export function DrawerContent({ children, size = 'medium' }: DrawerContentProps) {
  const {
    open,
    setOpen,
    placement,
    contentId,
    titleId,
    descriptionId,
    accessibilityLabel,
    role,
    initialFocusRef,
    closeOnEscape,
    onEscapeKeyDown,
  } = useDrawerContext();
  const slots = useSlotRecipe<DrawerSlots>('drawer', { size, placement });
  const reducedMotion = usePrefersReducedMotion();

  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      if (IS_TEST || reducedMotion) {
        setVisible(true);
        return;
      }
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

  const transformStr = reducedMotion || visible ? 'translate(0)' : SLIDE_HIDDEN[placement];

  return (
    <Portal>
      <DismissableLayer
        onDismiss={() => setOpen(false)}
        onEscapeKeyDown={onEscapeKeyDown}
        disableEscapeKey={!closeOnEscape}
        // Outside-click é responsabilidade do `<Drawer.Overlay />` (scrim
        // pinta e captura o pointer). Aqui desabilitamos para não disparar
        // o dismiss duas vezes.
        disableOutsideClick
      >
        <FocusScope trapped autoFocus restoreFocus initialFocus={initialFocusRef}>
          <Box
            as="aside"
            id={contentId}
            role={role}
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            aria-label={accessibilityLabel}
            innerRef={contentRef as React.RefObject<HTMLDivElement>}
            zIndex="modal"
            {...(slots.content as Record<string, unknown>)}
            style={{
              // `box-sizing: border-box` vital — sem isso, height alvo + padding
              // ultrapassam a dimensão (footer sai do viewport). Não dependemos
              // de reset CSS global do consumer (pattern nav-bar/tab-bar/select).
              boxSizing: 'border-box',
              transform: transformStr,
              transition: reducedMotion ? 'none' : transition(['transform'], 'normal', 'standard'),
            }}
          >
            {children}
          </Box>
        </FocusScope>
      </DismissableLayer>
    </Portal>
  );
}
