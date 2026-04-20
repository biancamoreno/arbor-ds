import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './text';

const meta = {
  title: 'Core/Layout/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { children: 'Texto padrão do Arbor DS' },
};

export const AsHeading: Story = {
  args: {
    as: 'h1',
    children: 'Título H1',
    style: { fontSize: 32, fontWeight: 700 },
  },
};

export const AsLabel: Story = {
  args: {
    as: 'label',
    children: 'Rótulo de formulário',
    style: { fontSize: 14, fontWeight: 500 },
  },
};

export const Scale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'] as const).map((tag) => (
        <Text key={tag} as={tag}>
          {tag} — Arbor DS Typography
        </Text>
      ))}
    </div>
  ),
};
