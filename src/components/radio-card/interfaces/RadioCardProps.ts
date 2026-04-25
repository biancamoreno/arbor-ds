import type { InputHTMLAttributes, ReactNode } from 'react';

/**
 * @platform web-only
 * RadioCard que estende HTMLInputElement — usa APIs DOM exclusivas da web.
 * Não compatível com React Native sem implementação dedicada.
 */
export interface RadioCardProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'onChange' | 'size' | 'type'> {
  label: ReactNode;
  description?: ReactNode;
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onCheckedChange?: (checked: boolean) => void;
  children?: ReactNode;
}
