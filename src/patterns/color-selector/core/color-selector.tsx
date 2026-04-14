import React, { useState } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { ColorSelectorProps } from '../interfaces';

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  value,
  onChange,
  layout = 'horizontal',
  size = 'md',
  showLabels = false,
  columns = 3,
  disabled,
  clearable,
}) => {
  const theme = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const sizeMap = {
    sm: { width: '32px', height: '32px', gap: '0.5rem' },
    md: { width: '40px', height: '40px', gap: '0.75rem' },
    lg: { width: '50px', height: '50px', gap: '1rem' },
  };

  const containerStyle: React.CSSProperties =
    layout === 'grid'
      ? {
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: sizeMap[size].gap,
        }
      : {
          display: 'flex',
          flexWrap: 'wrap' as const,
          gap: sizeMap[size].gap,
          alignItems: 'flex-start',
        };

  const handleSelect = (color: string) => {
    if (!disabled) {
      onChange?.(color);
    }
  };

  return (
    <div style={containerStyle}>
      {colors.map((color, index) => (
        <div
          key={color.value}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            textAlign: 'center',
          } as React.CSSProperties}
        >
          <button
            type="button"
            onClick={() => handleSelect(color.value)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            disabled={disabled}
            style={{
              width: sizeMap[size].width,
              height: sizeMap[size].height,
              borderRadius: '50%',
              backgroundColor: color.value,
              border:
                value === color.value
                  ? `2px solid ${theme.colors.brand.base}`
                  : `1px solid ${theme.colors.border.default}`,
              boxShadow:
                value === color.value
                  ? `0 0 0 2px ${theme.colors.brand.base}33` // ring effect
                  : 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              transition: 'transform 0.2s, box-shadow 0.2s',
              transform: hoveredIndex === index || value === color.value ? 'scale(1.1)' : 'scale(1)',
            } as React.CSSProperties}
            title={color.label}
          />
          {showLabels && (
            <span
              style={{
                fontSize: theme.fontSizes.xsmall,
                color: theme.colors.text.secondary,
                marginTop: '0.25rem',
              } as React.CSSProperties}
            >
              {color.label}
            </span>
          )}
        </div>
      ))}

      {clearable && value && (
        <button
          type="button"
          onClick={() => onChange?.('')}
          style={{
            padding: '0.5rem 1rem',
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: '4px',
            backgroundColor: theme.colors.surface.default,
            cursor: 'pointer',
            fontSize: theme.fontSizes.small,
            color: theme.colors.text.secondary,
          } as React.CSSProperties}
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
};

ColorSelector.displayName = 'ColorSelector';
export default ColorSelector;
