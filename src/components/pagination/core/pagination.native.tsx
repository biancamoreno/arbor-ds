import { Box, Flex, Clickable, Text, Icon } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { getRange, type PaginationRangeItem } from '../utils';
import type {
  PaginationProps,
  PaginationRootProps,
  PaginationListProps,
  PaginationItemProps,
  PaginationButtonProps,
  PaginationDirectionalProps,
  PaginationEllipsisProps,
  PaginationSize,
} from '../interfaces';
import type { TextVariant } from '../../core/text/interfaces/TextVariant';

type PaginationSlots = 'root' | 'list' | 'item' | 'button' | 'ellipsis';

type PaginationThemeShape = {
  components?: {
    pagination?: {
      button?: {
        colors?: {
          idle?:     { text?: string };
          current?:  { text?: string };
          disabled?: { text?: string };
        };
      };
      ellipsis?: { color?: string };
    };
  };
};

const LABEL_VARIANT_BY_SIZE: Record<PaginationSize, TextVariant> = {
  xsmall: 'caption',
  small:  'bodySmall',
  medium: 'bodyMedium',
  large:  'bodyMedium',
  xlarge: 'bodyLarge',
};

function PaginationRoot({
  children,
  accessibilityLabel = 'Paginação',
  style,
  ...props
}: PaginationRootProps) {
  const slots = useSlotRecipe<PaginationSlots>('pagination', {});
  return (
    <Box
      {...(props as object)}
      accessibilityLabel={accessibilityLabel}
      {...(slots.root as Record<string, unknown>)}
      style={style}
    >
      {children}
    </Box>
  );
}

function PaginationList({ children, style, ...props }: PaginationListProps) {
  const slots = useSlotRecipe<PaginationSlots>('pagination', {});
  return (
    <Flex
      {...(props as object)}
      {...(slots.list as Record<string, unknown>)}
      style={style}
    >
      {children}
    </Flex>
  );
}

function PaginationItem({ children, style, ...props }: PaginationItemProps) {
  const slots = useSlotRecipe<PaginationSlots>('pagination', {});
  return (
    <Box
      {...(props as object)}
      {...(slots.item as Record<string, unknown>)}
      style={style}
    >
      {children}
    </Box>
  );
}

