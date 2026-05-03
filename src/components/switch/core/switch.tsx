import { useId } from 'react';
import { useControllableState } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex } from '../../core';
import type { SwitchRootProps, SwitchSize, SwitchState } from '../interfaces/SwitchProps';

type SwitchSlot = 'root' | 'track' | 'thumb';

const trackGeometry: Record<SwitchSize, { width: number; thumb: number; padding: number }> = {
  small: { width: 36, thumb: 16, padding: 2 },
  medium: { width: 44, thumb: 20, padding: 2 },
  large: { width: 52, thumb: 24, padding: 2 },
};

function resolveState(isDisabled: boolean, isInvalid: boolean, isChecked: boolean): SwitchState {
  if (isDisabled) return 'disabled';
  if (isInvalid) return 'invalid';
  if (isChecked) return 'checked';
  return 'idle';
}

function SwitchRoot({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  id: idProp,
  name,
  value,
  size = 'medium',
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: SwitchRootProps) {
  const autoId = useId();
  const fieldCtx = useFieldContext();
  const inputId = fieldCtx?.fieldId ?? idProp ?? autoId;
  const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const effectiveInvalid = fieldCtx?.invalid ?? false;

  const [isChecked, setIsChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const state = resolveState(effectiveDisabled, effectiveInvalid, isChecked);
  const slots = useSlotRecipe<SwitchSlot>('switch', { size, state });
  const geometry = trackGeometry[size];
  const translateX = isChecked ? geometry.width - geometry.thumb - geometry.padding * 2 : 0;

  return (
    <Flex
      as="span"
      {...slots.root}
      cursor={effectiveDisabled ? 'not-allowed' : 'pointer'}
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
        {...slots.track}
        onClick={() => !effectiveDisabled && setIsChecked(!isChecked)}
        aria-hidden="true"
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '44px',
          minHeight: '44px',
        }}
        style={{ boxSizing: 'border-box' }}
      >
        <Box
          as="span"
          display="block"
          {...slots.thumb}
          style={{ transform: `translateX(${translateX}px)` }}
        />
      </Box>
      {children}
    </Flex>
  );
}

SwitchRoot.displayName = 'Switch.Root';

markFieldAware(SwitchRoot);

/**
 * @platform shared
 *
 * Toggle on/off com semântica `role="switch"`. Renderiza input nativo escondido
 * (para suporte a teclado e formulário) sobreposto a um track + thumb visuais
 * com transição animada. Field-aware: herda `disabled`/`invalid` do `<Field>`.
 * Use `onCheckedChange(checked)` para reagir ao toggle. Como o controle não
 * tem label visual embutido, passe `aria-label` ou `aria-labelledby` quando
 * standalone.
 *
 * @see {@link SwitchRootProps}
 */
export const Switch = Object.assign(SwitchRoot, {
  Root: SwitchRoot,
});
