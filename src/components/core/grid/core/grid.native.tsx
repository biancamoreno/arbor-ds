import { ArborTransform, type ArborTransformProps } from '../../../../ecosystem';

export function Grid<T extends object>(props: ArborTransformProps<T>) {
  return <ArborTransform {...props} display="flex" flexWrap="wrap" flexDirection="row" />;
}
