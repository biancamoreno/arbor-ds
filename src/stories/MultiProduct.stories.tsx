import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArborProvider } from '../ecosystem';
import { themeLight, themeDark } from '../foundations';
import type { ArborTheme } from '../foundations/theme/Theme';
import { themeProductB } from '../../.storybook/themes';
import { Box } from '../components/core/box';
import { Flex } from '../components/core/flex';
import { Text } from '../components/core/text';
import { Button } from '../components/button';
import { Switch } from '../components/switch';
import { Card } from '../components/card';
import { Badge } from '../components/badge';
import { Chip } from '../components/chip';
import { Avatar } from '../components/avatar';
import { Spinner } from '../components/spinner';
import { ProgressBar } from '../components/progress-bar';
import { Field } from '../components/field';
import { TextInput } from '../components/input';

const meta = {
  title: 'Foundations/Tematização Multi-Produto',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type ProductPanel = {
  label: string;
  description: string;
  theme: ArborTheme;
};

const panels: ProductPanel[] = [
  {
    label: 'themeLight (DS default)',
    description: 'Brand aqua · raios padrão · motion padrão',
    theme: themeLight,
  },
  {
    label: 'themeDark (DS default)',
    description: 'Mesmo contrato; tokens em modo escuro',
    theme: themeDark,
  },
  {
    label: 'Product B (violet)',
    description: 'createBrandPalette + override de motion (mais rápido) e radii (mais arredondado)',
    theme: themeProductB,
  },
];

function ProductColumn({ panel }: { panel: ProductPanel }) {
  return (
    <ArborProvider theme={panel.theme}>
      <Box
        backgroundColor="surface.default"
        borderRadius="medium"
        padding="large"
        width="100%"
      >
        <Flex flexDirection="column" gap="medium">
          <Flex alignItems="center" gap="small">
            <Box
              width="20px"
              height="20px"
              borderRadius="full"
              borderWidth="hairline"
              borderStyle="solid"
              borderColor="border.subtle"
              backgroundColor="brand.solid"
            />
            <Flex flexDirection="column" gap="nano">
              <Text fontSize="medium" fontWeight="bold" color="text.primary">
                {panel.label}
              </Text>
              <Text fontSize="xsmall" color="text.secondary">
                {panel.description}
              </Text>
            </Flex>
          </Flex>

          <Box height="1px" backgroundColor="border.subtle" />

          <Card variant="outlined" padding="medium">
            <Flex flexDirection="column" gap="medium">
              <Text fontSize="small" fontWeight="bold" color="text.primary">
                Buttons
              </Text>
              <Flex gap="small" flexWrap="wrap">
                <Button variant="primary" size="medium">Primary</Button>
                <Button variant="secondary" size="medium">Secondary</Button>
                <Button variant="ghost" size="medium">Ghost</Button>
              </Flex>
            </Flex>
          </Card>

          <Card variant="outlined" padding="medium">
            <Flex flexDirection="column" gap="medium">
              <Text fontSize="small" fontWeight="bold" color="text.primary">
                Selection
              </Text>
              <Flex alignItems="center" gap="medium">
                <Switch checked onCheckedChange={() => {}} aria-label="ativo" />
                <Switch checked={false} onCheckedChange={() => {}} aria-label="inativo" />
                <Spinner size="medium" label="loading" />
              </Flex>
            </Flex>
          </Card>

          <Card variant="outlined" padding="medium">
            <Flex flexDirection="column" gap="medium">
              <Text fontSize="small" fontWeight="bold" color="text.primary">
                Status & Tags
              </Text>
              <Flex gap="small" flexWrap="wrap" alignItems="center">
                <Badge tone="brand">Brand</Badge>
                <Badge tone="success">Success</Badge>
                <Badge tone="warning">Warning</Badge>
                <Badge tone="critical">Critical</Badge>
              </Flex>
              <Flex gap="small" flexWrap="wrap" alignItems="center">
                <Chip tone="brand" variant="filled">Filled</Chip>
                <Chip tone="brand" variant="outlined">Outlined</Chip>
                <Chip tone="neutral" variant="subtle">Subtle</Chip>
              </Flex>
            </Flex>
          </Card>

          <Card variant="outlined" padding="medium">
            <Flex flexDirection="column" gap="medium">
              <Text fontSize="small" fontWeight="bold" color="text.primary">
                Identity & Form
              </Text>
              <Flex alignItems="center" gap="medium">
                <Avatar size="medium">AB</Avatar>
                <Avatar size="medium">CD</Avatar>
                <Avatar size="medium">EF</Avatar>
              </Flex>
              <Field>
                <Field.Label>Email</Field.Label>
                <TextInput placeholder="voce@exemplo.com" />
              </Field>
              <ProgressBar progress={62} label="Progresso" />
            </Flex>
          </Card>
        </Flex>
      </Box>
    </ArborProvider>
  );
}

export const Showcase: Story = {
  name: 'Side-by-side',
  parameters: {
    docs: {
      description: {
        story:
          'Os 3 painéis renderizam o mesmo conjunto de componentes sob 3 temas diferentes. ' +
          'Cada coluna tem seu próprio ArborProvider — mudar de tema no toolbar afeta o decorator global, ' +
          'mas as colunas mantêm sua identidade independente. ' +
          'Prova visual de que o contrato themable cobre cor (brand/interactive/border/icon/focus), ' +
          'motion (durations) e radii — todos consumidos por alias string em runtime.',
      },
    },
  },
  render: () => (
    <Box padding="large" backgroundColor="background.subtle" minHeight="100vh">
      <Flex flexDirection="column" gap="large">
        <Flex flexDirection="column" gap="nano">
          <Text fontSize="xlarge" fontWeight="bold" color="text.primary">
            Tematização multi-produto
          </Text>
          <Text fontSize="small" color="text.secondary">
            Mesmo código de componentes; identidade trocada inteiramente pelo tema (createTheme + createBrandPalette).
          </Text>
        </Flex>
        <Flex gap="large" alignItems="stretch" flexWrap="wrap">
          {panels.map((panel) => (
            <Box key={panel.theme.mode} flex="1 1 320px" minWidth="300px">
              <ProductColumn panel={panel} />
            </Box>
          ))}
        </Flex>
      </Flex>
    </Box>
  ),
};

export const ProductBOnly: Story = {
  name: 'Product B isolado',
  parameters: {
    docs: {
      description: {
        story:
          'Apenas o produto B em destaque. Usado para inspeção fina do override violet ' +
          '(brand.solid + interactive + border.interactive + icon.interactive + focus.ring + motion + radii).',
      },
    },
  },
  render: () => (
    <Box padding="large" backgroundColor="background.subtle" minHeight="100vh">
      <ProductColumn panel={panels[2]} />
    </Box>
  ),
};
