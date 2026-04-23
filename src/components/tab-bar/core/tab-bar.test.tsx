import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabBar } from './tab-bar';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

function ControlledTabBar() {
  const [active, setActive] = useState('home');
  return (
    <TabBar value={active} onChange={setActive} aria-label="Navegação principal">
      <TabBar.Item value="home" icon="House" label="Início" />
      <TabBar.Item value="search" icon="Search" label="Buscar" />
      <TabBar.Item value="profile" icon="User" label="Perfil" />
    </TabBar>
  );
}

describe('TabBar', () => {
  it('renderiza todos os items', () => {
    render(<ControlledTabBar />, { wrapper });
    expect(screen.getByText('Início')).toBeTruthy();
    expect(screen.getByText('Buscar')).toBeTruthy();
    expect(screen.getByText('Perfil')).toBeTruthy();
  });

  it('tem role="tablist" no container', () => {
    render(<ControlledTabBar />, { wrapper });
    expect(screen.getByRole('tablist')).toBeTruthy();
  });

  it('item ativo tem aria-selected=true', () => {
    render(
      <TabBar value="search" onChange={() => {}} aria-label="Nav">
        <TabBar.Item value="home" icon="House" label="Início" />
        <TabBar.Item value="search" icon="Search" label="Buscar" />
      </TabBar>,
      { wrapper },
    );
    const buscar = screen.getByRole('tab', { name: 'Buscar' });
    expect(buscar.getAttribute('aria-selected')).toBe('true');
  });

  it('item inativo tem aria-selected=false', () => {
    render(
      <TabBar value="search" onChange={() => {}} aria-label="Nav">
        <TabBar.Item value="home" icon="House" label="Início" />
        <TabBar.Item value="search" icon="Search" label="Buscar" />
      </TabBar>,
      { wrapper },
    );
    const inicio = screen.getByRole('tab', { name: 'Início' });
    expect(inicio.getAttribute('aria-selected')).toBe('false');
  });

  it('chama onChange ao clicar em item', () => {
    const onChange = jest.fn();
    render(
      <TabBar value="home" onChange={onChange} aria-label="Nav">
        <TabBar.Item value="home" icon="House" label="Início" />
        <TabBar.Item value="search" icon="Search" label="Buscar" />
      </TabBar>,
      { wrapper },
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Buscar' }));
    expect(onChange).toHaveBeenCalledWith('search');
  });

  it('badge={3} renderiza "3"', () => {
    render(
      <TabBar value="home" onChange={() => {}} aria-label="Nav">
        <TabBar.Item value="home" icon="House" label="Início" badge={3} />
      </TabBar>,
      { wrapper },
    );
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('badge={150} renderiza "99+"', () => {
    render(
      <TabBar value="home" onChange={() => {}} aria-label="Nav">
        <TabBar.Item value="home" icon="House" label="Início" badge={150} />
      </TabBar>,
      { wrapper },
    );
    expect(screen.getByText('99+')).toBeTruthy();
  });

  it('item disabled não chama onChange', () => {
    const onChange = jest.fn();
    render(
      <TabBar value="home" onChange={onChange} aria-label="Nav">
        <TabBar.Item value="search" icon="Search" label="Buscar" disabled />
      </TabBar>,
      { wrapper },
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Buscar' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('aplica aria-label no nav', () => {
    render(
      <TabBar value="home" onChange={() => {}} aria-label="Menu principal">
        <TabBar.Item value="home" icon="House" label="Início" />
      </TabBar>,
      { wrapper },
    );
    expect(screen.getByRole('tablist', { name: 'Menu principal' })).toBeTruthy();
  });
});
