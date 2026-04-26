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

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Current: BreadcrumbCurrent,
  Separator: BreadcrumbSeparator,
});
