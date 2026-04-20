import type { AnchorHTMLAttributes, HTMLAttributes, LiHTMLAttributes, ReactNode } from 'react';

/**
 * @platform web-only
 */
export interface BreadcrumbRootProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** @default "Navegação estrutural" */
  label?: string;
}

export interface BreadcrumbListProps extends HTMLAttributes<HTMLOListElement> {
  children: ReactNode;
}

export interface BreadcrumbItemProps extends LiHTMLAttributes<HTMLLIElement> {
  children: ReactNode;
}

export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

export interface BreadcrumbCurrentProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export interface BreadcrumbSeparatorProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
}
