import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';
import { Flex, Text } from '../../core';
import { Field } from '../../field';
import { Counter } from './counter';

const meta = {
  title: 'Form/Counter',
  component: Counter,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['small', 'medium', 'large'] },
    showInput: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj;

function ControlledExample(props: Partial<React.ComponentProps<typeof Counter>>) {
  const [value, setValue] = useState(props.value ?? 1);
  return <Counter {...props} value={value} onValueChange={setValue} />;
}

export const Default: Story = {
  render: () => <ControlledExample />,
};

export const Controlled: Story = {
  render: () => <ControlledExample value={5} min={0} max={10} />,
};

export const Sizes: Story = {
  render: () => (
    <Flex flexDirection="column" gap="medium" alignItems="flex-start">
      <ControlledExample value={1} size="small" label="Small" />
      <ControlledExample value={1} size="medium" label="Medium (default)" />
      <ControlledExample value={1} size="large" label="Large" />
    </Flex>
  ),
};

export const WithLabel: Story = {
  render: () => <ControlledExample value={2} label="Quantidade" />,
};

export const InsideField: Story = {
  render: () => (
    <Field id="qty">
      <Field.Label>Quantidade no carrinho</Field.Label>
      <Field.Control>
        <ControlledExample value={1} min={1} max={20} />
      </Field.Control>
      <Field.Description>Mínimo 1, máximo 20 por pedido.</Field.Description>
    </Field>
  ),
};

export const MinMaxStep: Story = {
  render: () => (
    <Flex flexDirection="column" gap="medium" alignItems="flex-start">
      <Flex flexDirection="column" gap="micro" alignItems="flex-start">
        <Text variant="caption" color="text.secondary">min=0, max=5 (boundaries visualmente sinalizados)</Text>
        <ControlledExample value={0} min={0} max={5} />
      </Flex>
      <Flex flexDirection="column" gap="micro" alignItems="flex-start">
        <Text variant="caption" color="text.secondary">step=5</Text>
        <ControlledExample value={10} min={0} max={100} step={5} />
      </Flex>
    </Flex>
  ),
};

export const ShowInputFalse: Story = {
  render: () => (
    <Flex flexDirection="column" gap="medium" alignItems="flex-start">
      <Text variant="caption" color="text.secondary">Display somente leitura — uso típico em carrinho.</Text>
      <ControlledExample value={3} showInput={false} />
    </Flex>
  ),
};

export const DisabledStates: Story = {
  render: () => (
    <Flex flexDirection="column" gap="medium" alignItems="flex-start">
      <ControlledExample value={3} disabled label="Disabled inteiro" />
      <ControlledExample value={0} min={0} max={10} label="Decrement no boundary (value=min)" />
      <ControlledExample value={10} min={0} max={10} label="Increment no boundary (value=max)" />
    </Flex>
  ),
};

export const Theming: Story = {
  render: () => {
    const customTheme = createTheme(themeLight, {
      components: {
        counter: {
          borderRadius: 'full',
          colors: {
            button: {
              background: {
                default: 'brand.bgSubtle',
              },
              text: {
                default: 'brand.text',
              },
            },
          },
        },
      },
    });
    return (
      <Flex flexDirection="column" gap="medium" alignItems="flex-start">
        <ControlledExample value={2} label="Default" />
        <ArborProvider theme={customTheme}>
          <ControlledExample value={2} label="Override (brand subtle + full radius)" />
        </ArborProvider>
      </Flex>
    );
  },
};
