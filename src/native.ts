/**
 * Entrypoint para React Native.
 * Exporta apenas foundations, ecosystem e componentes marcados como `shared` ou `native-ready`.
 * Não inclui componentes `web-only` que dependem de APIs DOM.
 *
 * Uso: import { Box, Text } from 'arbor-ds/native'
 */

export * from './foundations';
export * from './ecosystem';

export { Box } from './components/core/box';
export type { BoxProps } from './components/core/box';

export { Flex } from './components/core/flex';

export { Grid } from './components/core/grid';

export { Center } from './components/core/center';
export type { CenterProps } from './components/core/center';

export { Circle } from './components/core/circle';
export type { CircleProps } from './components/core/circle';

export { Square } from './components/core/square';
export type { SquareProps } from './components/core/square';

export { Spacer } from './components/core/spacer';

export { Container } from './components/core/container';
export type { ContainerProps } from './components/core/container';

export { Text } from './components/core/text';
export type { TextProps } from './components/core/text';

export { Image } from './components/core/image';
export type { ImageProps } from './components/core/image';

export { Clickable } from './components/core/clickable';

export { Field } from './components/field';

export { TextInput, TextArea, Counter } from './components/input';
export type {
  TextInputProps,
  TextAreaProps,
  CounterProps,
} from './components/input/interfaces';

export { Radio } from './components/radio';
export type {
  RadioRootProps,
  RadioIndicatorProps,
  RadioLabelProps,
  RadioDescriptionProps,
  RadioSize,
} from './components/radio';

export { Select } from './components/select';
export type {
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectContentProps,
  SelectItemProps,
  SelectSize,
} from './components/select';
