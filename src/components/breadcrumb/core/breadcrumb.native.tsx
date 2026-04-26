import { Box, Flex, Clickable, Text } from '../../core';
import type {
  BreadcrumbRootProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbCurrentProps,
  BreadcrumbSeparatorProps,
} from '../interfaces';

/**
 * @platform native-ready
 *
 * Breadcrumb cross-platform. Web usa `<nav>`/`<ol>`/`<li>`/`<a>`; native remapeia para
 * `Box`/`Flex`/`Clickable.native` com `accessibilityRole="link"` no Link e
 * `accessibilityState={{ selected: true }}` no Current (RN não tem `aria-current`).
 * Separator é hidden de a11y via `accessibilityElementsHidden` + `importantForAccessibility`.
 */

function BreadcrumbRoot({ children, label = 'Navegação estrutural', style, ...props }: BreadcrumbRootProps) {
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

function BreadcrumbList({ children, style, ...props }: BreadcrumbListProps) {
  return (
    <Flex
      {...(props as object)}
      alignItems="center"
      flexWrap="wrap"
      gap="4px"
      style={style}
    >
      {children}
    </Flex>
  );
}

function BreadcrumbItem({ children, style, ...props }: BreadcrumbItemProps) {
  return (
    <Flex
      {...(props as object)}
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap="4px"
      style={style}
    >
      {children}
    </Flex>
  );
}

function BreadcrumbLink({ children, onClick, style, ...props }: BreadcrumbLinkProps) {
  return (
    <Clickable
      {...(props as object)}
      accessibilityRole="link"
      onClick={onClick}
      style={style}
    >
      <Text
        as="span"
        style={{
          color: '#18736A',
          fontSize: 14,
        }}
      >
        {children}
      </Text>
    </Clickable>
  );
}

function BreadcrumbCurrent({ children, style, ...props }: BreadcrumbCurrentProps) {
  return (
    <Text
      as="span"
      {...(props as object)}
      accessibilityState={{ selected: true }}
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
      {...(props as object)}
      color="text.tertiary"
      fontSize="sm"
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
