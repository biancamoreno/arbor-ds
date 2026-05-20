import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './pagination';
import { Box, Flex, Text } from '../../core';
import { Button } from '../../button';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj;

// ─────────────────────────────────────────────────────────────────────────
// 1. Default — uso minimal idiomático (API plana)
// ─────────────────────────────────────────────────────────────────────────
function DefaultDemo() {
  const [page, setPage] = useState(3);
  return <Pagination page={page} count={10} onPageChange={setPage} />;
}

export const Default: Story = {
  render: () => <DefaultDemo />,
};

// ─────────────────────────────────────────────────────────────────────────
// 2. Anatomia — radiografia visual com todos os elementos
// ─────────────────────────────────────────────────────────────────────────
export const Anatomy: Story = {
  render: () => (
    <Flex direction="column" gap="medium">
      <Text as="p" variant="bodySmall" color="text.secondary">
        Modo plano renderiza: <Text as="code" variant="code">Previous</Text> +
        boundary + <Text as="code" variant="code">ellipsis-start</Text> +
        siblings ao redor da current + <Text as="code" variant="code">ellipsis-end</Text> +
        boundary + <Text as="code" variant="code">Next</Text>. Com <Text as="code" variant="code">showFirstLast</Text>{' '}
        adiciona <Text as="code" variant="code">First</Text>/<Text as="code" variant="code">Last</Text> nas pontas.
      </Text>
      <Pagination page={10} count={20} onPageChange={() => {}} showFirstLast />
    </Flex>
  ),
};

// ─────────────────────────────────────────────────────────────────────────
// 3. Variações por axis
// ─────────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Variations / Sizes',
  render: () => (
    <Flex direction="column" gap="medium">
      {(['xsmall', 'small', 'medium', 'large', 'xlarge'] as const).map((size) => (
        <Box key={size}>
          <Text as="p" variant="bodySmall" color="text.secondary" marginBottom="micro">
            size=<Text as="code" variant="code">{size}</Text>
          </Text>
          <Pagination page={3} count={7} onPageChange={() => {}} size={size} />
        </Box>
      ))}
    </Flex>
  ),
};

function WithFirstLastDemo() {
  const [page, setPage] = useState(10);
  return (
    <Flex direction="column" gap="medium">
      <Text as="p" variant="bodySmall" color="text.secondary">
        <Text as="code" variant="code">showFirstLast</Text> adiciona pulo para 1ª/última página — útil em datasets
        longos.
      </Text>
      <Pagination page={page} count={50} onPageChange={setPage} showFirstLast />
    </Flex>
  );
}

export const WithFirstLast: Story = {
  name: 'Variations / WithFirstLast',
  render: () => <WithFirstLastDemo />,
};

export const FewPages: Story = {
  name: 'Variations / FewPages',
  render: () => (
    <Flex direction="column" gap="medium">
      <Text as="p" variant="bodySmall" color="text.secondary">
        Quando todas as páginas cabem (<Text as="code" variant="code">count ≤ 2·boundaries + 2·siblings + 3</Text>),{' '}
        o algoritmo emite o range contínuo, sem ellipsis.
      </Text>
      <Pagination page={3} count={5} onPageChange={() => {}} />
    </Flex>
  ),
};

function ManyPagesDemo() {
  const [page, setPage] = useState(25);
  return <Pagination page={page} count={100} onPageChange={setPage} siblings={1} boundaries={1} />;
}

export const ManyPages: Story = {
  name: 'Variations / ManyPages',
  render: () => <ManyPagesDemo />,
};

