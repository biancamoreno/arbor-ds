import type { ReactNode } from 'react';
import { Flex, Box, Text } from '../../core';

interface FieldShellProps {
  label?: string;
  helperText?: string;
  error?: string;
  children: ReactNode;
}

export function FieldShell({ label, helperText, error, children }: FieldShellProps) {
  const helperColor = error ? 'feedback.critical.solid' : 'text.secondary';
  const labelColor = error ? 'feedback.critical.solid' : 'text.primary';

  return (
    <Flex flexDirection="column" gap="micro">
      {label && (
        <Box
          as="label"
          fontSize="xsmall"
          fontWeight="medium"
          color={labelColor}
        >
          {label}
        </Box>
      )}
      {children}
      {(error || helperText) && (
        <Text as="span" fontSize="xsmall" color={helperColor}>
          {error ?? helperText}
        </Text>
      )}
    </Flex>
  );
}
