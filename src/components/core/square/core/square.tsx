import { forwardRef, type Ref } from 'react';
import { ArborTransform } from '../../../../ecosystem';
import { type SquareProps } from '../interfaces';

/**
 * @platform shared
 *
 * Bloco quadrado de proporção fixa: `width === height === size`. Por default
 * centraliza o conteúdo (`centerContent` = `true`); passe `centerContent={false}`
 * para desligar. Não cresce nem encolhe (`flexGrow: 0`, `flexShrink: 0`).
 *
 * @see {@link SquareProps}
 */
export const Square = forwardRef<HTMLElement, SquareProps>(function Square(props, ref) {
  const { centerContent = true, size, ...rest } = props;
  const legacyRef = props.innerRef as Ref<HTMLElement> | undefined;
  const centeredProps = centerContent
    ? { alignItems: 'center' as const, justifyContent: 'center' as const }
    : {};

  return (
    <ArborTransform
      {...rest}
      {...centeredProps}
      innerRef={ref ?? legacyRef}
      display="flex"
      width={size as SquareProps['size']}
      height={size as SquareProps['size']}
      flexGrow={0}
      flexShrink={0}
    />
  );
});

Square.displayName = 'Square';
