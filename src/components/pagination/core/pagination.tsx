import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Box, Flex, Clickable } from '../../core';
import type {
  PaginationRootProps,
  PaginationListProps,
  PaginationItemProps,
  PaginationButtonProps,
  PaginationEllipsisProps,
} from '../interfaces';

function PaginationRoot({ children, label = 'Paginação', style, ...props }: PaginationRootProps) {
  return (
    <Box as="nav" aria-label={label} {...props} display="inline-flex" style={style}>
      {children}
    </Box>
  );
}

function PaginationList({ children, style, ...props }: PaginationListProps) {
  return (
    <Flex
      as="ul"
      {...props}
      alignItems="center"
      gap="4px"
      style={{ listStyle: 'none', margin: 0, padding: 0, ...style }}
    >
      {children}
    </Flex>
  );
}

function PaginationItem({ children, style, ...props }: PaginationItemProps) {
  return (
    <Box as="li" {...props} display="inline-flex" style={style}>
      {children}
    </Box>
  );
}

function PaginationButton({
  children,
  current = false,
  disabled,
  style,
  ...props
}: PaginationButtonProps) {
  const theme = useTheme();

  return (
    <Clickable
      as="button"
      type="button"
      aria-current={current ? 'page' : undefined}
      disabled={disabled}
      {...props}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      height={36}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.5 : 1}
      borderRadius="nano"
      borderWidth={1}
      borderStyle="solid"
      fontSize="sm"
      style={{
        minWidth: '36px',
        padding: '0 8px',
        borderColor: current ? theme.colors.brand.base : theme.colors.border.default,
        backgroundColor: current ? theme.colors.brand.base : 'transparent',
        color: current ? theme.colors.text.inverse : theme.colors.text.primary,
        fontWeight: current ? theme.fontWeights.medium : theme.fontWeights.regular,
        ...style,
      }}
    >
      {children}
    </Clickable>
  );
}

function PaginationPrev({ children = '‹', 'aria-label': ariaLabel = 'Página anterior', ...props }: PaginationButtonProps) {
  return <PaginationButton aria-label={ariaLabel} {...props}>{children}</PaginationButton>;
}

function PaginationNext({ children = '›', 'aria-label': ariaLabel = 'Próxima página', ...props }: PaginationButtonProps) {
  return <PaginationButton aria-label={ariaLabel} {...props}>{children}</PaginationButton>;
}

function PaginationEllipsis({ style, ...props }: PaginationEllipsisProps) {
  return (
    <Flex
      as="span"
      aria-hidden="true"
      {...props}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      height={36}
      color="text.tertiary"
      fontSize="sm"
      style={{ minWidth: '36px', ...style }}
    >
      …
    </Flex>
  );
}

PaginationRoot.displayName = 'Pagination.Root';
PaginationList.displayName = 'Pagination.List';
PaginationItem.displayName = 'Pagination.Item';
PaginationButton.displayName = 'Pagination.Button';
PaginationPrev.displayName = 'Pagination.Prev';
PaginationNext.displayName = 'Pagination.Next';
PaginationEllipsis.displayName = 'Pagination.Ellipsis';

/**
 * @platform shared
 *
 * Compound de paginação. `Pagination.Root` é um `<nav aria-label>` (default
 * `"Paginação"`). Estrutura: `Root > List > Item* > Button|Prev|Next|Ellipsis`.
 * Use `Button` para páginas numeradas (com `current` na atual), `Prev`/`Next`
 * para navegação direcional e `Ellipsis` para indicar ranges omitidos. O
 * compound não controla o estado da página — o consumidor decide qual
 * botão é `current` e responde aos `onClick`.
 *
 * @example
 * <Pagination>
 *   <Pagination.List>
 *     <Pagination.Item><Pagination.Prev onClick={prev} /></Pagination.Item>
 *     <Pagination.Item><Pagination.Button onClick={() => goTo(1)}>1</Pagination.Button></Pagination.Item>
 *     <Pagination.Item><Pagination.Button current>2</Pagination.Button></Pagination.Item>
 *     <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
 *     <Pagination.Item><Pagination.Next onClick={next} /></Pagination.Item>
 *   </Pagination.List>
 * </Pagination>
 *
 * @see {@link PaginationRootProps}
 */
export const Pagination = Object.assign(PaginationRoot, {
  Root: PaginationRoot,
  List: PaginationList,
  Item: PaginationItem,
  Button: PaginationButton,
  Prev: PaginationPrev,
  Next: PaginationNext,
  Ellipsis: PaginationEllipsis,
});
