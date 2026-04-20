/**
 * @platform web-only
 * Família de inputs baseada em elementos HTML de formulário — não compatível com React Native sem implementação dedicada.
 */
export type FieldSize = 'sm' | 'md' | 'lg';

export type FieldVariant = 'default' | 'filled';

export interface FieldBaseProps {
  label?: string;
  error?: string;
  size?: FieldSize;
  variant?: FieldVariant;
  helperText?: string;
  disabled?: boolean;
}
