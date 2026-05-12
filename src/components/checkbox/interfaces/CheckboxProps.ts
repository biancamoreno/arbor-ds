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
  children?: ReactNode;
}

/**
 * Props do `Checkbox` (top-level) — atalho declarativo para o caso comum
 * (98%): renderiza Root + Indicator + Label/Description automaticamente.
 *
 * Quando precisar de ordem de slots não-trivial (Label antes do Indicator,
 * Description com ícone embutido, integração custom com Field), use o
 * compound: `<Checkbox.Root>` + `<Checkbox.Indicator />` + `<Checkbox.Label />`.
 */
export interface CheckboxProps extends Omit<CheckboxRootProps, 'children'> {
  /** Texto do label ao lado do indicador. Quando presente, renderiza automaticamente. */
  label?: ReactNode;
  /** Texto descritivo abaixo do label. Renderiza automaticamente quando presente. */
  description?: ReactNode;
  /**
   * Filhos para o modo compound — só consumido quando `label` e `description`
   * são undefined. Quando qualquer um deles está definido, `children` é
   * ignorado e a anatomia interna é gerada automaticamente.
   */
  children?: ReactNode;
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
