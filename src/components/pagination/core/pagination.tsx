import { Box, Flex, Clickable, Icon } from '../../core';
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

type PaginationSlots = 'root' | 'list' | 'item' | 'button' | 'ellipsis';

function PaginationRoot({
  children,
  accessibilityLabel = 'Paginação',
  style,
  ...props
}: PaginationRootProps) {
  const slots = useSlotRecipe<PaginationSlots>('pagination', {});
  return (
    <Box
      as="nav"
      aria-label={accessibilityLabel}
      {...props}
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
      as="ul"
      {...props}
      {...(slots.list as Record<string, unknown>)}
      style={{ listStyle: 'none', ...style }}
    >
      {children}
    </Flex>
  );
}

function PaginationItem({ children, style, ...props }: PaginationItemProps) {
  const slots = useSlotRecipe<PaginationSlots>('pagination', {});
  return (
    <Box
      as="li"
      {...props}
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
  style,
  ...props
}: PaginationButtonProps) {
  const state = disabled ? 'disabled' : current ? 'current' : 'idle';
  const slots = useSlotRecipe<PaginationSlots>('pagination', { size, state });

  return (
    <Clickable
      as="button"
      type="button"
      aria-current={current ? 'page' : undefined}
      aria-label={accessibilityLabel}
      disabled={disabled}
      {...props}
      {...(slots.button as Record<string, unknown>)}
      style={style}
    >
      {children}
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
    <Flex
      as="span"
      aria-hidden="true"
      {...props}
      {...(slots.ellipsis as Record<string, unknown>)}
      style={{ userSelect: 'none', ...style }}
    >
      <Icon name="MoreHorizontal" size={iconSizeFor(size)} decorative />
    </Flex>
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
 * @platform shared
 *
 * Paginação. Sob RFC-0043, top-level entrega **API plana** quando `count` é
 * passada — monta automaticamente Previous, range numérico com ellipsis,
 * Next e (opcional) First/Last via algoritmo padrão (`getRange`). Quando
 * `count` está ausente, recai no modo compound clássico.
 *
 * - Tematização: tokens `pagination.*` (themables via `createTheme`).
 * - A11y: `<nav aria-label>`, `<button aria-current="page">` na current,
 *   `aria-label` por item via `getItemLabel(page, isCurrent)`. Ellipsis é
 *   `aria-hidden`.
 * - SP-1: sizes `xsmall|small|medium|large|xlarge` mapeiam `control.{small|medium|large}`.
 *
 * @example
 * <Pagination
 *   page={page}
 *   count={20}
 *   onPageChange={setPage}
 *   siblings={1}
 *   boundaries={1}
 *   showFirstLast
 * />
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
  // RFC-0043: `count !== undefined` é o único discriminador. Sem count, modo
  // compound puro — children montam a árvore.
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
