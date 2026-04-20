import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

/**
 * @platform web-only
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
