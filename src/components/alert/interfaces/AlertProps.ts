import type { CSSProperties, ReactNode } from 'react';

/**
 * @platform shared
 * Mensagem de feedback inline.
 */
export interface AlertRootProps {
  children: ReactNode;
  /** @default 'info' */
  tone?: 'info' | 'success' | 'warning' | 'critical';
  className?: string;
  style?: CSSProperties;
}

export interface AlertIconProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface AlertTitleProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface AlertDescriptionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface AlertCloseProps {
  /** @default "Fechar" */
  label?: string;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}
