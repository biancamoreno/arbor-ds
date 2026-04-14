import type { ReactNode } from 'react';

export interface PriceBlockProps {
  price: number;
  compareAtPrice?: number;
  badge?: ReactNode;
  note?: ReactNode;
  installmentText?: ReactNode;
  locale?: string;
  currency?: string;
  showSavings?: boolean;
}
