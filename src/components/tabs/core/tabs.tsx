import React from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { TabsProps } from '../interfaces';

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = 'underline',
  size = 'md',
  fullWidth = false,
}: TabsProps) {
  const theme = useTheme();
  const fallbackId = items[0]?.id;
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? fallbackId);
  const selectedValue = value ?? internalValue ?? fallbackId;
  const activeItem = items.find((item) => item.id === selectedValue) ?? items[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space.small }}>
      <div
        role="tablist"
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: variant === 'underline' ? `1px solid ${theme.colors.border.subtle}` : 'none',
          flexWrap: 'wrap',
        }}
      >
        {items.map((item) => {
          const isActive = item.id === activeItem?.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) {
                  return;
                }

                if (value === undefined) {
                  setInternalValue(item.id);
                }

                onValueChange?.(item.id);
              }}
              style={{
                flex: fullWidth ? 1 : undefined,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: size === 'sm' ? '8px 12px' : '10px 16px',
                border: 'none',
                borderBottom:
                  variant === 'underline'
                    ? `2px solid ${isActive ? theme.colors.brand.base : 'transparent'}`
                    : 'none',
                borderRadius: variant === 'pill' ? theme.radii.full : 0,
                backgroundColor:
                  variant === 'pill'
                    ? isActive
                      ? theme.colors.brand.subtle
                      : theme.colors.background.subtle
                    : 'transparent',
                color: isActive ? theme.colors.text.primary : theme.colors.text.secondary,
                fontSize: size === 'sm' ? theme.fontSizes.xsmall : theme.fontSizes.small,
                fontWeight: isActive ? theme.fontWeights.medium : theme.fontWeights.regular,
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.5 : 1,
              }}
            >
              <span>{item.label}</span>
              {item.badge}
            </button>
          );
        })}
      </div>
      {activeItem && (
        <div role="tabpanel" style={{ color: theme.colors.text.primary }}>
          {activeItem.content}
        </div>
      )}
    </div>
  );
}

export default Tabs;
