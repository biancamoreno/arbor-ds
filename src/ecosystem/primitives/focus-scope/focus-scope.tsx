import React, { useEffect, useRef } from 'react';

const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary',
].join(', ');

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('hidden'),
  );
}

type FocusScopeProps = {
  children: React.ReactNode;
  trapped?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
};

export function FocusScope({
  children,
  trapped = false,
  autoFocus = false,
  restoreFocus = false,
}: FocusScopeProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const savedFocusRef = useRef<HTMLElement | null>(null);
  const optionsRef = useRef({ autoFocus, restoreFocus });

  useEffect(() => {
    const { autoFocus: shouldAutoFocus, restoreFocus: shouldRestoreFocus } = optionsRef.current;

    if (shouldRestoreFocus) {
      savedFocusRef.current = document.activeElement as HTMLElement;
    }

    if (shouldAutoFocus) {
      const container = containerRef.current;
      if (container) {
        const focusable = getFocusable(container);
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          container.focus();
        }
      }
    }

    return () => {
      if (shouldRestoreFocus) {
        savedFocusRef.current?.focus();
      }
    };
  }, []);

  useEffect(() => {
    if (!trapped) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = getFocusable(container);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !container.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [trapped]);

  return (
    <div ref={containerRef} tabIndex={-1} style={{ outline: 'none' }}>
      {children}
    </div>
  );
}
