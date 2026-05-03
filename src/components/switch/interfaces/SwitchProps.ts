import type { ReactNode } from 'react';

export type SwitchSize = 'small' | 'medium' | 'large';
export type SwitchState = 'idle' | 'checked' | 'invalid' | 'disabled';

/**
 * @platform shared
 * Web consome `<input type=checkbox role=switch>` com slot recipe;
 * `switch.native.tsx` re-implementa track/thumb com `Pressable` + Animated.
 */
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
