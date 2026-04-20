import type { CSSProperties, ReactNode } from 'react';

export type FieldRootProps = {
  id?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  style?: CSSProperties;
  children: ReactNode;
};

export type FieldLabelProps = {
  children: ReactNode;
};

export type FieldControlProps = {
  children: ReactNode;
};

export type FieldDescriptionProps = {
  children: ReactNode;
};

export type FieldErrorProps = {
  children: ReactNode;
};
