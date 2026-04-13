import { createElement, type ReactNode } from 'react';
import type { ArborTheme } from '../../../foundations/theme';
import { ArborContext } from './arbor-context';

export type ThemeProviderProps<T extends ArborTheme = ArborTheme> = {
  theme: T;
  children?: ReactNode;
};

function ThemeProvider<T extends ArborTheme = ArborTheme>({ theme, children }: ThemeProviderProps<T>) {
  return createElement(ArborContext.Provider, { value: theme }, children);
}

function render(template: TemplateStringsArray, ...values: Array<string | number>) {
  return template.reduce((acc, part, index) => acc + part + (values[index] ?? ''), '');
}

export const cssInJs = { render, ThemeProvider };
