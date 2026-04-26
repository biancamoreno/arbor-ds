import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

/**
 * @platform native-ready
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
  /** Marca a página como atual */
  isActive?: boolean;
  /** @default "Carregando" */
  'aria-label'?: string;
}

export type PaginationEllipsisProps = HTMLAttributes<HTMLSpanElement>;
