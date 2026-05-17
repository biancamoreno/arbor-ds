import React from 'react';
import { Box, Icon, Text } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useMenuContext } from '../context/menu-context';
import type { IconName } from '../../core/icon/interfaces/IconProps';
import type { MenuItemProps, MenuItemSelectEvent } from '../interfaces/MenuProps';

type MenuSlots = 'content' | 'item' | 'label' | 'separator';

type ThemeWithMenuItem = {
  components?: {
    menu?: {
      item?: {
        iconSize?: string;
        colors?: { icon?: string; criticalIcon?: string };
      };
    };
  };
};

function renderAdornment(
  icon: IconName | React.ReactElement | undefined,
  size: string,
  color: string | undefined,
): React.ReactNode {
  if (icon == null) return null;
  if (typeof icon === 'string') {
    return <Icon name={icon} size={size as never} {...(color ? { color } : {})} decorative />;
  }
  return icon;
}

export function MenuItem({
  children,
  onSelect,
  disabled = false,
  tone = 'default',
  startIcon,
  endIcon,
}: MenuItemProps) {
  const { setOpen } = useMenuContext();
  const theme = useTheme() as unknown as ThemeWithMenuItem;
  const slots = useSlotRecipe<MenuSlots>('menu', {
    state: disabled ? 'disabled' : 'idle',
    tone,
  });

  const iconCfg = theme.components?.menu?.item;
  const iconSize = iconCfg?.iconSize ?? 'small';
  const iconColor = tone === 'critical' ? iconCfg?.colors?.criticalIcon : iconCfg?.colors?.icon;

  const handleSelect = (): boolean => {
    // Retorna `true` se o consumer chamou preventDefault (menu não deve fechar).
    if (disabled) return true;
    let prevented = false;
    const event: MenuItemSelectEvent = {
      preventDefault() {
        prevented = true;
      },
      get defaultPrevented() {
        return prevented;
      },
    };
    onSelect?.(event);
    return prevented;
  };

  const handleClick = () => {
    const prevented = handleSelect();
    if (!prevented && !disabled) setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const prevented = handleSelect();
      if (!prevented) setOpen(false);
    }
  };

  const start = renderAdornment(startIcon, iconSize, iconColor);
  const end = renderAdornment(endIcon, iconSize, iconColor);
  const hasAdornments = start !== null || end !== null;

  // Children string → wrapper `<Text variant="bodyMedium">` para tipografia
  // canônica do DS. ReactNode passa direto.
  const label = typeof children === 'string' ? (
    <Text as="span" variant="bodyMedium">
      {children}
    </Text>
  ) : (
    children
  );

  return (
    <Box
      as="div"
      role="menuitem"
      aria-disabled={disabled || undefined}
      tabIndex={-1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...(slots.item as Record<string, unknown>)}
    >
      {hasAdornments ? (
        <>
          {start}
          <Box flexGrow={1} display="flex" alignItems="center" minWidth={0}>
            {label}
          </Box>
          {end}
        </>
      ) : (
        label
      )}
    </Box>
  );
}
