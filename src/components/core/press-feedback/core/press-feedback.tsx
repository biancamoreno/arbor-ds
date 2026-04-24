import { ArborTransform } from '../../../../ecosystem';
import type { PressFeedbackProps } from '../interfaces';
import { backgroundColorVariants } from './variants';

export function PressFeedback({
  variant = 'default',
  borderRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  testID,
}: PressFeedbackProps) {
  return (
    <ArborTransform
      opacity={0}
      position="absolute"
      left={0}
      top={0}
      bottom={0}
      right={0}
      borderRadius={borderRadius}
      borderBottomLeftRadius={borderBottomLeftRadius}
      borderBottomRightRadius={borderBottomRightRadius}
      data-testid={testID}
      zIndex="level1"
      _active={{
        opacity: 1,
        ...backgroundColorVariants(variant),
      }}
      {...backgroundColorVariants(variant)}
    />
  );
}

PressFeedback.displayName = 'PressFeedback';
