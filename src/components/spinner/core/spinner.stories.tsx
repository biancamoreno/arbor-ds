import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../core';
import { Box } from '../../core';
import { Text } from '../../core';
import { Spinner } from './spinner';
import type { SpinnerSize } from '../internal/sizes';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['small', 'medium', 'large'] },
    color: { control: 'color' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj;

const SIZE_LABELS: { token: SpinnerSize; px: number; uso: string }[] = [
  { token: 'small',  px: 16, uso: 'inline em buttons medium, helper text' },
  { token: 'medium', px: 24, uso: 'default — área de conteúdo, modais' },
  { token: 'large',  px: 40, uso: 'empty state, page-level loader, overlay' },
];

export const Default: Story = {
  args: { size: 'medium', label: 'Carregando' },
};

export const SizeScale: Story = {
  name: 'Anatomia — escala de tamanhos (themable)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Tokens themable via `theme.sizes.spinner` (RFC-0042 PCV-4). Produto consumidor pode
        reescalar sem editar o componente.
      </Text>
      <Flex alignItems="flex-end" gap="xlarge">
        {SIZE_LABELS.map(({ token, px, uso }) => (
          <Flex key={token} flexDirection="column" alignItems="center" gap="xsmall" width="180px">
            <Spinner size={token} label={`Carregando ${token}`} />
            <Text variant="label">{token}</Text>
            <Text variant="overline" color="text.tertiary">{px}px</Text>
            <Text variant="caption" color="text.secondary">{uso}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  ),
};

export const SemanticColors: Story = {
  name: 'Cor — passar token via `color`',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Default = `brand.solid`. Para contextos semânticos, passe o token diretamente.
      </Text>
      <Flex alignItems="center" gap="large">
        <Flex flexDirection="column" alignItems="center" gap="xsmall">
          <Spinner />
          <Text variant="caption" color="text.secondary">brand.solid (default)</Text>
        </Flex>
        <Flex flexDirection="column" alignItems="center" gap="xsmall">
          <Spinner color="text.primary" />
          <Text variant="caption" color="text.secondary">text.primary</Text>
        </Flex>
        <Flex flexDirection="column" alignItems="center" gap="xsmall">
          <Spinner color="feedback.success.solid" />
          <Text variant="caption" color="text.secondary">feedback.success.solid</Text>
        </Flex>
        <Flex flexDirection="column" alignItems="center" gap="xsmall">
          <Spinner color="feedback.critical.solid" />
          <Text variant="caption" color="text.secondary">feedback.critical.solid</Text>
        </Flex>
      </Flex>
    </Flex>
  ),
};

export const InlineWithText: Story = {
  name: 'Composição — inline com texto adjacente',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Quando há texto adjacente que anuncia o loading, passe `label=""` para evitar dupla
        anúncio em leitores de tela.
      </Text>
      <Flex flexDirection="column" gap="small">
        <Flex alignItems="center" gap="small">
          <Spinner size="small" label="" />
          <Text>Salvando rascunho…</Text>
        </Flex>
        <Flex alignItems="center" gap="small">
          <Spinner size="small" color="feedback.warning.solid" label="" />
          <Text color="feedback.warning.text">Reconciliando estado…</Text>
        </Flex>
      </Flex>
    </Flex>
  ),
};

export const OverlayLoader: Story = {
  name: 'Composição — loader cobrindo uma área',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        `Spinner size="large"` centrado sobre área de conteúdo bloqueada.
      </Text>
      <Box
        position="relative"
        width="100%"
        height="200px"
        backgroundColor="background.subtle"
        borderRadius="medium"
        borderWidth="hairline"
        borderStyle="solid"
        borderColor="border.subtle"
      >
        <Box
          position="absolute"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="background.overlay"
          borderRadius="medium"
        >
          <Flex flexDirection="column" alignItems="center" gap="small">
            <Spinner size="large" color="text.inverse" />
            <Text variant="caption" color="text.inverse">Sincronizando dados</Text>
          </Flex>
        </Box>
      </Box>
    </Flex>
  ),
};

export const ReducedMotion: Story = {
  name: 'A11y — reduced-motion (configuração do sistema)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Quando o usuário ativa &quot;Reduzir movimento&quot; no sistema, o spinner congela mas
        permanece anunciado por leitores de tela (`role=&quot;status&quot;` + `aria-label`).
        Honrado globalmente no web (provider) e por componente no native (TD-041).
      </Text>
      <Flex alignItems="center" gap="medium">
        <Spinner size="medium" label="Carregando — anunciado mesmo com motion reduzido" />
        <Text variant="caption" color="text.secondary">
          (Ative &quot;Reduce motion&quot; no SO para ver o efeito.)
        </Text>
      </Flex>
    </Flex>
  ),
};
