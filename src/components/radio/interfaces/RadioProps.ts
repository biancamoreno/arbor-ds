import type { ReactNode } from 'react';

export type RadioSize = 'small' | 'medium' | 'large';

/**
 * @platform shared
 * Web: `<input type=radio>` invisível + label clicável.
 * Native: `<Pressable accessibilityRole="radio">` em `radio.native.tsx`.
 */
export interface RadioRootProps {
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  size?: RadioSize;
  children: ReactNode;
}

export interface RadioIndicatorProps {
  style?: React.CSSProperties;
}

export interface RadioLabelProps {
  children: ReactNode;
}

export interface RadioDescriptionProps {
  children: ReactNode;
}
