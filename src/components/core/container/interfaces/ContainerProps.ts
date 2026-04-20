import type { ArborTransformProps } from '../../../../ecosystem';
import type { BaseBreakpointConfig } from '../../../../foundations';

/**
 * @platform shared
 * Container responsivo com largura máxima controlada por breakpoints.
 * Funciona em web e React Native via ArborTransform.
 */
export type ContainerProps = {
  fluid?: boolean;
  centerContent?: boolean;
  maxWidth?: BaseBreakpointConfig | keyof BaseBreakpointConfig;
} & Pick<ArborTransformProps, 'as' | 'backgroundColor' | 'background' | 'children'>;
