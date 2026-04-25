import type { ReactNode } from 'react';

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioRootProps {
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  size?: RadioSize;
  children: ReactNode;
}

export interface RadioIndicatorProps {
  style?: React.CSSProperties;
}

export interface RadioLabelProps {
  children: ReactNode;
}

export interface RadioDescriptionProps {
  children: ReactNode;
}
