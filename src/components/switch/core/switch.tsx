import { useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useControllableState } from '../../../ecosystem/primitives';
import { useFieldContext } from '../../field/context/field-context';
import { transition } from '../../../ecosystem/utils/functions';
import type { SwitchRootProps, SwitchSize } from '../interfaces/SwitchProps';

const trackSize: Record<SwitchSize, { width: number; height: number; padding: number }> = {
  sm: { width: 36, height: 20, padding: 2 },
  md: { width: 44, height: 24, padding: 2 },
  lg: { width: 52, height: 28, padding: 2 },
};

const thumbSize: Record<SwitchSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

function SwitchRoot({
  checked,
  defaultChecked = false,
  onChange,
  disabled,
  id: idProp,
  name,
  value,
  size = 'md',
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: SwitchRootProps) {
  const autoId = useId();
  const fieldCtx = useFieldContext();
  const inputId = fieldCtx?.fieldId ?? idProp ?? autoId;
  const effectiveDisabled = disabled ?? fieldCtx?.isDisabled ?? false;
  const theme = useTheme();

  const [isChecked, setIsChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange,
  });

  const track = trackSize[size];
  const thumb = thumbSize[size];
  const translateX = isChecked ? track.width - thumb - track.padding * 2 : 0;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: theme.space.tiny,
        cursor: effectiveDisabled ? 'not-allowed' : 'pointer',
        opacity: effectiveDisabled ? 0.6 : 1,
        userSelect: 'none',
      }}
    >
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        name={name}
        value={value}
        checked={isChecked}
        disabled={effectiveDisabled}
        aria-checked={isChecked}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={fieldCtx?.descriptionId}
        aria-required={fieldCtx?.isRequired || undefined}
        aria-invalid={fieldCtx?.isInvalid || undefined}
        aria-errormessage={fieldCtx?.isInvalid ? fieldCtx.errorId : undefined}
        onChange={(e) => setIsChecked(e.target.checked)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
      />
      <span
        onClick={() => !effectiveDisabled && setIsChecked(!isChecked)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          width: `${track.width}px`,
          height: `${track.height}px`,
          padding: `${track.padding}px`,
          borderRadius: '9999px',
          backgroundColor: isChecked ? theme.colors.interactive.default : theme.colors.border.strong,
          transition: transition(['background-color'], 'fast'),
          boxSizing: 'border-box',
        }}
        aria-hidden="true"
      >
        <span
          style={{
            display: 'block',
            width: `${thumb}px`,
            height: `${thumb}px`,
            borderRadius: '9999px',
            backgroundColor: theme.colors.surface.default,
            transform: `translateX(${translateX}px)`,
            transition: transition(['transform'], 'fast'),
            flexShrink: 0,
          }}
        />
      </span>
      {children}
    </span>
  );
}

SwitchRoot.displayName = 'Switch.Root';

function SwitchTrack({ children }: { children?: ReactNode }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center' }}>{children}</span>;
}

function SwitchThumb({ style }: { style?: CSSProperties }) {
  return <span style={style} />;
}

export const Switch = Object.assign(SwitchRoot, {
  Root: SwitchRoot,
  Track: SwitchTrack,
  Thumb: SwitchThumb,
});
