import type { HTMLAttributes, ReactNode, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

/**
 * @platform web-only
 * Tabela semântica minimal. Sem sorting ou paginação embutidos.
 */
export interface TableRootProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  /** Adiciona scroll horizontal quando o conteúdo excede o container */
  scrollable?: boolean;
}

export interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableDataCellElement> {
  children?: ReactNode;
}

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableHeaderCellElement> {
  children?: ReactNode;
}
