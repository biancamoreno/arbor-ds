import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { CheckboxProps } from '../interfaces';

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, indeterminate, checked, disabled, style, ...props }, ref) => {
    const theme = useTheme();
    const internalRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = Boolean(indeterminate) && !checked;
      }
    }, [checked, indeterminate]);

    return (
      <label
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <input
          {...props}
          ref={(node) => {
            internalRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          style={{
            width: '18px',
            height: '18px',
            marginTop: '2px',
            accentColor: theme.colors.interactive.default,
            ...style,
          }}
        />
        {(label || description) && (
          <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {label && (
              <span style={{ color: theme.colors.text.primary, fontSize: theme.fontSizes.small }}>{label}</span>
            )}
            {description && (
              <span style={{ color: theme.colors.text.secondary, fontSize: theme.fontSizes.xsmall }}>
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
