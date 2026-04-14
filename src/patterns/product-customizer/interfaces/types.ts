export interface CustomizationOption {
  id: string;
  name: string;
  type: 'color' | 'size' | 'text' | 'upload' | 'checkbox';
  value?: string | string[];
  options?: { value: string; label: string }[];
  required?: boolean;
  validation?: (value: any) => string | null;
  placeholder?: string;
  maxLength?: number;
}

export interface ProductCustomizerProps {
  productId: string;
  productName: string;
  previewImage: string;
  onPreviewUpdate?: (customizations: Record<string, any>) => void;
  previewLoading?: boolean;
  options: CustomizationOption[];
  values?: Record<string, any>;
  onChange?: (values: Record<string, any>) => void;
  onConfirm?: (customizations: Record<string, any>) => void;
  onCancel?: () => void;
  showPreview?: boolean;
  layout?: 'side-by-side' | 'stacked';
}
