import { forwardRef, type Ref } from 'react';
import { ArborTransform } from '../../../../ecosystem';
import type { GridProps } from '../interfaces';

/**
 * @platform shared
 *
 * Primitivo CSS Grid. Renomeia as props do styled-system para um conjunto mais
 * curto (`templateColumns`, `templateRows`, `columnGap`, `row`, `column`,
 * `area`, `autoFlow`). Em native a versão `.native.tsx` cai para flex-wrap row,
 * já que React Native não suporta CSS Grid.
 *
 * @see {@link GridProps}
 */
export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(props, ref) {
  const {
    templateColumns, templateRows, templateAreas,
    columnGap, rowGap, row, column, area,
    autoFlow, autoRows, autoColumns,
    ...rest
  } = props;
  const legacyRef = props.innerRef as Ref<HTMLElement> | undefined;

  return (
    <ArborTransform
      {...rest}
      innerRef={ref ?? legacyRef}
      display="grid"
      gridTemplateColumns={templateColumns}
      gridColumnGap={columnGap}
      gridRowGap={rowGap}
      gridRow={row}
      gridColumn={column}
      gridArea={area}
      gridAutoFlow={autoFlow}
      gridAutoRows={autoRows}
      gridAutoColumns={autoColumns}
      gridTemplateRows={templateRows}
      gridTemplateAreas={templateAreas}
    />
  );
});

Grid.displayName = 'Grid';
