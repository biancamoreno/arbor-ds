import { createContext, useContext, type MutableRefObject } from 'react';

export type MenuContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  itemCount: number;
  registerItem: () => number;
  triggerRef: MutableRefObject<HTMLElement | null>;
};

export const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenuContext(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('Menu compound components must be used within Menu.Root');
  return ctx;
}
