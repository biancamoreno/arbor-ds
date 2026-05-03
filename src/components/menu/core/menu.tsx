import { useCallback, useMemo, useRef, useState } from 'react';
import { useControllableState } from '../../../ecosystem/primitives';
import { MenuContext, type MenuContextValue } from '../context/menu-context';
import { MenuTrigger } from '../slots/menu-trigger';
import { MenuContent } from '../slots/menu-content';
import { MenuItem } from '../slots/menu-item';
import { MenuSeparator } from '../slots/menu-separator';
import { MenuLabel } from '../slots/menu-label';
import type { MenuRootProps } from '../interfaces/MenuProps';

function MenuRoot({ open: openProp, defaultOpen = false, onOpenChange, children }: MenuRootProps) {
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const [activeIndex, setActiveIndex] = useState(-1);
  const itemCountRef = useRef(0);
  const triggerRef = useRef<HTMLElement | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      setOpenState(next);
      setActiveIndex(next ? 0 : -1);
    },
    [setOpenState],
  );

  const registerItem = useCallback(() => {
    const index = itemCountRef.current;
    itemCountRef.current += 1;
    return index;
  }, []);

  const value = useMemo<MenuContextValue>(
    () => ({
      open,
      setOpen,
      activeIndex,
      setActiveIndex,
      itemCount: itemCountRef.current,
      registerItem,
      triggerRef,
    }),
    [open, setOpen, activeIndex, registerItem],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

/**
 * @platform shared
 *
 * Compound de menu de ações. `Menu.Root` mantém `open`/`activeIndex` para
 * navegação por teclado; itens auto-registram-se no contexto via
 * `registerItem` (definindo `activeIndex` ao abrir). `Trigger` é o botão que
 * abre o menu; `Content` é a lista montada em `Portal`; `Item` representa
 * uma ação clicável; `Separator` divide grupos visualmente; `Label` é
 * cabeçalho não-interativo de seção. Usa nomenclatura canônica `open`
 * (RFC-0013/RFC-0030).
 *
 * @example
 * <Menu>
 *   <Menu.Trigger>Mais</Menu.Trigger>
 *   <Menu.Content>
 *     <Menu.Label>Ações</Menu.Label>
 *     <Menu.Item onSelect={duplicate}>Duplicar</Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Item onSelect={remove}>Excluir</Menu.Item>
 *   </Menu.Content>
 * </Menu>
 *
 * @see {@link MenuRootProps}
 */
export const Menu = Object.assign(MenuRoot, {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  Separator: MenuSeparator,
  Label: MenuLabel,
});
