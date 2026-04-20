import { ArborTransform, type ArborTransformProps } from '../../../../ecosystem';

/**
 * @platform native-ready
 * Grid layout com implementação dedicada para web (`grid.tsx`) e React Native (`grid.native.tsx`).
 * No native, renderiza como flex-wrap em linha (equivalente funcional sem CSS grid).
 */
export function Grid<T extends object>(props: ArborTransformProps<T>) {
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
