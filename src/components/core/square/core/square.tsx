import { ArborTransform, type ArborTransformProps } from '../../../../ecosystem';
import { type SquareProps } from '../interfaces';

export function Square<T>({ centerContent = true, ...props }: SquareProps<T>) {
  const squareProps = centerContent && {
    alignItems: 'center',
    justifyContent: 'center',
  };

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
