import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './popover';
import { Box, Clickable, Flex, Icon, Text } from '../../core';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';

const meta = {
  title: 'Overlay/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj;

/**
 * Trigger outlined padronizado — mesmo estilo das stories do Tooltip.
 *
 * IMPORTANTE: usa `forwardRef` + spread de `...rest` para que `PopoverTrigger`
 * (que injeta `onClick`/`ref`/`aria-*` via `cloneElement` quando `asChild`)
 * consiga abrir o popover. Helper que apenas declara `children` engole as
 * props injetadas e quebra o trigger.
 */
const TriggerButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function TriggerButton({ children, ...rest }, ref) {
    return (
      <Clickable
        as="button"
        type="button"
        paddingX="medium"
        paddingY="small"
        borderRadius="small"
        backgroundColor="surface.default"
        borderWidth="hairline"
        borderStyle="solid"
        borderColor="border.default"
        innerRef={ref as React.Ref<HTMLButtonElement>}
        {...rest}
      >
        {children}
      </Clickable>
    );
  },
);

export const Default: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger>
        <TriggerButton>Abrir popover</TriggerButton>
      </Popover.Trigger>
      <Popover.Content>
        <Text as="p" variant="bodyMedium" fontWeight="semibold">
          Informações adicionais
        </Text>
        <Text as="p" variant="bodySmall" color="text.secondary">
          Conteúdo rico dentro do popover. Pode incluir formulários, listas ou qualquer elemento.
        </Text>
        <Popover.Close />
      </Popover.Content>
    </Popover>
  ),
};

export const Anatomia: Story = {
  name: 'Anatomia (Trigger → Content → Close)',
  render: () => (
    <Flex flexDirection="column" gap="medium" alignItems="flex-start">
      <Text as="p" variant="overline" color="text.secondary">
        Trigger → Content (com Close opcional)
      </Text>
      <Popover defaultOpen>
        <Popover.Trigger>
          <TriggerButton>Trigger</TriggerButton>
        </Popover.Trigger>
        <Popover.Content>
          <Text as="p" variant="bodyMedium" fontWeight="semibold">
            Title
          </Text>
          <Text as="p" variant="bodySmall" color="text.secondary">
            Description que pode ocupar várias linhas se necessário.
          </Text>
          <Popover.Close />
        </Popover.Content>
      </Popover>
    </Flex>
  ),
};

export const Placements: Story = {
  render: () => (
    <Flex gap="medium" padding="xlarge" flexWrap="wrap" justifyContent="center">
      {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
        <Popover key={p} placement={p}>
          <Popover.Trigger>
            <TriggerButton>placement="{p}"</TriggerButton>
          </Popover.Trigger>
          <Popover.Content>
            <Text as="p" variant="bodyMedium">
              Aberto em <Text as="span" fontWeight="semibold">{p}</Text>
            </Text>
            <Text as="p" variant="bodySmall" color="text.secondary">
              Flipa automaticamente se não couber.
            </Text>
          </Popover.Content>
        </Popover>
      ))}
    </Flex>
  ),
};

export const FlipNearViewportEdge: Story = {
  name: 'Flip automático perto da borda',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Quando o `placement` pedido não cabe no viewport, o popover flipa automaticamente para o eixo oposto. Clique em cada trigger e veja qual placement é de fato renderizado.',
      },
    },
  },
  render: () => (
    <Box position="relative" width="100%" height="100vh">
      <Box position="absolute" top={0} left="50%" style={{ transform: 'translateX(-50%)' }}>
        <Popover placement="top">
          <Popover.Trigger>
            <TriggerButton>Topo (pediu top)</TriggerButton>
          </Popover.Trigger>
          <Popover.Content>
            <Text as="p" variant="bodyMedium">Pediu top, flipou para bottom.</Text>
            <Popover.Close />
          </Popover.Content>
        </Popover>
      </Box>

      <Box position="absolute" top="50%" left={0} style={{ transform: 'translateY(-50%)' }}>
        <Popover placement="left">
          <Popover.Trigger>
            <TriggerButton>Esquerda (pediu left)</TriggerButton>
          </Popover.Trigger>
          <Popover.Content>
            <Text as="p" variant="bodyMedium">Pediu left, flipou para right.</Text>
            <Popover.Close />
          </Popover.Content>
        </Popover>
      </Box>

      <Box position="absolute" top="50%" right={0} style={{ transform: 'translateY(-50%)' }}>
        <Popover placement="right">
          <Popover.Trigger>
            <TriggerButton>Direita (pediu right)</TriggerButton>
          </Popover.Trigger>
          <Popover.Content>
            <Text as="p" variant="bodyMedium">Pediu right, flipou para left.</Text>
            <Popover.Close />
          </Popover.Content>
        </Popover>
      </Box>

      <Box position="absolute" bottom={0} left="50%" style={{ transform: 'translateX(-50%)' }}>
        <Popover placement="bottom">
          <Popover.Trigger>
            <TriggerButton>Base (pediu bottom)</TriggerButton>
          </Popover.Trigger>
          <Popover.Content>
            <Text as="p" variant="bodyMedium">Pediu bottom, flipou para top.</Text>
            <Popover.Close />
          </Popover.Content>
        </Popover>
      </Box>
    </Box>
  ),
};

