import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './tabs';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: { control: { type: 'select' }, options: ['horizontal', 'vertical'] },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1" style={{ width: 480 }}>
      <Tabs.List>
        <Tabs.Trigger value="tab1">Visão Geral</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Detalhes</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Configurações</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <div style={{ padding: '16px 0' }}>Conteúdo da aba Visão Geral.</div>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <div style={{ padding: '16px 0' }}>Conteúdo da aba Detalhes.</div>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <div style={{ padding: '16px 0' }}>Conteúdo da aba Configurações.</div>
      </Tabs.Content>
    </Tabs>
  ),
};

export const PillVariant: Story = {
  render: () => (
    <Tabs defaultValue="tab1" style={{ width: 480 }}>
      <Tabs.List variant="pill">
        <Tabs.Trigger value="tab1">Todos</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Ativos</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Inativos</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <div style={{ padding: '16px 0' }}>Todos os itens.</div>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <div style={{ padding: '16px 0' }}>Itens ativos.</div>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <div style={{ padding: '16px 0' }}>Itens inativos.</div>
      </Tabs.Content>
    </Tabs>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <Tabs defaultValue="tab1" style={{ width: 480 }}>
      <Tabs.List fullWidth>
        <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1"><div style={{ padding: '16px 0' }}>Conteúdo 1</div></Tabs.Content>
      <Tabs.Content value="tab2"><div style={{ padding: '16px 0' }}>Conteúdo 2</div></Tabs.Content>
      <Tabs.Content value="tab3"><div style={{ padding: '16px 0' }}>Conteúdo 3</div></Tabs.Content>
    </Tabs>
  ),
};
