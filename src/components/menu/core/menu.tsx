import { useCallback, useMemo, useRef } from 'react';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { MenuContext, type MenuContextValue } from '../context/menu-context';
import { MenuTrigger } from '../slots/menu-trigger';
import { MenuContent } from '../slots/menu-content';
import { MenuItem } from '../slots/menu-item';
import { MenuSeparator } from '../slots/menu-separator';
import { MenuLabel } from '../slots/menu-label';
import type { MenuRootProps } from '../interfaces/MenuProps';

function MenuRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom',
  offset,
  accessibilityLabel,
  // `accessibilityHint` faz parte do contrato cross-platform; no web a descrição
  // adicional fica no próprio conteúdo, então a prop é consumida apenas em
  // `menu.native.tsx`.
  accessibilityHint: _accessibilityHint,
  children,
}: MenuRootProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const triggerRef = useRef<HTMLElement | null>(null);
  const contentId = useLayoutId('menu');

  const setOpenStable = useCallback((next: boolean) => setOpen(next), [setOpen]);

  const value = useMemo<MenuContextValue>(
    () => ({
      open,
      setOpen: setOpenStable,
      contentId,
      triggerRef,
      placement,
      offset,
      accessibilityLabel,
    }),
    [open, setOpenStable, contentId, placement, offset, accessibilityLabel],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

/**
 * @platform shared
 *
 * Menu — painel não-modal ancorado ao trigger com lista de ações navegável por
 * teclado. Diferente de `Dialog`, não bloqueia interação com a UI subjacente:
 * clicar fora apenas fecha (via `DismissableLayer`). Usa `open`/`onOpenChange`
 * (RFC-0013/RFC-0030).
 *
 * Posiciona-se relativo ao trigger via `placement` (`top`/`bottom`/`left`/
 * `right`, default `bottom`) com flip automático quando não cabe no viewport e
 * clamp para manter o painel dentro da tela. Ao abrir, o foco vai para o
 * primeiro item habilitado; `ArrowDown`/`ArrowUp` navegam (pulam disabled);
 * `Home`/`End` saltam para o primeiro/último habilitado; `Enter`/`Space`
 * selecionam; `Escape` ou clique fora fecham. Foco é restaurado para o
 * trigger ao fechar.
 *
 * @example
 * <Menu>
 *   <Menu.Trigger asChild>
 *     <Button variant="ghost">Mais</Button>
 *   </Menu.Trigger>
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
