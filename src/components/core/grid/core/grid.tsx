import { ArborTransform, type ArborTransformProps } from '../../../../ecosystem';

export function Grid<T>(props: ArborTransformProps<T>) {
  return (
    <ArborTransform
      {...props}
      display="grid"
      gridTemplateColumns={props.templateColumns}
      gridColumnGap={props.columnGap}
      gridRowGap={props.rowGap}
      gridRow={props.row}
      gridColumn={props.column}
      gridArea={props.area}
      gridAutoFlow={props.autoFlow}
      gridAutoRows={props.autoRows}
      gridAutoColumns={props.autoColumns}
      gridTemplateRows={props.templateRows}
      gridTemplateAreas={props.templateAreas}
    />
  );
}
