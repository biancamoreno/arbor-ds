import { useCallback, useMemo, useRef } from 'react';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { DialogContext, type DialogContextValue } from '../context/dialog-context';
import { DialogTrigger } from '../slots/dialog-trigger';
import { DialogOverlay } from '../slots/dialog-overlay';
import { DialogContent } from '../slots/dialog-content';
import { DialogTitle } from '../slots/dialog-title';
import { DialogDescription } from '../slots/dialog-description';
import { DialogClose } from '../slots/dialog-close';
import { useBodyScrollLock } from '../utils/use-body-scroll-lock';
import type { DialogRootProps } from '../interfaces/DialogProps';

function DialogRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  lockBodyScroll = true,
  onInteractOutside,
  onEscapeKeyDown,
  accessibilityLabel,
  // `accessibilityHint` faz parte do contrato cross-platform; no web a descrição
  // adicional fica em `<Dialog.Description>`, então a prop é consumida apenas
  // em `dialog.native.tsx`.
  accessibilityHint: _accessibilityHint,
  children,
}: DialogRootProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const contentId = useLayoutId('dialog');
  const titleId = useLayoutId('dialog-title');
  const descriptionId = useLayoutId('dialog-desc');
  const triggerRef = useRef<HTMLElement | null>(null);

  useBodyScrollLock(open && lockBodyScroll);

  const setOpenStable = useCallback((next: boolean) => setOpen(next), [setOpen]);

  const value = useMemo<DialogContextValue>(
    () => ({
      open,
      setOpen: setOpenStable,
      contentId,
      titleId,
      descriptionId,
      triggerRef,
      accessibilityLabel,
      closeOnOverlayClick,
      closeOnEscape,
      lockBodyScroll,
      onInteractOutside,
      onEscapeKeyDown,
    }),
    [
      open,
      setOpenStable,
      contentId,
      titleId,
      descriptionId,
      accessibilityLabel,
      closeOnOverlayClick,
      closeOnEscape,
      lockBodyScroll,
      onInteractOutside,
      onEscapeKeyDown,
    ],
  );

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

/**
 * @platform shared
 *
 * Dialog — janela modal que bloqueia interação com a UI subjacente. Diferente
 * de `Popover` (não-modal, escapa via outside-click) ou `Menu` (lista de
 * ações), o Dialog é o overlay "pesado" para confirmações, formulários
 * embutidos e fluxos focados. Usa `open`/`onOpenChange` (RFC-0013/RFC-0030).
 *
 * Anatomia: `Overlay` (backdrop) + `Content` (painel) + opcional `Title` +
 * `Description` + `Close`. `Title`/`Description` populam `aria-labelledby`/
 * `aria-describedby` automaticamente; alternativamente, passe
 * `accessibilityLabel` no root quando não houver `Title` visível.
 *
 * Foco é **trapado** dentro do Content (Tab/Shift+Tab circulam apenas dentro);
 * Escape fecha; clique no overlay fecha (configurável via
 * `closeOnOverlayClick`); `FocusScope restoreFocus` devolve foco ao trigger
 * ao fechar. `onInteractOutside` / `onEscapeKeyDown` permitem interceptar com
 * `event.preventDefault()` (ex.: guarda de form com alterações não salvas).
 *
 * @example
 * <Dialog>
 *   <Dialog.Trigger asChild>
 *     <Button variant="primary">Abrir</Button>
 *   </Dialog.Trigger>
 *   <Dialog.Overlay />
 *   <Dialog.Content>
 *     <Dialog.Title>Confirmar exclusão</Dialog.Title>
 *     <Dialog.Description>Esta ação é irreversível.</Dialog.Description>
 *     <Dialog.Close />
 *   </Dialog.Content>
 * </Dialog>
 *
 * @see {@link DialogRootProps}
 */
export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
});
