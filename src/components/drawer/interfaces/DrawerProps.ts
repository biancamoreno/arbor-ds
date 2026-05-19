import type { ReactElement, ReactNode, RefObject } from 'react';
import type { DrawerPlacement } from '../context/drawer-context';

export type DrawerSize = 'small' | 'medium' | 'large';

/**
 * Interface mínima do evento de dismiss interceptável do Drawer.
 * Compartilha shape com `DialogDismissEvent` — duck-type cross-platform.
 */
export type DrawerDismissEvent = {
  defaultPrevented: boolean;
  preventDefault: () => void;
};

/**
 * `role: 'dialog'` (default) — painel modal genérico.
 * `role: 'alertdialog'` — confirmação destrutiva ou erro crítico. Em native,
 * mapeia para `accessibilityRole='alert'` no Modal interno.
 */
export type DrawerRole = 'dialog' | 'alertdialog';

/**
 * @platform shared
 *
 * Drawer compound construído sobre primitivas cross-platform (`Portal`,
 * `FocusScope`, `DismissableLayer`). Implementação web em `drawer.tsx`;
 * implementação nativa dedicada em `drawer.native.tsx` via Modal + Animated.
 *
 * Saídas modeladas:
 * - `closeOnOverlayClick` / `closeOnEscape` controlam as saídas default;
 * - `onInteractOutside` / `onEscapeKeyDown` interceptam com
 *   `event.preventDefault()` — útil em form com alterações não salvas;
 * - `lockBodyScroll` (web) trava `<body>` enquanto aberto (default true).
 */
export type DrawerRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: DrawerPlacement;

  /** Default `true`. Se `false`, clique no overlay não fecha. */
  closeOnOverlayClick?: boolean;
  /** Default `true`. Se `false`, Escape (web) / back hardware (Android) não fecham. */
  closeOnEscape?: boolean;
  /**
   * Default `true` (web). Trava o scroll do `<body>` enquanto o drawer está
   * aberto. No native é no-op (Modal já absorve interação).
   */
  lockBodyScroll?: boolean;
  /**
   * Disparado em clique fora do conteúdo (web: pointerdown fora; native:
   * tap no scrim). Chame `event.preventDefault()` para impedir o fechamento.
   */
  onInteractOutside?: (event: DrawerDismissEvent) => void;
  /**
   * Disparado em Escape (web) ou botão de back físico (Android). Chame
   * `event.preventDefault()` para impedir o fechamento.
   */
  onEscapeKeyDown?: (event: DrawerDismissEvent) => void;

  /**
   * Rótulo de acessibilidade do drawer (React Native canônico). Web mapeia
   * internamente para `aria-label` se nenhum `<Drawer.Title>` for fornecido
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
 * Contrato canônico do Drawer (RFC-0043 — API plana como default). O Drawer
 * top-level aceita props planas (`title`/`description`/`footer`/`trigger`)
 * que montam a anatomia padrão internamente. Quando as props planas não são
 * usadas, recai no modo compound (`<Drawer.Root>`/`<Drawer.Trigger>`/...).
 *
 * **Mixed plano + children** é a exceção controlada da RFC-0043: `title`/
 * `description` viram cabeçalho, `footer` vira rodapé, `children` preenche o
 * body entre eles.
 *
 * @example
 * // API plana — caso default
 * <Drawer
 *   open={open}
 *   onOpenChange={setOpen}
 *   placement="right"
 *   trigger={<Button>Abrir filtros</Button>}
 *   title="Filtros"
 *   description="Refine a busca."
 *   footer={<Button onClick={apply}>Aplicar</Button>}
 * >
 *   <Field label="Categoria"><Select options={...} /></Field>
 * </Drawer>
 *
 * @example
 * // Compound — layout não-trivial
 * <Drawer.Root>
 *   <Drawer.Trigger asChild><Button>Abrir</Button></Drawer.Trigger>
 *   <Drawer.Overlay />
 *   <Drawer.Content>
 *     <Drawer.Header><Drawer.Title>Filtros</Drawer.Title></Drawer.Header>
 *     <Drawer.Body>...</Drawer.Body>
 *     <Drawer.Close />
 *   </Drawer.Content>
 * </Drawer.Root>
 */
export type DrawerProps = DrawerRootProps & {
  /** Tamanho do painel. Default `'medium'`. */
  size?: DrawerSize;
  /**
   * Semântica WAI-ARIA. `'dialog'` (default) ou `'alertdialog'`. Em native,
   * `'alertdialog'` mapeia para `accessibilityRole='alert'` no Modal.
   */
  role?: DrawerRole;
  /** Cabeçalho — quando passado, ativa modo plano. */
  title?: ReactNode;
  /** Descrição secundária. Referenciada por `aria-describedby` quando presente. */
  description?: ReactNode;
  /** Rodapé com ações. Layout default: flex row, gap, justify flex-end. */
  footer?: ReactNode;
  /**
   * Trigger renderizado antes do overlay. Quando for um ReactElement, é
   * injetado dentro de `<Drawer.Trigger asChild>` (preserva ref/ARIA/disabled).
   */
  trigger?: ReactNode;
  /**
   * Quando passado, recebe foco ao abrir em vez do primeiro elemento tabável.
   * O alvo precisa estar dentro do conteúdo do Drawer.
   */
  initialFocusRef?: RefObject<HTMLElement | null>;
};

export type DrawerTriggerProps = {
  children: ReactElement;
  asChild?: boolean;
};

export type DrawerOverlayProps = Record<string, never>;

export type DrawerContentProps = {
  children: ReactNode;
  size?: DrawerSize;
};

export type DrawerHeaderProps = {
  children: ReactNode;
};

export type DrawerBodyProps = {
  children: ReactNode;
};

export type DrawerFooterProps = {
  children: ReactNode;
};

export type DrawerTitleProps = {
  children: ReactNode;
};

export type DrawerDescriptionProps = {
  children: ReactNode;
};

export type DrawerCloseProps = {
  children?: ReactNode;
  /**
   * Rótulo de acessibilidade do botão de fechar (React Native canônico).
   * Web mapeia internamente para `aria-label`. Default: `'Fechar'`.
   */
  accessibilityLabel?: string;
};
