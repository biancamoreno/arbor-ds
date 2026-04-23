import { ArborTransform, type ArborTransformProps } from '../../../../ecosystem';
import type { GridProps } from '../interfaces';

export function Grid<T extends object>(props: GridProps<T>) {
  const {
    templateColumns, templateRows, templateAreas,
    columnGap, rowGap, row, column, area,
    autoFlow, autoRows, autoColumns,
    ...rest
  } = props;

  return (
    <ArborTransform
      {...(rest as ArborTransformProps<T>)}
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
}

Grid.displayName = 'Grid';
