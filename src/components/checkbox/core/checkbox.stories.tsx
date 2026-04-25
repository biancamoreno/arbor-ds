import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';
import { Flex } from '../../core';
import { Checkbox } from './checkbox';

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
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

export const Indeterminate: Story = {
  render: () => (
    <Checkbox.Root id="indeterminate" indeterminate>
      <Checkbox.Indicator />
      <Checkbox.Label>Selecionar alguns itens</Checkbox.Label>
    </Checkbox.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Flex flexDirection="column" gap="8px">
      <Checkbox.Root id="disabled-unchecked" disabled>
        <Checkbox.Indicator />
        <Checkbox.Label>Desabilitado (desmarcado)</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root id="disabled-checked" disabled defaultChecked>
        <Checkbox.Indicator />
        <Checkbox.Label>Desabilitado (marcado)</Checkbox.Label>
      </Checkbox.Root>
    </Flex>
  ),
};

export const Group: Story = {
  render: () => (
    <Flex flexDirection="column" gap="8px">
      {['Opção A', 'Opção B', 'Opção C'].map((opt) => (
        <Checkbox.Root key={opt} id={`group-${opt}`}>
          <Checkbox.Indicator />
          <Checkbox.Label>{opt}</Checkbox.Label>
        </Checkbox.Root>
      ))}
    </Flex>
  ),
};

export const Theming: Story = {
  render: () => {
    const customTheme = createTheme(themeLight, {
      components: {
        checkbox: {
          slots: ['root', 'indicator', 'label', 'description'],
          base: { indicator: { borderRadius: 'huge' } },
          variants: {},
          defaultVariants: {},
        },
      },
    });
    return (
      <Flex flexDirection="column" gap="16px">
        <Checkbox.Root id="theming-default" defaultChecked>
          <Checkbox.Indicator />
          <Checkbox.Label>Default theme (radius nano)</Checkbox.Label>
        </Checkbox.Root>
        <ArborProvider theme={customTheme}>
          <Checkbox.Root id="theming-custom" defaultChecked>
            <Checkbox.Indicator />
            <Checkbox.Label>Override (radius huge via createTheme)</Checkbox.Label>
          </Checkbox.Root>
        </ArborProvider>
      </Flex>
    );
  },
};
