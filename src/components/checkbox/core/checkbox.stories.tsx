import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';
import { Field } from '../../field';
import { Flex } from '../../core';
import { Checkbox } from './checkbox';

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['small', 'medium', 'large'] },
    variant: { control: { type: 'select' }, options: ['outline', 'filled'] },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Checkbox label="Aceitar os termos e condições" />,
};

export const Checked: Story = {
  render: () => <Checkbox label="Glifo Check via Icon (cross-platform)" defaultChecked />,
};

export const Indeterminate: Story = {
  render: () => <Checkbox label="Glifo Minus via Icon (tri-state)" indeterminate />,
};

export const Variants: Story = {
  render: () => (
    <Flex flexDirection="column" gap="medium" alignItems="flex-start">
      <Flex flexDirection="column" gap="small" alignItems="flex-start">
        <Checkbox label="Outline · idle (default)" variant="outline" />
        <Checkbox label="Outline · checked" variant="outline" defaultChecked />
        <Checkbox label="Outline · indeterminate" variant="outline" indeterminate />
      </Flex>
      <Flex flexDirection="column" gap="small" alignItems="flex-start">
        <Checkbox label="Filled · idle (bg subtle)" variant="filled" />
        <Checkbox label="Filled · checked" variant="filled" defaultChecked />
        <Checkbox label="Filled · indeterminate" variant="filled" indeterminate />
      </Flex>
    </Flex>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex flexDirection="column" gap="12px" alignItems="flex-start">
      <Checkbox size="small" label="Tamanho small" defaultChecked />
      <Checkbox size="medium" label="Tamanho medium" defaultChecked />
      <Checkbox size="large" label="Tamanho large" defaultChecked />
    </Flex>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Checkbox
      label="Receber novidades"
      description="Enviaremos no máximo 1 e-mail por semana."
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <Flex flexDirection="column" gap="8px" alignItems="flex-start">
      <Checkbox label="Desabilitado (desmarcado)" disabled />
      <Checkbox label="Desabilitado (marcado)" disabled defaultChecked />
      <Checkbox label="Desabilitado (indeterminate)" disabled indeterminate />
    </Flex>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field id="terms" invalid>
      <Field.Control>
        <Checkbox label="É obrigatório aceitar os termos" />
      </Field.Control>
      <Field.Error>Você precisa aceitar para continuar.</Field.Error>
    </Field>
  ),
};

function TriStateExample() {
  const [items, setItems] = useState([false, true, false]);
  const allChecked = items.every(Boolean);
  const someChecked = items.some(Boolean) && !allChecked;
  const setAll = (checked: boolean) => setItems(items.map(() => checked));
  return (
    <Flex flexDirection="column" gap="8px" alignItems="flex-start">
      <Checkbox
        label="Selecionar todos"
        checked={allChecked}
        indeterminate={someChecked}
        onCheckedChange={setAll}
      />
      {items.map((checked, i) => (
        <Checkbox
          key={i}
          label={`Item ${i + 1}`}
          checked={checked}
          onCheckedChange={(next: boolean) => setItems(items.map((v, idx) => (idx === i ? next : v)))}
        />
      ))}
    </Flex>
  );
}

export const TriState: Story = {
  render: () => <TriStateExample />,
};

export const AdvancedCompound: Story = {
  render: () => (
    <Flex flexDirection="column" gap="small" alignItems="flex-start">
      <Checkbox.Root defaultChecked>
        <Checkbox.Label>Label antes do indicador</Checkbox.Label>
        <Checkbox.Indicator />
      </Checkbox.Root>
      <Checkbox.Root indeterminate>
        <Checkbox.Indicator />
        <Flex flexDirection="column">
          <Checkbox.Label>Descrição com layout custom</Checkbox.Label>
          <Checkbox.Description>Use Checkbox.Root quando precisar de ordem ou estrutura não-trivial.</Checkbox.Description>
        </Flex>
      </Checkbox.Root>
    </Flex>
  ),
};

export const Theming: Story = {
  render: () => {
    const customTheme = createTheme(themeLight, {
      components: {
        checkbox: {
          colors: {
            indicator: {
              background: { checked: 'feedback.success.solid' },
              border: { checked: 'feedback.success.solid' },
            },
          },
        },
      },
      recipes: {
        checkbox: {
          slots: ['root', 'indicator', 'label', 'description'],
          base: { indicator: { borderRadius: 'huge' } },
          variants: {},
          defaultVariants: {},
        },
      },
    });
    return (
      <Flex flexDirection="column" gap="16px" alignItems="flex-start">
        <Checkbox label="Default theme" defaultChecked />
        <ArborProvider theme={customTheme}>
          <Checkbox label="Override (success tone + radius huge)" defaultChecked />
        </ArborProvider>
      </Flex>
    );
  },
};
