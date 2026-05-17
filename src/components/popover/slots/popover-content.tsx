import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Portal, DismissableLayer, FocusScope } from '../../../ecosystem/primitives';
import { Box } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion';
import { usePopoverContext } from '../context/popover-context';
import {
  computePosition,
  resolvePlacement,
  clampPosition,
  getTransformOrigin,
  type PopoverPlacement,
  type Position,
} from '../utils/position';
import type { PopoverContentProps } from '../interfaces/PopoverProps';

type PopoverSlots = 'content' | 'close';

type ThemeWithPopover = {
  components?: { popover?: { offset?: number } };
};

const TRANSITION_MS = 120;
const SCALE_FROM = 0.97;
const IS_TEST = process.env.NODE_ENV === 'test';

export function PopoverContent({ children }: PopoverContentProps) {
  const { open, setOpen, contentId, triggerRef, placement: requestedPlacement, offset: offsetOverride, accessibilityLabel } = usePopoverContext();
  const theme = useTheme() as unknown as ThemeWithPopover;
  const slots = useSlotRecipe<PopoverSlots>('popover', {});
  const reducedMotion = usePrefersReducedMotion();

  const offset = offsetOverride ?? theme.components?.popover?.offset ?? 8;

  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState<PopoverPlacement>(requestedPlacement);
  const [position, setPosition] = useState<Position | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);

  // Monta/desmonta — `open=true` monta imediato; `open=false` agenda desmount
  // após a transição de saída (animada de volta a opacity 0).
  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    setVisible(false);
    if (IS_TEST) {
      setMounted(false);
      setPosition(null);
      return;
    }
    const id = setTimeout(() => {
      setMounted(false);
      setPosition(null);
    }, TRANSITION_MS);
    return () => clearTimeout(id);
  }, [open]);

  // Mede e posiciona — só libera `visible=true` quando a posição final foi
  // computada com `contentRef` medido. Isso evita o "chicote" (popover
  // aparecendo em posição parcial e snap depois). No 1º render `position`
  // continua null → `visibility:hidden` esconde o popover sem desmontar (ref
  // permanece pra medição).
  useLayoutEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    let raf = 0;

    function measureAndPosition() {
      if (cancelled) return;
      const trigger = triggerRef.current;
      const content = contentRef.current;
      // Sem trigger ainda — em test env (`defaultOpen` sem `<Popover.Trigger>`)
      // ou enquanto o Trigger não montou. Renderiza em (0,0) e libera visible
      // pra não travar; assim que o Trigger montar o efeito re-executa.
      if (!trigger || !content || typeof trigger.getBoundingClientRect !== 'function') {
        if (IS_TEST) {
          setPosition({ top: 0, left: 0 });
          setVisible(true);
          return;
        }
        raf = requestAnimationFrame(measureAndPosition);
        return;
      }

      const triggerRect = trigger.getBoundingClientRect();
      const size = { width: content.offsetWidth, height: content.offsetHeight };
      const hasSize = size.width > 0 && size.height > 0;

      if (!hasSize && !IS_TEST) {
        raf = requestAnimationFrame(measureAndPosition);
        return;
      }

      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const resolved = hasSize
        ? resolvePlacement(triggerRect, size, requestedPlacement, offset, viewport)
        : requestedPlacement;
      setPlacement(resolved);

      const raw = computePosition(triggerRect, size, resolved, offset);
      setPosition(hasSize ? clampPosition(raw, size, viewport) : raw);

      // Posição final pronta — libera fade-in no próximo frame para que o
      // browser pinte 1× em opacity:0 antes de animar pra opacity:1.
      if (IS_TEST) {
        setVisible(true);
      } else {
        raf = requestAnimationFrame(() => {
          if (!cancelled) setVisible(true);
        });
      }
    }

    function reposition() {
      if (cancelled) return;
      const trigger = triggerRef.current;
      const content = contentRef.current;
      if (!trigger || !content) return;
      const triggerRect = trigger.getBoundingClientRect();
      const size = { width: content.offsetWidth, height: content.offsetHeight };
      if (size.width === 0 || size.height === 0) return;
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const resolved = resolvePlacement(triggerRect, size, requestedPlacement, offset, viewport);
      setPlacement(resolved);
      setPosition(clampPosition(computePosition(triggerRect, size, resolved, offset), size, viewport));
    }

    measureAndPosition();
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, { passive: true, capture: true });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, { capture: true });
    };
  }, [mounted, requestedPlacement, offset, triggerRef]);

  if (!mounted) return null;

  const transitionStr = reducedMotion
    ? 'none'
    : `opacity ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
  const scale = reducedMotion || visible ? 1 : SCALE_FROM;

  return (
    <Portal>
      <DismissableLayer onDismiss={() => setOpen(false)} excludeRef={triggerRef}>
        <Box
          as="div"
          id={contentId}
          role="dialog"
          aria-modal={false}
          aria-label={accessibilityLabel}
          tabIndex={-1}
          zIndex="popover"
          innerRef={contentRef as React.RefObject<HTMLDivElement>}
          {...(slots.content as Record<string, unknown>)}
          style={{
            top: position?.top ?? 0,
            left: position?.left ?? 0,
            visibility: position ? 'visible' : 'hidden',
            opacity: visible ? 1 : 0,
            transformOrigin: getTransformOrigin(placement),
            transition: position ? transitionStr : 'none',
            transform: `scale(${scale})`,
          }}
        >
          <FocusScope restoreFocus>{children}</FocusScope>
        </Box>
      </DismissableLayer>
    </Portal>
  );
}
