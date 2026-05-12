import type { ReactNode } from 'react';
import type { CheckboxSize } from '../context/checkbox-context';

/**
 * @platform shared
 *
 * Checkbox compound props.
 *
 * `Root` renderiza um `<input type="checkbox">` visualmente escondido (web) ou
 * `<Pressable>` (native). `Indicator` é puramente visual — não aceita props
 * HTML do input (essas migraram para `Root`).
 */
export interface CheckboxRootProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  size?: CheckboxSize;
  id?: string;
  name?: string;
  value?: string;
  children: ReactNode;
}

/**
 * `Checkbox.Indicator` é decorativo: lê estado do contexto e renderiza glifo
 * (`Check`/`Minus`) sobre a caixa. Sem props consumidas — slot existe para
 * permitir composição (`<Indicator />` entre `Label` e outros children).
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CheckboxIndicatorProps {}

export interface CheckboxLabelProps {
  children: ReactNode;
}

export interface CheckboxDescriptionProps {
  children: ReactNode;
}
