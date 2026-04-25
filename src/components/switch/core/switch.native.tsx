import { Switch as RNSwitch, View } from 'react-native';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useControllableState } from '../../../ecosystem/primitives';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import type { SwitchRootProps } from '../interfaces/SwitchProps';

function SwitchRoot({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  children,
  'aria-label': ariaLabel,
}: SwitchRootProps) {
  const fieldCtx = useFieldContext();
  const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const theme = useTheme();

  const [isChecked, setIsChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8, opacity: effectiveDisabled ? 0.6 : 1 }}
      accessibilityRole="switch"
      accessibilityState={{ checked: isChecked, disabled: effectiveDisabled }}
      accessibilityLabel={ariaLabel}
    >
      <RNSwitch
        value={isChecked}
        onValueChange={(val) => {
          if (!effectiveDisabled) setIsChecked(val);
        }}
        disabled={effectiveDisabled}
        trackColor={{
          false: theme.colors.border.strong,
          true: theme.colors.interactive.default,
        }}
        thumbColor={theme.colors.surface.default}
      />
      {children}
    </View>
  );
}

markFieldAware(SwitchRoot);

export const Switch = Object.assign(SwitchRoot, {
  Root: SwitchRoot,
});
