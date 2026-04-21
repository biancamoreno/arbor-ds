import { createContext, useContext } from 'react';

export interface ButtonGroupContextValue {
  attached: boolean;
  orientation: 'horizontal' | 'vertical';
  isDisabled: boolean;
}

export interface ButtonGroupItemContextValue {
  index: number;
  totalItems: number;
}

export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);
export const ButtonGroupItemContext = createContext<ButtonGroupItemContextValue | null>(null);

export function useButtonGroup(): ButtonGroupContextValue | null {
  return useContext(ButtonGroupContext);
}

export function useButtonGroupItem(): ButtonGroupItemContextValue | null {
  return useContext(ButtonGroupItemContext);
}
