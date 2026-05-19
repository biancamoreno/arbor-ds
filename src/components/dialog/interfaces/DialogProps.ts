import type { ReactElement, ReactNode } from 'react';

export type DialogSize = 'small' | 'medium' | 'large';

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
