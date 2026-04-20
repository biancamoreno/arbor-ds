import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup } from './avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: { type: 'select' }, options: ['circle', 'square'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj;

export const WithImage: Story = {
  render: () => (
    <Avatar size="md">
      <Avatar.Image src="https://i.pravatar.cc/80?img=1" alt="Ana Silva" />
      <Avatar.Fallback>AS</Avatar.Fallback>
    </Avatar>
  ),
};

export const WithFallback: Story = {
  render: () => (
    <Avatar size="md">
      <Avatar.Image src="invalid-url" alt="Usuário" />
      <Avatar.Fallback>JD</Avatar.Fallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar key={size} size={size}>
          <Avatar.Image src={`https://i.pravatar.cc/80?img=${size.length}`} alt="Usuário" />
          <Avatar.Fallback>{size.toUpperCase()}</Avatar.Fallback>
        </Avatar>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Avatar size="lg" shape="circle">
        <Avatar.Fallback>CI</Avatar.Fallback>
      </Avatar>
      <Avatar size="lg" shape="square">
        <Avatar.Fallback>SQ</Avatar.Fallback>
      </Avatar>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={4}>
      {Array.from({ length: 6 }, (_, i) => (
        <Avatar key={i} size="md">
          <Avatar.Image src={`https://i.pravatar.cc/80?img=${i + 1}`} alt={`Usuário ${i + 1}`} />
          <Avatar.Fallback>U{i + 1}</Avatar.Fallback>
        </Avatar>
      ))}
    </AvatarGroup>
  ),
};
