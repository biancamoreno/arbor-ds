import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from './box';

const meta = {
  title: 'Core/Layout/Box',
  component: Box,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    as: { control: 'text', description: 'Elemento HTML ou componente React' },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    children: 'Box básico',
    style: { padding: 16, background: '#f0f0f0', borderRadius: 4 },
  },
};

export const AsSection: Story = {
  args: {
    as: 'section',
    children: 'Box renderizado como <section>',
    style: { padding: 16, border: '2px dashed #aaa', borderRadius: 4 },
  },
};

export const Nested: Story = {
  render: () => (
    <Box style={{ padding: 24, background: '#e8f4fd', borderRadius: 8 }}>
      <Box style={{ padding: 16, background: '#ffffff', borderRadius: 4, marginBottom: 8 }}>
        Item 1
      </Box>
      <Box style={{ padding: 16, background: '#ffffff', borderRadius: 4 }}>
        Item 2
      </Box>
    </Box>
  ),
};
