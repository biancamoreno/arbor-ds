import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './tabs';
import { Box, Flex, Icon, Text } from '../../core';
import { Badge } from '../../badge';

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
    <Tabs defaultValue="reviews" style={{ width: 520 }}>
      <Tabs.List>
        <Tabs.Trigger value="overview">Visão geral</Tabs.Trigger>
        <Tabs.Trigger value="reviews">Avaliações</Tabs.Trigger>
        <Tabs.Trigger value="specs">Especificações</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">
        <Text variant="bodyMedium">Conteúdo da Visão Geral.</Text>
      </Tabs.Content>
      <Tabs.Content value="reviews">
        <Text variant="bodyMedium">
          Defaultvalue=&quot;reviews&quot; — indicador deve aparecer já neste item no carregamento.
        </Text>
      </Tabs.Content>
      <Tabs.Content value="specs">
        <Text variant="bodyMedium">Conteúdo das Especificações.</Text>
      </Tabs.Content>
    </Tabs>
  ),
};

/** Composição livre dentro do Trigger — Icon + label + Badge. */
export const FreeComposition: Story = {
  render: () => (
    <Tabs defaultValue="inbox" style={{ width: 520 }}>
      <Tabs.List>
        <Tabs.Trigger value="inbox">
          <Icon name="Mail" size="small" decorative />
          Caixa de entrada
          <Badge tone="info">12</Badge>
        </Tabs.Trigger>
        <Tabs.Trigger value="sent">
          <Icon name="Send" size="small" decorative />
          Enviados
        </Tabs.Trigger>
        <Tabs.Trigger value="drafts">
          <Icon name="FileText" size="small" decorative />
          Rascunhos
          <Badge tone="warning">3</Badge>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="inbox">
        <Text variant="bodyMedium">12 mensagens não lidas.</Text>
      </Tabs.Content>
      <Tabs.Content value="sent">
        <Text variant="bodyMedium">Mensagens enviadas.</Text>
      </Tabs.Content>
      <Tabs.Content value="drafts">
        <Text variant="bodyMedium">3 rascunhos salvos.</Text>
      </Tabs.Content>
    </Tabs>
  ),
};

export const Pill: Story = {
  render: () => (
    <Tabs defaultValue="all" style={{ width: 520 }}>
      <Tabs.List variant="pill">
        <Tabs.Trigger value="all">Todos</Tabs.Trigger>
        <Tabs.Trigger value="active">Ativos</Tabs.Trigger>
        <Tabs.Trigger value="archived">Arquivados</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="all">
        <Text variant="bodyMedium">Todos os itens.</Text>
      </Tabs.Content>
      <Tabs.Content value="active">
        <Text variant="bodyMedium">Itens ativos.</Text>
      </Tabs.Content>
      <Tabs.Content value="archived">
        <Text variant="bodyMedium">Itens arquivados.</Text>
      </Tabs.Content>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="available" style={{ width: 520 }}>
      <Tabs.List>
        <Tabs.Trigger value="available">Disponível</Tabs.Trigger>
        <Tabs.Trigger value="locked" disabled>
          Bloqueado
        </Tabs.Trigger>
        <Tabs.Trigger value="archived" disabled>
          Arquivado
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="available">
        <Text variant="bodyMedium">Recurso disponível.</Text>
      </Tabs.Content>
      <Tabs.Content value="locked">
        <Text variant="bodyMedium">Bloqueado.</Text>
      </Tabs.Content>
      <Tabs.Content value="archived">
        <Text variant="bodyMedium">Arquivado.</Text>
      </Tabs.Content>
    </Tabs>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <Tabs defaultValue="tab2" style={{ width: 520 }}>
      <Tabs.List fullWidth>
        <Tabs.Trigger value="tab1">Hoje</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Semana</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Mês</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <Text variant="bodyMedium">Resultados de hoje.</Text>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <Text variant="bodyMedium">Resultados da semana.</Text>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <Text variant="bodyMedium">Resultados do mês.</Text>
      </Tabs.Content>
    </Tabs>
  ),
};

