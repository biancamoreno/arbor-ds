import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Box } from '../../core';
import type {
  TableRootProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableHeaderCellProps,
} from '../interfaces';

function TableRoot({ children, scrollable = false, style, ...props }: TableRootProps) {
  const table = (
    <Box
      as="table"
      {...props}
      width="100%"
      fontSize="sm"
      color="text.primary"
      style={{ borderCollapse: 'collapse', ...style }}
    >
      {children}
    </Box>
  );

  if (!scrollable) return table;

  return (
    <Box width="100%" style={{ overflowX: 'auto' }}>
      {table}
    </Box>
  );
}

function TableHead({ children, style, ...props }: TableHeadProps) {
  const theme = useTheme();
  return (
    <Box
      as="thead"
      {...props}
      style={{ borderBottom: `2px solid ${theme.colors.border.default}`, ...style }}
    >
      {children}
    </Box>
  );
}

function TableBody({ children, style, ...props }: TableBodyProps) {
  return <Box as="tbody" {...props} style={style}>{children}</Box>;
}

function TableRow({ children, style, ...props }: TableRowProps) {
  const theme = useTheme();
  return (
    <Box
      as="tr"
      {...props}
      style={{ borderBottom: `1px solid ${theme.colors.border.subtle}`, ...style }}
    >
      {children}
    </Box>
  );
}

function TableCell({ children, style, ...props }: TableCellProps) {
  return (
    <Box
      as="td"
      {...props}
      padding="small"
      paddingX="medium"
      verticalAlign="middle"
      style={style}
    >
      {children}
    </Box>
  );
}

function TableHeaderCell({ children, style, ...props }: TableHeaderCellProps) {
  return (
    <Box
      as="th"
      scope="col"
      {...props}
      padding="small"
      paddingX="medium"
      fontWeight="medium"
      color="text.secondary"
      verticalAlign="middle"
      style={{ textAlign: 'left', whiteSpace: 'nowrap', ...style }}
    >
      {children}
    </Box>
  );
}

/**
 * @platform shared
 *
 * Compound de tabela. Estrutura: `Root > Head > Row > HeaderCell* + Body >
 * Row* > Cell*`. Em web renderiza tags HTML semânticas (`<table>`, `<thead>`,
 * `<tbody>`, `<tr>`, `<th>`, `<td>`); em native usa Flex columnar +
 * `ScrollView` (RFC-0022 — RN não tem CSS table). `Root.scrollable` (default
 * `true`) permite scroll horizontal quando o conteúdo excede o container.
 *
 * @example
 * <Table>
 *   <Table.Head>
 *     <Table.Row>
 *       <Table.HeaderCell>Nome</Table.HeaderCell>
 *       <Table.HeaderCell>Status</Table.HeaderCell>
 *     </Table.Row>
 *   </Table.Head>
 *   <Table.Body>
 *     {rows.map(r => (
 *       <Table.Row key={r.id}>
 *         <Table.Cell>{r.name}</Table.Cell>
 *         <Table.Cell>{r.status}</Table.Cell>
 *       </Table.Row>
 *     ))}
 *   </Table.Body>
 * </Table>
 *
 * @see {@link TableRootProps}
 */
export const Table = Object.assign(TableRoot, {
  Root: TableRoot,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  HeaderCell: TableHeaderCell,
});
