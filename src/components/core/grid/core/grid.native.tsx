import { ArborTransform, type ArborTransformProps } from '../../../../ecosystem';

/**
 * Native: CSS Grid não existe em RN. Usa Flex com flexWrap como fallback.
 */
export function Grid<T>(props: ArborTransformProps<T>) {
  return <ArborTransform {...props} display="flex" flexWrap="wrap" flexDirection="row" />;
}
