import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type {
  TableRootProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableHeaderCellProps,
} from '../interfaces';

function TableRoot({ children, scrollable = false, style, ...props }: TableRootProps) {
  const theme = useTheme();
  const table = (
    <table
      {...props}
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: theme.fontSizes.sm,
        color: theme.colors.text.primary,
        ...style,
      }}
    >
      {children}
    </table>
  );

  if (!scrollable) return table;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      {table}
    </div>
  );
}

function TableHead({ children, style, ...props }: TableHeadProps) {
  const theme = useTheme();
  return (
    <thead
      {...props}
      style={{
        borderBottom: `2px solid ${theme.colors.border.default}`,
        ...style,
      }}
    >
      {children}
    </thead>
  );
}

function TableBody({ children, style, ...props }: TableBodyProps) {
  return <tbody {...props} style={style}>{children}</tbody>;
}

function TableRow({ children, style, ...props }: TableRowProps) {
  const theme = useTheme();
  return (
    <tr
      {...props}
      style={{
        borderBottom: `1px solid ${theme.colors.border.subtle}`,
        ...style,
      }}
    >
      {children}
    </tr>
  );
}

function TableCell({ children, style, ...props }: TableCellProps) {
  const theme = useTheme();
  return (
    <td
      {...props}
      style={{
        padding: `${theme.space.small} ${theme.space.medium}`,
        verticalAlign: 'middle',
        ...style,
      }}
    >
      {children}
    </td>
  );
}

function TableHeaderCell({ children, style, ...props }: TableHeaderCellProps) {
  const theme = useTheme();
  return (
    <th
      scope="col"
      {...props}
      style={{
        padding: `${theme.space.small} ${theme.space.medium}`,
        textAlign: 'left',
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.text.secondary,
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </th>
  );
}

export const Table = Object.assign(TableRoot, {
  Root: TableRoot,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  HeaderCell: TableHeaderCell,
});
