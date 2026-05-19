import React, { useEffect, useRef, useState } from 'react';
import { Portal, FocusScope, DismissableLayer } from '../../../ecosystem/primitives';
import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion';
import { transition } from '../../../foundations/theme/transition';
import { useDialogContext } from '../context/dialog-context';
import type { DialogContentProps } from '../interfaces/DialogProps';

type DialogSlots =
  | 'overlay'
  | 'content'
  | 'header'
  | 'body'
  | 'footer'
  | 'title'
  | 'description'
  | 'close';

// Régua sóbria — 160ms (motion.duration.normal), scale entrada 0.98→1, fade.
const TRANSITION_MS = 160;
const SCALE_FROM = 0.98;
const IS_TEST = process.env.NODE_ENV === 'test';

export function DialogContent({ children, size = 'medium' }: DialogContentProps) {
  const {
    open,
    setOpen,
    contentId,
    titleId,
    descriptionId,
    accessibilityLabel,
    role,
    initialFocusRef,
    closeOnEscape,
    onEscapeKeyDown,
  } = useDialogContext();
  const slots = useSlotRecipe<DialogSlots>('dialog', { size });
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
      // Double rAF: garante paint inicial com `opacity:0` + `scale(0.98)`
      // antes de flipar para o estado visível, destravando a CSS transition
      // em React 18 concurrent. Pattern Radix UI.
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

  const transitionStr = reducedMotion ? 'none' : transition(['opacity', 'transform'], 'normal', 'standard');
  const scale = reducedMotion || visible ? 1 : SCALE_FROM;

  return (
    <Portal>
      <DismissableLayer
        onDismiss={() => setOpen(false)}
        onEscapeKeyDown={onEscapeKeyDown}
        disableEscapeKey={!closeOnEscape}
        // Outside-click do Dialog é gerenciado pelo próprio `<Dialog.Overlay />`
        // (que pinta o scrim e absorve o pointer). Mantemos
        // `disableOutsideClick` em true aqui para não dispararmos o dismiss
        // duas vezes.
        disableOutsideClick
      >
        <FocusScope trapped autoFocus restoreFocus initialFocus={initialFocusRef}>
          <Box
            as="div"
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
              opacity: visible ? 1 : 0,
              transform: `translate(-50%, -50%) scale(${scale})`,
              transition: transitionStr,
              width: '90%',
            }}
          >
            {children}
          </Box>
        </FocusScope>
      </DismissableLayer>
    </Portal>
  );
}
