import type { InputHTMLAttributes, ReactNode } from 'react';
import type { FieldBaseProps } from './shared';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, FieldBaseProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  clearable?: boolean;
  onValueChange?: (value: string) => void;
}
