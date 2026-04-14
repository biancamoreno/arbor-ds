import { useTheme } from '../../../ecosystem';
import { ProductCard } from '../../product-card';
import type { ProductGridProps } from '../interfaces';

export function ProductGrid({ items, columns = 3, emptyState }: ProductGridProps) {
  const theme = useTheme();

  if (items.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: theme.space.small,
      }}
    >
      {items.map((item, index) => (
        <ProductCard key={String(item.id ?? index)} {...item} />
      ))}
    </div>
  );
}

export default ProductGrid;