export const RichContent: Story = {
  name: 'Conteúdo customizado (slot livre)',
  render: () => (
    <Popover placement="right">
      <Popover.Trigger>
        <TriggerButton>
          <Flex gap="micro" alignItems="center">
            <Icon name="Info" size="small" />
            <Text as="span" variant="bodySmall">Detalhes</Text>
          </Flex>
        </TriggerButton>
      </Popover.Trigger>
      <Popover.Content>
        <Flex gap="small" alignItems="center">
          <Icon name="CircleCheck" size="medium" />
          <Text as="p" variant="bodyMedium" fontWeight="semibold">Compra protegida</Text>
        </Flex>
        <Text as="p" variant="bodySmall" color="text.secondary">
          Reembolso garantido em até 7 dias após a entrega. Sem perguntas.
        </Text>
        <Popover.Close />
      </Popover.Content>
    </Popover>
  ),
};

export const InsideOverflowClip: Story = {
  name: 'Portal escapa overflow:hidden',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Box padding="xlarge">
      <Text as="p" variant="bodyMedium" color="text.secondary" marginBottom="medium">
        O container abaixo tem <Text variant="code">overflow: hidden</Text>; o Popover renderiza via Portal e escapa do clip.
      </Text>
      <Box
        width="200px"
        height="60px"
        overflow="hidden"
        borderWidth="thin"
        borderStyle="dashed"
        borderColor="border.subtle"
        borderRadius="medium"
        padding="medium"
      >
        <Popover defaultOpen>
          <Popover.Trigger>
            <TriggerButton>Abrir</TriggerButton>
          </Popover.Trigger>
          <Popover.Content>
            <Text as="p" variant="bodyMedium" fontWeight="semibold">Escapa do clip</Text>
            <Text as="p" variant="bodySmall">Renderizado via Portal em document.body.</Text>
            <Popover.Close />
          </Popover.Content>
        </Popover>
      </Box>
    </Box>
  ),
};

export const Controlled: Story = {
  name: 'Controlado externamente',
  parameters: {
    docs: {
      description: {
        story:
          'Popover controlado via `open`/`onOpenChange`. Controles externos devem ser direcionais (`Abrir` / `Fechar`), não toggles — um toggle externo entraria em conflito com o `DismissableLayer` (o `pointerdown` já fecha o popover antes do `click` toggle disparar, fazendo o popover reabrir).',
      },
    },
  },
  render: () => {
    function ControlledDemo() {
      const [open, setOpen] = useState(false);
      return (
        <Flex flexDirection="column" gap="medium" alignItems="flex-start">
          <Text as="p" variant="bodySmall" color="text.secondary">
            Estado: <Text as="span" fontWeight="semibold">{open ? 'aberto' : 'fechado'}</Text>
          </Text>
          <Flex gap="small">
            {open ? (
              <Clickable
                as="button"
                type="button"
                paddingX="medium"
                paddingY="small"
                borderRadius="small"
                backgroundColor="surface.default"
                borderWidth="hairline"
                borderStyle="solid"
                borderColor="border.default"
                onClick={() => setOpen(false)}
              >
                Fechar via estado externo
              </Clickable>
            ) : (
              <Clickable
                as="button"
                type="button"
                paddingX="medium"
                paddingY="small"
                borderRadius="small"
                backgroundColor="surface.default"
                borderWidth="hairline"
                borderStyle="solid"
                borderColor="border.default"
                onClick={() => setOpen(true)}
              >
                Abrir via estado externo
              </Clickable>
            )}
            <Popover open={open} onOpenChange={setOpen}>
              <Popover.Trigger>
                <TriggerButton>Trigger interno</TriggerButton>
              </Popover.Trigger>
              <Popover.Content>
                <Text as="p" variant="bodyMedium">Controlado por estado externo.</Text>
                <Popover.Close />
              </Popover.Content>
            </Popover>
          </Flex>
        </Flex>
      );
    }
    return <ControlledDemo />;
  },
};

export const Theming: Story = {
  name: 'Theming via createTheme',
  parameters: {
    docs: {
      description: {
        story:
          'Override completo do `popover` via `createTheme({ components: { popover: {...} } })`. Cores, sombra, offset, borderRadius, padding e tamanhos são todos themables.',
      },
    },
  },
  render: () => {
    const customTheme = createTheme(themeLight, {
      components: {
        popover: {
          borderRadius: 'large',
          shadow: 'xl',
          padding: { inline: 'large', block: 'large' },
          colors: {
            background: 'brand.bgSubtle',
            border: 'brand.borderDefault',
            text: 'text.primary',
          },
        },
      },
    });
    return (
      <ArborProvider theme={customTheme}>
        <Popover defaultOpen>
          <Popover.Trigger>
            <TriggerButton>Tema customizado</TriggerButton>
          </Popover.Trigger>
          <Popover.Content>
            <Text as="p" variant="bodyMedium" fontWeight="semibold">
              Popover com tema custom
            </Text>
            <Text as="p" variant="bodySmall">
              Borda + sombra + background + padding tematizáveis.
            </Text>
            <Popover.Close />
          </Popover.Content>
        </Popover>
      </ArborProvider>
    );
  },
};

export const AdvancedCompound: Story = {
  name: 'API compound — controle granular',
  parameters: {
    docs: {
      description: {
        story:
          'Use `<Popover.Root>` (alias retrocompatível de `<Popover>`) quando precisar de `open` controlado externamente ou anatomia rica.',
      },
    },
  },
  render: () => (
    <Popover.Root>
      <Popover.Trigger>
        <TriggerButton>Compound API</TriggerButton>
      </Popover.Trigger>
      <Popover.Content>
        <Flex flexDirection="column" gap="micro">
          <Text as="span" variant="bodySmall" fontWeight="semibold">Controle granular</Text>
          <Text as="span" variant="caption">
            Compound preservado para anatomia rica ou estado externo.
          </Text>
        </Flex>
        <Popover.Close />
      </Popover.Content>
    </Popover.Root>
  ),
};
