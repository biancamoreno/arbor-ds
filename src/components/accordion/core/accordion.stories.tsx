import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './accordion';

const meta = {
  title: 'Navigation/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    type: { control: { type: 'select' }, options: ['single', 'multiple'] },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj;

export const Single: Story = {
  render: () => (
    <Accordion type="single" style={{ width: 400 }}>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>O que é o Arbor DS?</Accordion.Trigger>
        <Accordion.Content>
          Arbor DS é um design system cross-platform para React e React Native.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>Como instalar?</Accordion.Trigger>
        <Accordion.Content>
          Execute <code>pnpm add arbor-ds</code> no seu projeto.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>Suporta React Native?</Accordion.Trigger>
        <Accordion.Content>
          Sim! Componentes marcados como cross-platform funcionam em web e mobile.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={['item-1']} style={{ width: 400 }}>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>Seção 1 (aberta por padrão)</Accordion.Trigger>
        <Accordion.Content>Conteúdo da primeira seção expandida por padrão.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>Seção 2</Accordion.Trigger>
        <Accordion.Content>Conteúdo da segunda seção.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3" disabled>
        <Accordion.Trigger>Seção 3 (desabilitada)</Accordion.Trigger>
        <Accordion.Content>Este conteúdo não é acessível.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};
