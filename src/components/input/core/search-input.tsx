import React from 'react';
import { Icon } from '../../core';
import { markFieldAware } from '../../field/utils/is-field-aware';
import type { SearchInputProps } from '../interfaces';
import { TextInput } from './textinput';

export const SearchInput = markFieldAware(
  React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({ onSearch, onKeyDown, ...props }, ref) => (
      <TextInput
        ref={ref}
        type="search"
        leftIcon={<Icon name="Search" size="sm" decorative />}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.key === 'Enter') {
            onSearch?.(event.currentTarget.value);
          }
        }}
        {...props}
      />
    ),
  ),
);

SearchInput.displayName = 'SearchInput';
