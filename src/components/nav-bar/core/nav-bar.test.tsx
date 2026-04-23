import React from 'react';
import { render, screen } from '@testing-library/react';
import { NavBar } from './nav-bar';
import { IconButton } from '../../button';
import { Icon } from '../../core';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

const BackButton = () => (
  <IconButton aria-label="Voltar" variant="ghost" size="sm">
    <Icon name="ArrowLeft" size={20} decorative />
  </IconButton>
);

const SearchButton = () => (
  <IconButton aria-label="Buscar" variant="ghost" size="sm">
    <Icon name="Search" size={20} decorative />
  </IconButton>
);

describe('NavBar', () => {
  it('renderiza o elemento header', () => {
    const { container } = render(<NavBar />, { wrapper });
    expect(container.querySelector('header')).toBeTruthy();
  });

  it('exibe título quando title é fornecido', () => {
    render(<NavBar title="Detalhes do produto" />, { wrapper });
    expect(screen.getByText('Detalhes do produto')).toBeTruthy();
  });

  it('renderiza slot start', () => {
    render(<NavBar start={<BackButton />} />, { wrapper });
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeTruthy();
  });

  it('renderiza slot end', () => {
    render(<NavBar end={<SearchButton />} />, { wrapper });
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeTruthy();
  });

  it('renderiza start e end simultaneamente', () => {
    render(<NavBar start={<BackButton />} end={<SearchButton />} title="Home" />, { wrapper });
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeTruthy();
    expect(screen.getByText('Home')).toBeTruthy();
  });

  it('renderiza ProgressBar quando progress é fornecido', () => {
    render(<NavBar progress={60} progressLabel="Carregando" />, { wrapper });
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('ProgressBar usa progressLabel como aria-label', () => {
    render(<NavBar progress={40} progressLabel="Upload em andamento" />, { wrapper });
    expect(screen.getByLabelText('Upload em andamento')).toBeTruthy();
  });

  it('center sobrepõe title', () => {
    render(
      <NavBar title="Ignorado" center={<span>Centro customizado</span>} />,
      { wrapper },
    );
    expect(screen.getByText('Centro customizado')).toBeTruthy();
    expect(screen.queryByText('Ignorado')).toBeNull();
  });

  it('center sobrepõe progress', () => {
    render(
      <NavBar progress={50} center={<span>Centro customizado</span>} />,
      { wrapper },
    );
    expect(screen.getByText('Centro customizado')).toBeTruthy();
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('progress sobrepõe title', () => {
    render(<NavBar title="Ignorado" progress={50} progressLabel="Progresso" />, { wrapper });
    expect(screen.getByRole('progressbar')).toBeTruthy();
    expect(screen.queryByText('Ignorado')).toBeNull();
  });

  it('aplica aria-label no header', () => {
    const { container } = render(
      <NavBar aria-label="Barra de navegação principal" />,
      { wrapper },
    );
    const header = container.querySelector('header');
    expect(header?.getAttribute('aria-label')).toBe('Barra de navegação principal');
  });

  it('renderiza sem props obrigatórias', () => {
    const { container } = render(<NavBar />, { wrapper });
    expect(container.querySelector('header')).toBeTruthy();
  });

  it('position sticky por padrão', () => {
    const { container } = render(<NavBar />, { wrapper });
    const header = container.querySelector('header') as HTMLElement;
    expect(header.style.position).toBe('sticky');
  });

  it('elevated aplica box-shadow', () => {
    const { container } = render(<NavBar elevated />, { wrapper });
    const header = container.querySelector('header') as HTMLElement;
    expect(header.style.boxShadow).toBeTruthy();
  });

  it('sem elevated não aplica box-shadow', () => {
    const { container } = render(<NavBar />, { wrapper });
    const header = container.querySelector('header') as HTMLElement;
    expect(header.style.boxShadow).toBeFalsy();
  });
});
