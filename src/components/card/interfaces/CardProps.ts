import type { HTMLAttributes, ReactNode } from 'react';

/**
 * @platform shared
 */
export interface CardRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'outlined' | 'elevated' | 'flat' | 'hoverable' | 'clickable';
  /** Padding interno padrão */
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
