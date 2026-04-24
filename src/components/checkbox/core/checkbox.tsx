import React, { useEffect, useId, useRef } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useControllableState } from '../../../ecosystem/primitives';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Text } from '../../core';
import { CheckboxContext, useCheckboxContext } from '../context/checkbox-context';
import type {
  CheckboxRootProps,
  CheckboxIndicatorProps,
  CheckboxLabelProps,
  CheckboxDescriptionProps,
  CheckboxProps,
} from '../interfaces';

function CheckboxRoot({
  checked,
  defaultChecked = false,
  onChange,
  disabled,
  indeterminate = false,
  id: idProp,
  name: _name,
  value: _value,
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
      <Flex
        as="label"
        display="inline-flex"
        alignItems="flex-start"
        gap="10px"
        cursor={effectiveDisabled ? 'not-allowed' : 'pointer'}
        opacity={effectiveDisabled ? 0.6 : 1}
        color="text.primary"
        htmlFor={inputId}
      >
        {children}
      </Flex>
    </CheckboxContext.Provider>
  );
}

const CheckboxIndicator = React.forwardRef<HTMLInputElement, CheckboxIndicatorProps>(({ style, ...props }, ref) => {
  const theme = useTheme();
  const ctx = useCheckboxContext();
  const fieldCtx = useFieldContext();
  const internalRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = ctx.isIndeterminate && !ctx.isChecked;
    }
  }, [ctx.isChecked, ctx.isIndeterminate]);

  return (
    <Box
      as="input"
      {...props}
      innerRef={(node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }}
      id={ctx.inputId}
      type="checkbox"
      checked={ctx.isChecked}
      disabled={ctx.isDisabled}
      aria-describedby={fieldCtx?.descriptionRegistered ? fieldCtx.descriptionId : undefined}
      aria-required={fieldCtx?.required || undefined}
      aria-invalid={fieldCtx?.invalid || undefined}
      aria-errormessage={fieldCtx?.invalid && fieldCtx?.errorRegistered ? fieldCtx.errorId : undefined}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { if (!ctx.isDisabled) ctx.onChange(e.target.checked); }}
      width={18}
      height={18}
      marginTop={2}
      cursor={ctx.isDisabled ? 'not-allowed' : 'pointer'}
      flexShrink={0}
      style={{ accentColor: theme.colors.interactive.default, ...style }}
    />
  );
});

CheckboxIndicator.displayName = 'Checkbox.Indicator';

function CheckboxLabel({ children }: CheckboxLabelProps) {
  return (
    <Text as="span" fontSize="small" color="text.primary">
      {children}
    </Text>
  );
}

function CheckboxDescription({ children }: CheckboxDescriptionProps) {
  return (
    <Text as="span" fontSize="xsmall" color="text.secondary">
      {children}
    </Text>
  );
}

/**
 * @deprecated Use the compound Checkbox.Root / Checkbox.Indicator / Checkbox.Label pattern.
 */
const LegacyCheckbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, indeterminate, checked, disabled, style, onChange, ...props }, ref) => {
    const handleChange = onChange
      ? (e: React.ChangeEvent<HTMLInputElement>) => onChange(e)
      : undefined;

    return (
      <CheckboxRoot
        checked={checked}
        defaultChecked={props.defaultChecked}
        onChange={handleChange ? (val) => { if (handleChange) { const e = { target: { checked: val } } as React.ChangeEvent<HTMLInputElement>; handleChange(e); } } : undefined}
        disabled={disabled}
        indeterminate={indeterminate}
        id={props.id}
        name={props.name}
        value={props.value as string}
      >
        <CheckboxIndicator ref={ref} style={style} />
        {(label || description) && (
          <Flex as="span" flexDirection="column" gap="2px">
            {label && <CheckboxLabel>{label}</CheckboxLabel>}
            {description && <CheckboxDescription>{description}</CheckboxDescription>}
          </Flex>
        )}
      </CheckboxRoot>
    );
  },
);

LegacyCheckbox.displayName = 'Checkbox';

markFieldAware(CheckboxRoot);
markFieldAware(CheckboxIndicator);
markFieldAware(LegacyCheckbox);

export const Checkbox = Object.assign(LegacyCheckbox, {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
  Label: CheckboxLabel,
  Description: CheckboxDescription,
});
