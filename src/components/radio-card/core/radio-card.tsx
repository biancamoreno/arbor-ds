import React from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { RadioCardProps } from '../interfaces';

const sizeMap = {
  sm: {
    padding: '12px',
    titleSize: '16px',
    descriptionSize: '10px',
  },
  md: {
    padding: '16px',
    titleSize: '16px',
    descriptionSize: '10px',
  },
  lg: {
    padding: '20px',
    titleSize: '20px',
    descriptionSize: '16px',
  },
} as const;

export const RadioCard = React.forwardRef<HTMLInputElement, RadioCardProps>(
  (
    {
      label,
      description,
      value,
      checked,
      defaultChecked = false,
      disabled = false,
      size = 'md',
      onCheckedChange,
      children,
      name,
      id,
      style,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme();
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isChecked = checked ?? internalChecked;
    const sizing = sizeMap[size];

    return (
      <label
        style={{
          display: 'flex',
          width: '100%',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <input
          {...rest}
          ref={ref}
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={isChecked}
          disabled={disabled}
          onChange={() => {
            if (disabled) {
              return;
            }

            if (checked === undefined) {
              setInternalChecked(true);
            }

            onCheckedChange?.(true, value);
          }}
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
        <div
          aria-checked={isChecked}
          role="radio"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: theme.space.small,
            padding: sizing.padding,
            borderRadius: theme.radii.medium,
            border: `1px solid ${isChecked ? theme.colors.brand.base : theme.colors.border.default}`,
            backgroundColor: isChecked ? theme.colors.brand.subtle : theme.colors.surface.default,
            boxShadow: isChecked ? `0 0 0 2px ${theme.colors.brand.subtle}` : 'none',
            transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
            ...style,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
            <span
              style={{
                color: theme.colors.text.primary,
                fontSize: sizing.titleSize,
                fontWeight: theme.fontWeights.medium,
              }}
            >
              {label}
            </span>
            {description && (
              <span
                style={{
                  color: theme.colors.text.secondary,
                  fontSize: sizing.descriptionSize,
                }}
              >
                {description}
              </span>
            )}
            {children && <div>{children}</div>}
          </div>
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              borderRadius: theme.radii.full,
              border: `1px solid ${isChecked ? theme.colors.brand.base : theme.colors.border.strong}`,
              backgroundColor: theme.colors.surface.default,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: theme.radii.full,
                backgroundColor: isChecked ? theme.colors.brand.base : 'transparent',
              }}
            />
          </span>
        </div>
      </label>
    );
  },
);

RadioCard.displayName = 'RadioCard';

export default RadioCard;
