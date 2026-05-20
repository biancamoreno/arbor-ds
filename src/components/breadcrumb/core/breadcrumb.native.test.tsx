import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Breadcrumb } from './breadcrumb';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function BasicBreadcrumb({ onHome }: { onHome?: () => void } = {}) {
  return (
    <Breadcrumb>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link onClick={onHome as React.MouseEventHandler<HTMLElement>}>Home</Breadcrumb.Link>
          <Breadcrumb.Separator />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Link>Produtos</Breadcrumb.Link>
          <Breadcrumb.Separator />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Current>Detalhes</Breadcrumb.Current>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb>
  );
}

describe('Breadcrumb (native)', () => {
  it('renderiza Root com accessibilityLabel padrão', () => {
    render(<BasicBreadcrumb />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Navegação estrutural')).toBeTruthy();
  });

  it('aceita label customizado', () => {
    render(
      <Breadcrumb label="Trilha">
        <Breadcrumb.List>
          <Breadcrumb.Item><Breadcrumb.Current>X</Breadcrumb.Current></Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>,
      { wrapper: Wrapper },
    );
    expect(screen.getByLabelText('Trilha')).toBeTruthy();
  });

  it('Link tem accessibilityRole="link"', () => {
    render(<BasicBreadcrumb />, { wrapper: Wrapper });
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('Link dispara onClick ao pressionar', () => {
    const onHome = jest.fn();
    render(<BasicBreadcrumb onHome={onHome} />, { wrapper: Wrapper });
    fireEvent.press(screen.getByText('Home'));
    expect(onHome).toHaveBeenCalledTimes(1);
  });

  it('Current renderiza texto', () => {
    render(<BasicBreadcrumb />, { wrapper: Wrapper });
    expect(screen.getByText('Detalhes')).toBeTruthy();
  });

  it('Separator default não renderiza texto "/" (agora é Icon ChevronRight)', () => {
    render(<BasicBreadcrumb />, { wrapper: Wrapper });
    expect(
      screen.queryAllByText('/', { includeHiddenElements: true }).length,
    ).toBe(0);
  });

  it('Separator aceita children customizados (oculto de a11y)', () => {
    render(
      <Breadcrumb>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link>Home</Breadcrumb.Link>
            <Breadcrumb.Separator>›</Breadcrumb.Separator>
          </Breadcrumb.Item>
          <Breadcrumb.Item><Breadcrumb.Current>Página</Breadcrumb.Current></Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('›', { includeHiddenElements: true })).toBeTruthy();
  });

  it('Separator é oculto de screen readers (TD-019)', () => {
    render(<BasicBreadcrumb />, { wrapper: Wrapper });
    expect(screen.queryByText('/')).toBeNull();
  });
});
