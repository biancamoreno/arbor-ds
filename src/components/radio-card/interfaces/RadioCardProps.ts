import type { InputHTMLAttributes, ReactNode } from 'react';

export interface RadioCardProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'onChange' | 'size' | 'type'> {
  label: ReactNode;
  description?: ReactNode;
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onCheckedChange?: (checked: boolean, value: string) => void;
  children?: ReactNode;
}
