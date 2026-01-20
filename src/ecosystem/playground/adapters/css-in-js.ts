import { createElement, type ReactNode } from 'react';
import { ArborContext } from './arbor-context';

export type ThemeProviderProps<T> = {
  theme: T;
  children?: ReactNode;
};

function ThemeProvider<T>({ theme, children }: ThemeProviderProps<T>) {
  return createElement(ArborContext.Provider, { value: theme }, children);
}

function render(template: TemplateStringsArray, ...values: Array<string | number>) {
  return template.reduce((acc, part, index) => acc + part + (values[index] ?? ''), '');
}

export const cssInJs = { render, ThemeProvider };
