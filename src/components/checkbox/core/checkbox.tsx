import React, { useEffect, useId, useRef } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useControllableState } from '../../../ecosystem/primitives';
import { useFieldContext } from '../../field/context/field-context';
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
  const effectiveDisabled = disabled ?? fieldCtx?.isDisabled ?? false;

  const [isChecked, setIsChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange,
  });

  const theme = useTheme();

  return (
    <CheckboxContext.Provider
      value={{ isChecked, isIndeterminate: indeterminate, isDisabled: effectiveDisabled, inputId, onChange: setIsChecked }}
    >
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'flex-start',
          gap: '10px',
          cursor: effectiveDisabled ? 'not-allowed' : 'pointer',
          opacity: effectiveDisabled ? 0.6 : 1,
          color: theme.colors.text.primary,
        }}
        htmlFor={inputId}
      >
        {children}
      </label>
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
    <input
      {...props}
      ref={(node) => {
        internalRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      id={ctx.inputId}
      type="checkbox"
      checked={ctx.isChecked}
      disabled={ctx.isDisabled}
      aria-describedby={fieldCtx?.descriptionId}
      aria-required={fieldCtx?.isRequired || undefined}
      aria-invalid={fieldCtx?.isInvalid || undefined}
      aria-errormessage={fieldCtx?.isInvalid ? fieldCtx.errorId : undefined}
      onChange={(e) => { if (!ctx.isDisabled) ctx.onChange(e.target.checked); }}
      style={{
        width: '18px',
        height: '18px',
        marginTop: '2px',
        accentColor: theme.colors.interactive.default,
        cursor: ctx.isDisabled ? 'not-allowed' : 'pointer',
        flexShrink: 0,
        ...style,
      }}
    />
  );
});

CheckboxIndicator.displayName = 'Checkbox.Indicator';

function CheckboxLabel({ children }: CheckboxLabelProps) {
  const theme = useTheme();
  return (
    <span style={{ fontSize: theme.fontSizes.small, color: theme.colors.text.primary }}>
      {children}
    </span>
  );
}

function CheckboxDescription({ children }: CheckboxDescriptionProps) {
  const theme = useTheme();
  return (
    <span style={{ fontSize: theme.fontSizes.xsmall, color: theme.colors.text.secondary }}>
      {children}
    </span>
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
          <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {label && <CheckboxLabel>{label}</CheckboxLabel>}
            {description && <CheckboxDescription>{description}</CheckboxDescription>}
          </span>
        )}
      </CheckboxRoot>
    );
  },
);

LegacyCheckbox.displayName = 'Checkbox';

export const Checkbox = Object.assign(LegacyCheckbox, {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
  Label: CheckboxLabel,
  Description: CheckboxDescription,
});
