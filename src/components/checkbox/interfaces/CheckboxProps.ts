import type { InputHTMLAttributes, ReactNode } from 'react';

/**
 * Checkbox compound props. Web consome `<input type=checkbox>` (APIs DOM);
 * `checkbox.native.tsx` re-implementa o indicador com `Pressable` + tokens.
 */
export interface CheckboxRootProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  id?: string;
  name?: string;
  value?: string;
  children: ReactNode;
}

export interface CheckboxIndicatorProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange' | 'disabled' | 'size'> {
  style?: React.CSSProperties;
}

export interface CheckboxLabelProps {
  children: ReactNode;
}

export interface CheckboxDescriptionProps {
  children: ReactNode;
}
