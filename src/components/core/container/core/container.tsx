import { useMemo } from 'react';
import { ArborTransform, useTheme } from '../../../../ecosystem';
import type { ContainerProps } from '../interfaces';

export function Container(props: ContainerProps) {
  const { breakpoints } = useTheme();
  const maxWidth = useMemo(() => {
    if (!props.fluid && !props.maxWidth) {
      return {
        ...breakpoints,
      };
    }
    if (props.maxWidth && typeof props.maxWidth === 'string') {
      return breakpoints?.[Number(props.maxWidth)];
    }
    return props.maxWidth;
  }, [props.fluid, props.maxWidth]);

  return (
    <ArborTransform
      as={props.as}
      display="block"
      width="100%"
      marginInline="auto"
      paddingInline="md"
      maxWidth={maxWidth}
      backgroundColor={props.backgroundColor}
      background={props.background}
      children={props.children}
      {...(props.centerContent && { display: 'flex', flexDirection: 'column', alignItems: 'center' })}
    />
  );
}