// ─────────────────────────────────────────────────────────────────────────
// 4. Comportamento de borda — boundaries e siblings
// ─────────────────────────────────────────────────────────────────────────
export const BoundariesAndSiblings: Story = {
  render: () => (
    <Flex direction="column" gap="large">
      <Box>
        <Text as="p" variant="bodySmall" color="text.secondary" marginBottom="micro">
          <Text as="code" variant="code">siblings=0, boundaries=1</Text> (compacto)
        </Text>
        <Pagination page={10} count={20} onPageChange={() => {}} siblings={0} boundaries={1} />
      </Box>
      <Box>
        <Text as="p" variant="bodySmall" color="text.secondary" marginBottom="micro">
          <Text as="code" variant="code">siblings=2, boundaries=1</Text> (default visual ampliado)
        </Text>
        <Pagination page={10} count={20} onPageChange={() => {}} siblings={2} boundaries={1} />
      </Box>
      <Box>
        <Text as="p" variant="bodySmall" color="text.secondary" marginBottom="micro">
          <Text as="code" variant="code">siblings=1, boundaries=3</Text> (extremidades reforçadas)
        </Text>
        <Pagination page={10} count={20} onPageChange={() => {}} siblings={1} boundaries={3} />
      </Box>
      <Box>
        <Text as="p" variant="bodySmall" color="text.secondary" marginBottom="micro">
          current na borda — expansão à esquerda
        </Text>
        <Pagination page={2} count={20} onPageChange={() => {}} />
      </Box>
      <Box>
        <Text as="p" variant="bodySmall" color="text.secondary" marginBottom="micro">
          current na borda — expansão à direita
        </Text>
        <Pagination page={19} count={20} onPageChange={() => {}} />
      </Box>
    </Flex>
  ),
};

// ─────────────────────────────────────────────────────────────────────────
// 5. APIs — Controlled + AdvancedCompound + getItemLabel
// ─────────────────────────────────────────────────────────────────────────

function ControlledDemo() {
  const [page, setPage] = useState(1);
  return (
    <Flex direction="column" gap="medium">
      <Text as="p" variant="bodySmall" color="text.secondary">
        Página atual: <Text as="code" variant="code">{page}</Text>
      </Text>
      <Pagination page={page} count={10} onPageChange={setPage} />
      <Flex gap="small">
        <Button variant="ghost" size="small" onClick={() => setPage(1)}>Reset para 1</Button>
        <Button variant="ghost" size="small" onClick={() => setPage(10)}>Pular para 10</Button>
      </Flex>
    </Flex>
  );
}

export const Controlled: Story = {
  name: 'APIs / Controlled',
  render: () => <ControlledDemo />,
};

export const CustomItemLabels: Story = {
  name: 'APIs / CustomItemLabels',
  render: () => (
    <Flex direction="column" gap="medium">
      <Text as="p" variant="bodySmall" color="text.secondary">
        <Text as="code" variant="code">getItemLabel(page, isCurrent)</Text> personaliza o accessibilityLabel
        de cada botão numérico — útil para screen readers em inglês ou contextos específicos.
      </Text>
      <Pagination
        page={3}
        count={10}
        onPageChange={() => {}}
        previousLabel="Previous"
        nextLabel="Next"
        getItemLabel={(p, isCurrent) => (isCurrent ? `Page ${p}, current` : `Go to page ${p}`)}
      />
    </Flex>
  ),
};

export const AdvancedCompound: Story = {
  name: 'APIs / AdvancedCompound',
  render: () => (
    <Flex direction="column" gap="medium">
      <Text as="p" variant="bodySmall" color="text.secondary">
        Sob RFC-0043, sem <Text as="code" variant="code">count</Text> o componente recai no modo compound —
        para layouts não-triviais (controles extras intercalados, estados especiais).
      </Text>
      <Pagination accessibilityLabel="Paginação avançada">
        <Pagination.List>
          <Pagination.Item><Pagination.First /></Pagination.Item>
          <Pagination.Item><Pagination.Previous /></Pagination.Item>
          <Pagination.Item>
            <Pagination.Button accessibilityLabel="Ir para 1">1</Pagination.Button>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Button current accessibilityLabel="Página 2, atual">2</Pagination.Button>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Button accessibilityLabel="Ir para 3">3</Pagination.Button>
          </Pagination.Item>
          <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
          <Pagination.Item>
            <Pagination.Button accessibilityLabel="Ir para 99">99</Pagination.Button>
          </Pagination.Item>
          <Pagination.Item><Pagination.Next /></Pagination.Item>
          <Pagination.Item><Pagination.Last /></Pagination.Item>
        </Pagination.List>
      </Pagination>
    </Flex>
  ),
};

