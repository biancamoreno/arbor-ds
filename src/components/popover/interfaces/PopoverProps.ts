import type { ReactElement, ReactNode } from 'react';

export type PopoverRootProps = {
  isOpen?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
  children: ReactNode;
};

export type PopoverTriggerProps = {
  children: ReactElement;
  asChild?: boolean;
};

export type PopoverContentProps = {
  children: ReactNode;
};

export type PopoverCloseProps = {
  children?: ReactNode;
  label?: string;
};
