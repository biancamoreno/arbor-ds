import { ArborTransform } from '../../../../ecosystem';
import type { GridProps } from '../interfaces';

export function Grid<T extends object>(props: GridProps<T>) {
  return <ArborTransform {...props} display="flex" flexWrap="wrap" flexDirection="row" />;
}

Grid.displayName = 'Grid';
