import type { ButtonProps } from '../../../components/button';
import type { ReactNode } from 'react';

export interface FavoriteButtonProps extends Omit<ButtonProps, 'children'> {
  checked?: boolean;
  defaultChecked?: boolean;
  label?: string;
  tooltip?: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}
