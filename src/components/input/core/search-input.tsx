import React from 'react';
import { Icon } from '../../core';
import { markFieldAware } from '../../field/utils/is-field-aware';
import type { SearchInputProps } from '../interfaces';
import { TextInput } from './textinput';

/**
 * @platform shared
 *
 * `TextInput` pré-configurado com `type="search"` e ícone de lupa à esquerda.
 * Dispara `onSearch(value)` quando o usuário pressiona Enter (sem debounce
 * embutido — para busca incremental, use `onValueChange`). Encadeia `onKeyDown`
 * antes do handler interno para permitir intercepção do consumidor.
 *
 * @see {@link SearchInputProps}
 */
export const SearchInput = markFieldAware(
  React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({ onSearch, onKeyDown, ...props }, ref) => (
      <TextInput
        ref={ref}
        type="search"
        leftIcon={<Icon name="Search" size="small" decorative />}
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
