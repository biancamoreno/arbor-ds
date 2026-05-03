import type { CSSProperties, ReactNode } from 'react';
import type { FeedbackTone } from '../../../foundations';

/**
 * @platform shared
 * Mensagem de feedback inline.
 */
export interface AlertRootProps {
  children: ReactNode;
  /**
   * Subset canônico de `FeedbackTone`. `neutral` cobre nota informativa
   * sem urgência; `brand` cobre anúncio do produto; demais tons mantêm
   * a semântica padrão.
   *
   * @default 'info'
   */
  tone?: FeedbackTone;
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
