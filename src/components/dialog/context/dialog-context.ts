import { createContext, useContext } from 'react';

export type DialogContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  titleId: string;
  descriptionId: string;
};

export const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialogContext(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('Dialog compound components must be used within Dialog.Root');
  return ctx;
}
