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

export { Alert } from './components/alert';
export type {
  AlertRootProps,
  AlertIconProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertCloseProps,
} from './components/alert';

export { Badge } from './components/badge';
export type { BadgeProps, BadgeAnchorProps } from './components/badge';

export { ProgressBar } from './components/progress-bar';
export type { ProgressBarProps } from './components/progress-bar';

export { Spinner } from './components/spinner';
export type { SpinnerProps } from './components/spinner';

export { Skeleton } from './components/skeleton';
export type { SkeletonProps } from './components/skeleton';

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

export { Pagination } from './components/pagination';
export type {
  PaginationRootProps,
  PaginationListProps,
  PaginationItemProps,
  PaginationButtonProps,
  PaginationEllipsisProps,
} from './components/pagination';

export { Tabs } from './components/tabs';
export type {
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from './components/tabs';

export { Breadcrumb } from './components/breadcrumb';
export type {
  BreadcrumbRootProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbCurrentProps,
  BreadcrumbSeparatorProps,
} from './components/breadcrumb';

export { Tag } from './components/tag';
export type { TagProps } from './components/tag';

export { Accordion } from './components/accordion';
export type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from './components/accordion';

export { Button } from './components/button';
export { IconButton } from './components/button';
export type { ButtonProps, ButtonVariant, IconButtonProps } from './components/button';

export { ButtonGroup } from './components/button-group';
export type { ButtonGroupProps } from './components/button-group';

export { Table } from './components/table';
export type {
  TableRootProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableHeaderCellProps,
} from './components/table';
