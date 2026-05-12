import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';
import { Box, Flex } from '../../core';
import { Field } from '../../field';
import { Radio } from './radio';

const meta = {
  title: 'Form/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['small', 'medium', 'large'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Radio.Root value="opt1" id="r1">
      <Radio.Indicator />
      <Radio.Label>Opção 1</Radio.Label>
    </Radio.Root>
  ),
};

export const Checked: Story = {
  render: () => (
    <Radio.Root value="opt1" id="r1-checked" defaultChecked>
      <Radio.Indicator />
      <Radio.Label>Selecionado</Radio.Label>
    </Radio.Root>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Radio.Root value="plan-pro" id="r-pro" defaultChecked>
      <Radio.Indicator />
      <Flex flexDirection="column">
        <Radio.Label>Plano Pro</Radio.Label>
        <Radio.Description>R$ 49/mês — Recursos ilimitados</Radio.Description>
      </Flex>
    </Radio.Root>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex flexDirection="column" gap="12px" alignItems="flex-start">
      {(['small', 'medium', 'large'] as const).map((size) => (
        <Radio.Root key={size} value={size} id={`size-${size}`} size={size} defaultChecked>
          <Radio.Indicator />
          <Radio.Label>Tamanho {size}</Radio.Label>
        </Radio.Root>
      ))}
    </Flex>
  ),
};

function GroupExample() {
  const [selected, setSelected] = useState('pro');
  const options = [
    { value: 'free', label: 'Gratuito', description: 'Até 3 projetos' },
    { value: 'pro', label: 'Pro', description: 'R$ 49/mês' },
    { value: 'enterprise', label: 'Enterprise', description: 'Sob consulta' },
  ];
  return (
    <Box as="div" role="radiogroup" aria-label="Planos">
      <Flex flexDirection="column" gap="small" alignItems="flex-start">
        {options.map((plan) => (
          <Radio.Root
            key={plan.value}
            value={plan.value}
            id={`plan-${plan.value}`}
            name="plan"
            checked={selected === plan.value}
            onCheckedChange={() => setSelected(plan.value)}
          >
            <Radio.Indicator />
            <Flex flexDirection="column">
              <Radio.Label>{plan.label}</Radio.Label>
              <Radio.Description>{plan.description}</Radio.Description>
            </Flex>
          </Radio.Root>
        ))}
      </Flex>
    </Box>
  );
}

export const Group: Story = {
  render: () => <GroupExample />,
};

export const Disabled: Story = {
  render: () => (
    <Flex flexDirection="column" gap="small" alignItems="flex-start">
      <Radio.Root value="disabled" id="r-disabled-idle" disabled>
        <Radio.Indicator />
        <Radio.Label>Desabilitado (não selecionado)</Radio.Label>
      </Radio.Root>
      <Radio.Root value="disabled-on" id="r-disabled-on" disabled defaultChecked>
        <Radio.Indicator />
        <Radio.Label>Desabilitado (selecionado)</Radio.Label>
      </Radio.Root>
    </Flex>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field id="shipping" invalid>
      <Field.Control>
        <Radio.Root value="invalid">
          <Radio.Indicator />
          <Radio.Label>Selecione uma opção válida</Radio.Label>
        </Radio.Root>
      </Field.Control>
      <Field.Error>Opção indisponível para sua região.</Field.Error>
    </Field>
  ),
};

export const Theming: Story = {
  render: () => {
    const customTheme = createTheme(themeLight, {
      components: {
        radio: {
          colors: {
            indicator: {
              border: { checked: 'feedback.success.solid' },
              dot: 'feedback.success.solid',
            },
          },
        },
      },
      recipes: {
        radio: {
          slots: ['root', 'control', 'indicator', 'dot', 'label', 'description'],
          base: { indicator: { borderRadius: 'small' } },
          variants: {},
          defaultVariants: {},
        },
      },
    });
    return (
      <Flex flexDirection="column" gap="medium" alignItems="flex-start">
        <Radio.Root value="default" id="theming-default" defaultChecked>
          <Radio.Indicator />
          <Radio.Label>Default theme</Radio.Label>
        </Radio.Root>
        <ArborProvider theme={customTheme}>
          <Radio.Root value="custom" id="theming-custom" defaultChecked>
            <Radio.Indicator />
            <Radio.Label>Override (success tone + indicator quadrado)</Radio.Label>
          </Radio.Root>
        </ArborProvider>
      </Flex>
    );
  },
};
