import { Box, Flex, Clickable, Text } from '../../core';
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
  const theme = useTheme();
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
          color: theme.colors.brand.base,
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
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
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

/**
 * @platform native
 *
 * `Breadcrumb` em React Native. Web usa `<nav>`/`<ol>`/`<li>`/`<a>`; native
 * remapeia para `Box`/`Flex`/`Clickable.native` com `accessibilityRole='link'`
 * no `Link` e `accessibilityState={{ selected: true }}` no `Current` (RN não
 * tem `aria-current`). `Separator` é escondido de a11y via
 * `accessibilityElementsHidden` + `importantForAccessibility`.
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
