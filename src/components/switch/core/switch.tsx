import { useId } from 'react';
import { useControllableState } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex } from '../../core';
import type { SwitchRootProps, SwitchState } from '../interfaces/SwitchProps';

type SwitchSlot = 'root' | 'track' | 'thumb';

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
  const theme = useTheme();
  const reducedMotion = usePrefersReducedMotion();

  const [isChecked, setIsChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const state = resolveState(effectiveDisabled, effectiveInvalid, isChecked);
  const slots = useSlotRecipe<SwitchSlot>('switch', { size, state });

  const switchTokens = theme.components.switch;
  const trackWidth = parseFloat(switchTokens.track.size[size].width);
  const thumbWidth = parseFloat(switchTokens.thumb.size[size]);
  const padding = theme.space[switchTokens.track.padding as keyof typeof theme.space] as number;
  const translateX = isChecked ? trackWidth - thumbWidth - padding * 2 : 0;

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
      >
        <Box
          as="span"
          display="block"
          {...slots.thumb}
          style={{
            transform: `translateX(${translateX}px)`,
            ...(reducedMotion ? { transition: 'none' } : null),
          }}
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
 * com transição animada. Geometria deriva integralmente de
 * `theme.components.switch.track.size` / `thumb.size` / `track.padding` —
 * override do tema propaga para o `translateX` do thumb. Field-aware: herda
 * `disabled`/`invalid` do `<Field>`. Use `onCheckedChange(checked)` para reagir
 * ao toggle. Como o controle não tem label visual embutido, passe `aria-label`
 * ou `aria-labelledby` quando standalone.
 *
 * @see {@link SwitchRootProps}
 */
export const Switch = Object.assign(SwitchRoot, {
  Root: SwitchRoot,
});
