import { useId } from 'react';
import type { ReactNode } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useControllableState } from '../../../ecosystem/primitives';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex } from '../../core';
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
  onCheckedChange,
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
  const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const theme = useTheme();

  const [isChecked, setIsChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const track = trackSize[size];
  const thumb = thumbSize[size];
  const translateX = isChecked ? track.width - thumb - track.padding * 2 : 0;

  return (
    <Flex
      as="span"
      display="inline-flex"
      alignItems="center"
      gap="tiny"
      cursor={effectiveDisabled ? 'not-allowed' : 'pointer'}
      opacity={effectiveDisabled ? 0.6 : 1}
      userSelect="none"
    >
      <Box
        as="input"
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
        aria-describedby={fieldCtx?.descriptionRegistered ? fieldCtx.descriptionId : undefined}
        aria-required={fieldCtx?.required || undefined}
        aria-invalid={fieldCtx?.invalid || undefined}
        aria-errormessage={fieldCtx?.invalid && fieldCtx?.errorRegistered ? fieldCtx.errorId : undefined}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsChecked(e.target.checked)}
        position="absolute"
        opacity={0}
        pointerEvents="none"
        style={{ width: 0, height: 0 }}
      />
      <Box
        as="span"
        display="inline-flex"
        alignItems="center"
        borderRadius="full"
        onClick={() => !effectiveDisabled && setIsChecked(!isChecked)}
        aria-hidden="true"
        style={{
          width: `${track.width}px`,
          height: `${track.height}px`,
          padding: `${track.padding}px`,
          backgroundColor: isChecked ? theme.colors.interactive.default : theme.colors.border.strong,
          transition: transition(['background-color'], 'fast'),
          boxSizing: 'border-box',
        }}
      >
        <Box
          as="span"
          display="block"
          borderRadius="full"
          flexShrink={0}
          style={{
            width: `${thumb}px`,
            height: `${thumb}px`,
            backgroundColor: theme.colors.surface.default,
            transform: `translateX(${translateX}px)`,
            transition: transition(['transform'], 'fast'),
          }}
        />
      </Box>
      {children}
    </Flex>
  );
}

SwitchRoot.displayName = 'Switch.Root';

function SwitchTrack({ children }: { children?: ReactNode }) {
  return (
    <Flex as="span" display="inline-flex" alignItems="center">
      {children}
    </Flex>
  );
}

function SwitchThumb({ style }: { style?: React.CSSProperties }) {
  return <Box as="span" style={style} />;
}

markFieldAware(SwitchRoot);

export const Switch = Object.assign(SwitchRoot, {
  Root: SwitchRoot,
  Track: SwitchTrack,
  Thumb: SwitchThumb,
});
