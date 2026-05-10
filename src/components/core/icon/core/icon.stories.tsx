import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './icon';
import { IconShowcase } from './icon-showcase';
import { Flex } from '../../flex';
import { Box } from '../../box';
import { Text } from '../../text';
import type { IconSizeToken } from '../../../../foundations';

const meta = {
  title: '🌳 Arbor DS/Foundations/Icons',
  component: Icon,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    name: { control: 'text' },
    size: {
      control: { type: 'select' },
      options: ['xsmall', 'small', 'medium', 'large', 'xlarge', 'hero'],
    },
    color: { control: 'color' },
    strokeWidth: {
      control: { type: 'select' },
      options: [1, 1.5, 1.75, 2],
    },
    decorative: { control: 'boolean' },
    'aria-label': { control: 'text' },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj;

const SIZES: { token: IconSizeToken; px: number; uso: string }[] = [
  { token: 'xsmall', px: 12, uso: 'inline em texto pequeno' },
  { token: 'small',  px: 16, uso: 'buttons sm, chips, tags' },
  { token: 'medium', px: 20, uso: 'default — buttons, inputs, alerts' },
  { token: 'large',  px: 24, uso: 'buttons lg, headers de section' },
  { token: 'xlarge', px: 32, uso: 'hero icons em cards' },
  { token: 'hero',   px: 48, uso: 'empty state, onboarding' },
];

export const Library: Story = {
  name: 'Catálogo completo',
  render: () => <IconShowcase />,
  parameters: { layout: 'fullscreen' },
};

export const Default: Story = {
  args: {
    name: 'Check',
    decorative: true,
  },
};

export const SizeScale: Story = {
  name: 'Anatomia — escala de tamanhos (tokens)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Use tokens semânticos sempre que possível. Pixel literal é escape hatch.
      </Text>
      <Flex alignItems="flex-end" gap="large">
        {SIZES.map(({ token, px }) => (
          <Flex key={token} flexDirection="column" alignItems="center" gap="xsmall">
            <Icon name="Star" size={token} decorative />
            <Text variant="caption" color="text.secondary">{token}</Text>
            <Text variant="overline" color="text.tertiary">{px}px</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  ),
};

export const StrokeVariants: Story = {
  name: 'StrokeWidth — peso da linha',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Default 1.75 — meio termo entre Lucide 1.5 (leve) e 2 (firme).
      </Text>
      <Flex alignItems="center" gap="xlarge">
        {([1, 1.5, 1.75, 2] as const).map((sw) => (
          <Flex key={sw} flexDirection="column" alignItems="center" gap="xsmall">
            <Icon name="Circle" size="large" strokeWidth={sw} decorative />
            <Text variant="caption" color="text.secondary">{sw}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  ),
};

export const InlineWithText: Story = {
  name: 'Alinhamento — Icon inline com Text',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Icon herda `currentColor` por default; alinha pelo baseline do Text quando o `size`
        casa com a textStyle.
      </Text>
      <Flex flexDirection="column" gap="small">
        <Flex alignItems="center" gap="xsmall">
          <Icon name="Check" size="xsmall" decorative />
          <Text variant="bodySmall">xsmall (12) com bodySmall (14)</Text>
        </Flex>
        <Flex alignItems="center" gap="xsmall">
          <Icon name="Check" size="small" decorative />
          <Text variant="bodyMedium">small (16) com bodyMedium (16)</Text>
        </Flex>
        <Flex alignItems="center" gap="small">
          <Icon name="Check" size="medium" decorative />
          <Text variant="bodyLarge">medium (20) com bodyLarge (18)</Text>
        </Flex>
        <Flex alignItems="center" gap="small">
          <Icon name="Check" size="large" decorative />
          <Text variant="headingSmall">large (24) com headingSmall (24)</Text>
        </Flex>
        <Flex alignItems="center" gap="medium">
          <Icon name="Check" size="xlarge" decorative />
          <Text variant="headingLarge">xlarge (32) com headingLarge (32)</Text>
        </Flex>
      </Flex>
    </Flex>
  ),
};

export const ColorInheritance: Story = {
  name: 'Cor — herda do contexto via `currentColor`',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Icon herda a cor do parent (web). Para forçar tom, passe `color` apontando para token.
      </Text>
      <Flex flexDirection="column" gap="small">
        <Flex alignItems="center" gap="xsmall" color="text.primary">
          <Icon name="Heart" decorative />
          <Text>color: text.primary (default herdado)</Text>
        </Flex>
        <Flex alignItems="center" gap="xsmall" color="text.secondary">
          <Icon name="Heart" decorative />
          <Text>color: text.secondary (herdado)</Text>
        </Flex>
        <Flex alignItems="center" gap="xsmall" color="brand.text">
          <Icon name="Heart" decorative />
          <Text>color: brand.text (herdado)</Text>
        </Flex>
      </Flex>
    </Flex>
  ),
};

export const SemanticColor: Story = {
  name: 'Cor — passar token diretamente via `color`',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Quando o ícone carrega significado próprio (alerta, sucesso), passe `color` apontando
        diretamente para um token de feedback.
      </Text>
      <Flex flexDirection="column" gap="small">
        <Flex alignItems="center" gap="small">
          <Icon name="CircleCheck" color="feedback.success.solid" decorative />
          <Text>feedback.success.solid</Text>
        </Flex>
        <Flex alignItems="center" gap="small">
          <Icon name="TriangleAlert" color="feedback.warning.solid" decorative />
          <Text>feedback.warning.solid</Text>
        </Flex>
        <Flex alignItems="center" gap="small">
          <Icon name="CircleAlert" color="feedback.critical.solid" decorative />
          <Text>feedback.critical.solid</Text>
        </Flex>
        <Flex alignItems="center" gap="small">
          <Icon name="Info" color="feedback.info.solid" decorative />
          <Text>feedback.info.solid</Text>
        </Flex>
      </Flex>
    </Flex>
  ),
};

export const DecorativeVsSemantic: Story = {
  name: 'A11y — decorative vs semantic',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Default = decorativo (`aria-hidden`). Para ícone que carrega significado (sem texto
        adjacente), passe `decorative={false}` + `aria-label`.
      </Text>
      <Flex flexDirection="column" gap="small">
        <Box>
          <Text variant="label">Decorativo (default) — ícone ao lado de texto</Text>
          <Flex alignItems="center" gap="xsmall" paddingTop="xsmall">
            <Icon name="Download" decorative />
            <Text>Baixar relatório</Text>
          </Flex>
        </Box>
        <Box>
          <Text variant="label">Semântico — ícone sozinho com significado</Text>
          <Flex alignItems="center" gap="xsmall" paddingTop="xsmall">
            <Icon name="Download" decorative={false} aria-label="Baixar relatório" />
          </Flex>
        </Box>
      </Flex>
    </Flex>
  ),
};

export const FallbackBehavior: Story = {
  name: 'Estado extremo — nome inexistente',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Nome fora do catálogo retorna `null` silenciosamente — não quebra render.
      </Text>
      <Flex alignItems="center" gap="small" backgroundColor="background.subtle" padding="medium" borderRadius="medium">
        <Icon name="Check" decorative />
        <Text variant="caption" color="text.secondary">Antes do ícone fantasma</Text>
        <Icon name={'NaoExisteIcon' as never} decorative />
        <Text variant="caption" color="text.secondary">— depois (sem quebrar layout)</Text>
      </Flex>
    </Flex>
  ),
};