export const IndicatorPositions: Story = {
  render: () => (
    <Flex flexDirection="column" gap="xlarge" style={{ width: 520 }}>
      {(['bottom', 'top'] as const).map((position) => (
        <Box key={position}>
          <Box paddingBottom="small">
            <Text variant="caption" color="text.secondary">
              indicatorPosition=&quot;{position}&quot;
            </Text>
          </Box>
          <Tabs defaultValue="reviews">
            <Tabs.List indicatorPosition={position}>
              <Tabs.Trigger value="overview">Visão geral</Tabs.Trigger>
              <Tabs.Trigger value="reviews">Avaliações</Tabs.Trigger>
              <Tabs.Trigger value="specs">Especificações</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="overview">
              <Text variant="bodyMedium">Conteúdo.</Text>
            </Tabs.Content>
            <Tabs.Content value="reviews">
              <Text variant="bodyMedium">Conteúdo.</Text>
            </Tabs.Content>
            <Tabs.Content value="specs">
              <Text variant="bodyMedium">Conteúdo.</Text>
            </Tabs.Content>
          </Tabs>
        </Box>
      ))}

      {(['left', 'right'] as const).map((position) => (
        <Box key={position}>
          <Box paddingBottom="small">
            <Text variant="caption" color="text.secondary">
              indicatorPosition=&quot;{position}&quot; (vertical)
            </Text>
          </Box>
          <Tabs defaultValue="security" orientation="vertical">
            <Tabs.List indicatorPosition={position}>
              <Tabs.Trigger value="general">Geral</Tabs.Trigger>
              <Tabs.Trigger value="security">Segurança</Tabs.Trigger>
              <Tabs.Trigger value="billing">Cobrança</Tabs.Trigger>
            </Tabs.List>
            <Box paddingLeft="medium">
              <Tabs.Content value="general">
                <Text variant="bodyMedium">Preferências gerais.</Text>
              </Tabs.Content>
              <Tabs.Content value="security">
                <Text variant="bodyMedium">Configurações de segurança.</Text>
              </Tabs.Content>
              <Tabs.Content value="billing">
                <Text variant="bodyMedium">Faturas.</Text>
              </Tabs.Content>
            </Box>
          </Tabs>
        </Box>
      ))}
    </Flex>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="security" orientation="vertical" style={{ width: 560, height: 220 }}>
      <Tabs.List>
        <Tabs.Trigger value="general">Geral</Tabs.Trigger>
        <Tabs.Trigger value="security">Segurança</Tabs.Trigger>
        <Tabs.Trigger value="billing">Cobrança</Tabs.Trigger>
      </Tabs.List>
      <Box paddingLeft="medium">
        <Tabs.Content value="general">
          <Text variant="bodyMedium">Preferências gerais.</Text>
        </Tabs.Content>
        <Tabs.Content value="security">
          <Text variant="bodyMedium">Configurações de segurança.</Text>
        </Tabs.Content>
        <Tabs.Content value="billing">
          <Text variant="bodyMedium">Faturas e métodos de pagamento.</Text>
        </Tabs.Content>
      </Box>
    </Tabs>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex flexDirection="column" gap="xlarge" style={{ width: 520 }}>
      {(['xsmall', 'small', 'medium', 'large', 'xlarge'] as const).map((size) => (
        <Box key={size}>
          <Box paddingBottom="small">
            <Text variant="caption" color="text.secondary">
              size=&quot;{size}&quot;
            </Text>
          </Box>
          <Tabs defaultValue="overview">
            <Tabs.List size={size}>
              <Tabs.Trigger value="overview">Visão geral</Tabs.Trigger>
              <Tabs.Trigger value="reviews">Avaliações</Tabs.Trigger>
              <Tabs.Trigger value="specs">Especificações</Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </Box>
      ))}
    </Flex>
  ),
};
