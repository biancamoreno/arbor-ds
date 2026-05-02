import { ArborTransform } from '../../../../ecosystem';
import type { PressFeedbackProps } from '../interfaces';
import { backgroundColorVariants } from './variants';

/**
 * @platform shared
 *
 * Camada de feedback visual para press/hover/active, posicionada absolutamente
 * sobre um elemento clicável (Button, Card hoverable, IconButton, etc.).
 * Permanece invisível por default (`opacity: 0`) e só "acende" via `_active`,
 * pintando o overlay com a variante de fundo. Ajuste `borderRadius` para casar
 * com a borda do alvo. É um internal helper — consumidores normalmente
 * encontram o efeito embutido em componentes que já o utilizam.
 *
 * @see {@link PressFeedbackProps}
 */
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
