import { createContext, useContext, type RefObject } from 'react';

export interface TabsContextValue {
  activeValue: string;
  setActive: (value: string) => void;
  registerTrigger: (value: string, ref: RefObject<HTMLButtonElement | null>) => void;
  unregisterTrigger: (value: string) => void;
  focusNext: (fromValue: string) => void;
  focusPrev: (fromValue: string) => void;
  orientation: 'horizontal' | 'vertical';
}

export const TabsContext = createContext<TabsContextValue>({
  activeValue: '',
  setActive: () => {},
  registerTrigger: () => {},
  unregisterTrigger: () => {},
  focusNext: () => {},
  focusPrev: () => {},
  orientation: 'horizontal',
});

export const useTabsContext = () => useContext(TabsContext);
