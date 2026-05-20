import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './breadcrumb';
import { Box, Flex, Icon, Text } from '../../core';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj;

// ─────────────────────────────────────────────────────────────────────────
// 1. Default — uso minimal idiomático
// ─────────────────────────────────────────────────────────────────────────
export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Início</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Produtos</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Current>Camiseta Azul</Breadcrumb.Current>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb>
  ),
};

// ─────────────────────────────────────────────────────────────────────────
// 2. Anatomia — radiografia visual com todos os slots
// ─────────────────────────────────────────────────────────────────────────
export const Anatomy: Story = {
  render: () => (
    <Flex direction="column" gap="medium">
      <Text as="p" variant="bodySmall" color="text.secondary">
        Estrutura: <Text as="code" variant="code">Root &gt; List &gt; Item* &gt; Link|Current + Separator</Text>
      </Text>
      <Breadcrumb>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Início</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Categoria</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Subcategoria</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Current>Página atual</Breadcrumb.Current>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>
    </Flex>
  ),
};

// ─────────────────────────────────────────────────────────────────────────
// 3. Variações por axis
// ─────────────────────────────────────────────────────────────────────────

export const CustomSeparator: Story = {
  name: 'Variations / CustomSeparator',
  render: () => (
    <Flex direction="column" gap="medium">
      <Box>
        <Text as="p" variant="bodySmall" color="text.secondary" marginBottom="micro">
          Default — Icon ChevronRight
        </Text>
        <Breadcrumb>
          <Breadcrumb.List>
            <Breadcrumb.Item><Breadcrumb.Link href="#">Home</Breadcrumb.Link></Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item><Breadcrumb.Current>Documentos</Breadcrumb.Current></Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
      </Box>
      <Box>
        <Text as="p" variant="bodySmall" color="text.secondary" marginBottom="micro">
          Custom — string &quot;/&quot;
        </Text>
        <Breadcrumb>
          <Breadcrumb.List>
            <Breadcrumb.Item><Breadcrumb.Link href="#">Home</Breadcrumb.Link></Breadcrumb.Item>
            <Breadcrumb.Separator>/</Breadcrumb.Separator>
            <Breadcrumb.Item><Breadcrumb.Current>Documentos</Breadcrumb.Current></Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
      </Box>
      <Box>
        <Text as="p" variant="bodySmall" color="text.secondary" marginBottom="micro">
          Custom — Icon ChevronsRight
        </Text>
        <Breadcrumb>
          <Breadcrumb.List>
            <Breadcrumb.Item><Breadcrumb.Link href="#">Home</Breadcrumb.Link></Breadcrumb.Item>
            <Breadcrumb.Separator>
              <Icon name="ChevronsRight" size="small" decorative />
            </Breadcrumb.Separator>
            <Breadcrumb.Item><Breadcrumb.Current>Documentos</Breadcrumb.Current></Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
      </Box>
    </Flex>
  ),
};

export const Long: Story = {
  name: 'Variations / Long',
  render: () => (
    <Breadcrumb>
      <Breadcrumb.List>
        <Breadcrumb.Item><Breadcrumb.Link href="#">Início</Breadcrumb.Link></Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item><Breadcrumb.Link href="#">Minha Conta</Breadcrumb.Link></Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item><Breadcrumb.Link href="#">Pedidos</Breadcrumb.Link></Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item><Breadcrumb.Link href="#">2026</Breadcrumb.Link></Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item><Breadcrumb.Current>Pedido #12345</Breadcrumb.Current></Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb>
  ),
};

// ─────────────────────────────────────────────────────────────────────────
// 4. Comportamento de borda — wrap em container estreito
// ─────────────────────────────────────────────────────────────────────────
export const WrapsInNarrowContainer: Story = {
  render: () => (
    <Flex direction="column" gap="medium">
      <Text as="p" variant="bodySmall" color="text.secondary">
        Em container estreito, a List quebra para a próxima linha (<Text as="code" variant="code">flexWrap: wrap</Text>).
      </Text>
      <Box maxWidth="280px" padding="small" borderWidth="hairline" borderStyle="solid" borderColor="border.subtle">
        <Breadcrumb>
          <Breadcrumb.List>
            <Breadcrumb.Item><Breadcrumb.Link href="#">Início</Breadcrumb.Link></Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item><Breadcrumb.Link href="#">Minha Conta</Breadcrumb.Link></Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item><Breadcrumb.Link href="#">Histórico</Breadcrumb.Link></Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item><Breadcrumb.Current>Pedido #2026-04-30</Breadcrumb.Current></Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
      </Box>
    </Flex>
  ),
};

