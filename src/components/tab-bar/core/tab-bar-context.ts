import { createContext, useContext } from 'react';

export interface TabBarContextValue {
  value: string;
  onChange: (value: string) => void;
}

export const TabBarContext = createContext<TabBarContextValue | null>(null);

export function useTabBar(): TabBarContextValue {
  const ctx = useContext(TabBarContext);
  if (!ctx) throw new Error('[TabBar.Item] must be used inside a <TabBar>');
  return ctx;
}
