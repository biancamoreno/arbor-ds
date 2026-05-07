import React, { useId } from 'react';
import { useSlotRecipe } from '../../../ecosystem';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Text } from '../../core';
import type { TextAreaProps } from '../interfaces';
import { FieldShell } from './field-shell';

/**
 * @platform shared
 *
 * Área de texto multi-linha Field-aware. Mesmo modelo de cabeamento que
 * `TextInput` (herda do `FieldContext` quando aninhado em `<Field>`,
 * `FieldShell` standalone). `rows` define a altura inicial; `maxLength` limita
 * caracteres e, combinado com `showCharCount`, exibe contador
 * `<atual> / <máx>` abaixo do controle (cor crítica acima de 90% do limite).
 *
 * @see {@link TextAreaProps}
 */
export const TextArea = markFieldAware(
  React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
      {
        label,
        error,
        size = 'medium',
        variant = 'default',
        helperText,
        disabled,
        value,
        onChange,
        onValueChange,
        rows = 4,
        maxLength,
        showCharCount,
        style,
        id: idProp,
        ...rest
      },
      ref,
    ) => {
      const fieldCtx = useFieldContext();
      const autoId = useId();

      const effectiveError = fieldCtx?.invalid ? (error ?? ' ') : error;
      const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;
      const state = effectiveError ? 'error' : effectiveDisabled ? 'disabled' : 'idle';

      const slots = useSlotRecipe<'frame' | 'control'>('input', { size, variant, state });
      const inputId = fieldCtx?.fieldId ?? idProp ?? autoId;
      const charCount = (value as string)?.length || 0;

      const textareaElement = (
        <Box
          as="textarea"
          ref={ref}
          {...slots.frame}
          {...slots.control}
          cursor={effectiveDisabled ? 'not-allowed' : 'auto'}
          id={inputId}
          rows={rows}
          value={value}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange?.(event);
            onValueChange?.(event.target.value);
          }}
          disabled={effectiveDisabled}
          maxLength={maxLength}
          aria-describedby={fieldCtx?.descriptionRegistered ? fieldCtx.descriptionId : undefined}
          aria-required={fieldCtx?.required || undefined}
          aria-invalid={fieldCtx?.invalid || undefined}
          aria-errormessage={fieldCtx?.invalid && fieldCtx?.errorRegistered ? fieldCtx.errorId : undefined}
          {...rest}
          style={{
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            ...style,
          }}
        />
      );

      const charCountEl = showCharCount && maxLength && (
        <Flex justifyContent="flex-end">
          <Text
            as="span"
            fontSize="xsmall"
            color={charCount > maxLength * 0.9 ? 'feedback.critical.solid' : 'text.secondary'}
          >
            {charCount} / {maxLength}
          </Text>
        </Flex>
      );

      if (fieldCtx) {
        return (
          <>
            {textareaElement}
            {charCountEl}
          </>
        );
      }

      return (
        <FieldShell label={label} helperText={helperText} error={error}>
          {textareaElement}
          {charCountEl}
        </FieldShell>
      );
    },
  ),
);

TextArea.displayName = 'TextArea';
