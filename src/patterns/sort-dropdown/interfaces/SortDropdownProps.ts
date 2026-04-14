import type { ReactNode } from 'react';
import type { SelectOption } from '../../../components';

export interface SortDropdownProps {
  label?: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (value?: string | number) => void;
  disabled?: boolean;
  helperText?: ReactNode;
}
