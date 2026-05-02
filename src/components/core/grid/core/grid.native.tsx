import { forwardRef, type Ref } from 'react';
import { ArborTransform } from '../../../../ecosystem';
import type { GridProps } from '../interfaces';

/**
 * @platform native
 *
 * Fallback do `Grid` em React Native: como a plataforma não tem CSS Grid, cai
 * para `flexDirection: 'row'` + `flexWrap: 'wrap'`. Props específicas de Grid
 * (`templateColumns`, `area`, etc.) são aceitas pela tipagem cross-platform mas
 * não têm efeito; controle o layout via `gap`, `width` dos filhos e `flex`.
 *
 * @see {@link GridProps}
 */
export const Grid = forwardRef<unknown, GridProps>(function Grid(props, ref) {
  const legacyRef = props.innerRef as Ref<unknown> | undefined;
  return <ArborTransform {...props} innerRef={ref ?? legacyRef} display="flex" flexWrap="wrap" flexDirection="row" />;
});

Grid.displayName = 'Grid';
