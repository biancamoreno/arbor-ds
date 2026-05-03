import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../core';
import { Button } from '../../button';
import { Toaster, useToast, type ToastTone } from '../index';

const meta = {
  title: 'Feedback/Toast',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function ToastDemo({ tone }: { tone?: ToastTone }) {
  const { toast } = useToast();
  return (
    <>
      <Toaster />
      <Button
        variant="secondary"
        onClick={() => toast({ title: `Toast ${tone ?? 'neutral'}`, description: 'Mensagem de exemplo.', tone })}
      >
        Exibir toast {tone ?? 'neutral'}
      </Button>
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
      <Flex gap="small" flexWrap="wrap">
        {(['neutral', 'success', 'warning', 'critical', 'info'] as const).map((tone) => (
          <Button
            key={tone}
            variant="secondary"
            size="sm"
            onClick={() => toast({ title: tone, description: `Toast do tipo ${tone}`, tone })}
          >
            {tone}
          </Button>
        ))}
      </Flex>
    </>
  );
}

export const AllTones: Story = {
  render: () => <AllTonesDemo />,
};
