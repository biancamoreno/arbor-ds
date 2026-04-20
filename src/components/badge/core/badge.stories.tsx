import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    tone: {
      control: { type: 'select' },
      options: ['neutral', 'brand', 'success', 'warning', 'critical', 'info'],
    },
    variant: { control: { type: 'select' }, options: ['solid', 'subtle'] },
    size: { control: { type: 'select' }, options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { children: 'Novo', tone: 'brand', variant: 'solid' },
};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(['neutral', 'brand', 'success', 'warning', 'critical', 'info'] as const).map((tone) => (
        <Badge key={tone} tone={tone}>{tone}</Badge>
      ))}
    </div>
  ),
};

export const Subtle: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(['neutral', 'brand', 'success', 'warning', 'critical', 'info'] as const).map((tone) => (
        <Badge key={tone} tone={tone} variant="subtle">{tone}</Badge>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge size="sm" tone="brand">SM</Badge>
      <Badge size="md" tone="brand">MD</Badge>
    </div>
  ),
};

export const WithAnchor: Story = {
  render: () => (
    <Badge.Anchor badge={<Badge tone="critical" size="sm">3</Badge>}>
      <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        🔔
      </div>
    </Badge.Anchor>
  ),
};
