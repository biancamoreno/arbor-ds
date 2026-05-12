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
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Checkbox.Root id="accept">
      <Checkbox.Indicator />
      <Checkbox.Label>Aceitar os termos e condições</Checkbox.Label>
    </Checkbox.Root>
  ),
};

export const Checked: Story = {
  render: () => (
    <Checkbox.Root id="checked" defaultChecked>
      <Checkbox.Indicator />
      <Checkbox.Label>Glifo Check via Icon (cross-platform)</Checkbox.Label>
    </Checkbox.Root>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <Checkbox.Root id="indeterminate" indeterminate>
      <Checkbox.Indicator />
      <Checkbox.Label>Glifo Minus via Icon (tri-state)</Checkbox.Label>
    </Checkbox.Root>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex flexDirection="column" gap="12px" alignItems="flex-start">
      {(['small', 'medium', 'large'] as const).map((size) => (
        <Checkbox.Root key={size} id={`size-${size}`} size={size} defaultChecked>
          <Checkbox.Indicator />
          <Checkbox.Label>Tamanho {size}</Checkbox.Label>
        </Checkbox.Root>
      ))}
    </Flex>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Checkbox.Root id="newsletter">
      <Checkbox.Indicator />
      <Flex flexDirection="column">
        <Checkbox.Label>Receber novidades</Checkbox.Label>
        <Checkbox.Description>Enviaremos no máximo 1 e-mail por semana.</Checkbox.Description>
      </Flex>
    </Checkbox.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Flex flexDirection="column" gap="8px" alignItems="flex-start">
      <Checkbox.Root id="disabled-unchecked" disabled>
        <Checkbox.Indicator />
        <Checkbox.Label>Desabilitado (desmarcado)</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root id="disabled-checked" disabled defaultChecked>
        <Checkbox.Indicator />
        <Checkbox.Label>Desabilitado (marcado)</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root id="disabled-indeterminate" disabled indeterminate>
        <Checkbox.Indicator />
        <Checkbox.Label>Desabilitado (indeterminate)</Checkbox.Label>
      </Checkbox.Root>
    </Flex>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field id="terms" invalid>
      <Field.Control>
        <Checkbox.Root>
          <Checkbox.Indicator />
          <Checkbox.Label>É obrigatório aceitar os termos</Checkbox.Label>
        </Checkbox.Root>
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
      <Checkbox.Root
        id="all"
        checked={allChecked}
        indeterminate={someChecked}
        onCheckedChange={setAll}
      >
        <Checkbox.Indicator />
        <Checkbox.Label>Selecionar todos</Checkbox.Label>
      </Checkbox.Root>
      {items.map((checked, i) => (
        <Checkbox.Root
          key={i}
          id={`item-${i}`}
          checked={checked}
          onCheckedChange={(next) => setItems(items.map((v, idx) => (idx === i ? next : v)))}
        >
          <Checkbox.Indicator />
          <Checkbox.Label>Item {i + 1}</Checkbox.Label>
        </Checkbox.Root>
      ))}
    </Flex>
  );
}

export const TriState: Story = {
  render: () => <TriStateExample />,
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
        <Checkbox.Root id="theming-default" defaultChecked>
          <Checkbox.Indicator />
          <Checkbox.Label>Default theme</Checkbox.Label>
        </Checkbox.Root>
        <ArborProvider theme={customTheme}>
          <Checkbox.Root id="theming-custom" defaultChecked>
            <Checkbox.Indicator />
            <Checkbox.Label>Override (success tone + radius huge)</Checkbox.Label>
          </Checkbox.Root>
        </ArborProvider>
      </Flex>
    );
  },
};
