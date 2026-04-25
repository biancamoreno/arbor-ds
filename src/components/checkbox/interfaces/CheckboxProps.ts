import type { InputHTMLAttributes, ReactNode } from 'react';

/**
 * @platform web-only
 * Checkbox que estende HTMLInputElement — usa APIs DOM exclusivas da web.
 */
export interface CheckboxRootProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
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
