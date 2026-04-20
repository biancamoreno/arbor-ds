import { createContext, useContext } from 'react';
import type { AlertRootProps } from '../interfaces';

export interface AlertContextValue {
  tone: NonNullable<AlertRootProps['tone']>;
}

export const AlertContext = createContext<AlertContextValue>({ tone: 'info' });
export const useAlertContext = () => useContext(AlertContext);
