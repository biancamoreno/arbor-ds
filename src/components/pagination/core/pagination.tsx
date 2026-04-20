import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type {
  PaginationRootProps,
  PaginationListProps,
  PaginationItemProps,
  PaginationButtonProps,
  PaginationEllipsisProps,
} from '../interfaces';

function PaginationRoot({ children, label = 'Paginação', style, ...props }: PaginationRootProps) {
  return (
    <nav aria-label={label} {...props} style={{ display: 'inline-flex', ...style }}>
      {children}
    </nav>
  );
}

function PaginationList({ children, style, ...props }: PaginationListProps) {
  return (
    <ul
      {...props}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        ...style,
      }}
    >
      {children}
    </ul>
  );
}

function PaginationItem({ children, style, ...props }: PaginationItemProps) {
  return (
    <li {...props} style={{ display: 'inline-flex', ...style }}>
      {children}
    </li>
  );
}

function PaginationButton({
  children,
  isActive = false,
  disabled,
  style,
  ...props
}: PaginationButtonProps) {
  const theme = useTheme();

  return (
    <button
      type="button"
      aria-current={isActive ? 'page' : undefined}
      disabled={disabled}
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '36px',
        height: '36px',
        padding: '0 8px',
        border: `1px solid ${isActive ? theme.colors.brand.base : theme.colors.border.default}`,
        borderRadius: theme.radii.nano,
        backgroundColor: isActive ? theme.colors.brand.base : 'transparent',
        color: isActive ? theme.colors.text.inverse : theme.colors.text.primary,
        fontSize: theme.fontSizes.sm,
        fontWeight: isActive ? theme.fontWeights.medium : theme.fontWeights.regular,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function PaginationPrev({ children = '‹', 'aria-label': ariaLabel = 'Página anterior', ...props }: PaginationButtonProps) {
  return <PaginationButton aria-label={ariaLabel} {...props}>{children}</PaginationButton>;
}

function PaginationNext({ children = '›', 'aria-label': ariaLabel = 'Próxima página', ...props }: PaginationButtonProps) {
  return <PaginationButton aria-label={ariaLabel} {...props}>{children}</PaginationButton>;
}

function PaginationEllipsis({ style, ...props }: PaginationEllipsisProps) {
  const theme = useTheme();
  return (
    <span
      aria-hidden="true"
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '36px',
        height: '36px',
        color: theme.colors.text.tertiary,
        fontSize: theme.fontSizes.sm,
        ...style,
      }}
    >
      …
    </span>
  );
}

export const Pagination = Object.assign(PaginationRoot, {
  Root: PaginationRoot,
  List: PaginationList,
  Item: PaginationItem,
  Button: PaginationButton,
  Prev: PaginationPrev,
  Next: PaginationNext,
  Ellipsis: PaginationEllipsis,
});
