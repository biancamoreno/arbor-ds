import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '../../box';
import { Grid } from './grid';

const meta = {
  title: 'Core/Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj;

const Cell = ({ children, variant = 'brand' }: { children: React.ReactNode; variant?: 'brand' | 'success' }) => (
  <Box
    padding="medium"
    backgroundColor={variant === 'brand' ? 'semantic.brand.base' : 'semantic.feedback.success.base'}
    borderRadius="small"
    color="semantic.text.inverse"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    {children}
  </Box>
);

export const ThreeColumns: Story = {
  render: () => (
    <Grid templateColumns="repeat(3, 1fr)" columnGap={16} rowGap={16} width="100%">
      <Cell>1</Cell>
      <Cell>2</Cell>
      <Cell>3</Cell>
      <Cell variant="success">4</Cell>
      <Cell variant="success">5</Cell>
      <Cell variant="success">6</Cell>
    </Grid>
  ),
};

export const TwoColumns: Story = {
  render: () => (
    <Grid templateColumns="1fr 2fr" columnGap={16} rowGap={16} width="100%">
      <Cell>Sidebar</Cell>
      <Cell variant="success">Conteúdo Principal</Cell>
      <Cell>Sidebar 2</Cell>
      <Cell variant="success">Conteúdo 2</Cell>
    </Grid>
  ),
};
