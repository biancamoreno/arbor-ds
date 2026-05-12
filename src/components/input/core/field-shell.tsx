import type { ReactNode } from 'react';
import { useSlotRecipe } from '../../../ecosystem';
import { Flex, Box, Text } from '../../core';

interface FieldShellProps {
  label?: string;
  helperText?: string;
  error?: string;
  children: ReactNode;
}

export function FieldShell({ label, helperText, error, children }: FieldShellProps) {
  const invalid = Boolean(error);
  const slots = useSlotRecipe('field', { invalid });
  const rootStyles = (slots as Record<string, unknown>).root as Record<string, unknown> | undefined;
  const labelStyles = (slots as Record<string, unknown>).label as Record<string, unknown> | undefined;
  const descriptionStyles = (slots as Record<string, unknown>).description as
    | Record<string, unknown>
    | undefined;
  const errorStyles = (slots as Record<string, unknown>).error as Record<string, unknown> | undefined;

  const helperOrError = error ?? helperText;
  const helperSlotStyles = error ? errorStyles : descriptionStyles;

  return (
    <Flex {...(rootStyles ?? {})}>
      {label && (
        <Box as="label" {...(labelStyles ?? {})}>
          {label}
        </Box>
      )}
      {children}
      {helperOrError && (
        <Text as="span" {...(helperSlotStyles ?? {})}>
          {helperOrError}
        </Text>
      )}
    </Flex>
  );
}
