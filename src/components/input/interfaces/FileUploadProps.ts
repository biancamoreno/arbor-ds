export interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onFileSelect?: (files: File[]) => void;
  preview?: boolean;
  previewUrl?: string;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
  dragAndDrop?: boolean;
  onRemove?: () => void;
}
