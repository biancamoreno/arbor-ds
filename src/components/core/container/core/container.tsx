import { forwardRef, useMemo } from 'react';
import { ArborTransform, useTheme } from '../../../../ecosystem';
import type { BaseBreakpointConfig } from '../../../../foundations';
import type { ContainerProps } from '../interfaces';

/**
 * @platform shared
 *
 * Container responsivo com largura máxima atrelada aos breakpoints do tema e
 * gutter horizontal padronizado. Sem props, escala automaticamente por
 * breakpoint; passe `maxWidth="md"` para fixar um breakpoint específico ou
 * `fluid` para ocupar 100%. `centerContent` empilha filhos centralizados.
 *
 * @see {@link ContainerProps}
 */
export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(props, ref) {
  const { breakpoints } = useTheme();
  const maxWidth = useMemo(() => {
    if (!props.fluid && !props.maxWidth) {
      return {
        ...breakpoints,
      };
    }
    if (props.maxWidth && typeof props.maxWidth === 'string') {
      return breakpoints?.[props.maxWidth as keyof BaseBreakpointConfig];
    }
    return props.maxWidth;
  }, [props.fluid, props.maxWidth, breakpoints]);

  return (
    <ArborTransform
      as={props.as}
      innerRef={ref}
      display="block"
      width="100%"
      mx="auto"
      paddingX="medium"
      maxWidth={maxWidth}
      backgroundColor={props.backgroundColor}
      background={props.background}
      children={props.children}
      {...(props.centerContent && { display: 'flex', flexDirection: 'column', alignItems: 'center' })}
    />
  );
});

Container.displayName = 'Container';
