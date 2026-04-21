import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavBar } from './nav-bar';

const meta = {
  title: 'Components/NavBar',
  component: NavBar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    value: 'home',
    onChange: () => {},
    children: null,
  },
  argTypes: {
    safeAreaBottom: { control: 'boolean' },
    blurred: { control: 'boolean' },
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultNavBarStory() {
  const [active, setActive] = useState('home');

  return (
    <div style={{ height: '100vh', position: 'relative', background: '#f9fafb' }}>
      <div style={{ padding: '24px 16px', paddingBottom: 80 }}>
        <h2 style={{ margin: 0, fontSize: 18, color: '#111' }}>
          {active.charAt(0).toUpperCase() + active.slice(1)}
        </h2>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Conteúdo da aba ativa</p>
      </div>
      <NavBar value={active} onChange={setActive} aria-label="Navegação principal">
        <NavBar.Item value="home" icon="House" label="Início" />
        <NavBar.Item value="search" icon="Search" label="Buscar" />
        <NavBar.Item value="cart" icon="ShoppingCart" label="Carrinho" badge={3} />
        <NavBar.Item value="profile" icon="User" label="Perfil" />
      </NavBar>
    </div>
  );
}

function NavBarWithBadgesStory() {
  const [active, setActive] = useState('notifications');

  return (
    <div style={{ height: '100vh', position: 'relative', background: '#f9fafb' }}>
      <p style={{ padding: 24, color: '#6b7280', fontSize: 14 }}>Demonstração de badges</p>
      <NavBar value={active} onChange={setActive} aria-label="Navegação com badges">
        <NavBar.Item value="home" icon="House" label="Início" />
        <NavBar.Item value="notifications" icon="Bell" label="Alertas" badge={true} />
        <NavBar.Item value="messages" icon="MessageCircle" label="Mensagens" badge={12} />
        <NavBar.Item value="cart" icon="ShoppingCart" label="Carrinho" badge={150} />
      </NavBar>
    </div>
  );
}

function NavBarWithDisabledItemStory() {
  const [active, setActive] = useState('home');

  return (
    <div style={{ height: '100vh', position: 'relative', background: '#f9fafb' }}>
      <p style={{ padding: 24, color: '#6b7280', fontSize: 14 }}>Item "Premium" está desabilitado</p>
      <NavBar value={active} onChange={setActive} aria-label="Navegação">
        <NavBar.Item value="home" icon="House" label="Início" />
        <NavBar.Item value="explore" icon="Compass" label="Explorar" />
        <NavBar.Item value="premium" icon="Star" label="Premium" disabled />
        <NavBar.Item value="profile" icon="User" label="Perfil" />
      </NavBar>
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultNavBarStory />,
};

export const WithBadges: Story = {
  render: () => <NavBarWithBadgesStory />,
};

export const WithDisabledItem: Story = {
  render: () => <NavBarWithDisabledItemStory />,
};
