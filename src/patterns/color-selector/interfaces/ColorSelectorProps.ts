export interface ColorOption {
  value: string; // Hex color code (#FF0000)
  label: string; // "Vermelho"
}

export interface ColorSelectorProps {
  colors: ColorOption[];
  value?: string; // Selected color hex
  onChange?: (color: string) => void;

  // Display
  layout?: 'horizontal' | 'grid'; // Default: horizontal
  size?: 'sm' | 'md' | 'lg'; // Swatch size
  showLabels?: boolean; // Default: false
  columns?: number; // For grid layout (default: 3)

  // Behavior
  disabled?: boolean;
  clearable?: boolean;
}
