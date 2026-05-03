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
      <Tabs.Content value="tab1">Conteúdo da aba Visão Geral.</Tabs.Content>
      <Tabs.Content value="tab2">Conteúdo da aba Detalhes.</Tabs.Content>
      <Tabs.Content value="tab3">Conteúdo da aba Configurações.</Tabs.Content>
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
      <Tabs.Content value="tab1">Todos os itens.</Tabs.Content>
      <Tabs.Content value="tab2">Itens ativos.</Tabs.Content>
      <Tabs.Content value="tab3">Itens inativos.</Tabs.Content>
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
      <Tabs.Content value="tab1">Conteúdo 1</Tabs.Content>
      <Tabs.Content value="tab2">Conteúdo 2</Tabs.Content>
      <Tabs.Content value="tab3">Conteúdo 3</Tabs.Content>
    </Tabs>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 480 }}>
      {(['xsmall', 'small', 'medium', 'large', 'xlarge'] as const).map((size) => (
        <Tabs key={size} defaultValue="a">
          <Tabs.List size={size}>
            <Tabs.Trigger value="a">{`size="${size}"`}</Tabs.Trigger>
            <Tabs.Trigger value="b">Outro</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="a">Conteúdo da aba A.</Tabs.Content>
          <Tabs.Content value="b">Conteúdo da aba B.</Tabs.Content>
        </Tabs>
      ))}
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="tab1" orientation="vertical" style={{ width: 480 }}>
      <Tabs.List>
        <Tabs.Trigger value="tab1">Visão Geral</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Detalhes</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Configurações</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Conteúdo da aba Visão Geral.</Tabs.Content>
      <Tabs.Content value="tab2">Conteúdo da aba Detalhes.</Tabs.Content>
      <Tabs.Content value="tab3">Conteúdo da aba Configurações.</Tabs.Content>
    </Tabs>
  ),
};
