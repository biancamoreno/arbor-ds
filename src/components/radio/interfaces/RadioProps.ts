import type { ReactNode } from 'react';

export type RadioSize = 'small' | 'medium' | 'large';
export type RadioVariant = 'outline' | 'filled';

/**
 * @platform shared
 * Web: `<input type=radio>` invisível + label clicável.
 * Native: `<Pressable accessibilityRole="radio">` em `radio.native.tsx`.
 *
 * `variant`:
 * - `'outline'` (default) — círculo transparente com borda visível.
 * - `'filled'` — círculo com `background.subtle` preenchendo o indicador no
 *   estado idle. Checked retorna a `surface.default` para o dot brand-solid
 *   contrastar.
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
  variant?: RadioVariant;
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
