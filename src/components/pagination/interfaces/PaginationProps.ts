import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

/**
 * @platform shared
 *
 * Paginação compound. Web usa semântica `<nav>`/`<ul>`/`<li>`/`<button>`; native
 * remapeia para `Box`/`Flex`/`Clickable.native` com a11y nativa equivalente.
 */
export interface PaginationRootProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** @default "Paginação" */
  label?: string;
}

export interface PaginationListProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
}

export interface PaginationItemProps extends HTMLAttributes<HTMLLIElement> {
  children: ReactNode;
}

export interface PaginationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  /**
   * Marca o botão como a página atual. Aplica `aria-current="page"` e o estado
   * visual selecionado.
   */
  current?: boolean;
  /**
   * Texto acessível do botão. Use quando `children` for apenas numérico/icônico
   * para descrever a ação (ex.: `"Ir para a página 3"`, `"Próxima página"`).
   */
  'aria-label'?: string;
}

export type PaginationEllipsisProps = HTMLAttributes<HTMLSpanElement>;
