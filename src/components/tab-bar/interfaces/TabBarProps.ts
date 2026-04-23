import type { ReactNode } from 'react';
import type { IconName } from '../../core/icon/interfaces/IconName';

export interface TabBarProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  safeAreaBottom?: boolean;
  blurred?: boolean;
  'aria-label'?: string;
}

export interface TabBarItemProps {
  value: string;
  icon: IconName;
  label: string;
  badge?: number | boolean;
  disabled?: boolean;
}
