import { ArborTransform, type ArborTransformProps } from '../../../../ecosystem';
import { type SquareProps } from '../interfaces';

export function Square<T extends object>({ centerContent = true, size, ...rest }: SquareProps<T>) {
  const centeredProps = centerContent
    ? { alignItems: 'center' as const, justifyContent: 'center' as const }
    : {};

  return (
    <ArborTransform<T>
      {...(rest as ArborTransformProps<T>)}
      {...centeredProps}
      display="flex"
      width={size}
      height={size}
      flexGrow={0}
      flexShrink={0}
    />
  );
}

Square.displayName = 'Square';
