import React from 'react';
import { useTheme } from '../../../ecosystem';
import { Tag } from '../../../components';
import type { CategoryMenuProps } from '../interfaces';

export function CategoryMenu({ items, value, defaultValue, onValueChange }: CategoryMenuProps) {
  const theme = useTheme();
  const fallbackValue = items[0]?.value;
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? fallbackValue);
  const selectedValue = value ?? internalValue ?? fallbackValue;

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {items.map((item) => {
        const isSelected = item.value === selectedValue;

        return (
          <Tag
            key={item.value}
            selected={isSelected}
            tone={isSelected ? 'brand' : 'neutral'}
            onClick={() => {
              if (value === undefined) {
                setInternalValue(item.value);
              }
              onValueChange?.(item.value);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderColor: isSelected ? theme.colors.brand.base : undefined,
            }}
          >
            <span>{item.label}</span>
            {typeof item.count === 'number' && <span>({item.count})</span>}
          </Tag>
        );
      })}
    </div>
  );
}

export default CategoryMenu;
