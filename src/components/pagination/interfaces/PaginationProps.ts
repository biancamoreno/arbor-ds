import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

/**
 * Tamanhos canônicos do componente (SP-1).
 */
export type PaginationSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

/**
 * @platform shared
 *
 * Paginação. Sob RFC-0043, o top-level entrega **API plana** quando `count`
 * é passada — o componente monta `Previous`, range numérico com ellipsis,
 * `Next` e (opcional) `First`/`Last` automaticamente. Sem `count`, recai no
 * modo compound (`.Root/.List/.Item/.Button/...`).
 *
 * Em React Native, web semantics (`<nav>`/`<ul>`/`<li>`/`<button>`) mapeiam
 * para `Box`/`Clickable.native` com `accessibilityLabel`/`accessibilityRole`
 * equivalentes.
 *
 * @example
 * // API plana — caso 95%: paginar tabela / lista.
 * <Pagination
 *   page={page}
 *   count={totalPages}
 *   onPageChange={setPage}
 *   siblings={1}
 *   boundaries={1}
 * />
 *
 * @example
 * // Compound — layout não-trivial (controles extras intercalados).
 * <Pagination.Root>
 *   <Pagination.List>
 *     <Pagination.Item><Pagination.Previous onClick={prev} /></Pagination.Item>
 *     <Pagination.Item><Pagination.Button current>1</Pagination.Button></Pagination.Item>
 *     <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
 *     <Pagination.Item><Pagination.Next onClick={next} /></Pagination.Item>
 *   </Pagination.List>
 * </Pagination.Root>
 */
export interface PaginationProps extends Omit<PaginationRootProps, 'children'> {
  /** Página atual (1-indexed). Obrigatório no modo plano. */
  page?: number;
  /** Total de páginas. Quando passada, ativa o modo plano. */
  count?: number;
  /** Disparado ao clicar em uma página (qualquer Previous/Next/First/Last/numérico). */
  onPageChange?: (page: number) => void;
  /** Páginas ao redor da current (modo plano). Default `1`. */
  siblings?: number;
  /** Páginas fixas em cada extremidade (modo plano). Default `1`. */
  boundaries?: number;
  /** Inclui First/Last além de Previous/Next. Default `false`. */
  showFirstLast?: boolean;
  /** Tamanho dos controles. Default `'medium'`. */
  size?: PaginationSize;
  /**
   * Texto acessível do Previous (modo plano). Default `"Página anterior"`.
   * Mapeia para `accessibilityLabel` (e `aria-label` no web).
   */
  previousLabel?: string;
  /** Texto acessível do Next. Default `"Próxima página"`. */
  nextLabel?: string;
  /** Texto acessível do First. Default `"Primeira página"`. */
  firstLabel?: string;
  /** Texto acessível do Last. Default `"Última página"`. */
  lastLabel?: string;
  /**
   * Texto acessível por página numérica. Recebe o número da página e indica se
   * é a current. Default: `` `Ir para a página ${page}` `` (ou `` `Página ${page}, atual` `` quando current).
   */
  getItemLabel?: (page: number, isCurrent: boolean) => string;
  /**
   * Filhos do modo compound. Quando `count` é passada e `children` também,
   * o modo plano **vence** (children é ignorado). Pattern Dialog/Drawer.
   */
  children?: ReactNode;
}

export interface PaginationRootProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  /**
   * Texto acessível do `<nav>`. Default `"Paginação"`.
   * Mapeia para `accessibilityLabel` no native.
   */
  accessibilityLabel?: string;
}

export interface PaginationListProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
}

export interface PaginationItemProps extends HTMLAttributes<HTMLLIElement> {
  children: ReactNode;
}

export interface PaginationButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  children?: ReactNode;
  /**
   * Marca o botão como a página atual. Aplica `aria-current="page"` (web) /
   * `accessibilityState={{ selected: true }}` (native) e o estilo selecionado.
   */
  current?: boolean;
  /** Tamanho. Default `'medium'`. */
  size?: PaginationSize;
  /**
   * Texto acessível do botão. Use quando `children` for numérico/icônico.
   * Recomendado em vez de `aria-label` por uniformidade cross-platform.
   */
  accessibilityLabel?: string;
}

/**
 * Botão direcional (Previous/Next/First/Last). Mesma API do `Button` numérico,
 * apenas com defaults adequados (ícone interno + accessibilityLabel padrão).
 */
export type PaginationDirectionalProps = PaginationButtonProps;

export interface PaginationEllipsisProps extends HTMLAttributes<HTMLSpanElement> {
  /** Tamanho — quando consumido em compound, deve casar com o `size` dos buttons. */
  size?: PaginationSize;
}
