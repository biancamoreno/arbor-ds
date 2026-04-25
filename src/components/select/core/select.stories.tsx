import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from '../../core';
import { Select } from './select';

const meta = {
  title: 'Form/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Box width="280px">
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Selecione..." />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="react">React</Select.Item>
          <Select.Item value="vue">Vue</Select.Item>
          <Select.Item value="angular">Angular</Select.Item>
          <Select.Item value="svelte">Svelte</Select.Item>
        </Select.Content>
      </Select.Root>
    </Box>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <Box width="280px">
      <Select.Root defaultValue="react">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="react">React</Select.Item>
          <Select.Item value="vue">Vue</Select.Item>
          <Select.Item value="angular">Angular</Select.Item>
        </Select.Content>
      </Select.Root>
    </Box>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <Box width="280px">
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Plano..." />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="free">Gratuito</Select.Item>
          <Select.Item value="pro">Pro — R$ 49/mês</Select.Item>
          <Select.Item value="enterprise" disabled>Enterprise (em breve)</Select.Item>
        </Select.Content>
      </Select.Root>
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex flexDirection="column" gap="12px">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Box key={size} width="280px">
          <Select.Root size={size}>
            <Select.Trigger>
              <Select.Value placeholder={`Tamanho ${size}`} />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="opt1">Opção 1</Select.Item>
              <Select.Item value="opt2">Opção 2</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>
      ))}
    </Flex>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Box width="280px">
      <Select.Root disabled>
        <Select.Trigger>
          <Select.Value placeholder="Desabilitado" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="opt1">Opção 1</Select.Item>
        </Select.Content>
      </Select.Root>
    </Box>
  ),
};
