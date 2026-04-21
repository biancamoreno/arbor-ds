import { createContext, useContext } from 'react';

export interface NavBarContextValue {
  value: string;
  onChange: (value: string) => void;
}

export const NavBarContext = createContext<NavBarContextValue | null>(null);

export function useNavBar(): NavBarContextValue {
  const ctx = useContext(NavBarContext);
  if (!ctx) throw new Error('[NavBar.Item] must be used inside a <NavBar>');
  return ctx;
}
