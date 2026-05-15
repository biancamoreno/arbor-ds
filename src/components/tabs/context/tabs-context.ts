import { createContext, useContext, type RefObject } from 'react';
import type { TabsIndicatorPosition, TabsOrientation, TabsSize, TabsVariant } from '../interfaces';

export interface TabsContextValue {
  activeValue: string;
  setActive: (value: string) => void;
  registerTrigger: (value: string, ref: RefObject<HTMLButtonElement | null>) => void;
  unregisterTrigger: (value: string) => void;
  /** Web-only: registra o nó do container interno (slot `triggerContent`) — o indicator mede ESTE elemento, não o button (que tem padding). */
  registerContent: (value: string, node: HTMLElement | null) => void;
  focusNext: (fromValue: string) => void;
  focusPrev: (fromValue: string) => void;
  focusFirst: () => void;
  focusLast: () => void;
  orientation: TabsOrientation;
  baseId: string;
  /** Web-only: retorna o button DOM node (usado para foco/keyboard, não para indicator). */
  getTriggerNode: (value: string) => HTMLElement | null;
  /** Web-only: retorna o container interno (slot `triggerContent`) do trigger ativo. O indicator mede ESTE elemento em ambas as variants — acompanha o tamanho do conteúdo, ignora o padding do button. */
  getContentNode: (value: string) => HTMLElement | null;
  /**
   * Web-only: incrementa toda vez que um content node registra/desregistra.
   * O TabsIndicator depende desse contador para re-medir após os Triggers
   * terminarem de registrar suas refs — sem isso, primeira renderização
   * com `defaultValue` não acha o nó (Triggers registram em ordem JSX, mas
   * o re-render do Indicator não é disparado automaticamente).
   */
  contentVersion: number;
}

export const TabsContext = createContext<TabsContextValue>({
  activeValue: '',
  setActive: () => {},
  registerTrigger: () => {},
  unregisterTrigger: () => {},
  registerContent: () => {},
  focusNext: () => {},
  focusPrev: () => {},
  focusFirst: () => {},
  focusLast: () => {},
  orientation: 'horizontal',
  baseId: '',
  getTriggerNode: () => null,
  getContentNode: () => null,
  contentVersion: 0,
});

export const useTabsContext = () => useContext(TabsContext);

export interface TabsListContextValue {
  variant: TabsVariant;
  size: TabsSize;
  indicatorPosition: TabsIndicatorPosition;
}

export const TabsListContext = createContext<TabsListContextValue>({
  variant: 'underline',
  size: 'medium',
  indicatorPosition: 'bottom',
});

export const useTabsListContext = () => useContext(TabsListContext);
