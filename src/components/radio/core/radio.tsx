import { useId } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useControllableState } from '../../../ecosystem/primitives';
import { useFieldContext } from '../../field/context/field-context';
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
      <label
        style={{
          display: 'flex',
          width: '100%',
          cursor: effectiveDisabled ? 'not-allowed' : 'pointer',
          opacity: effectiveDisabled ? 0.6 : 1,
        }}
      >
        <input
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
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        />
        <div
          aria-hidden="true"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: theme.space.small,
            padding: sizing.padding,
            borderRadius: theme.radii.medium,
            border: `1px solid ${isChecked ? theme.colors.brand.base : theme.colors.border.default}`,
            backgroundColor: isChecked ? theme.colors.brand.subtle : theme.colors.surface.default,
            boxShadow: isChecked ? `0 0 0 2px ${theme.colors.brand.subtle}` : 'none',
            transition: transition(['border-color', 'background-color', 'box-shadow'], 'fast'),
          }}
        >
          {children}
        </div>
      </label>
    </RadioContext.Provider>
  );
}

function RadioIndicator({ style }: RadioIndicatorProps) {
  const theme = useTheme();
  const ctx = useRadioContext();

  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        borderRadius: theme.radii.full,
        border: `1px solid ${ctx.isChecked ? theme.colors.brand.base : theme.colors.border.strong}`,
        backgroundColor: theme.colors.surface.default,
        flexShrink: 0,
        ...style,
      }}
    >
      <span
        style={{
          width: '10px',
          height: '10px',
          borderRadius: theme.radii.full,
          backgroundColor: ctx.isChecked ? theme.colors.brand.base : 'transparent',
          transition: transition(['background-color'], 'fast'),
        }}
      />
    </span>
  );
}

function RadioLabel({ children }: RadioLabelProps) {
  const theme = useTheme();
  return (
    <span
      style={{
        color: theme.colors.text.primary,
        fontSize: theme.fontSizes.small,
        fontWeight: theme.fontWeights.medium,
        flex: 1,
        minWidth: 0,
      }}
    >
      {children}
    </span>
  );
}

function RadioDescription({ children }: RadioDescriptionProps) {
  const theme = useTheme();
  return (
    <span style={{ color: theme.colors.text.secondary, fontSize: theme.fontSizes.xsmall }}>
      {children}
    </span>
  );
}

export const Radio = Object.assign(RadioRoot, {
  Root: RadioRoot,
  Indicator: RadioIndicator,
  Label: RadioLabel,
  Description: RadioDescription,
});
