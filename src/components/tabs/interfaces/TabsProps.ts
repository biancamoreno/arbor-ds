import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

/**
 * @platform native-ready
 * Tabs compostas via slots. Web tem navegação por teclado e semântica ARIA automáticas;
 * native usa `accessibilityRole="tab"/"tablist"` + `accessibilityState.selected` (touch-only).
 */
export interface TabsRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'underline' | 'pill';
  fullWidth?: boolean;
}

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Identificador único desta tab — deve coincidir com TabsContent value */
  value: string;
  size?: 'small' | 'medium';
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  value: string;
}
