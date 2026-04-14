import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { SelectProps } from '../interfaces';
import { FieldShell, getFieldColors, getFieldFrameStyle } from './shared';

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      placeholder = 'Select an option',
      options,
      value,
      onChange,
      error,
      size = 'md',
      variant = 'default',
      searchable,
      clearable,
      helperText,
      disabled,
    },
    ref,
  ) => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const colors = getFieldColors(theme, { error, variant, disabled });
    const frameStyle = getFieldFrameStyle(theme, { size, variant, error, disabled });

    const selectedOption = options.find((option) => option.value === value);
    const displayValue = selectedOption?.label || placeholder;
    const filteredOptions =
      searchable && searchQuery
        ? options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : options;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <FieldShell theme={theme} label={label} helperText={helperText} error={error}>
        <div ref={ref} style={{ position: 'relative' }}>
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => !disabled && setIsOpen((open) => !open)}
              disabled={disabled}
              style={{
                ...frameStyle,
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: value ? colors.textColor : colors.placeholderColor,
                fontFamily: 'inherit',
                textAlign: 'left',
                boxShadow: isOpen ? `0 0 0 2px ${theme.colors.brand.subtle}` : 'none',
              }}
            >
              <span>{displayValue}</span>
              <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {clearable && value && (
                  <button
                    type="button"
                    aria-label="Clear selection"
                    onClick={(event) => {
                      event.stopPropagation();
                      onChange?.(undefined);
                      setSearchQuery('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: colors.placeholderColor,
                      fontSize: theme.fontSizes.small,
                      padding: 0,
                    }}
                  >
                    x
                  </button>
                )}
                <span aria-hidden="true">v</span>
              </span>
            </button>

            {isOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  backgroundColor: theme.colors.surface.raised,
                  border: `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.radii.small,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  zIndex: 1000,
                  maxHeight: '16rem',
                  overflowY: 'auto',
                }}
              >
                {searchable && (
                  <div style={{ padding: '8px', borderBottom: `1px solid ${theme.colors.border.subtle}` }}>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: `1px solid ${theme.colors.border.default}`,
                        borderRadius: theme.radii.small,
                        fontSize: theme.fontSizes.small,
                        outline: 'none',
                      }}
                    />
                  </div>
                )}

                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        if (option.disabled) {
                          return;
                        }
                        onChange?.(option.value);
                        setIsOpen(false);
                        setSearchQuery('');
                      }}
                      disabled={option.disabled}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        backgroundColor:
                          value === option.value ? theme.colors.brand.subtle : theme.colors.surface.raised,
                        color: option.disabled
                          ? theme.colors.text.disabled
                          : value === option.value
                            ? theme.colors.brand.strong
                            : theme.colors.text.primary,
                        cursor: option.disabled ? 'not-allowed' : 'pointer',
                        textAlign: 'left',
                        fontSize: theme.fontSizes.small,
                        transition: 'background-color 0.15s',
                        fontWeight: value === option.value ? theme.fontWeights.medium : theme.fontWeights.regular,
                      }}
                    >
                      {option.label}
                    </button>
                  ))
                ) : (
                  <div
                    style={{
                      padding: '16px',
                      textAlign: 'center',
                      color: theme.colors.text.secondary,
                      fontSize: theme.fontSizes.small,
                    }}
                  >
                    No options found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </FieldShell>
    );
  },
);

Select.displayName = 'Select';

export default Select;
