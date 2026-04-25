import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from '../../core';
import { RadioCard } from './radio-card';

const meta = {
  title: 'Form/RadioCard',
  component: RadioCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof RadioCard>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    value: 'opt1',
    label: 'Opção A',
    description: 'Descrição da opção A',
  },
};

export const Group: Story = {
  render: () => (
    <Box as="div" role="radiogroup" aria-label="Planos" width="320px">
      <Flex flexDirection="column" gap="12px">
        {[
          { value: 'free', label: 'Gratuito', description: 'Ideal para começar, até 3 projetos.' },
          { value: 'pro', label: 'Pro — R$ 49/mês', description: 'Projetos ilimitados e suporte prioritário.' },
          { value: 'enterprise', label: 'Enterprise', description: 'Solução customizada para grandes times.' },
        ].map((plan) => (
          <RadioCard
            key={plan.value}
            value={plan.value}
            label={plan.label}
            description={plan.description}
            name="plan"
          />
        ))}
      </Flex>
    </Box>
  ),
};

export const Disabled: Story = {
  args: {
    value: 'disabled',
    label: 'Opção indisponível',
    description: 'Esta opção não está disponível no momento.',
    disabled: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <Flex flexDirection="column" gap="12px" width="320px">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <RadioCard key={size} value={size} label={`Tamanho ${size}`} size={size} name="size" />
      ))}
    </Flex>
  ),
};
