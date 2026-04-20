import { createContext, useContext } from 'react';

export type MenuContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  itemCount: number;
  registerItem: () => number;
};

export const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenuContext(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('Menu compound components must be used within Menu.Root');
  return ctx;
}
