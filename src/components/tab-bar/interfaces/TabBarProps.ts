import type { ReactNode } from 'react';
import type { IconName } from '../../core/icon';

/**
 * @platform native-ready
 * Bottom tab bar; `tab-bar.native.tsx` posiciona com safe-area iOS e usa
 * `Clickable.native` para o press feedback nos itens.
 */
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
