import { ArborTransform, type ArborTransformProps } from '../../../../ecosystem';
import { type CenterProps } from '../interfaces';

export function Center<T>(props: CenterProps<T>) {
  return (
    <ArborTransform<T>
      {...(props as ArborTransformProps<T>)}
      alignItems="center"
      justifyContent="center"
      display="flex"
    />
  );
}