function PaginationButton({
  children,
  current = false,
  disabled,
  size = 'medium',
  accessibilityLabel,
  onClick,
  style,
  ...props
}: PaginationButtonProps) {
  const state = disabled ? 'disabled' : current ? 'current' : 'idle';
  const slots = useSlotRecipe<PaginationSlots>('pagination', { size, state });
  const theme = useTheme() as unknown as PaginationThemeShape;

  const colorAlias =
    theme.components?.pagination?.button?.colors?.[state]?.text ??
    (state === 'current' ? 'text.inverse' : state === 'disabled' ? 'text.disabled' : 'text.primary');

  const accessibilityState = { selected: !!current, disabled: !!disabled };

  return (
    <Clickable
      {...(props as object)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      onClick={onClick}
      disabled={disabled}
      {...(slots.button as Record<string, unknown>)}
      style={style}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text as="span" variant={LABEL_VARIANT_BY_SIZE[size]} color={colorAlias}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Clickable>
  );
}

function PaginationPrevious({
  size = 'medium',
  accessibilityLabel = 'Página anterior',
  children,
  ...props
}: PaginationDirectionalProps) {
  return (
    <PaginationButton size={size} accessibilityLabel={accessibilityLabel} {...props}>
      {children ?? <Icon name="ChevronLeft" size={iconSizeFor(size)} decorative />}
    </PaginationButton>
  );
}

function PaginationNext({
  size = 'medium',
  accessibilityLabel = 'Próxima página',
  children,
  ...props
}: PaginationDirectionalProps) {
  return (
    <PaginationButton size={size} accessibilityLabel={accessibilityLabel} {...props}>
      {children ?? <Icon name="ChevronRight" size={iconSizeFor(size)} decorative />}
    </PaginationButton>
  );
}

function PaginationFirst({
  size = 'medium',
  accessibilityLabel = 'Primeira página',
  children,
  ...props
}: PaginationDirectionalProps) {
  return (
    <PaginationButton size={size} accessibilityLabel={accessibilityLabel} {...props}>
      {children ?? <Icon name="ChevronsLeft" size={iconSizeFor(size)} decorative />}
    </PaginationButton>
  );
}

function PaginationLast({
  size = 'medium',
  accessibilityLabel = 'Última página',
  children,
  ...props
}: PaginationDirectionalProps) {
  return (
    <PaginationButton size={size} accessibilityLabel={accessibilityLabel} {...props}>
      {children ?? <Icon name="ChevronsRight" size={iconSizeFor(size)} decorative />}
    </PaginationButton>
  );
}

function PaginationEllipsis({ size = 'medium', style, ...props }: PaginationEllipsisProps) {
  const slots = useSlotRecipe<PaginationSlots>('pagination', { size });
  return (
    <Box
      {...(props as object)}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      {...(slots.ellipsis as Record<string, unknown>)}
      style={style}
    >
      <Icon name="MoreHorizontal" size={iconSizeFor(size)} decorative />
    </Box>
  );
}

function iconSizeFor(size: PaginationSize) {
  switch (size) {
    case 'xsmall': return 'xsmall';
    case 'small':  return 'small';
    case 'medium': return 'small';
    case 'large':  return 'medium';
    case 'xlarge': return 'medium';
  }
}

PaginationRoot.displayName = 'Pagination.Root';
PaginationList.displayName = 'Pagination.List';
PaginationItem.displayName = 'Pagination.Item';
PaginationButton.displayName = 'Pagination.Button';
PaginationPrevious.displayName = 'Pagination.Previous';
PaginationNext.displayName = 'Pagination.Next';
PaginationFirst.displayName = 'Pagination.First';
PaginationLast.displayName = 'Pagination.Last';
PaginationEllipsis.displayName = 'Pagination.Ellipsis';

/**
 * @platform native
 *
 * `Pagination` em React Native:
 * - Web semantics (`<nav>`/`<ul>`/`<li>`/`<button>`) → `Box`/`Flex`/`Clickable.native`.
 * - `accessibilityLabel`/`accessibilityRole='button'`/`accessibilityState={{ selected, disabled }}`.
 * - Cores resolvidas via `theme.components.pagination.button.colors.<state>.text`
 *   + `resolveAliasColor` (RN não cascateia color de View → Text).
 * - Ícones (Previous/Next/First/Last/Ellipsis) usam `<Icon>` do DS.
 * - Ellipsis oculto de a11y via `accessibilityElementsHidden` +
 *   `importantForAccessibility='no-hide-descendants'`.
 *
 * Sob RFC-0043, `count !== undefined` ativa o modo plano com `getRange`.
 *
 * @see {@link PaginationProps}
 */
function PaginationFlat({
  page,
  count,
  onPageChange,
  siblings = 1,
  boundaries = 1,
  showFirstLast = false,
  size = 'medium',
  previousLabel = 'Página anterior',
  nextLabel = 'Próxima página',
  firstLabel = 'Primeira página',
  lastLabel = 'Última página',
  getItemLabel = defaultItemLabel,
  children,
  ...rootProps
}: PaginationProps) {
  if (count === undefined) {
    return <PaginationRoot {...rootProps}>{children}</PaginationRoot>;
  }

  const current = clamp(page ?? 1, 1, Math.max(1, count));
  const items = getRange({ page: current, count, siblings, boundaries });

  const goTo = (p: number) => {
    if (p === current || p < 1 || p > count) return;
    onPageChange?.(p);
  };

  return (
    <PaginationRoot {...rootProps}>
      <PaginationList>
        {showFirstLast && (
          <PaginationItem>
            <PaginationFirst
              size={size}
              accessibilityLabel={firstLabel}
              disabled={current <= 1}
              onClick={() => goTo(1)}
            />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationPrevious
            size={size}
            accessibilityLabel={previousLabel}
            disabled={current <= 1}
            onClick={() => goTo(current - 1)}
          />
        </PaginationItem>
        {items.map((item, index) => (
          <PaginationItem key={renderKey(item, index)}>
            {renderItem(item, current, size, goTo, getItemLabel)}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            size={size}
            accessibilityLabel={nextLabel}
            disabled={current >= count}
            onClick={() => goTo(current + 1)}
          />
        </PaginationItem>
        {showFirstLast && (
          <PaginationItem>
            <PaginationLast
              size={size}
              accessibilityLabel={lastLabel}
              disabled={current >= count}
              onClick={() => goTo(count)}
            />
          </PaginationItem>
        )}
      </PaginationList>
    </PaginationRoot>
  );
}

function renderItem(
  item: PaginationRangeItem,
  current: number,
  size: PaginationSize,
  goTo: (p: number) => void,
  getItemLabel: (page: number, isCurrent: boolean) => string,
) {
  if (typeof item === 'number') {
    const isCurrent = item === current;
    return (
      <PaginationButton
        size={size}
        current={isCurrent}
        accessibilityLabel={getItemLabel(item, isCurrent)}
        onClick={() => goTo(item)}
      >
        {item}
      </PaginationButton>
    );
  }
  return <PaginationEllipsis size={size} />;
}

function renderKey(item: PaginationRangeItem, index: number) {
  return typeof item === 'number' ? `p-${item}` : `${item}-${index}`;
}

function defaultItemLabel(page: number, isCurrent: boolean) {
  return isCurrent ? `Página ${page}, atual` : `Ir para a página ${page}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

PaginationFlat.displayName = 'Pagination';

export const Pagination = Object.assign(PaginationFlat, {
  Root: PaginationRoot,
  List: PaginationList,
  Item: PaginationItem,
  Button: PaginationButton,
  Previous: PaginationPrevious,
  Next: PaginationNext,
  First: PaginationFirst,
  Last: PaginationLast,
  Ellipsis: PaginationEllipsis,
});