// ─────────────────────────────────────────────────────────────────────────
// 6. Patterns reais — paginar tabela
// ─────────────────────────────────────────────────────────────────────────
function TablePaginationDemo() {
  const pageSize = 5;
  const totalRows = 47;
  const totalPages = Math.ceil(totalRows / pageSize);
  const [page, setPage] = useState(1);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalRows);

  return (
    <Flex direction="column" gap="medium" padding="medium" borderWidth="hairline" borderStyle="solid" borderColor="border.subtle" borderRadius="medium">
      <Text as="p" variant="bodySmall" color="text.secondary">
        Mostrando <Text as="span" color="text.primary">{start}–{end}</Text> de{' '}
        <Text as="span" color="text.primary">{totalRows}</Text>
      </Text>
      <Box height="200px" backgroundColor="surface.subtle" borderRadius="small" display="flex" alignItems="center" justifyContent="center">
        <Text as="span" variant="bodySmall" color="text.tertiary">
          Tabela (página {page}/{totalPages})
        </Text>
      </Box>
      <Flex justifyContent="flex-end">
        <Pagination page={page} count={totalPages} onPageChange={setPage} />
      </Flex>
    </Flex>
  );
}

export const TablePagination: Story = {
  render: () => <TablePaginationDemo />,
};

// ─────────────────────────────────────────────────────────────────────────
// 7. Theming
// ─────────────────────────────────────────────────────────────────────────

function DensitySample({ label, theme }: { label: string; theme: typeof themeLight }) {
  return (
    <ArborProvider theme={theme}>
      <Flex direction="column" gap="micro">
        <Text as="p" variant="caption" color="text.secondary">{label}</Text>
        <Pagination page={3} count={10} onPageChange={() => {}} />
      </Flex>
    </ArborProvider>
  );
}

export const ThemingDensity: Story = {
  name: 'Theming / Density',
  render: () => {
    const compact = createTheme(themeLight, {
      components: {
        pagination: { gap: 'nano' },
      },
    });
    const spacious = createTheme(themeLight, {
      components: {
        pagination: { gap: 'small' },
      },
    });

    return (
      <Flex direction="column" gap="large">
        <DensitySample label="Compact (gap=nano)" theme={compact} />
        <DensitySample label="Default (gap=micro)" theme={themeLight} />
        <DensitySample label="Spacious (gap=small)" theme={spacious} />
      </Flex>
    );
  },
};

export const Theming: Story = {
  render: () => {
    const brandTheme = createTheme(themeLight, {
      components: {
        pagination: {
          gap: 'tiny',
          button: {
            borderRadius: 'medium',
            colors: {
              idle: {
                bg: 'transparent',
                bgHover: 'brand.bgSubtle',
                border: 'border.subtle',
                text: 'text.primary',
              },
              current: {
                bg: 'brand.bgElement',
                border: 'brand.solid',
                text: 'brand.text',
              },
              disabled: {
                bg: 'transparent',
                border: 'border.subtle',
                text: 'text.disabled',
              },
            },
          },
        },
      },
    });

    return (
      <Flex direction="column" gap="large">
        <Box>
          <Text as="p" variant="bodySmall" color="text.secondary" marginBottom="micro">
            Default — current preenchido com <Text as="code" variant="code">brand.solid</Text>.
          </Text>
          <Pagination page={3} count={10} onPageChange={() => {}} />
        </Box>
        <Box>
          <Text as="p" variant="bodySmall" color="text.secondary" marginBottom="micro">
            Override via <Text as="code" variant="code">createTheme</Text> — current "tonal" (bg subtle, border solid,
            text brand), borderRadius medium, hover cromático.
          </Text>
          <ArborProvider theme={brandTheme}>
            <Pagination page={3} count={10} onPageChange={() => {}} />
          </ArborProvider>
        </Box>
      </Flex>
    );
  },
};
