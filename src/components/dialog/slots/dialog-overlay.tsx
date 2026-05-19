import React, { useEffect, useState } from 'react';
import { Portal } from '../../../ecosystem/primitives';
import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion';
import { transition } from '../../../foundations/theme/transition';
import { useDialogContext } from '../context/dialog-context';

type DialogSlots =
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

export function DialogOverlay() {
  const { open, setOpen, closeOnOverlayClick, onInteractOutside } = useDialogContext();
  const slots = useSlotRecipe<DialogSlots>('dialog', {});
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
      // Double rAF: React 18 concurrent pode batchar mount + setVisible num
      // único commit, fazendo o browser nunca ver `opacity:0` e a transition
      // não disparar. Dois rAFs garantem ao menos um frame com `opacity:0`
      // antes de flipar para `1`. Pattern Radix UI.
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
    // Evento sintético com `defaultPrevented` mutável: consumer pode chamar
    // `preventDefault()` no `onInteractOutside` para impedir o fechamento.
    const synthetic = {
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
    };
    onInteractOutside?.(synthetic);
    // Também respeita o preventDefault do evento nativo (consumer avançado).
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
