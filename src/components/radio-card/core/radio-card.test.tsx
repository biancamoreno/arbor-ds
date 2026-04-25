import React from 'react';
import { render, screen } from '@testing-library/react';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { RadioCard } from './radio-card';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderCard(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

describe('RadioCard', () => {
  it('renders label and description', () => {
    renderCard(<RadioCard value="a" label="Plan A" description="Best value" />);
    expect(screen.getByText('Plan A')).toBeTruthy();
    expect(screen.getByText('Best value')).toBeTruthy();
  });

  it('renders the underlying radio input', () => {
    renderCard(<RadioCard value="a" label="Plan A" />);
    expect(screen.getByRole('radio')).toBeTruthy();
  });
});

describe('RadioCard accessibility — visible focus (TD-014, WCAG 2.4.7)', () => {
  it('emits :has(:focus-visible) outline rule on the label root', () => {
    const { container } = renderCard(<RadioCard value="a" label="Plan A" />);
    const rootClass = (container.querySelector('label') as HTMLElement).className;
    const sheet = document.getElementById('arbor-style-engine')?.textContent ?? '';
    const focusRule = new RegExp(`\\.${rootClass.split(' ').pop()}:has\\(:focus-visible\\)\\{[^}]*outline`);
    expect(sheet).toMatch(focusRule);
  });
});