// ─────────────────────────────────────────────────────────────────────────
// 5. APIs — customLabel (label do nav)
// ─────────────────────────────────────────────────────────────────────────
export const CustomLabel: Story = {
  name: 'APIs / CustomLabel',
  render: () => (
    <Flex direction="column" gap="medium">
      <Text as="p" variant="bodySmall" color="text.secondary">
        <Text as="code" variant="code">label</Text> override define o <Text as="code" variant="code">aria-label</Text> do <Text as="code" variant="code">&lt;nav&gt;</Text>. Útil quando há múltiplos
        breadcrumbs na mesma página (screen reader precisa distinguir).
      </Text>
      <Breadcrumb label="Trilha do produto">
        <Breadcrumb.List>
          <Breadcrumb.Item><Breadcrumb.Link href="#">Catálogo</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item><Breadcrumb.Current>Tênis</Breadcrumb.Current></Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>
    </Flex>
  ),
};

// ─────────────────────────────────────────────────────────────────────────
// 6. Patterns reais — Breadcrumb dentro de header de página
// ─────────────────────────────────────────────────────────────────────────
export const InsidePageHeader: Story = {
  render: () => (
    <Flex direction="column" gap="medium" padding="medium" backgroundColor="surface.subtle">
      <Breadcrumb>
        <Breadcrumb.List>
          <Breadcrumb.Item><Breadcrumb.Link href="#">Dashboard</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item><Breadcrumb.Link href="#">Vendas</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item><Breadcrumb.Current>Relatório Q1</Breadcrumb.Current></Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>
      <Text as="h1" variant="headingLarge">Relatório Q1</Text>
      <Text as="p" variant="bodyMedium" color="text.secondary">
        Vendas consolidadas no primeiro trimestre de 2026.
      </Text>
    </Flex>
  ),
};

// ─────────────────────────────────────────────────────────────────────────
// 7. Theming
// ─────────────────────────────────────────────────────────────────────────

export const Theming: Story = {
  render: () => {
    const brandTheme = createTheme(themeLight, {
      components: {
        breadcrumb: {
          gap: 'micro',
          itemGap: 'micro',
          separator: {
            iconSize: 'small',
            color: 'brand.bgSolid',
          },
          link: {
            colors: {
              default: 'brand.solid',
              hover: 'brand.solidHover',
            },
          },
          current: {
            color: 'brand.text',
          },
        },
      },
    });

    return (
      <Flex direction="column" gap="medium">
        <Box>
          <Text as="p" variant="bodySmall" color="text.secondary" marginBottom="micro">
            Default — cor do link via <Text as="code" variant="code">interactive.default</Text>, separator <Text as="code" variant="code">text.tertiary</Text>.
          </Text>
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item><Breadcrumb.Link href="#">Início</Breadcrumb.Link></Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item><Breadcrumb.Link href="#">Loja</Breadcrumb.Link></Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item><Breadcrumb.Current>Produto</Breadcrumb.Current></Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </Box>
        <Box>
          <Text as="p" variant="bodySmall" color="text.secondary" marginBottom="micro">
            Override via <Text as="code" variant="code">createTheme</Text> — gap reduzido, cores brand-driven.
          </Text>
          <ArborProvider theme={brandTheme}>
            <Breadcrumb>
              <Breadcrumb.List>
                <Breadcrumb.Item><Breadcrumb.Link href="#">Início</Breadcrumb.Link></Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item><Breadcrumb.Link href="#">Loja</Breadcrumb.Link></Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item><Breadcrumb.Current>Produto</Breadcrumb.Current></Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb>
          </ArborProvider>
        </Box>
      </Flex>
    );
  },
};
