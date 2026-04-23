import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabBar } from './tab-bar';

const meta = {
  title: 'Components/TabBar',
  component: TabBar,
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
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultTabBarStory() {
  const [active, setActive] = useState('home');

  return (
    <div style={{ height: '100vh', position: 'relative', background: '#f9fafb' }}>
      <div style={{ padding: '24px 16px', paddingBottom: 80 }}>
        <h2 style={{ margin: 0, fontSize: 18, color: '#111' }}>
          {active.charAt(0).toUpperCase() + active.slice(1)}
        </h2>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Conteúdo da aba ativa</p>
      </div>
      <TabBar value={active} onChange={setActive} aria-label="Navegação principal">
        <TabBar.Item value="home" icon="House" label="Início" />
        <TabBar.Item value="search" icon="Search" label="Buscar" />
        <TabBar.Item value="cart" icon="ShoppingCart" label="Carrinho" badge={3} />
        <TabBar.Item value="profile" icon="User" label="Perfil" />
      </TabBar>
    </div>
  );
}

function TabBarWithBadgesStory() {
  const [active, setActive] = useState('notifications');

  return (
    <div style={{ height: '100vh', position: 'relative', background: '#f9fafb' }}>
      <p style={{ padding: 24, color: '#6b7280', fontSize: 14 }}>Demonstração de badges</p>
      <TabBar value={active} onChange={setActive} aria-label="Navegação com badges">
        <TabBar.Item value="home" icon="House" label="Início" />
        <TabBar.Item value="notifications" icon="Bell" label="Alertas" badge={true} />
        <TabBar.Item value="messages" icon="MessageCircle" label="Mensagens" badge={12} />
        <TabBar.Item value="cart" icon="ShoppingCart" label="Carrinho" badge={150} />
      </TabBar>
    </div>
  );
}

function TabBarWithDisabledItemStory() {
  const [active, setActive] = useState('home');

  return (
    <div style={{ height: '100vh', position: 'relative', background: '#f9fafb' }}>
      <p style={{ padding: 24, color: '#6b7280', fontSize: 14 }}>Item "Premium" está desabilitado</p>
      <TabBar value={active} onChange={setActive} aria-label="Navegação">
        <TabBar.Item value="home" icon="House" label="Início" />
        <TabBar.Item value="explore" icon="Compass" label="Explorar" />
        <TabBar.Item value="premium" icon="Star" label="Premium" disabled />
        <TabBar.Item value="profile" icon="User" label="Perfil" />
      </TabBar>
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultTabBarStory />,
};

export const WithBadges: Story = {
  render: () => <TabBarWithBadgesStory />,
};

export const WithDisabledItem: Story = {
  render: () => <TabBarWithDisabledItemStory />,
};
