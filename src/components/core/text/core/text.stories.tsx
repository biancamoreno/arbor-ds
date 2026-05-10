import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../flex';
import { Box } from '../../box';
import { Text } from './text';
import { type TextVariant } from '../interfaces/TextVariant';

const meta = {
  title: 'Core/Layout/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj;

const ALL_VARIANTS: TextVariant[] = [
  'displayHero',
  'displayLarge',
  'displayMedium',
  'displaySmall',
  'headingLarge',
  'headingMedium',
  'headingSmall',
  'subheading',
  'bodyLarge',
  'bodyMedium',
  'bodySmall',
  'label',
  'caption',
  'overline',
  'code',
];

const SAMPLE = 'The quick brown fox jumps over the lazy dog';

export const Default: Story = {
  args: { children: 'Texto padrão do Arbor DS' },
};

export const VariantScale: Story = {
  name: 'Anatomia — escala completa',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="900px">
      {ALL_VARIANTS.map((v) => (
        <Flex key={v} flexDirection="column" gap="xsmall">
          <Text variant="overline" color="text.tertiary">{v}</Text>
          <Text variant={v}>{SAMPLE}</Text>
        </Flex>
      ))}
    </Flex>
  ),
};

export const SemanticDefaults: Story = {
  name: 'Default por `as` (sem `variant`)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="800px">
      <Text variant="overline" color="text.tertiary">
        Cada `as` mapeia para uma variant default — h1→headingLarge, p→bodyMedium, label→label, etc.
      </Text>
      <Text as="h1">h1 — Heading Large</Text>
      <Text as="h2">h2 — Heading Medium</Text>
      <Text as="h3">h3 — Heading Small</Text>
      <Text as="h4">h4 — Subheading</Text>
      <Text as="h5">h5 — Subheading</Text>
      <Text as="h6">h6 — Overline</Text>
      <Text as="p">p — Body Medium (default geral)</Text>
      <Text as="label">label — Label</Text>
    </Flex>
  ),
};

export const HierarchyShowcase: Story = {
  name: 'Hierarquia — landing hero realista',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="800px">
      <Text variant="overline" color="brand.text">Plataforma multi-produto</Text>
      <Text variant="displayLarge">Construa interfaces que respiram identidade.</Text>
      <Text variant="bodyLarge" color="text.secondary">
        Arbor-DS dá o motor; seu produto traz a marca. Tema único, comportamento consistente,
        sem fork.
      </Text>
      <Box paddingTop="medium">
        <Text variant="caption" color="text.tertiary">
          Disponível para web, iOS e Android.
        </Text>
      </Box>
    </Flex>
  ),
};

export const HierarchyCard: Story = {
  name: 'Hierarquia — Card típico',
  render: () => (
    <Flex flexDirection="column" gap="xsmall" maxWidth="400px">
      <Text variant="overline" color="text.tertiary">categoria</Text>
      <Text variant="headingMedium">Título do card</Text>
      <Text variant="subheading" color="text.secondary">Subtítulo opcional</Text>
      <Text variant="bodyMedium">
        Corpo descritivo do card. Aqui mora a explicação principal do que está sendo apresentado,
        com hierarquia tipográfica que conduz a leitura.
      </Text>
      <Text variant="caption" color="text.tertiary">Atualizado há 2 dias</Text>
    </Flex>
  ),
};

export const Truncation: Story = {
  name: 'Estado extremo — truncamento (numberOfLines)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="320px">
      <Box>
        <Text variant="overline" color="text.tertiary">numberOfLines=1</Text>
        <Text numberOfLines={1}>
          Texto longo que precisa ser truncado em uma única linha porque o container é estreito.
        </Text>
      </Box>
      <Box>
        <Text variant="overline" color="text.tertiary">numberOfLines=2</Text>
        <Text numberOfLines={2}>
          Texto longo que precisa ser truncado depois de duas linhas porque a área disponível é
          limitada e queremos garantir um layout previsível.
        </Text>
      </Box>
      <Box>
        <Text variant="overline" color="text.tertiary">sem truncamento</Text>
        <Text>
          Texto longo sem truncamento se estende livremente — wrap natural conforme largura
          disponível, ocupando quantas linhas forem necessárias.
        </Text>
      </Box>
    </Flex>
  ),
};

export const HtmlInline: Story = {
  name: 'HTML inline — parser embutido (web)',
  render: () => (
    <Flex flexDirection="column" gap="small" maxWidth="600px">
      <Text>{'Texto com <b>negrito</b>, <i>itálico</i> e <u>sublinhado</u> inline.'}</Text>
      <Text>{'Link: <a href="https://arbor.dev">arbor.dev</a> abre a página da lib.'}</Text>
      <Text>{'Combinação: <b>negrito com <i>itálico aninhado</i></b> funciona.'}</Text>
    </Flex>
  ),
};

export const CodeAndMono: Story = {
  name: 'Variant `code` (mono)',
  render: () => (
    <Flex flexDirection="column" gap="small" maxWidth="600px">
      <Text>
        Para destacar código inline, use <Text as="span" variant="code">npm install</Text> dentro
        do parágrafo.
      </Text>
      <Text variant="code">const arbor = createTheme(themeLight, { /* override */ });</Text>
    </Flex>
  ),
};

export const ColorContext: Story = {
  name: 'Cor — herda do contexto (sem prop `color`)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="600px">
      <Box backgroundColor="background.subtle" padding="medium" borderRadius="medium">
        <Text variant="bodyMedium">Texto sobre `background.subtle` (herda `text.primary`).</Text>
      </Box>
      <Box backgroundColor="brand.solid" padding="medium" borderRadius="medium">
        <Text variant="bodyMedium" color="text.inverse">Texto sobre `brand.solid` com `color="text.inverse"`.</Text>
      </Box>
      <Flex flexDirection="column" gap="xsmall">
        <Text color="text.primary">color=text.primary</Text>
        <Text color="text.secondary">color=text.secondary</Text>
        <Text color="text.tertiary">color=text.tertiary</Text>
        <Text color="brand.text">color=brand.text</Text>
      </Flex>
    </Flex>
  ),
};
