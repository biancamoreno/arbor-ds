import type { ReactElement, ReactNode, RefObject } from 'react';

export type DialogSize = 'small' | 'medium' | 'large';

/**
 * `role: 'dialog'` (default) — janela modal genérica.
 * `role: 'alertdialog'` — confirmação destrutiva ou erro crítico. Screen readers
 * tratam diferente (anunciam imediatamente; foco geralmente vai para o botão
 * menos destrutivo). Em web vira `role="alertdialog"`; em native, mapeia para
 * `accessibilityRole='alert'` no Modal interno.
 */
export type DialogRole = 'dialog' | 'alertdialog';

/**
 * Interface mínima de evento aceito pelos handlers de dismiss interceptáveis
 * do Dialog. `KeyboardEvent` (web), `PointerEvent` (web) e os eventos
 * sintéticos do native satisfazem este shape — duck-type cross-platform.
 */
export type DialogDismissEvent = {
  defaultPrevented: boolean;
  preventDefault: () => void;
};

/**
 * @platform shared
 *
 * Dialog compound modal — Portal + Overlay (backdrop) + Content (painel).
 * Trapping focus + restore focus + escape-to-close. Diferente de `Popover`,
 * **bloqueia** interação com a UI subjacente (modal real). Usa `open`/
 * `onOpenChange` (RFC-0013/RFC-0030).
 *
 * Implementação web via Portal + DismissableLayer + FocusScope; implementação
 * nativa em `dialog.native.tsx` via Modal RN com transparent + Animated fade.
 *
 * Saídas modeladas (PR1 — fix urgente):
 * - `closeOnOverlayClick` / `closeOnEscape` controlam as saídas default;
 * - `onInteractOutside` / `onEscapeKeyDown` interceptam com
 *   `event.preventDefault()` — útil em form com alterações não salvas;
 * - `lockBodyScroll` (web) trava `<body>` enquanto aberto (default true).
 */
export type DialogRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Default `true`. Se `false`, clique no overlay não fecha. */
  closeOnOverlayClick?: boolean;
  /** Default `true`. Se `false`, Escape (web) / back hardware (Android) não fecham. */
  closeOnEscape?: boolean;
  /**
   * Default `true` (web). Trava o scroll do `<body>` enquanto o dialog está
   * aberto. No native é no-op (Modal já absorve interação).
   */
  lockBodyScroll?: boolean;
  /**
   * Disparado em clique fora do conteúdo (web: pointerdown fora; native:
   * tap no scrim). Chame `event.preventDefault()` para impedir o fechamento.
   * Em web recebe um `PointerEvent` real; em native recebe um evento
   * sintético com a mesma interface mínima.
   */
  onInteractOutside?: (event: DialogDismissEvent) => void;
  /**
   * Disparado em Escape (web) ou botão de back físico (Android). Chame
   * `event.preventDefault()` para impedir o fechamento. Em web recebe um
   * `KeyboardEvent` real; em native recebe um evento sintético com a mesma
   * interface mínima.
   */
  onEscapeKeyDown?: (event: DialogDismissEvent) => void;

  /**
   * Rótulo de acessibilidade do dialog (React Native canônico). Web mapeia
   * internamente para `aria-label` se nenhum `<Dialog.Title>` for fornecido
   * (caso contrário `aria-labelledby` aponta para o título).
   */
  accessibilityLabel?: string;
  /** Descrição adicional de acessibilidade (React Native). */
  accessibilityHint?: string;
  children?: ReactNode;
};

/**
 * @platform shared
 *
 * Contrato canônico do Dialog (RFC-0043 — API plana como default). O Dialog
 * top-level aceita props planas (`title`/`description`/`footer`/`trigger`)
 * que montam a anatomia padrão internamente. Quando as props planas não são
 * usadas, o componente recai no modo compound (`<Dialog.Root>`/`<Dialog.Trigger>`/
 * `<Dialog.Content>`/...).
 *
 * **Mixed plano + children** é a exceção controlada documentada na RFC-0043:
 * `title`/`description` viram cabeçalho, `footer` vira rodapé, `children`
 * (quando passado junto com qualquer prop plana) preenche o body entre eles.
 *
 * @example
 * // API plana — caso default
 * <Dialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   trigger={<Button>Excluir conta</Button>}
 *   title="Confirmar exclusão"
 *   description="Esta ação é irreversível."
 *   role="alertdialog"
 *   footer={
 *     <>
 *       <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
 *       <Button variant="danger" onClick={confirm}>Excluir</Button>
 *     </>
 *   }
 * />
 *
 * @example
 * // Plano + body custom (Exceção RFC-0043)
 * <Dialog title="Editar usuário" footer={<SaveButton />}>
 *   <Field label="Nome"><Input /></Field>
 *   <Field label="Email"><Input /></Field>
 * </Dialog>
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
 */
export type DialogProps = DialogRootProps & {
  /** Tamanho do painel. Default `'medium'`. */
  size?: DialogSize;
  /**
   * Semântica WAI-ARIA. `'dialog'` (default) ou `'alertdialog'`. Em native,
   * `'alertdialog'` mapeia para `accessibilityRole='alert'` no Modal.
   */
  role?: DialogRole;
  /** Cabeçalho — quando passado, ativa modo plano. */
  title?: ReactNode;
  /** Descrição secundária. Referenciada por `aria-describedby` quando presente. */
  description?: ReactNode;
  /** Rodapé com ações. Layout default: flex row, gap, justify flex-end. */
  footer?: ReactNode;
  /**
   * Trigger renderizado antes do overlay. Aceita qualquer ReactNode; quando for
   * um elemento React clonável, ele é injetado dentro de `<Dialog.Trigger asChild>`
   * (mantém ref do consumer, propaga ARIA, respeita `disabled`).
   */
  trigger?: ReactNode;
  /**
   * Quando passado, recebe foco ao abrir em vez do primeiro elemento tabável.
   * O elemento alvo precisa estar dentro do conteúdo do Dialog.
   */
  initialFocusRef?: RefObject<HTMLElement | null>;
};

export type DialogHeaderProps = {
  children: ReactNode;
};

export type DialogBodyProps = {
  children: ReactNode;
};

export type DialogFooterProps = {
  children: ReactNode;
};

export type DialogTriggerProps = {
  children: ReactElement;
  asChild?: boolean;
};

export type DialogOverlayProps = Record<string, never>;

export type DialogContentProps = {
  children: ReactNode;
  size?: DialogSize;
};

export type DialogTitleProps = {
  children: ReactNode;
};

export type DialogDescriptionProps = {
  children: ReactNode;
};

export type DialogCloseProps = {
  children?: ReactNode;
  /**
   * Rótulo de acessibilidade do botão de fechar (React Native canônico).
   * Web mapeia internamente para `aria-label`. Default: `'Fechar'`.
   */
  accessibilityLabel?: string;
};
