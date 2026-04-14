import type { ReactNode } from 'react';

export interface ProductCardProps {
  id?: string | number;
  title: ReactNode;
  image: string;
  imageAlt?: string;
  description?: ReactNode;
  badge?: ReactNode;
  eta?: ReactNode;
  price: number;
  compareAtPrice?: number;
  locale?: string;
  currency?: string;
  favorite?: boolean;
  onFavoriteChange?: (checked: boolean) => void;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  footer?: ReactNode;
}
