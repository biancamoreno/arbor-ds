import type { TextareaHTMLAttributes } from 'react';
import type { FieldBaseProps } from './shared';

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    FieldBaseProps {
  showCharCount?: boolean;
  onValueChange?: (value: string) => void;
}
