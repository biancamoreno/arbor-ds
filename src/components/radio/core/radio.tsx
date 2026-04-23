import { useId } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useControllableState } from '../../../ecosystem/primitives';
import { useFieldContext } from '../../field/context/field-context';
import { Box, Flex, Text } from '../../core';
import { RadioContext, useRadioContext } from '../context/radio-context';
import { transition } from '../../../ecosystem/utils/functions';
import type {
  RadioRootProps,
  RadioIndicatorProps,
  RadioLabelProps,
  RadioDescriptionProps,
  RadioSize,
} from '../interfaces/RadioProps';

const sizeMap: Record<RadioSize, { padding: string; titleSize: string; descriptionSize: string }> = {
  sm: { padding: '12px', titleSize: '14px', descriptionSize: '10px' },
  md: { padding: '16px', titleSize: '16px', descriptionSize: '12px' },
  lg: { padding: '20px', titleSize: '20px', descriptionSize: '14px' },
};

function RadioRoot({
  value,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  id: idProp,
  name,
  size = 'md',
  children,
}: RadioRootProps) {
  const autoId = useId();
  const fieldCtx = useFieldContext();
  const inputId = fieldCtx?.fieldId ?? idProp ?? autoId;
  const effectiveDisabled = disabled || (fieldCtx?.isDisabled ?? false);
  const theme = useTheme();
  const sizing = sizeMap[size];

  const [isChecked, setIsChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: (val) => onCheckedChange?.(val, value),
  });

  return (
    <RadioContext.Provider
      value={{
        isChecked,
        isDisabled: effectiveDisabled,
        inputId,
        value,
        name,
        onChange: () => !effectiveDisabled && setIsChecked(true),
      }}
    >
      <Box
        as="label"
        width="100%"
        cursor={effectiveDisabled ? 'not-allowed' : 'pointer'}
        opacity={effectiveDisabled ? 0.6 : 1}
      >
        <Box
          as="input"
          id={inputId}
          type="radio"
          name={name}
          value={value}
          checked={isChecked}
          disabled={effectiveDisabled}
          aria-describedby={fieldCtx?.descriptionId}
          aria-required={fieldCtx?.isRequired || undefined}
          aria-invalid={fieldCtx?.isInvalid || undefined}
          aria-errormessage={fieldCtx?.isInvalid ? fieldCtx.errorId : undefined}
          onChange={() => !effectiveDisabled && setIsChecked(true)}
          position="absolute"
          opacity={0}
          pointerEvents="none"
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
          }}
        >
          {children}
        </Flex>
      </Box>
    </RadioContext.Provider>
  );
}

function RadioIndicator({ style }: RadioIndicatorProps) {
  const theme = useTheme();
  const ctx = useRadioContext();

  return (
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
        border: `1px solid ${ctx.isChecked ? theme.colors.brand.base : theme.colors.border.strong}`,
        backgroundColor: theme.colors.surface.default,
        ...style,
      }}
    >
      <Box
        as="span"
        width={10}
        height={10}
        borderRadius="full"
        style={{
          backgroundColor: ctx.isChecked ? theme.colors.brand.base : 'transparent',
          transition: transition(['background-color'], 'fast'),
        }}
      />
    </Flex>
  );
}

function RadioLabel({ children }: RadioLabelProps) {
  return (
    <Text
      as="span"
      color="text.primary"
      fontSize="small"
      fontWeight="medium"
      flex={1}
      style={{ minWidth: 0 }}
    >
      {children}
    </Text>
  );
}

function RadioDescription({ children }: RadioDescriptionProps) {
  return (
    <Text as="span" color="text.secondary" fontSize="xsmall">
      {children}
    </Text>
  );
}

export const Radio = Object.assign(RadioRoot, {
  Root: RadioRoot,
  Indicator: RadioIndicator,
  Label: RadioLabel,
  Description: RadioDescription,
});
