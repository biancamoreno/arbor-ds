import { createContext, useContext } from 'react';

export type DrawerPlacement = 'left' | 'right' | 'bottom' | 'top';

export type DrawerContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  placement: DrawerPlacement;
  titleId: string;
};

export const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawerContext(): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('Drawer compound components must be used within Drawer.Root');
  return ctx;
}
