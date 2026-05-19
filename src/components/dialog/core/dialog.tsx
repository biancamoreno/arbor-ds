import React, { useCallback, useMemo, useRef } from 'react';
import { useBodyScrollLock, useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { DialogContext, type DialogContextValue } from '../context/dialog-context';
import { DialogTrigger } from '../slots/dialog-trigger';
import { DialogOverlay } from '../slots/dialog-overlay';
import { DialogContent } from '../slots/dialog-content';
import { DialogHeader } from '../slots/dialog-header';
import { DialogBody } from '../slots/dialog-body';
import { DialogFooter } from '../slots/dialog-footer';
import { DialogTitle } from '../slots/dialog-title';
import { DialogDescription } from '../slots/dialog-description';
import { DialogClose } from '../slots/dialog-close';
import type {
  DialogProps,
  DialogRole,
  DialogRootProps,
} from '../interfaces/DialogProps';

type DialogRootInternalProps = DialogRootProps & {
  role?: DialogRole;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
};

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
  role = 'dialog',
  initialFocusRef,
  children,
}: DialogRootInternalProps) {
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
      role,
      initialFocusRef,
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
      role,
      initialFocusRef,
      closeOnOverlayClick,
      closeOnEscape,
      lockBodyScroll,
      onInteractOutside,
      onEscapeKeyDown,
    ],
  );

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

DialogRoot.displayName = 'Dialog.Root';

/**
 * @platform shared
 *
 * Dialog — janela modal que bloqueia interação com a UI subjacente. Diferente
 * de `Popover` (não-modal, escapa via outside-click) ou `Menu` (lista de
 * ações), o Dialog é o overlay "pesado" para confirmações, formulários
 * embutidos e fluxos focados. Usa `open`/`onOpenChange` (RFC-0013/RFC-0030).
 *
 * Sob RFC-0043, o top-level entrega **API plana** quando alguma das props
 * `title`/`description`/`footer`/`trigger`/`role`/`initialFocusRef` é passada;
 * caso contrário, o componente recai no modo compound clássico (`.Root`,
 * `.Trigger`, `.Content`, ...). Mixed (props planas + `children`) é a
 * **exceção controlada** documentada na RFC: `title`/`description` viram
 * cabeçalho, `footer` vira rodapé, `children` (quando presente) preenche o
 * body entre eles.
 *
 * Foco é **trapado** dentro do Content (Tab/Shift+Tab circulam apenas dentro);
 * Escape fecha; clique no overlay fecha (configurável via
 * `closeOnOverlayClick`); `FocusScope restoreFocus` devolve foco ao trigger
 * ao fechar. `initialFocusRef` redireciona o foco inicial para um elemento
 * específico em vez do primeiro tabável.
 *
 * @example
 * // API plana (default)
 * <Dialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   trigger={<Button>Excluir conta</Button>}
 *   title="Confirmar exclusão"
 *   description="Esta ação é irreversível."
 *   role="alertdialog"
 *   footer={<>
 *     <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
 *     <Button variant="danger" onClick={confirm}>Excluir</Button>
 *   </>}
 * />
 *
 * @example
 * // Compound — layout não-trivial
 * <Dialog.Root>
 *   <Dialog.Trigger asChild><Button>Abrir</Button></Dialog.Trigger>
 *   <Dialog.Overlay />
 *   <Dialog.Content>
 *     <Dialog.Header>
 *       <Dialog.Title>Confirmar</Dialog.Title>
 *     </Dialog.Header>
 *     <Dialog.Body>...</Dialog.Body>
 *     <Dialog.Close />
 *   </Dialog.Content>
 * </Dialog.Root>
 *
 * @see {@link DialogProps}
 */
function DialogFlat({
  title,
  description,
  footer,
  trigger,
  role,
  initialFocusRef,
  size = 'medium',
  children,
  ...rootProps
}: DialogProps) {
  // Discriminação por prop (RFC-0043): qualquer prop plana ativa o modo plano.
  // Sem props planas E com children → modo compound (children são montados
  // pelo consumidor com `<Dialog.Trigger/Content/...>`).
  const usesFlatApi =
    title !== undefined ||
    description !== undefined ||
    footer !== undefined ||
    trigger !== undefined ||
    children === undefined;

  if (!usesFlatApi) {
    return <DialogRoot {...rootProps}>{children}</DialogRoot>;
  }

  return (
    <DialogRoot {...rootProps} role={role} initialFocusRef={initialFocusRef}>
      {trigger ? renderFlatTrigger(trigger) : null}
      <DialogOverlay />
      <DialogContent size={size}>
        {(title !== undefined || description !== undefined) && (
          <DialogHeader>
            {title !== undefined ? <DialogTitle>{title}</DialogTitle> : null}
            {description !== undefined ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
        )}
        {children !== undefined ? <DialogBody>{children}</DialogBody> : null}
        {footer !== undefined ? <DialogFooter>{footer}</DialogFooter> : null}
        <DialogClose />
      </DialogContent>
    </DialogRoot>
  );
}

DialogFlat.displayName = 'Dialog';

function renderFlatTrigger(trigger: React.ReactNode): React.ReactNode {
  // Quando o consumer passa um ReactElement (ex.: `<Button>...`) embalamos em
  // `<Dialog.Trigger asChild>` para preservar ref/ARIA/`disabled` do botão.
  // Se passou algo primitivo (string/number) o trigger é ignorado — o caso
  // legítimo é `open` controlado pelo consumer sem trigger inline.
  if (!React.isValidElement(trigger)) return null;
  return <DialogTrigger asChild>{trigger}</DialogTrigger>;
}

export const Dialog = Object.assign(DialogFlat, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
});
