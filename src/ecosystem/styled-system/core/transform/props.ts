import { type CSSProperties, type ElementType, type ReactNode, type Ref } from 'react';
import { type StyleProps as SystemStyleProps } from '../../system';

type PropsWithTestID = {
  testID?: string;
  'data-testid'?: string;
};

type PropsWithInnerRef<T> = {
  innerRef?: Ref<T>;
};

export type ArborAs = ElementType | { web?: ElementType; native?: ElementType };

type PropsWithTransform = {
  as?: ArborAs;
};

export type ArborStyle = CSSProperties | Record<string, unknown>;

type PropsWithStyle = {
  style?: ArborStyle;
};

type PropsOther = Record<string, unknown>;

type PropsWithArborChildren = {
  children?: ReactNode;
};

export type ArborTransformProps<T extends object = PropsOther, U = unknown> = T &
  PropsWithTransform &
  SystemStyleProps &
  PropsWithStyle &
  PropsWithArborChildren &
  PropsWithTestID &
  PropsWithInnerRef<U>;
