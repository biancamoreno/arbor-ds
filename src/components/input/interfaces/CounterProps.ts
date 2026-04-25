export interface CounterProps {
  value: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  showInput?: boolean;
}
