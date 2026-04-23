import type { ArborTransformProps } from '../../../../ecosystem';

export type GridProps<T extends object = object> = ArborTransformProps<T> & {
  templateColumns?: string;
  templateRows?: string;
  templateAreas?: string;
  columnGap?: string | number;
  rowGap?: string | number;
  row?: string | number;
  column?: string | number;
  area?: string;
  autoFlow?: string;
  autoRows?: string;
  autoColumns?: string;
};
