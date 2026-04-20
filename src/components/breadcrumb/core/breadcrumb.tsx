import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type {
  BreadcrumbRootProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbCurrentProps,
  BreadcrumbSeparatorProps,
} from '../interfaces';

function BreadcrumbRoot({ children, label = 'Navegação estrutural', style, ...props }: BreadcrumbRootProps) {
  return (
    <nav aria-label={label} {...props} style={{ display: 'inline-flex', ...style }}>
      {children}
    </nav>
  );
}

function BreadcrumbList({ children, style, ...props }: BreadcrumbListProps) {
  return (
    <ol
      {...props}
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '4px',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        ...style,
      }}
    >
      {children}
    </ol>
  );
}

function BreadcrumbItem({ children, style, ...props }: BreadcrumbItemProps) {
  return (
    <li {...props} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', ...style }}>
      {children}
    </li>
  );
}

function BreadcrumbLink({ children, style, ...props }: BreadcrumbLinkProps) {
  const theme = useTheme();
  return (
    <a
      {...props}
      style={{
        color: theme.colors.interactive.default,
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        ...style,
      }}
    >
      {children}
    </a>
  );
}

function BreadcrumbCurrent({ children, style, ...props }: BreadcrumbCurrentProps) {
  const theme = useTheme();
  return (
    <span
      aria-current="page"
      {...props}
      style={{
        color: theme.colors.text.primary,
        fontSize: theme.fontSizes.sm,
        fontWeight: theme.fontWeights.medium,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function BreadcrumbSeparator({ children = '/', style, ...props }: BreadcrumbSeparatorProps) {
  const theme = useTheme();
  return (
    <span
      aria-hidden="true"
      role="presentation"
      {...props}
      style={{
        color: theme.colors.text.tertiary,
        fontSize: theme.fontSizes.sm,
        userSelect: 'none',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Current: BreadcrumbCurrent,
  Separator: BreadcrumbSeparator,
});
