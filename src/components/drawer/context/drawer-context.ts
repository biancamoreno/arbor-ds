import { createContext, useContext, type MutableRefObject, type RefObject } from 'react';
import type { DrawerDismissEvent, DrawerRole } from '../interfaces/DrawerProps';

export type DrawerPlacement = 'left' | 'right' | 'bottom' | 'top';

export type DrawerContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  placement: DrawerPlacement;
  contentId: string;
  titleId: string;
  descriptionId: string;
  triggerRef: MutableRefObject<HTMLElement | null>;
  accessibilityLabel?: string;
  /** Semântica ARIA do drawer. Default `'dialog'`. */
  role: DrawerRole;
  /** Override do foco inicial; consumido pelo `FocusScope` no Content. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Default true. Se false, clique no overlay/fora não fecha. */
  closeOnOverlayClick: boolean;
  /** Default true. Se false, Escape (web) ou back hardware (Android) não fecham. */
  closeOnEscape: boolean;
  /** Default true. Se false, body scroll continua liberado enquanto aberto. */
  lockBodyScroll: boolean;
  /**
   * Interceptáveis pelo consumidor com `event.preventDefault()` — quando
   * chamado e o evento for preventDefault, o overlay/Escape NÃO fecha.
   */
  onInteractOutside?: (event: DrawerDismissEvent) => void;
  onEscapeKeyDown?: (event: DrawerDismissEvent) => void;
};

export const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawerContext(): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('Drawer compound components must be used within Drawer.Root');
  return ctx;
}
