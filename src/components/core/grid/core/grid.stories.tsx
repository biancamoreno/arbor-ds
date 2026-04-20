import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from './grid';

const meta = {
  title: 'Core/Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj;

const Cell = ({ children, color = '#4a90e2' }: { children: React.ReactNode; color?: string }) => (
  <div style={{ padding: 16, background: color, color: '#fff', borderRadius: 4, textAlign: 'center' }}>
    {children}
  </div>
);

export const ThreeColumns: Story = {
  render: () => (
    <Grid templateColumns="repeat(3, 1fr)" columnGap={16} rowGap={16} style={{ width: '100%' }}>
      <Cell>1</Cell>
      <Cell>2</Cell>
      <Cell>3</Cell>
      <Cell color="#2ecc71">4</Cell>
      <Cell color="#2ecc71">5</Cell>
      <Cell color="#2ecc71">6</Cell>
    </Grid>
  ),
};

export const TwoColumns: Story = {
  render: () => (
    <Grid templateColumns="1fr 2fr" columnGap={16} rowGap={16} style={{ width: '100%' }}>
      <Cell>Sidebar</Cell>
      <Cell color="#e74c3c">Conteúdo Principal</Cell>
      <Cell>Sidebar 2</Cell>
      <Cell color="#e74c3c">Conteúdo 2</Cell>
    </Grid>
  ),
};
