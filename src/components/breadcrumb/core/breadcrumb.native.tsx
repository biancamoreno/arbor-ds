import { Box, Clickable, Text, Icon } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
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

type BreadcrumbThemeShape = {
  components?: {
    breadcrumb?: {
      link?: { colors?: { default?: string } };
      current?: { color?: string };
      separator?: { color?: string };
    };
  };
};

function BreadcrumbRoot({ children, label = 'Navegação estrutural', style, ...props }: BreadcrumbRootProps) {
  const slots = useSlotRecipe<BreadcrumbSlots>('breadcrumb', {});
  return (
    <Box
      {...(props as object)}
      accessibilityLabel={label}
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
      {...(props as object)}
      {...(slots.list as Record<string, unknown>)}
      style={style}
    >
      {children}
    </Box>
  );
}

function BreadcrumbItem({ children, style, ...props }: BreadcrumbItemProps) {
  const slots = useSlotRecipe<BreadcrumbSlots>('breadcrumb', {});
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

function BreadcrumbLink({ children, onClick, style, ...props }: BreadcrumbLinkProps) {
  const theme = useTheme() as unknown as BreadcrumbThemeShape;
  const linkColor = theme.components?.breadcrumb?.link?.colors?.default ?? 'interactive.default';
  return (
    <Clickable
      {...(props as object)}
      accessibilityRole="link"
      onClick={onClick}
      style={style}
    >
      <Text as="span" variant="bodySmall" color={linkColor}>
        {children}
      </Text>
    </Clickable>
  );
}

function BreadcrumbCurrent({ children, style, ...props }: BreadcrumbCurrentProps) {
  const slots = useSlotRecipe<BreadcrumbSlots>('breadcrumb', {});
  const theme = useTheme() as unknown as BreadcrumbThemeShape;
  const currentColor = theme.components?.breadcrumb?.current?.color ?? 'text.primary';
  return (
    <Text
      as="span"
      {...(props as object)}
      accessibilityState={{ selected: true }}
      variant="label"
      color={currentColor}
      {...(slots.current as Record<string, unknown>)}
      style={style}
    >
      {children}
    </Text>
  );
}

function BreadcrumbSeparator({ children, style, ...props }: BreadcrumbSeparatorProps) {
  const slots = useSlotRecipe<BreadcrumbSlots>('breadcrumb', {});
  const theme = useTheme() as unknown as BreadcrumbThemeShape;
  const separatorColor = theme.components?.breadcrumb?.separator?.color ?? 'text.tertiary';
  const hasCustomContent = children !== undefined;
  return (
    <Box
      {...(props as object)}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      {...(slots.separator as Record<string, unknown>)}
      style={style}
    >
      {hasCustomContent ? (
        typeof children === 'string' ? (
          <Text as="span" variant="bodySmall" color={separatorColor}>
            {children}
          </Text>
        ) : (
          children
        )
      ) : (
        <Icon name="ChevronRight" size="small" decorative />
      )}
    </Box>
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
 * remapeia para `Box`/`Clickable.native`/`Text` com `accessibilityRole='link'`
 * no `Link` e `accessibilityState={{ selected: true }}` no `Current` (RN não
 * tem `aria-current`). `Separator` default usa `<Icon name="ChevronRight">` e
 * é escondido de a11y via `accessibilityElementsHidden` +
 * `importantForAccessibility`. Cores extraídas de
 * `theme.components.breadcrumb.*` e passadas explicitamente ao `<Text>`
 * (RN não cascateia color de View → Text).
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
