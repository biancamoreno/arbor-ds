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
    padding: 'small',
    backgroundColor: 'semantic.surface.highlight',
    borderRadius: 'medium',
  },
};

export const AsSection: Story = {
  args: {
    as: 'section',
    children: 'Box renderizado como <section>',
    padding: 'small',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'semantic.border.default',
    borderRadius: 'medium',
  },
};

export const Nested: Story = {
  render: () => (
    <Box padding="large" backgroundColor="semantic.surface.highlight" borderRadius="large">
      <Box padding="small" backgroundColor="semantic.surface.default" borderRadius="medium" marginBottom="small">
        Item 1
      </Box>
      <Box padding="small" backgroundColor="semantic.surface.default" borderRadius="medium">
        Item 2
      </Box>
    </Box>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Box padding={{ base: 'tiny', md: 'medium' }} backgroundColor="semantic.brand.subtle" borderRadius="medium">
      Padding responsivo: tiny em mobile, medium em md+
    </Box>
  ),
};
