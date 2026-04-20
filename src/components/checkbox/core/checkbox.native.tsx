import { useId } from 'react';
import { Pressable, View, Text as RNText } from 'react-native';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useControllableState } from '../../../ecosystem/primitives';
import { useFieldContext } from '../../field/context/field-context';
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
  const effectiveDisabled = disabled ?? fieldCtx?.isDisabled ?? false;

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
    <View
      style={{
        width: 18,
        height: 18,
        marginTop: 2,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: isActive ? theme.colors.interactive.default : theme.colors.border.strong,
        backgroundColor: isActive ? theme.colors.interactive.default : theme.colors.surface.default,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isActive && (
        <View
          style={{
            width: 10,
            height: 2,
            backgroundColor: theme.colors.text.inverse,
            transform: ctx.isIndeterminate ? [] : [{ rotate: '-45deg' }],
          }}
        />
      )}
    </View>
  );
}

function CheckboxLabel({ children }: CheckboxLabelProps) {
  const theme = useTheme();
  return <RNText style={{ fontSize: theme.fontSizes.small, color: theme.colors.text.primary }}>{children}</RNText>;
}

function CheckboxDescription({ children }: CheckboxDescriptionProps) {
  const theme = useTheme();
  return <RNText style={{ fontSize: theme.fontSizes.xsmall, color: theme.colors.text.secondary }}>{children}</RNText>;
}

export const Checkbox = Object.assign(
  function LegacyCheckbox() { return null; },
  {
    Root: CheckboxRoot,
    Indicator: CheckboxIndicator,
    Label: CheckboxLabel,
    Description: CheckboxDescription,
  },
);
