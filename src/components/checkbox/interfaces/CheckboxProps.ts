import type { ReactNode } from 'react';
import type { CheckboxSize, CheckboxVariant } from '../context/checkbox-context';

/**
 * @platform shared
 *
 * Checkbox compound props.
 *
 * `Root` renderiza um `<input type="checkbox">` visualmente escondido (web) ou
 * `<Pressable>` (native). `Indicator` é puramente visual — não aceita props
 * HTML do input (essas migraram para `Root`).
 *
 * `variant`:
 * - `'outline'` (default) — caixa transparente com borda visível.
 * - `'filled'` — caixa com `background.subtle` preenchendo o indicador no
 *   estado idle (mais "tactile" sobre fundo branco). Estado checked preenche
 *   com `interactive.default` em ambos.
 */
export interface CheckboxRootProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
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
