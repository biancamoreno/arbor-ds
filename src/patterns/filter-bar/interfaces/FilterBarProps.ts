import type { ReactNode } from 'react';
import type { SelectOption } from '../../../components';
import type { CategoryMenuItem } from '../../category-menu';

export interface FilterBarProps {
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  searchPlaceholder?: string;
  categories?: CategoryMenuItem[];
  categoryValue?: string;
  onCategoryValueChange?: (value: string) => void;
  sortOptions?: SelectOption[];
  sortValue?: string | number;
  onSortChange?: (value?: string | number) => void;
  summary?: ReactNode;
  advancedFilters?: ReactNode;
  advancedFiltersTitle?: ReactNode;
}
