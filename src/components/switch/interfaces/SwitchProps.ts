import type { ReactNode } from 'react';

export type SwitchSize = 'sm' | 'md' | 'lg';
export type SwitchState = 'idle' | 'checked' | 'invalid' | 'disabled';

export interface SwitchRootProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
  size?: SwitchSize;
  children?: ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}
