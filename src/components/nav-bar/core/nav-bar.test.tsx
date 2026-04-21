import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavBar } from './nav-bar';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

function ControlledNavBar() {
  const [active, setActive] = useState('home');
  return (
    <NavBar value={active} onChange={setActive} aria-label="Navegação principal">
      <NavBar.Item value="home" icon="House" label="Início" />
      <NavBar.Item value="search" icon="Search" label="Buscar" />
      <NavBar.Item value="profile" icon="User" label="Perfil" />
    </NavBar>
  );
}

describe('NavBar', () => {
  it('renderiza todos os items', () => {
    render(<ControlledNavBar />, { wrapper });
    expect(screen.getByText('Início')).toBeTruthy();
    expect(screen.getByText('Buscar')).toBeTruthy();
    expect(screen.getByText('Perfil')).toBeTruthy();
  });

  it('tem role="tablist" no container', () => {
    render(<ControlledNavBar />, { wrapper });
    expect(screen.getByRole('tablist')).toBeTruthy();
  });

  it('item ativo tem aria-selected=true', () => {
    render(
      <NavBar value="search" onChange={() => {}} aria-label="Nav">
        <NavBar.Item value="home" icon="House" label="Início" />
        <NavBar.Item value="search" icon="Search" label="Buscar" />
      </NavBar>,
      { wrapper },
    );
    const buscar = screen.getByRole('tab', { name: 'Buscar' });
    expect(buscar.getAttribute('aria-selected')).toBe('true');
  });

  it('item inativo tem aria-selected=false', () => {
    render(
      <NavBar value="search" onChange={() => {}} aria-label="Nav">
        <NavBar.Item value="home" icon="House" label="Início" />
        <NavBar.Item value="search" icon="Search" label="Buscar" />
      </NavBar>,
      { wrapper },
    );
    const inicio = screen.getByRole('tab', { name: 'Início' });
    expect(inicio.getAttribute('aria-selected')).toBe('false');
  });

  it('chama onChange ao clicar em item', () => {
    const onChange = jest.fn();
    render(
      <NavBar value="home" onChange={onChange} aria-label="Nav">
        <NavBar.Item value="home" icon="House" label="Início" />
        <NavBar.Item value="search" icon="Search" label="Buscar" />
      </NavBar>,
      { wrapper },
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Buscar' }));
    expect(onChange).toHaveBeenCalledWith('search');
  });

  it('badge={3} renderiza "3"', () => {
    render(
      <NavBar value="home" onChange={() => {}} aria-label="Nav">
        <NavBar.Item value="home" icon="House" label="Início" badge={3} />
      </NavBar>,
      { wrapper },
    );
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('badge={150} renderiza "99+"', () => {
    render(
      <NavBar value="home" onChange={() => {}} aria-label="Nav">
        <NavBar.Item value="home" icon="House" label="Início" badge={150} />
      </NavBar>,
      { wrapper },
    );
    expect(screen.getByText('99+')).toBeTruthy();
  });

  it('item disabled não chama onChange', () => {
    const onChange = jest.fn();
    render(
      <NavBar value="home" onChange={onChange} aria-label="Nav">
        <NavBar.Item value="search" icon="Search" label="Buscar" disabled />
      </NavBar>,
      { wrapper },
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Buscar' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('aplica aria-label no nav', () => {
    render(
      <NavBar value="home" onChange={() => {}} aria-label="Menu principal">
        <NavBar.Item value="home" icon="House" label="Início" />
      </NavBar>,
      { wrapper },
    );
    expect(screen.getByRole('tablist', { name: 'Menu principal' })).toBeTruthy();
  });
});
