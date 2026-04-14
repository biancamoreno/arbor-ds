import type { ReactNode } from 'react';
import type { ProductCardProps } from '../../product-card';

export interface ProductGridProps {
  items: ProductCardProps[];
  columns?: 2 | 3 | 4;
  emptyState?: ReactNode;
}
