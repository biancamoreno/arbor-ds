import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';
import { Box, Flex, Text } from '../../core';
import { Field } from '../../field';
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

export const Anatomia: Story = {
  render: () => (
    <Flex flexDirection="column" gap="large" alignItems="flex-start">
      <Text variant="overline" color="text.tertiary">Track + thumb</Text>
      <Switch aria-label="Anatomia" />
      <Text variant="caption" color="text.secondary">
        Track: faixa colorida (idle/checked/invalid via recipe). Thumb: disco que desliza —
        geometria deriva de <code>theme.components.switch.track.size</code> e
        <code>thumb.size</code>; <code>translateX</code> é calculado no JS a partir desses
        mesmos tokens, então override do tema propaga para o movimento.
      </Text>
    </Flex>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex gap="large" alignItems="center">
      {(['small', 'medium', 'large'] as const).map((size) => (
        <Flex key={size} flexDirection="column" alignItems="center" gap="micro">
          <Switch size={size} defaultChecked aria-label={`Tamanho ${size}`} />
          <Text variant="caption" color="text.tertiary">{size}</Text>
        </Flex>
      ))}
    </Flex>
  ),
};

export const States: Story = {
  render: () => (
    <Flex flexDirection="column" gap="medium" alignItems="flex-start">
      <Flex gap="medium" alignItems="center">
        <Switch aria-label="Idle" />
        <Text variant="caption" color="text.secondary">idle</Text>
      </Flex>
      <Flex gap="medium" alignItems="center">
        <Switch defaultChecked aria-label="Checked" />
        <Text variant="caption" color="text.secondary">checked</Text>
      </Flex>
      <Flex gap="medium" alignItems="center">
        <Switch disabled aria-label="Disabled idle" />
        <Text variant="caption" color="text.secondary">disabled (off)</Text>
      </Flex>
      <Flex gap="medium" alignItems="center">
        <Switch disabled defaultChecked aria-label="Disabled checked" />
        <Text variant="caption" color="text.secondary">disabled (on)</Text>
      </Flex>
      <Flex gap="medium" alignItems="center">
        <Field invalid>
          <Switch aria-label="Invalid (via Field)" />
        </Field>
        <Text variant="caption" color="text.secondary">invalid (via Field)</Text>
      </Flex>
    </Flex>
  ),
};

function ControlledExample() {
  const [on, setOn] = useState(false);
  return (
    <Flex alignItems="center" gap="small">
      <Switch checked={on} onCheckedChange={setOn} aria-labelledby="ctl-label" id="ctl" />
      <Box as="label" id="ctl-label" htmlFor="ctl">
        <Text variant="bodyMedium">Modo escuro {on ? '(ativo)' : '(inativo)'}</Text>
      </Box>
    </Flex>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

export const WithLabel: Story = {
  render: () => (
    <Flex alignItems="center" gap="small">
      <Switch id="notif" aria-labelledby="notif-label" />
      <Box as="label" id="notif-label" htmlFor="notif">
        <Text variant="bodyMedium">Receber notificações</Text>
      </Box>
    </Flex>
  ),
};

export const InsideField: Story = {
  render: () => (
    <Box width="320px">
      <Field>
        <Flex alignItems="center" justifyContent="space-between">
          <Box flex={1}>
            <Field.Label>Compartilhar dados</Field.Label>
            <Field.Description>Métricas anônimas de uso ajudam a melhorar o app.</Field.Description>
          </Box>
          <Switch aria-labelledby="share-label" />
        </Flex>
      </Field>
    </Box>
  ),
};

export const Theming: Story = {
  render: () => {
    const customTheme = createTheme(themeLight, {
      components: {
        switch: {
          colors: {
            track: {
              checked: 'feedback.success.solid',
            },
          },
        },
      },
    });
    return (
      <Flex flexDirection="column" gap="medium" alignItems="flex-start">
        <Flex alignItems="center" gap="small">
          <Switch defaultChecked aria-label="Default (brand)" />
          <Text variant="caption" color="text.secondary">default — brand.solid</Text>
        </Flex>
        <ArborProvider theme={customTheme}>
          <Flex alignItems="center" gap="small">
            <Switch defaultChecked aria-label="Override (success)" />
            <Text variant="caption" color="text.secondary">
              override — components.switch.colors.track.checked → feedback.success.solid
            </Text>
          </Flex>
        </ArborProvider>
      </Flex>
    );
  },
};
