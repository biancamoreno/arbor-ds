import type { ArborTransformProps, BaseBreakpointConfig } from '../../../../ecosystem';

export type ContainerProps = {
  fluid?: boolean;
  centerContent?: boolean;
  maxWidth?: BaseBreakpointConfig | keyof BaseBreakpointConfig;
} & Pick<ArborTransformProps, 'as' | 'backgroundColor' | 'background' | 'children'>;
