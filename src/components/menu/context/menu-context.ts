import { createContext, useContext, type MutableRefObject } from 'react';
import type { MenuPlacement } from '../utils/position';

export type MenuContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  contentId: string;
  triggerRef: MutableRefObject<HTMLElement | null>;
  placement: MenuPlacement;
  offset?: number;
  accessibilityLabel?: string;
};

export const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenuContext(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('Menu compound components must be used within Menu.Root');
  return ctx;
}
