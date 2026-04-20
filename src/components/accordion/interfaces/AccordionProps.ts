import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

/**
 * @platform web-only
 */
export interface AccordionRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Modo single: apenas um item aberto por vez */
  type?: 'single' | 'multiple';
  /** Valor(es) controlado(s) */
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  value: string;
  disabled?: boolean;
}

export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
