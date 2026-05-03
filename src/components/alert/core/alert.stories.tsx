import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../core';
import { Alert } from './alert';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    tone: { control: { type: 'select' }, options: ['info', 'success', 'warning', 'critical'] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj;

export const Info: Story = {
  render: () => (
    <Alert tone="info">
      <Alert.Icon />
      <Alert.Title>Informação</Alert.Title>
      <Alert.Description>Esta é uma mensagem informativa para o usuário.</Alert.Description>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert tone="success">
      <Alert.Icon />
      <Alert.Title>Sucesso!</Alert.Title>
      <Alert.Description>A operação foi concluída com sucesso.</Alert.Description>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert tone="warning">
      <Alert.Icon />
      <Alert.Title>Atenção</Alert.Title>
      <Alert.Description>Verifique as informações antes de continuar.</Alert.Description>
    </Alert>
  ),
};

export const Critical: Story = {
  render: () => (
    <Alert tone="critical">
      <Alert.Icon />
      <Alert.Title>Erro crítico</Alert.Title>
      <Alert.Description>Ocorreu um erro. Por favor, tente novamente.</Alert.Description>
      <Alert.Close />
    </Alert>
  ),
};

export const AllTones: Story = {
  render: () => (
    <Flex flexDirection="column" gap="small" width={400}>
      {(['info', 'success', 'warning', 'critical'] as const).map((tone) => (
        <Alert key={tone} tone={tone}>
          <Alert.Icon />
          <Alert.Title>{tone.charAt(0).toUpperCase() + tone.slice(1)}</Alert.Title>
          <Alert.Description>Mensagem de alerta do tipo {tone}.</Alert.Description>
        </Alert>
      ))}
    </Flex>
  ),
};
