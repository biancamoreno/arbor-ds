import type { ReactElement, ReactNode } from 'react';

export type DialogRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  children: ReactNode;
};

export type DialogTriggerProps = {
  children: ReactElement;
  asChild?: boolean;
};

export type DialogOverlayProps = {
  style?: React.CSSProperties;
};

export type DialogContentProps = {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
};

export type DialogTitleProps = {
  children: ReactNode;
};

export type DialogDescriptionProps = {
  children: ReactNode;
};

export type DialogCloseProps = {
  children?: ReactNode;
  label?: string;
};
