import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Flex, Box, Text, Icon, Clickable } from '../../core';
import { ArborProvider } from '../../../ecosystem';
import { createTheme, themeLight } from '../../../foundations';
import { Alert } from './alert';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    tone: {
      control: { type: 'select' },
      options: ['neutral', 'brand', 'info', 'success', 'warning', 'critical'],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj;

const noop = () => undefined;

export const Default: Story = {
  render: () => (
    <Alert
      tone="info"
      title="Informação"
      description="Esta é uma mensagem informativa para o usuário."
    />
  ),
};

export const Anatomia: Story = {
  name: 'Anatomia — slots internos',
  render: () => (
    <Flex flexDirection="column" gap="large" maxWidth={520}>
      <Flex flexDirection="column" gap="micro">
        <Text variant="overline" color="text.secondary">
          API plana (recomendada)
        </Text>
        <Alert
          tone="warning"
          title="Atenção"
          description="Sua sessão expira em 5 minutos."
          onClose={noop}
        />
      </Flex>
      <Flex flexDirection="column" gap="micro">
        <Text variant="overline" color="text.secondary">
          API compound — slots Icon / Title / Description / Close
        </Text>
        <Alert.Root tone="warning">
          <Alert.Icon />
          <Flex flex={1} flexDirection="column" gap="micro">
            <Alert.Title>Atenção</Alert.Title>
            <Alert.Description>
              Sua sessão expira em 5 minutos.
            </Alert.Description>
          </Flex>
          <Alert.Close onClick={noop} />
        </Alert.Root>
      </Flex>
    </Flex>
  ),
};

export const Tones: Story = {
  render: () => (
    <Flex flexDirection="column" gap="small" maxWidth={520}>
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
  render: () => {
    const Demo = () => {
      const [visible, setVisible] = useState(true);
      if (!visible) {
        return (
          <Clickable
            as="button"
            type="button"
            onClick={() => setVisible(true)}
            padding="small"
            paddingX="medium"
            borderRadius="small"
            borderWidth={0}
            backgroundColor="background.subtle"
            cursor="pointer"
          >
            <Text>Mostrar alerta novamente</Text>
          </Clickable>
        );
      }
      return (
        <Alert
          tone="info"
          title="Nova versão disponível"
          description="A versão 2.0 chegou com melhorias de performance."
          onClose={() => setVisible(false)}
        />
      );
    };
    return <Demo />;
  },
};

export const CustomIcon: Story = {
  render: () => (
    <Alert
      tone="brand"
      icon={<Icon name="Megaphone" size="medium" />}
      title="Novidade"
      description="Ícone customizado via prop sobrescreve o padrão por tom."
    />
  ),
};

export const WithoutIcon: Story = {
  name: 'Sem ícone — API compound',
  render: () => (
    <Alert.Root tone="info">
      <Flex flex={1} flexDirection="column" gap="micro">
        <Alert.Title>Mensagem direta</Alert.Title>
        <Alert.Description>
          Use o compound omitindo `Alert.Icon` quando o título já carrega contexto suficiente.
        </Alert.Description>
      </Flex>
    </Alert.Root>
  ),
};

export const LongMessage: Story = {
  render: () => (
    <Alert
      tone="critical"
      title="Falha ao salvar registro"
      description="Não foi possível salvar este registro porque o servidor retornou erro 502. Verifique sua conexão e tente novamente. Se o erro persistir, contate o suporte com o ID da transação 7b3e9-aa12-002f."
      onClose={noop}
    />
  ),
};

export const WithInlineAction: Story = {
  name: 'Ação inline na descrição (compound)',
  render: () => (
    <Alert.Root tone="warning">
      <Alert.Icon />
      <Flex flex={1} flexDirection="column" gap="micro">
        <Alert.Title>Sessão expirando</Alert.Title>
        <Alert.Description>
          Sua sessão expira em 5 minutos.{' '}
          <Box
            as="a"
            href="#"
            onClick={(e: React.MouseEvent) => e.preventDefault()}
            color="inherit"
            style={{ textDecoration: 'underline' }}
          >
            Renovar agora
          </Box>
        </Alert.Description>
      </Flex>
      <Alert.Close onClick={noop} />
    </Alert.Root>
  ),
};

const themedAlert = createTheme(themeLight, {
  components: {
    alert: {
      borderRadius: 'medium',
      colors: {
        info: {
          background: 'brand.bgSubtle',
          borderColor: 'brand.solid',
          icon: 'brand.solid',
          title: 'brand.text',
          description: 'brand.text',
          closeHover: 'brand.bgElementHover',
        },
      },
    },
  },
});

export const Theming: Story = {
  name: 'Theming — override de components.alert.colors',
  render: () => (
    <ArborProvider theme={themedAlert}>
      <Flex flexDirection="column" gap="small" maxWidth={520}>
        <Text variant="overline" color="text.secondary">
          Tone info repintado via tokens.components.alert.colors.info
        </Text>
        <Alert
          tone="info"
          title="Brand-tinted info"
          description="A cor de fundo, borda, ícone e texto seguem o tema customizado."
          onClose={noop}
        />
      </Flex>
    </ArborProvider>
  ),
};
