import { useId } from 'react';
import { Pressable } from 'react-native';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useControllableState } from '../../../ecosystem/primitives';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Text } from '../../core';
import { CheckboxContext, useCheckboxContext } from '../context/checkbox-context';
import type { CheckboxRootProps, CheckboxLabelProps, CheckboxDescriptionProps } from '../interfaces';

function CheckboxRoot({
  checked,
  defaultChecked = false,
  onChange,
  disabled,
  indeterminate = false,
  id: idProp,
  children,
}: CheckboxRootProps) {
  const autoId = useId();
  const fieldCtx = useFieldContext();
  const inputId = fieldCtx?.fieldId ?? idProp ?? autoId;
  const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;

  const [isChecked, setIsChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange,
  });

  return (
    <CheckboxContext.Provider
      value={{ isChecked, isIndeterminate: indeterminate, isDisabled: effectiveDisabled, inputId, onChange: setIsChecked }}
    >
      <Pressable
        onPress={() => !effectiveDisabled && setIsChecked(!isChecked)}
        disabled={effectiveDisabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isChecked, disabled: effectiveDisabled }}
        style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, opacity: effectiveDisabled ? 0.6 : 1 }}
      >
        {children}
      </Pressable>
    </CheckboxContext.Provider>
  );
}

function CheckboxIndicator() {
  const ctx = useCheckboxContext();
  const theme = useTheme();

  const isActive = ctx.isChecked || ctx.isIndeterminate;

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      style={{
        width: 18,
        height: 18,
        marginTop: 2,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: isActive ? theme.colors.interactive.default : theme.colors.border.strong,
        backgroundColor: isActive ? theme.colors.interactive.default : theme.colors.surface.default,
      }}
    >
      {isActive && (
        <Box
          style={{
            width: 10,
            height: 2,
            backgroundColor: theme.colors.text.inverse,
            transform: ctx.isIndeterminate ? [] : [{ rotate: '-45deg' }],
          }}
        />
      )}
    </Flex>
  );
}

function CheckboxLabel({ children }: CheckboxLabelProps) {
  return <Text as="span" fontSize="small" color="text.primary">{children}</Text>;
}

function CheckboxDescription({ children }: CheckboxDescriptionProps) {
  return <Text as="span" fontSize="xsmall" color="text.secondary">{children}</Text>;
}

markFieldAware(CheckboxRoot);
markFieldAware(CheckboxIndicator);

export const Checkbox = Object.assign(CheckboxRoot, {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
  Label: CheckboxLabel,
  Description: CheckboxDescription,
});
