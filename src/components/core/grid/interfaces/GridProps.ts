import type { ArborTransformProps } from '../../../../ecosystem';

/**
 * @platform shared
 * Layout primitivo CSS Grid no web; `grid.native.tsx` traduz `templateColumns/Rows`
 * para wrapping em Flex equivalente.
 */
export type GridProps = ArborTransformProps & {
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
