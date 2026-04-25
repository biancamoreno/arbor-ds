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
