import { Box, Flex, Text, Icon } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import type {
  BreadcrumbRootProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbCurrentProps,
  BreadcrumbSeparatorProps,
} from '../interfaces';

type BreadcrumbSlots = 'root' | 'list' | 'item' | 'link' | 'current' | 'separator';

function BreadcrumbRoot({ children, label = 'Navegação estrutural', style, ...props }: BreadcrumbRootProps) {
  const slots = useSlotRecipe<BreadcrumbSlots>('breadcrumb', {});
  return (
    <Box
      as="nav"
      aria-label={label}
      {...props}
      {...(slots.root as Record<string, unknown>)}
      style={style}
    >
      {children}
    </Box>
  );
}

function BreadcrumbList({ children, style, ...props }: BreadcrumbListProps) {
  const slots = useSlotRecipe<BreadcrumbSlots>('breadcrumb', {});
  return (
    <Box
      as="ol"
      {...props}
      {...(slots.list as Record<string, unknown>)}
      style={{ listStyle: 'none', ...style }}
    >
      {children}
    </Box>
  );
}

function BreadcrumbItem({ children, style, ...props }: BreadcrumbItemProps) {
  const slots = useSlotRecipe<BreadcrumbSlots>('breadcrumb', {});
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

function BreadcrumbLink({ children, style, ...props }: BreadcrumbLinkProps) {
  const slots = useSlotRecipe<BreadcrumbSlots>('breadcrumb', {});
  return (
    <Text
      as="a"
      variant="bodySmall"
      {...props}
      {...(slots.link as Record<string, unknown>)}
      style={style}
    >
      {children}
    </Text>
  );
}

function BreadcrumbCurrent({ children, style, ...props }: BreadcrumbCurrentProps) {
  const slots = useSlotRecipe<BreadcrumbSlots>('breadcrumb', {});
  return (
    <Text
      as="span"
      aria-current="page"
      variant="label"
      {...props}
      {...(slots.current as Record<string, unknown>)}
      style={style}
    >
      {children}
    </Text>
  );
}

function BreadcrumbSeparator({ children, style, ...props }: BreadcrumbSeparatorProps) {
  const slots = useSlotRecipe<BreadcrumbSlots>('breadcrumb', {});
  const hasCustomContent = children !== undefined;
  return (
    <Flex
      as="span"
      aria-hidden="true"
      role="presentation"
      {...props}
      {...(slots.separator as Record<string, unknown>)}
      style={{ userSelect: 'none', ...style }}
    >
      {hasCustomContent ? (
        <Text as="span" variant="bodySmall">
          {children}
        </Text>
      ) : (
        <Icon name="ChevronRight" size="small" decorative />
      )}
    </Flex>
  );
}

BreadcrumbRoot.displayName = 'Breadcrumb.Root';
BreadcrumbList.displayName = 'Breadcrumb.List';
BreadcrumbItem.displayName = 'Breadcrumb.Item';
BreadcrumbLink.displayName = 'Breadcrumb.Link';
BreadcrumbCurrent.displayName = 'Breadcrumb.Current';
BreadcrumbSeparator.displayName = 'Breadcrumb.Separator';

/**
 * @platform shared
 *
 * Compound de breadcrumb (trilha de navegação). `Breadcrumb.Root` é um
 * `<nav aria-label>` com `label` default `"Navegação estrutural"`. Estrutura
 * canônica: `Root > List > Item* > Link|Current + Separator`. Use `Link` em
 * todos os níveis menos o último (a página atual), que recebe `Current` com
 * `aria-current="page"`. `Separator` default renderiza `<Icon name="ChevronRight">`;
 * passe `children` (string ou ReactNode) para customizar.
 *
 * Tipografia: `Link` e separator custom usam `<Text variant="bodySmall">`;
 * `Current` usa `<Text variant="label">` (mesmo tamanho, peso medium para
 * diferenciar). Toda cor e transição é themable via `tokens.breadcrumb`.
 *
 * @example
 * <Breadcrumb>
 *   <Breadcrumb.List>
 *     <Breadcrumb.Item><Breadcrumb.Link href="/">Início</Breadcrumb.Link></Breadcrumb.Item>
 *     <Breadcrumb.Separator />
 *     <Breadcrumb.Item><Breadcrumb.Link href="/produtos">Produtos</Breadcrumb.Link></Breadcrumb.Item>
 *     <Breadcrumb.Separator />
 *     <Breadcrumb.Item><Breadcrumb.Current>Tênis</Breadcrumb.Current></Breadcrumb.Item>
 *   </Breadcrumb.List>
 * </Breadcrumb>
 *
 * @see {@link BreadcrumbRootProps}
 */
export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Current: BreadcrumbCurrent,
  Separator: BreadcrumbSeparator,
});
