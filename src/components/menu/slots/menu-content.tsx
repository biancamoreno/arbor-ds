import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Portal, DismissableLayer, useRestoreFocus } from '../../../ecosystem/primitives';
import { Box } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion';
import { useMenuContext } from '../context/menu-context';
import {
  computePosition,
  resolvePlacement,
  clampPosition,
  getTransformOrigin,
  type MenuPlacement,
  type Position,
} from '../utils/position';
import type { MenuContentProps } from '../interfaces/MenuProps';

type MenuSlots = 'content' | 'item' | 'label' | 'separator';

type ThemeWithMenu = {
  components?: { menu?: { offset?: number } };
};

// Régua sóbria — 160ms (motion.duration.normal), scale entrada 0.98→1, fade.
const TRANSITION_MS = 160;
const SCALE_FROM = 0.98;
const IS_TEST = process.env.NODE_ENV === 'test';

const ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])';

function getEnabledItems(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
}

export function MenuContent({ children }: MenuContentProps) {
  const {
    open,
    setOpen,
    contentId,
    triggerRef,
    placement: requestedPlacement,
    offset: offsetOverride,
    accessibilityLabel,
  } = useMenuContext();
  const theme = useTheme() as unknown as ThemeWithMenu;
  const slots = useSlotRecipe<MenuSlots>('menu', {});
  const reducedMotion = usePrefersReducedMotion();

  const offset = offsetOverride ?? theme.components?.menu?.offset ?? 6;

  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState<MenuPlacement>(requestedPlacement);
  const [position, setPosition] = useState<Position | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);

  // Salva o foco que estava ativo antes do menu abrir e restaura no unmount.
  // Substitui `<FocusScope restoreFocus>` (que injetava `<div tabIndex={-1}>`
  // entre `role="menu"` e os `role="menuitem"`, quebrando a árvore ARIA).
  useRestoreFocus(mounted);

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

  useLayoutEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    let raf = 0;

    function measureAndPosition() {
      if (cancelled) return;
      const trigger = triggerRef.current;
      const content = contentRef.current;
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

  // Foco inicial — após mount + items renderizados, foca o primeiro habilitado.
  // Pular para a próxima task da fila garante que filhos `Menu.Item` tenham
  // sido inseridos no DOM (alguns React internals montam children após o
  // useLayoutEffect do parent).
  useEffect(() => {
    if (!mounted) return;
    const focusFirst = () => {
      const items = getEnabledItems(contentRef.current);
      items[0]?.focus();
    };
    if (IS_TEST) {
      focusFirst();
      return;
    }
    const id = window.requestAnimationFrame(focusFirst);
    return () => window.cancelAnimationFrame(id);
  }, [mounted]);

  const moveFocus = useCallback((delta: number) => {
    const items = getEnabledItems(contentRef.current);
    if (items.length === 0) return;
    const current = document.activeElement as HTMLElement | null;
    const currentIndex = current ? items.indexOf(current) : -1;
    const next = currentIndex === -1
      ? (delta > 0 ? 0 : items.length - 1)
      : (currentIndex + delta + items.length) % items.length;
    items[next]?.focus();
  }, []);

  const focusEdge = useCallback((edge: 'first' | 'last') => {
    const items = getEnabledItems(contentRef.current);
    if (items.length === 0) return;
    (edge === 'first' ? items[0] : items[items.length - 1])?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveFocus(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveFocus(-1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusEdge('first');
    } else if (e.key === 'End') {
      e.preventDefault();
      focusEdge('last');
    } else if (e.key === 'Tab') {
      // APG: Tab fecha o menu. preventDefault evita que o browser mova foco a
      // partir do item focado (queremos restoreFocus levar de volta ao trigger;
      // o usuário pode dar Tab de novo a partir dele).
      e.preventDefault();
      setOpen(false);
    }
  };

  if (!mounted) return null;

  const transitionStr = reducedMotion
    ? 'none'
    : `opacity ${TRANSITION_MS}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${TRANSITION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;
  const scale = reducedMotion || visible ? 1 : SCALE_FROM;

  return (
    <Portal>
      <DismissableLayer onDismiss={() => setOpen(false)} excludeRef={triggerRef}>
        <Box
          as="div"
          id={contentId}
          role="menu"
          aria-label={accessibilityLabel}
          aria-orientation="vertical"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
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
          {children}
        </Box>
      </DismissableLayer>
    </Portal>
  );
}
