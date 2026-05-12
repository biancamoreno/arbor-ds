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

/**
 * `Radio.Indicator` é decorativo: lê estado do contexto e renderiza o círculo
 * com `dot` interno. Sem props consumidas — slot existe para permitir
 * composição (`<Indicator />` entre `Label` e outros children).
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RadioIndicatorProps {}

export interface RadioLabelProps {
  children: ReactNode;
}

export interface RadioDescriptionProps {
  children: ReactNode;
}
