import type { HTMLAttributes, ReactNode } from 'react';

/**
 * @platform shared
 */
export interface CardRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'outlined' | 'elevated' | 'flat';
  /** Padding interno padrão */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
