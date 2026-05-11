import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '../../box';
import { Grid } from './grid';
import { Text } from '../../text';
import { Flex } from '../../flex';

const meta = {
  title: 'Core/Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj;

const Cell = ({ children, tone = 'brand' }: { children: React.ReactNode; tone?: 'brand' | 'success' }) => (
  <Box
    padding="medium"
    backgroundColor={tone === 'brand' ? 'brand.solid' : 'feedback.success.solid'}
    borderRadius="small"
    color="text.inverse"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    {children}
  </Box>
);

export const ThreeColumns: Story = {
  name: 'Anatomia — 3 colunas iguais',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        `templateColumns="repeat(3, 1fr)"` cria 3 colunas com larguras iguais.
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" columnGap={16} rowGap={16} width="100%">
        <Cell>1</Cell>
        <Cell>2</Cell>
        <Cell>3</Cell>
        <Cell tone="success">4</Cell>
        <Cell tone="success">5</Cell>
        <Cell tone="success">6</Cell>
      </Grid>
    </Flex>
  ),
};

export const SidebarLayout: Story = {
  name: 'Composição — sidebar + conteúdo principal (1fr 2fr)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Proporção `1fr 2fr` aloca 1/3 para sidebar, 2/3 para conteúdo.
      </Text>
      <Grid templateColumns="1fr 2fr" columnGap={16} rowGap={16} width="100%">
        <Cell>Sidebar</Cell>
        <Cell tone="success">Conteúdo Principal</Cell>
        <Cell>Sidebar 2</Cell>
        <Cell tone="success">Conteúdo 2</Cell>
      </Grid>
    </Flex>
  ),
};

export const AutoFill: Story = {
  name: 'Anatomia — auto-fill (grid responsivo)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        `auto-fill` + `minmax(120px, 1fr)` cria quantas colunas couberem com largura mínima 120px.
      </Text>
      <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" columnGap={12} rowGap={12} width="100%">
        {Array.from({ length: 8 }).map((_, i) => (
          <Cell key={i} tone={i % 2 === 0 ? 'brand' : 'success'}>
            {i + 1}
          </Cell>
        ))}
      </Grid>
    </Flex>
  ),
};
