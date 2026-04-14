export interface ProductGalleryImage {
  id: string;
  src: string;
  alt?: string;
  label?: string;
  thumbnailSrc?: string;
}

export interface ProductGalleryProps {
  images: ProductGalleryImage[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  showThumbnails?: boolean;
}
