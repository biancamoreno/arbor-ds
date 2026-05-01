import type { ReactNode } from 'react';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectRootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  size?: SelectSize;
  children: ReactNode;
}

export interface SelectTriggerProps {
  children?: ReactNode;
}

export interface SelectValueProps {
  placeholder?: string;
}

export interface SelectContentProps {
  children: ReactNode;
}

export interface SelectItemProps {
  value: string;
  disabled?: boolean;
  /**
   * Texto plano usado pelo `SelectValue` (display) e por type-ahead. Default: extraído
   * recursivamente de `children`. Defina explicitamente quando `children` não for trivial
   * (ex.: contiver `Icon` + texto, ou nodes que não traduzam para string limpa).
   */
  displayText?: string;
  children: ReactNode;
}
