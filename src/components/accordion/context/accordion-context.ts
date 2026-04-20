import { createContext, useContext, type RefObject } from 'react';

export interface AccordionContextValue {
  openValues: string[];
  toggle: (value: string) => void;
  type: 'single' | 'multiple';
  registerTrigger: (value: string, ref: RefObject<HTMLButtonElement | null>) => void;
  unregisterTrigger: (value: string) => void;
  focusNext: (fromValue: string) => void;
  focusPrev: (fromValue: string) => void;
}

export const AccordionContext = createContext<AccordionContextValue>({
  openValues: [],
  toggle: () => {},
  type: 'single',
  registerTrigger: () => {},
  unregisterTrigger: () => {},
  focusNext: () => {},
  focusPrev: () => {},
});

export interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled: boolean;
  contentId: string;
  triggerId: string;
}

export const AccordionItemContext = createContext<AccordionItemContextValue>({
  value: '',
  isOpen: false,
  disabled: false,
  contentId: '',
  triggerId: '',
});

export const useAccordionContext = () => useContext(AccordionContext);
export const useAccordionItemContext = () => useContext(AccordionItemContext);
