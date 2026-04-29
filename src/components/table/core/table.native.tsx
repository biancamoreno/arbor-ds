import { createContext, useContext } from 'react';
import { ScrollView } from 'react-native';
import { Flex, Text } from '../../core';
import type {
  TableRootProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableHeaderCellProps,
} from '../interfaces';

/**
 * @platform native-ready
 *
 * Table cross-platform. Web usa `<table>/<thead>/<tbody>/<tr>/<td>/<th>`; native
 * remapeia para `Flex` columnar/row com bordas controladas via `TableSectionContext`
 * (Head aplica `borderBottomWidth: 2`, Body aplica `1` em cada Row).
 *
 * Limitações em native: `colSpan`/`rowSpan`/`scope` são no-op (RN não tem grid span);
 * roles `'table'/'row'/'cell'/'columnheader'` não existem na plataforma — apenas
 * `accessibilityRole='header'` é aplicado em HeaderCell.
 *
 * Para tabelas largas em mobile, prefira `scrollable` (envolve em `ScrollView` horizontal).
 */

type TableSection = 'head' | 'body' | 'none';
const TableSectionContext = createContext<TableSection>('none');

function TableRoot({ children, scrollable = false, style, ...props }: TableRootProps) {
  const table = (
    <Flex
      {...(props as object)}
      flexDirection="column"
      width="100%"
      style={style}
    >
      {children}
    </Flex>
  );

  if (!scrollable) return table;

  return <ScrollView horizontal>{table}</ScrollView>;
}

function TableHead({ children, style, ...props }: TableHeadProps) {
  return (
    <TableSectionContext.Provider value="head">
      <Flex
        {...(props as object)}
        flexDirection="column"
        borderBottomWidth={2}
        borderBottomColor="border.default"
        style={style}
      >
        {children}
      </Flex>
    </TableSectionContext.Provider>
  );
}

function TableBody({ children, style, ...props }: TableBodyProps) {
  return (
    <TableSectionContext.Provider value="body">
      <Flex
        {...(props as object)}
        flexDirection="column"
        style={style}
      >
        {children}
      </Flex>
    </TableSectionContext.Provider>
  );
}

function TableRow({ children, style, ...props }: TableRowProps) {
  const section = useContext(TableSectionContext);
  const isBody = section === 'body';
  return (
    <Flex
      {...(props as object)}
      flexDirection="row"
      alignItems="stretch"
      borderBottomWidth={isBody ? 1 : 0}
      borderBottomColor={isBody ? 'border.subtle' : undefined}
      style={style}
    >
      {children}
    </Flex>
  );
}

function TableCell({ children, style, ...props }: TableCellProps) {
  return (
    <Flex
      {...(props as object)}
      flex={1}
      flexDirection="row"
      alignItems="center"
      padding="small"
      paddingX="medium"
      style={style}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text as="span" color="text.primary" fontSize="sm">
          {children}
        </Text>
      ) : (
        children
      )}
    </Flex>
  );
}

function TableHeaderCell({ children, style, ...props }: TableHeaderCellProps) {
  return (
    <Flex
      {...(props as object)}
      flex={1}
      flexDirection="row"
      alignItems="center"
      padding="small"
      paddingX="medium"
      style={style}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text
          as="span"
          accessibilityRole="header"
          color="text.secondary"
          fontSize="sm"
          fontWeight="medium"
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Flex>
  );
}

TableRoot.displayName = 'Table.Root';
TableHead.displayName = 'Table.Head';
TableBody.displayName = 'Table.Body';
TableRow.displayName = 'Table.Row';
TableCell.displayName = 'Table.Cell';
TableHeaderCell.displayName = 'Table.HeaderCell';

export const Table = Object.assign(TableRoot, {
  Root: TableRoot,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  HeaderCell: TableHeaderCell,
});
