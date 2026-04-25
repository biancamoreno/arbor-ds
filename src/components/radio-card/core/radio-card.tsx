import React from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { transition } from '../../../ecosystem/utils/functions';
import { Box, Flex, Text } from '../../core';
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
      <Box
        as="label"
        width="100%"
        cursor={disabled ? 'not-allowed' : 'pointer'}
        opacity={disabled ? 0.6 : 1}
        borderRadius="medium"
        _focusVisibleWithin={{
          outline: '2px solid',
          outlineColor: 'interactive.default',
          outlineOffset: '2px',
        }}
      >
        <Box
          as="input"
          innerRef={ref}
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={isChecked}
          disabled={disabled}
          onChange={() => {
            if (disabled) return;
            if (checked === undefined) setInternalChecked(true);
            onCheckedChange?.(true);
          }}
          position="absolute"
          opacity={0}
          pointerEvents="none"
          {...rest}
        />
        <Flex
          aria-hidden="true"
          width="100%"
          alignItems="flex-start"
          justifyContent="space-between"
          borderRadius="medium"
          style={{
            gap: theme.space.small,
            padding: sizing.padding,
            border: `1px solid ${isChecked ? theme.colors.brand.base : theme.colors.border.default}`,
            backgroundColor: isChecked ? theme.colors.brand.subtle : theme.colors.surface.default,
            boxShadow: isChecked ? `0 0 0 2px ${theme.colors.brand.subtle}` : 'none',
            transition: transition(['border-color', 'background-color', 'box-shadow'], 'fast'),
            ...style,
          }}
        >
          <Flex flexDirection="column" gap="6px" style={{ minWidth: 0 }}>
            <Text
              as="span"
              fontWeight="medium"
              style={{
                color: theme.colors.text.primary,
                fontSize: sizing.titleSize,
              }}
            >
              {label}
            </Text>
            {description && (
              <Text
                as="span"
                style={{
                  color: theme.colors.text.secondary,
                  fontSize: sizing.descriptionSize,
                }}
              >
                {description}
              </Text>
            )}
            {children && <Box>{children}</Box>}
          </Flex>
          <Flex
            as="span"
            aria-hidden="true"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            width={20}
            height={20}
            borderRadius="full"
            flexShrink={0}
            style={{
              border: `1px solid ${isChecked ? theme.colors.brand.base : theme.colors.border.strong}`,
              backgroundColor: theme.colors.surface.default,
            }}
          >
            <Box
              as="span"
              width={10}
              height={10}
              borderRadius="full"
              style={{
                backgroundColor: isChecked ? theme.colors.brand.base : 'transparent',
              }}
            />
          </Flex>
        </Flex>
      </Box>
    );
  },
);

RadioCard.displayName = 'RadioCard';
