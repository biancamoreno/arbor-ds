import { forwardRef, type Ref } from 'react';
import { ArborTransform } from '../../../../ecosystem';
import type { GridProps } from '../interfaces';

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
