import { ArborTransform, type ArborTransformProps } from '../../../../ecosystem';
import { type CenterProps } from '../interfaces';

export function Center<T extends object>(props: CenterProps<T>) {
  return (
    <ArborTransform<T>
      {...(props as ArborTransformProps<T>)}
      alignItems="center"
      justifyContent="center"
      display="flex"
    />
  );
}

Center.displayName = 'Center';
