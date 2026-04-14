import type { ReactNode } from 'react';

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  trigger?: 'hover' | 'click';
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  maxWidth?: string | number;
}
