import { createContext, useContext, type MutableRefObject, type RefObject } from 'react';
import type { DialogDismissEvent, DialogRole } from '../interfaces/DialogProps';

export type DialogContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  contentId: string;
  titleId: string;
  descriptionId: string;
  triggerRef: MutableRefObject<HTMLElement | null>;
  accessibilityLabel?: string;
  /** Semântica ARIA do dialog. Default `'dialog'`. */
  role: DialogRole;
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
  onInteractOutside?: (event: DialogDismissEvent) => void;
  onEscapeKeyDown?: (event: DialogDismissEvent) => void;
};

export const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialogContext(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('Dialog compound components must be used within Dialog.Root');
  return ctx;
}
