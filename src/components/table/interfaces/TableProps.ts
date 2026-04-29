import type { HTMLAttributes, ReactNode, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

/**
 * @platform native-ready
 * Tabela semântica minimal. Sem sorting/paginação embutidos.
 *
 * Em native: layout columnar com Flex; sem reflow para cards (use composição manual).
 * Limitações: `colSpan`/`rowSpan`/`scope` são no-op (RN não tem grid span);
 * `accessibilityRole='table'/'row'/'cell'` não existem na plataforma —
 * apenas `accessibilityRole='header'` é aplicado em HeaderCell.
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
