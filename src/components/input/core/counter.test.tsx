import React from 'react';
import { render, screen } from '@testing-library/react';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Counter } from './counter';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderCounter(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

describe('Counter', () => {
  it('renders − and + buttons', () => {
    renderCounter(<Counter value={1} />);
    expect(screen.getByRole('button', { name: 'Decrementar' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Incrementar' })).toBeTruthy();
  });
});

describe('Counter accessibility — touch target (TD-016, WCAG 2.5.5)', () => {
  it.each(['sm', 'md', 'lg'] as const)('buttons carry 44x44 hit-area overlay in size %s', size => {
    renderCounter(<Counter value={1} size={size} />);
    const decBtn = screen.getByRole('button', { name: 'Decrementar' });
    const btnClass = decBtn.className.split(' ').pop()!;
    const sheet = document.getElementById('arbor-style-engine')?.textContent ?? '';
    const beforeRule = new RegExp(`\\.${btnClass}::before\\{[^}]*min-width:44px[^}]*min-height:44px`);
    expect(sheet).toMatch(beforeRule);
  });
});
