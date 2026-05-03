import { createContext, useContext, type RefObject } from 'react';
import type { TabsOrientation, TabsSize, TabsVariant } from '../interfaces';

export interface TabsContextValue {
  activeValue: string;
  setActive: (value: string) => void;
  registerTrigger: (value: string, ref: RefObject<HTMLButtonElement | null>) => void;
  unregisterTrigger: (value: string) => void;
  focusNext: (fromValue: string) => void;
  focusPrev: (fromValue: string) => void;
  focusFirst: () => void;
  focusLast: () => void;
  orientation: TabsOrientation;
  baseId: string;
}

export const TabsContext = createContext<TabsContextValue>({
  activeValue: '',
  setActive: () => {},
  registerTrigger: () => {},
  unregisterTrigger: () => {},
  focusNext: () => {},
  focusPrev: () => {},
  focusFirst: () => {},
  focusLast: () => {},
  orientation: 'horizontal',
  baseId: '',
});

export const useTabsContext = () => useContext(TabsContext);

export interface TabsListContextValue {
  variant: TabsVariant;
  size: TabsSize;
}

export const TabsListContext = createContext<TabsListContextValue>({
  variant: 'underline',
  size: 'medium',
});

export const useTabsListContext = () => useContext(TabsListContext);
