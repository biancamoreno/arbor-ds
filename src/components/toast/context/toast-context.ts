import { createContext, useContext } from 'react';
import type { ToastRootProps } from '../interfaces';

export interface ToastContextValue {
  tone: NonNullable<ToastRootProps['tone']>;
}

export const ToastContext = createContext<ToastContextValue>({ tone: 'neutral' });
export const useToastContext = () => useContext(ToastContext);
