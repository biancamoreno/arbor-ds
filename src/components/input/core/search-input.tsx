import React from 'react';
import { Box } from '../../core';
import type { SearchInputProps } from '../interfaces';
import { TextInput } from './textinput';

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, onKeyDown, ...props }, ref) => (
    <TextInput
      ref={ref}
      type="search"
      leftIcon={<Box as="span" aria-hidden="true">Q</Box>}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === 'Enter') {
          onSearch?.(event.currentTarget.value);
        }
      }}
      {...props}
    />
  ),
);

SearchInput.displayName = 'SearchInput';
