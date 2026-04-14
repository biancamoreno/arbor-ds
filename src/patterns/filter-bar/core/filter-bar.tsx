import React from 'react';
import { useTheme } from '../../../ecosystem';
import { Button, Drawer, SearchInput } from '../../../components';
import { CategoryMenu } from '../../category-menu';
import { SortDropdown } from '../../sort-dropdown';
import type { FilterBarProps } from '../interfaces';

export function FilterBar({
  searchValue,
  onSearchValueChange,
  searchPlaceholder = 'Buscar por produto, material ou categoria',
  categories = [],
  categoryValue,
  onCategoryValueChange,
  sortOptions = [],
  sortValue,
  onSortChange,
  summary,
  advancedFilters,
  advancedFiltersTitle = 'Filtros avançados',
}: FilterBarProps) {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <>
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.space.small,
          padding: theme.space.small,
          borderRadius: theme.radii.large,
          border: `1px solid ${theme.colors.border.subtle}`,
          backgroundColor: theme.colors.surface.default,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(220px, 1fr) auto', gap: '12px' }}>
          <SearchInput
            value={searchValue}
            onValueChange={onSearchValueChange}
            placeholder={searchPlaceholder}
            aria-label="Buscar produtos"
          />
          <SortDropdown options={sortOptions} value={sortValue} onChange={onSortChange} />
          {advancedFilters && (
            <Button variant="ghost" onClick={() => setDrawerOpen(true)}>
              Mais filtros
            </Button>
          )}
        </div>
        {categories.length > 0 && (
          <CategoryMenu items={categories} value={categoryValue} onValueChange={onCategoryValueChange} />
        )}
        {summary && (
          <span
            style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.xsmall,
            }}
          >
            {summary}
          </span>
        )}
      </section>
      {advancedFilters && (
        <Drawer open={drawerOpen} title={advancedFiltersTitle} onOpenChange={setDrawerOpen}>
          {advancedFilters}
        </Drawer>
      )}
    </>
  );
}

export default FilterBar;
