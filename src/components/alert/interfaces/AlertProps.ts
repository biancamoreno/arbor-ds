import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

/**
 * @platform shared
 * Mensagem de feedback inline.
 */
export interface AlertRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'critical';
}

export interface AlertIconProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export interface AlertTitleProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface AlertDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface AlertCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default "Fechar" */
  label?: string;
}
