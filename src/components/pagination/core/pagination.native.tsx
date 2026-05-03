import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Box, Flex, Clickable, Text } from '../../core';
import type {
  PaginationRootProps,
  PaginationListProps,
  PaginationItemProps,
  PaginationButtonProps,
  PaginationEllipsisProps,
} from '../interfaces';

function PaginationRoot({ children, label = 'Paginação', style, ...props }: PaginationRootProps) {
  return (
    <Box
      {...(props as object)}
      accessibilityLabel={label}
      display="flex"
      flexDirection="row"
      style={style}
    >
      {children}
    </Box>
  );
}

function PaginationList({ children, style, ...props }: PaginationListProps) {
  return (
    <Flex {...(props as object)} alignItems="center" gap="4px" style={style}>
      {children}
    </Flex>
  );
}

function PaginationItem({ children, style, ...props }: PaginationItemProps) {
  return (
    <Box {...(props as object)} display="flex" flexDirection="row" style={style}>
      {children}
    </Box>
  );
}

function PaginationButton({
  children,
  current = false,
  disabled,
  onClick,
  'aria-label': ariaLabel,
  style,
  ...props
}: PaginationButtonProps) {
  const theme = useTheme();
  const accessibilityState = { selected: !!current, disabled: !!disabled };

  return (
    <Clickable
      {...(props as object)}
      accessibilityRole="button"
      accessibilityLabel={ariaLabel}
      accessibilityState={accessibilityState}
      onClick={onClick}
      disabled={disabled}
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={36}
      borderRadius="nano"
      borderWidth={1}
      borderStyle="solid"
      style={{
        minWidth: 36,
        paddingHorizontal: 8,
        borderColor: current ? theme.colors.brand.base : theme.colors.border.default,
        backgroundColor: current ? theme.colors.brand.base : 'transparent',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <Text
        as="span"
        style={{
          color: current ? theme.colors.text.inverse : theme.colors.text.primary,
          fontSize: 14,
          fontWeight: current ? '500' : '400',
        }}
      >
        {children}
      </Text>
    </Clickable>
  );
}

function PaginationPrev({
  children = '‹',
  'aria-label': ariaLabel = 'Página anterior',
  ...props
}: PaginationButtonProps) {
  return (
    <PaginationButton aria-label={ariaLabel} {...props}>
      {children}
    </PaginationButton>
  );
}

function PaginationNext({
  children = '›',
  'aria-label': ariaLabel = 'Próxima página',
  ...props
}: PaginationButtonProps) {
  return (
    <PaginationButton aria-label={ariaLabel} {...props}>
      {children}
    </PaginationButton>
  );
}

function PaginationEllipsis({ style, ...props }: PaginationEllipsisProps) {
  const theme = useTheme();
  return (
    <Flex
      {...(props as object)}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      alignItems="center"
      justifyContent="center"
      height={36}
      style={{ minWidth: 36, ...style }}
    >
      <Text as="span" style={{ color: theme.colors.text.disabled, fontSize: 14 }}>
        {'…'}
      </Text>
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
 * @platform native
 *
 * `Pagination` em React Native:
 * - `Box`/`Flex` para wrappers (sem semântica de `<nav>`/`<ul>`/`<li>` — RN
 *   não tem equivalente).
 * - `aria-label` mapeia para `accessibilityLabel` no wrapper.
 * - `Pagination.Button` via `Clickable.native` com `accessibilityRole='button'`
 *   + `accessibilityState={{ selected: current, disabled }}` para anunciar
 *   página atual.
 * - `Pagination.Ellipsis` é escondido de a11y via
 *   `accessibilityElementsHidden`/`importantForAccessibility='no-hide-descendants'`.
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
