import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';
import { Box, Flex } from '../../core';
import { Switch } from './switch';

const meta = {
  title: 'Form/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['small', 'medium', 'large'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Switch aria-label="Notificações" />,
};

export const WithLabel: Story = {
  render: () => (
    <Flex alignItems="center" gap="8px">
      <Switch id="notif" aria-labelledby="notif-label" />
      <Box as="label" id="notif-label" htmlFor="notif">Receber notificações</Box>
    </Flex>
  ),
};

export const Checked: Story = {
  render: () => <Switch defaultChecked aria-label="Ativo por padrão" />,
};

export const Disabled: Story = {
  render: () => (
    <Flex gap="16px">
      <Switch disabled aria-label="Desabilitado desligado" />
      <Switch disabled defaultChecked aria-label="Desabilitado ligado" />
    </Flex>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex gap="16px" alignItems="center">
      {(['small', 'medium', 'large'] as const).map((size) => (
        <Switch key={size} size={size} aria-label={`Tamanho ${size}`} />
      ))}
    </Flex>
  ),
};

export const Theming: Story = {
  render: () => {
    const customTheme = createTheme(themeLight, {
      components: {
        switch: {
          slots: ['root', 'track', 'thumb'],
          base: { track: { borderRadius: 'huge' } },
          variants: {},
          defaultVariants: {},
        },
      },
    });
    return (
      <Flex flexDirection="column" gap="16px">
        <Switch defaultChecked aria-label="Default" />
        <ArborProvider theme={customTheme}>
          <Switch defaultChecked aria-label="Override (radius huge via createTheme)" />
        </ArborProvider>
      </Flex>
    );
  },
};
