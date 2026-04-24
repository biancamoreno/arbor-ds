import type { ReactElement, ReactNode } from 'react';

/**
 * Canonical API (RFC-0013): `open`/`defaultOpen`/`onOpenChange`. The `isOpen`
 * alias is kept for one major with a dev warning.
 */
export type DialogRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  /** @deprecated Use `open` (RFC-0013). */
  isOpen?: boolean;
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
