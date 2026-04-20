import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toaster, useToast } from '../index';

const meta = {
  title: 'Feedback/Toast',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function ToastDemo({ tone }: { tone?: 'neutral' | 'success' | 'warning' | 'critical' | 'info' }) {
  const { toast } = useToast();
  return (
    <>
      <Toaster />
      <button
        onClick={() => toast({ title: `Toast ${tone ?? 'neutral'}`, description: 'Mensagem de exemplo.', tone })}
        style={{ padding: '8px 16px', borderRadius: 4, cursor: 'pointer', border: '1px solid #ccc' }}
      >
        Exibir toast {tone ?? 'neutral'}
      </button>
    </>
  );
}

export const Default: Story = {
  render: () => <ToastDemo />,
};

export const Success: Story = {
  render: () => <ToastDemo tone="success" />,
};

export const Warning: Story = {
  render: () => <ToastDemo tone="warning" />,
};

export const Critical: Story = {
  render: () => <ToastDemo tone="critical" />,
};

export const Info: Story = {
  render: () => <ToastDemo tone="info" />,
};

function AllTonesDemo() {
  const { toast } = useToast();
  return (
    <>
      <Toaster />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(['neutral', 'success', 'warning', 'critical', 'info'] as const).map((tone) => (
          <button
            key={tone}
            onClick={() => toast({ title: tone, description: `Toast do tipo ${tone}`, tone })}
            style={{ padding: '8px 12px', borderRadius: 4, cursor: 'pointer', border: '1px solid #ccc' }}
          >
            {tone}
          </button>
        ))}
      </div>
    </>
  );
}

export const AllTones: Story = {
  render: () => <AllTonesDemo />,
};


