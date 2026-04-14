import type { TextInputProps } from './TextInputProps';

export interface SearchInputProps extends Omit<TextInputProps, 'type'> {
  onSearch?: (value: string) => void;
}
