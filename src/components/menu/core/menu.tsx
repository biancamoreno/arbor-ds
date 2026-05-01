import { useCallback, useRef, useState } from 'react';
import { useControllableState } from '../../../ecosystem/primitives';
import { MenuContext } from '../context/menu-context';
import { MenuTrigger } from '../slots/menu-trigger';
import { MenuContent } from '../slots/menu-content';
import { MenuItem } from '../slots/menu-item';
import { MenuSeparator } from '../slots/menu-separator';
import { MenuLabel } from '../slots/menu-label';
import type { MenuRootProps } from '../interfaces/MenuProps';

function MenuRoot({ isOpen: isOpenProp, defaultOpen = false, onClose, children }: MenuRootProps) {
  const [isOpen, setIsOpen] = useControllableState({
    value: isOpenProp,
    defaultValue: defaultOpen,
    onChange: (v) => {
      if (!v) onClose?.();
    },
  });

  const [activeIndex, setActiveIndex] = useState(-1);
  const itemCountRef = useRef(0);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    setIsOpen(true);
    setActiveIndex(0);
  }, [setIsOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, [setIsOpen]);

  const registerItem = useCallback(() => {
    const index = itemCountRef.current;
    itemCountRef.current += 1;
    return index;
  }, []);

  return (
    <MenuContext.Provider value={{
      isOpen,
      open,
      close,
      activeIndex,
      setActiveIndex,
      itemCount: itemCountRef.current,
      registerItem,
      triggerRef,
    }}>
      {children}
    </MenuContext.Provider>
  );
}

export const Menu = Object.assign(MenuRoot, {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  Separator: MenuSeparator,
  Label: MenuLabel,
});
