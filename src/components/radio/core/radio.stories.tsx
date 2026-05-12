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
    variant: { control: { type: 'select' }, options: ['outline', 'filled'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Radio value="opt1" label="Opção 1" />,
};

export const Checked: Story = {
  render: () => <Radio value="opt1" label="Selecionado" defaultChecked />,
};

export const Variants: Story = {
  render: () => (
    <Flex flexDirection="column" gap="medium" alignItems="flex-start">
      <Flex flexDirection="column" gap="small" alignItems="flex-start">
        <Radio value="o-idle" label="Outline · idle (default)" variant="outline" />
        <Radio value="o-checked" label="Outline · checked" variant="outline" defaultChecked />
      </Flex>
      <Flex flexDirection="column" gap="small" alignItems="flex-start">
        <Radio value="f-idle" label="Filled · idle (bg subtle)" variant="filled" />
        <Radio value="f-checked" label="Filled · checked" variant="filled" defaultChecked />
      </Flex>
    </Flex>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Radio
      value="plan-pro"
      label="Plano Pro"
      description="R$ 49/mês — Recursos ilimitados"
      defaultChecked
    />
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex flexDirection="column" gap="12px" alignItems="flex-start">
      <Radio value="size-small" label="Tamanho small" size="small" defaultChecked />
      <Radio value="size-medium" label="Tamanho medium" size="medium" defaultChecked />
      <Radio value="size-large" label="Tamanho large" size="large" defaultChecked />
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
          <Radio
            key={plan.value}
            value={plan.value}
            name="plan"
            label={plan.label}
            description={plan.description}
            checked={selected === plan.value}
            onCheckedChange={() => setSelected(plan.value)}
          />
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
      <Radio value="d-idle" label="Desabilitado (não selecionado)" disabled />
      <Radio value="d-on" label="Desabilitado (selecionado)" disabled defaultChecked />
    </Flex>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field id="shipping" invalid>
      <Field.Control>
        <Radio value="invalid" label="Selecione uma opção válida" />
      </Field.Control>
      <Field.Error>Opção indisponível para sua região.</Field.Error>
    </Field>
  ),
};

export const AdvancedCompound: Story = {
  render: () => (
    <Flex flexDirection="column" gap="small" alignItems="flex-start">
      <Radio.Root value="adv-1" defaultChecked>
        <Radio.Label>Label antes do indicador</Radio.Label>
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Root value="adv-2">
        <Radio.Indicator />
        <Flex flexDirection="column">
          <Radio.Label>Layout custom</Radio.Label>
          <Radio.Description>Use Radio.Root quando precisar de ordem ou estrutura não-trivial.</Radio.Description>
        </Flex>
      </Radio.Root>
    </Flex>
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
        <Radio value="default" label="Default theme" defaultChecked />
        <ArborProvider theme={customTheme}>
          <Radio value="custom" label="Override (success tone + indicator quadrado)" defaultChecked />
        </ArborProvider>
      </Flex>
    );
  },
};
