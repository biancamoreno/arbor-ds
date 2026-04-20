import type { ReactNode } from 'react';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchRootProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
  size?: SwitchSize;
  children?: ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export interface SwitchTrackProps {
  children?: ReactNode;
}

export interface SwitchThumbProps {
  style?: React.CSSProperties;
}
