import { createContext, useContext, type RefObject } from 'react';

export type AccordionMode =
  | { type: 'single'; collapsible: boolean }
  | { type: 'multiple' };

export interface AccordionContextValue {
  openValues: string[];
  toggle: (value: string) => void;
  mode: AccordionMode;
  registerTrigger: (value: string, ref: RefObject<HTMLButtonElement | null>) => void;
  unregisterTrigger: (value: string) => void;
  focusNext: (fromValue: string) => void;
  focusPrev: (fromValue: string) => void;
  focusFirst: () => void;
  focusLast: () => void;
}

export const AccordionContext = createContext<AccordionContextValue>({
  openValues: [],
  toggle: () => {},
  mode: { type: 'single', collapsible: true },
  registerTrigger: () => {},
  unregisterTrigger: () => {},
  focusNext: () => {},
  focusPrev: () => {},
  focusFirst: () => {},
  focusLast: () => {},
});

export interface AccordionItemContextValue {
  value: string;
  open: boolean;
  disabled: boolean;
  contentId: string;
  triggerId: string;
}

export const AccordionItemContext = createContext<AccordionItemContextValue>({
  value: '',
  open: false,
  disabled: false,
  contentId: '',
  triggerId: '',
});

export const useAccordionContext = () => useContext(AccordionContext);
export const useAccordionItemContext = () => useContext(AccordionItemContext);
