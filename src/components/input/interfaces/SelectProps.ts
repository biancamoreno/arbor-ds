import type { SelectHTMLAttributes } from 'react';
import type { FieldBaseProps } from './shared';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size'>,
    FieldBaseProps {
  placeholder?: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (value?: string | number) => void;
  searchable?: boolean;
  clearable?: boolean;
}
