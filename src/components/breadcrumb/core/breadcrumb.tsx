import { Box, Flex, Text } from '../../core';
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
    <Box as="nav" aria-label={label} {...props} display="inline-flex" style={style}>
      {children}
    </Box>
  );
}

function BreadcrumbList({ children, style, ...props }: BreadcrumbListProps) {
  return (
    <Flex
      as="ol"
      {...props}
      alignItems="center"
      flexWrap="wrap"
      gap="4px"
      style={{ listStyle: 'none', margin: 0, padding: 0, ...style }}
    >
      {children}
    </Flex>
  );
}

function BreadcrumbItem({ children, style, ...props }: BreadcrumbItemProps) {
  return (
    <Flex
      as="li"
      {...props}
      display="inline-flex"
      alignItems="center"
      gap="4px"
      style={style}
    >
      {children}
    </Flex>
  );
}

function BreadcrumbLink({ children, style, ...props }: BreadcrumbLinkProps) {
  return (
    <Box
      as="a"
      {...props}
      color="interactive.default"
      fontSize="sm"
      style={{ textDecoration: 'none', ...style }}
    >
      {children}
    </Box>
  );
}

function BreadcrumbCurrent({ children, style, ...props }: BreadcrumbCurrentProps) {
  return (
    <Text
      as="span"
      aria-current="page"
      {...props}
      color="text.primary"
      fontSize="sm"
      fontWeight="medium"
      style={style}
    >
      {children}
    </Text>
  );
}

function BreadcrumbSeparator({ children = '/', style, ...props }: BreadcrumbSeparatorProps) {
  return (
    <Text
      as="span"
      aria-hidden="true"
      role="presentation"
      {...props}
      color="text.tertiary"
      fontSize="sm"
      userSelect="none"
      style={style}
    >
      {children}
    </Text>
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
 * `aria-current="page"`. `Separator` é tipicamente um chevron — passe
 * `children` para customizar.
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
