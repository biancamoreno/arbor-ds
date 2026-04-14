import type { ReactNode } from 'react';

export interface TabsItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  badge?: ReactNode;
}

export interface TabsProps {
  items: TabsItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: 'underline' | 'pill';
  size?: 'sm' | 'md';
  fullWidth?: boolean;
}
