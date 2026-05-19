import React, { useCallback, useMemo, useRef } from 'react';
import { useBodyScrollLock, useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { DrawerContext, type DrawerContextValue } from '../context/drawer-context';
import { DrawerTrigger } from '../slots/drawer-trigger';
import { DrawerOverlay } from '../slots/drawer-overlay';
import { DrawerContent } from '../slots/drawer-content';
import { DrawerHeader } from '../slots/drawer-header';
import { DrawerBody } from '../slots/drawer-body';
import { DrawerFooter } from '../slots/drawer-footer';
import { DrawerTitle } from '../slots/drawer-title';
import { DrawerDescription } from '../slots/drawer-description';
import { DrawerClose } from '../slots/drawer-close';
import type {
  DrawerProps,
  DrawerRole,
  DrawerRootProps,
} from '../interfaces/DrawerProps';

type DrawerRootInternalProps = DrawerRootProps & {
  role?: DrawerRole;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
};

function DrawerRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = 'right',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  lockBodyScroll = true,
  onInteractOutside,
  onEscapeKeyDown,
  accessibilityLabel,
  // `accessibilityHint` é consumido apenas no `.native.tsx`.
  accessibilityHint: _accessibilityHint,
  role = 'dialog',
  initialFocusRef,
  children,
}: DrawerRootInternalProps) {
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const contentId = useLayoutId('drawer');
  const titleId = useLayoutId('drawer-title');
  const descriptionId = useLayoutId('drawer-desc');
  const triggerRef = useRef<HTMLElement | null>(null);

  useBodyScrollLock(open && lockBodyScroll);

  const setOpen = useCallback((next: boolean) => setOpenState(next), [setOpenState]);

  const value = useMemo<DrawerContextValue>(
    () => ({
      open,
      setOpen,
      placement,
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
      setOpen,
      placement,
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

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

DrawerRoot.displayName = 'Drawer.Root';

/**
 * @platform shared
 *
 * Drawer — painel modal lateral/superior/inferior. Diferente do `Dialog`
 * (centro, foco em decisão pontual), o Drawer assume mais conteúdo (filtros,
 * navegação, formulário em fluxo) e desliza a partir de uma borda. Usa
 * `open`/`onOpenChange` (RFC-0013/RFC-0030) e `placement` para o lado.
 *
 * Sob RFC-0043, o top-level entrega **API plana** quando alguma das props
 * `title`/`description`/`footer`/`trigger`/`role`/`initialFocusRef` é passada;
 * caso contrário recai no modo compound clássico (`.Root`, `.Trigger`,
 * `.Content`, ...). Mixed (props planas + `children`) é a exceção controlada
 * da RFC: `title`/`description` viram cabeçalho, `footer` vira rodapé,
 * `children` (quando presente) preenche o body entre eles.
 *
 * Foco é **trapado** dentro do Content (Tab/Shift+Tab circulam); Escape fecha;
 * clique no overlay fecha (configurável via `closeOnOverlayClick`);
 * `FocusScope restoreFocus` devolve foco ao trigger ao fechar.
 * `initialFocusRef` redireciona o foco inicial para um elemento específico.
 *
 * @example
 * // API plana (default)
 * <Drawer
 *   open={open}
 *   onOpenChange={setOpen}
 *   placement="right"
 *   trigger={<Button>Filtros</Button>}
 *   title="Filtros"
 *   description="Refine os resultados."
 *   footer={<Button onClick={apply}>Aplicar</Button>}
 * >
 *   <Field label="Categoria"><Select options={...} /></Field>
 * </Drawer>
 *
 * @example
 * // Compound — layout não-trivial
 * <Drawer.Root placement="left">
 *   <Drawer.Trigger asChild><Button>Menu</Button></Drawer.Trigger>
 *   <Drawer.Overlay />
 *   <Drawer.Content>
 *     <Drawer.Header><Drawer.Title>Menu</Drawer.Title></Drawer.Header>
 *     <Drawer.Body>...</Drawer.Body>
 *     <Drawer.Close />
 *   </Drawer.Content>
 * </Drawer.Root>
 *
 * @see {@link DrawerProps}
 */
function DrawerFlat({
  title,
  description,
  footer,
  trigger,
  role,
  initialFocusRef,
  size = 'medium',
  children,
  ...rootProps
}: DrawerProps) {
  const usesFlatApi =
    title !== undefined ||
    description !== undefined ||
    footer !== undefined ||
    trigger !== undefined ||
    children === undefined;

  if (!usesFlatApi) {
    return <DrawerRoot {...rootProps}>{children}</DrawerRoot>;
  }

  return (
    <DrawerRoot {...rootProps} role={role} initialFocusRef={initialFocusRef}>
      {trigger ? renderFlatTrigger(trigger) : null}
      <DrawerOverlay />
      <DrawerContent size={size}>
        {(title !== undefined || description !== undefined) && (
          <DrawerHeader>
            {title !== undefined ? <DrawerTitle>{title}</DrawerTitle> : null}
            {description !== undefined ? <DrawerDescription>{description}</DrawerDescription> : null}
          </DrawerHeader>
        )}
        {children !== undefined ? <DrawerBody>{children}</DrawerBody> : null}
        {footer !== undefined ? <DrawerFooter>{footer}</DrawerFooter> : null}
        <DrawerClose />
      </DrawerContent>
    </DrawerRoot>
  );
}

DrawerFlat.displayName = 'Drawer';

function renderFlatTrigger(trigger: React.ReactNode): React.ReactNode {
  // ReactElement embala em `<Drawer.Trigger asChild>` preservando ref/ARIA/
  // disabled. Primitive (string/number) é ignorado — caso legítimo é `open`
  // controlado sem trigger inline.
  if (!React.isValidElement(trigger)) return null;
  return <DrawerTrigger asChild>{trigger}</DrawerTrigger>;
}

export const Drawer = Object.assign(DrawerFlat, {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
});
