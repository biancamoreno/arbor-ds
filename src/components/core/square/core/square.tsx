import { ArborTransform, type ArborTransformProps } from '../../../../ecosystem';
import { type SquareProps } from '../interfaces';

export function Square<T extends object>({ centerContent = true, ...props }: SquareProps<T>) {
  const squareProps = centerContent
    ? {
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      }
    : undefined;

  return (
    <ArborTransform<T>
      {...squareProps}
      {...(props as ArborTransformProps<T>)}
      display="flex"
      width={props.size}
      height={props.size}
      flexGrow={0}
      flexShrink={0}
    />
  );
}
