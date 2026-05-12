import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../core';
import { Icon } from '../../core';
import { Alert } from './alert';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    tone: { control: { type: 'select' }, options: ['neutral', 'brand', 'info', 'success', 'warning', 'critical'] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj;

export const Info: Story = {
  render: () => (
    <Alert tone="info" title="Informação" description="Esta é uma mensagem informativa para o usuário." />
  ),
};

export const Success: Story = {
  render: () => (
    <Alert tone="success" title="Sucesso!" description="A operação foi concluída com sucesso." />
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert tone="warning" title="Atenção" description="Verifique as informações antes de continuar." />
  ),
};

export const Critical: Story = {
  render: () => (
    <Alert
      tone="critical"
      title="Erro crítico"
      description="Ocorreu um erro. Por favor, tente novamente."
      onClose={() => undefined}
    />
  ),
};

export const AllTones: Story = {
  render: () => (
    <Flex flexDirection="column" gap="small" width={400}>
      {(['neutral', 'brand', 'info', 'success', 'warning', 'critical'] as const).map((tone) => (
        <Alert
          key={tone}
          tone={tone}
          title={tone.charAt(0).toUpperCase() + tone.slice(1)}
          description={`Mensagem de alerta do tipo ${tone}.`}
        />
      ))}
    </Flex>
  ),
};

export const Dismissable: Story = {
  render: () => (
    <Alert
      tone="info"
      title="Nova versão disponível"
      description="A versão 2.0 chegou com melhorias de performance."
      onClose={() => alert('Fechado')}
    />
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <Alert
      tone="brand"
      icon={<Icon name="Megaphone" size="medium" />}
      title="Novidade"
      description="Ícone customizado via prop."
    />
  ),
};

export const AdvancedCompound: Story = {
  name: 'API compound — layout custom',
  render: () => (
    <Alert.Root tone="warning">
      <Alert.Icon />
      <Flex flex={1} flexDirection="column" gap="micro">
        <Alert.Title>Anatomia compound</Alert.Title>
        <Alert.Description>
          Use `Alert.Root` quando precisar de slots em ordem não-trivial,
          ação inline na descrição ou layout multi-coluna.
        </Alert.Description>
      </Flex>
      <Alert.Close onClick={() => undefined} />
    </Alert.Root>
  ),
};
