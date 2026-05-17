import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Menu } from './menu';
import { Box, Clickable, Flex, Icon, Text } from '../../core';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';

const meta = {
  title: 'Overlay/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj;

/**
 * Trigger outlined padronizado — mesmo idioma das stories de Tooltip e Popover.
 *
 * Usa `forwardRef` + spread de `...rest` para que `Menu.Trigger` (que injeta
 * `onClick`/`ref`/`aria-haspopup`/`aria-expanded` via `cloneElement` quando
 * `asChild`) consiga abrir o menu. Helper que apenas declara `children` engole
 * as props injetadas e quebra o trigger.
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
    <Menu>
      <Menu.Trigger asChild>
        <TriggerButton>
          <Flex gap="micro" alignItems="center">
            <Text as="span" variant="bodyMedium">
              Ações
            </Text>
            <Icon name="ChevronDown" size="small" />
          </Flex>
        </TriggerButton>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item onSelect={fn()}>Editar</Menu.Item>
        <Menu.Item onSelect={fn()}>Duplicar</Menu.Item>
        <Menu.Separator />
        <Menu.Item onSelect={fn()}>Arquivar</Menu.Item>
        <Menu.Item onSelect={fn()} disabled>
          Excluir (sem permissão)
        </Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};

export const Anatomia: Story = {
  name: 'Anatomia (Trigger → Content → Item)',
  render: () => (
    <Flex flexDirection="column" gap="medium" alignItems="flex-start">
      <Text as="p" variant="overline" color="text.secondary">
        Trigger → Content (Label, Item, Separator)
      </Text>
      <Menu defaultOpen>
        <Menu.Trigger asChild>
          <TriggerButton>Trigger</TriggerButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Label>Section</Menu.Label>
          <Menu.Item onSelect={fn()}>Item</Menu.Item>
          <Menu.Item onSelect={fn()}>Item</Menu.Item>
          <Menu.Separator />
          <Menu.Item onSelect={fn()} disabled>
            Disabled item
          </Menu.Item>
        </Menu.Content>
      </Menu>
    </Flex>
  ),
};

export const Placements: Story = {
  render: () => (
    <Flex gap="medium" padding="xlarge" flexWrap="wrap" justifyContent="center">
      {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
        <Menu key={p} placement={p}>
          <Menu.Trigger asChild>
            <TriggerButton>placement=&quot;{p}&quot;</TriggerButton>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item onSelect={fn()}>Item 1</Menu.Item>
            <Menu.Item onSelect={fn()}>Item 2</Menu.Item>
            <Menu.Item onSelect={fn()}>Item 3</Menu.Item>
          </Menu.Content>
        </Menu>
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
          'Quando o `placement` pedido não cabe no viewport, o menu flipa automaticamente para o eixo oposto. Clique em cada trigger e veja qual placement é de fato renderizado.',
      },
    },
  },
  render: () => (
    <Box position="relative" width="100%" height="100vh">
      <Box position="absolute" top={0} left="50%" style={{ transform: 'translateX(-50%)' }}>
        <Menu placement="top">
          <Menu.Trigger asChild>
            <TriggerButton>Topo (pediu top)</TriggerButton>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item onSelect={fn()}>Pediu top, flipou para bottom</Menu.Item>
            <Menu.Item onSelect={fn()}>Item 2</Menu.Item>
          </Menu.Content>
        </Menu>
      </Box>

      <Box position="absolute" top="50%" left={0} style={{ transform: 'translateY(-50%)' }}>
        <Menu placement="left">
          <Menu.Trigger asChild>
            <TriggerButton>Esquerda (pediu left)</TriggerButton>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item onSelect={fn()}>Pediu left, flipou para right</Menu.Item>
            <Menu.Item onSelect={fn()}>Item 2</Menu.Item>
          </Menu.Content>
        </Menu>
      </Box>

      <Box position="absolute" top="50%" right={0} style={{ transform: 'translateY(-50%)' }}>
        <Menu placement="right">
          <Menu.Trigger asChild>
            <TriggerButton>Direita (pediu right)</TriggerButton>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item onSelect={fn()}>Pediu right, flipou para left</Menu.Item>
            <Menu.Item onSelect={fn()}>Item 2</Menu.Item>
          </Menu.Content>
        </Menu>
      </Box>

      <Box position="absolute" bottom={0} left="50%" style={{ transform: 'translateX(-50%)' }}>
        <Menu placement="bottom">
          <Menu.Trigger asChild>
            <TriggerButton>Base (pediu bottom)</TriggerButton>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item onSelect={fn()}>Pediu bottom, flipou para top</Menu.Item>
            <Menu.Item onSelect={fn()}>Item 2</Menu.Item>
          </Menu.Content>
        </Menu>
      </Box>
    </Box>
  ),
};

export const Sections: Story = {
  name: 'Seções (Label + Separator)',
  parameters: {
    docs: {
      description: {
        story:
          '`Menu.Label` agrupa items relacionados sem ser interativo (`role="presentation"`); `Menu.Separator` divide grupos com `role="separator"`.',
      },
    },
  },
  render: () => (
    <Menu>
      <Menu.Trigger asChild>
        <TriggerButton>
          <Flex gap="micro" alignItems="center">
            <Text as="span" variant="bodyMedium">
              Conta
            </Text>
            <Icon name="ChevronDown" size="small" />
          </Flex>
        </TriggerButton>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Label>Configurações</Menu.Label>
        <Menu.Item onSelect={fn()}>Perfil</Menu.Item>
        <Menu.Item onSelect={fn()}>Segurança</Menu.Item>
        <Menu.Separator />
        <Menu.Label>Sessão</Menu.Label>
        <Menu.Item onSelect={fn()}>Sair</Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};

export const WithIcons: Story = {
  name: 'Items com ícones (startIcon / endIcon)',
  parameters: {
    docs: {
      description: {
        story:
          '`Menu.Item` aceita `startIcon` e `endIcon` (`IconName` ou `ReactElement`). Ícones são automaticamente themados por `menu.item.iconSize` / `menu.item.colors.icon`.',
      },
    },
  },
  render: () => (
    <Menu>
      <Menu.Trigger asChild>
        <TriggerButton>
          <Flex gap="micro" alignItems="center">
            <Icon name="Settings" size="small" />
            <Text as="span" variant="bodyMedium">
              Mais ações
            </Text>
          </Flex>
        </TriggerButton>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item onSelect={fn()} startIcon="Pencil">
          Editar
        </Menu.Item>
        <Menu.Item onSelect={fn()} startIcon="Copy">
          Duplicar
        </Menu.Item>
        <Menu.Item onSelect={fn()} startIcon="ExternalLink" endIcon="ChevronRight">
          Abrir em nova aba
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item onSelect={fn()} startIcon="Folder">
          Arquivar
        </Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};

export const DestructiveItem: Story = {
  name: 'Item destrutivo (tone="critical")',
  parameters: {
    docs: {
      description: {
        story:
          'Ações destrutivas (Excluir, Remover) usam `tone="critical"` — texto e ícone em `feedback.critical.solid`; hover/focus em `feedback.critical.bgSubtle`. Tom themable via `menu.item.colors.criticalText` / `criticalBackgroundHover`.',
      },
    },
  },
  render: () => (
    <Menu defaultOpen>
      <Menu.Trigger asChild>
        <TriggerButton>
          <Flex gap="micro" alignItems="center">
            <Text as="span" variant="bodyMedium">
              Documento
            </Text>
            <Icon name="ChevronDown" size="small" />
          </Flex>
        </TriggerButton>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item onSelect={fn()} startIcon="Pencil">
          Editar
        </Menu.Item>
        <Menu.Item onSelect={fn()} startIcon="Copy">
          Duplicar
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item onSelect={fn()} startIcon="Trash2" tone="critical">
          Excluir permanentemente
        </Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};

export const KeepOpenToggle: Story = {
  name: 'Manter aberto (preventDefault)',
  parameters: {
    docs: {
      description: {
        story:
          '`onSelect` recebe um evento com `preventDefault()`. Chamando-o, o menu **não** fecha após a seleção — útil para toggles (Mostrar grade, Modo escuro) onde o usuário pode querer alternar múltiplas opções sem reabrir.',
      },
    },
  },
  render: () => {
    function ToggleDemo() {
      const [showGrid, setShowGrid] = useState(true);
      const [snapToGrid, setSnapToGrid] = useState(false);
      const [darkMode, setDarkMode] = useState(false);

      return (
        <Menu>
          <Menu.Trigger asChild>
            <TriggerButton>
              <Flex gap="micro" alignItems="center">
                <Icon name="Settings" size="small" />
                <Text as="span" variant="bodyMedium">
                  Visualização
                </Text>
              </Flex>
            </TriggerButton>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Label>Toggles (menu permanece aberto)</Menu.Label>
            <Menu.Item
              startIcon={showGrid ? 'Check' : 'Minus'}
              onSelect={(e) => {
                e.preventDefault();
                setShowGrid((v) => !v);
              }}
            >
              Mostrar grade
            </Menu.Item>
            <Menu.Item
              startIcon={snapToGrid ? 'Check' : 'Minus'}
              onSelect={(e) => {
                e.preventDefault();
                setSnapToGrid((v) => !v);
              }}
            >
              Snap à grade
            </Menu.Item>
            <Menu.Item
              startIcon={darkMode ? 'Check' : 'Minus'}
              onSelect={(e) => {
                e.preventDefault();
                setDarkMode((v) => !v);
              }}
            >
              Modo escuro
            </Menu.Item>
            <Menu.Separator />
            <Menu.Label>Ações (menu fecha)</Menu.Label>
            <Menu.Item startIcon="Save" onSelect={fn()}>
              Salvar preferências
            </Menu.Item>
          </Menu.Content>
        </Menu>
      );
    }
    return <ToggleDemo />;
  },
};

export const KeyboardNavigation: Story = {
  name: 'Navegação por teclado (WAI-ARIA APG)',
  parameters: {
    docs: {
      description: {
        story:
          'Atalhos seguem o pattern [WAI-ARIA APG Menu](https://www.w3.org/WAI/ARIA/apg/patterns/menu/). Foque o trigger (Tab) e teste cada tecla.',
      },
    },
  },
  render: () => (
    <Flex gap="xlarge" alignItems="flex-start">
      <Flex flexDirection="column" gap="small" minWidth="280px">
        <Text as="p" variant="overline" color="text.secondary">
          Atalhos
        </Text>
        {[
          ['Tab', 'Foca o trigger'],
          ['↓ / Enter / Space', 'Abre o menu (foco vai pro 1º item)'],
          ['↑', 'Abre o menu'],
          ['↓ / ↑', 'Navega entre items (pula disabled, faz wrap)'],
          ['Home / End', 'Salta para 1º / último item habilitado'],
          ['Enter / Space', 'Seleciona item ativo'],
          ['Esc', 'Fecha e devolve foco ao trigger'],
          ['Tab (no menu)', 'Fecha e devolve foco ao trigger'],
          ['Click fora', 'Fecha'],
        ].map(([key, action]) => (
          <Flex key={key} gap="small" alignItems="baseline">
            <Box
              paddingX="micro"
              paddingY="nano"
              borderRadius="small"
              backgroundColor="background.subtle"
              borderWidth="hairline"
              borderStyle="solid"
              borderColor="border.subtle"
              minWidth="100px"
            >
              <Text as="span" variant="caption" fontWeight="medium">
                {key}
              </Text>
            </Box>
            <Text as="span" variant="bodySmall" color="text.secondary">
              {action}
            </Text>
          </Flex>
        ))}
      </Flex>

      <Menu>
        <Menu.Trigger asChild>
          <TriggerButton>
            <Flex gap="micro" alignItems="center">
              <Text as="span" variant="bodyMedium">
                Teste aqui
              </Text>
              <Icon name="ChevronDown" size="small" />
            </Flex>
          </TriggerButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item onSelect={fn()} startIcon="Pencil">
            Editar
          </Menu.Item>
          <Menu.Item onSelect={fn()} disabled startIcon="Lock">
            Bloqueado (skip)
          </Menu.Item>
          <Menu.Item onSelect={fn()} startIcon="Copy">
            Duplicar
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item onSelect={fn()} startIcon="Trash2" tone="critical">
            Excluir
          </Menu.Item>
        </Menu.Content>
      </Menu>
    </Flex>
  ),
};

export const InsideOverflowClip: Story = {
  name: 'Portal escapa overflow:hidden',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Box padding="xlarge">
      <Text as="p" variant="bodyMedium" color="text.secondary" marginBottom="medium">
        O container abaixo tem <Text variant="code">overflow: hidden</Text>; o Menu renderiza via Portal e escapa do clip.
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
        <Menu defaultOpen>
          <Menu.Trigger asChild>
            <TriggerButton>
              <Flex gap="micro" alignItems="center">
                <Text as="span" variant="bodyMedium">
                  Ações
                </Text>
                <Icon name="ChevronDown" size="small" />
              </Flex>
            </TriggerButton>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item onSelect={fn()}>Editar</Menu.Item>
            <Menu.Item onSelect={fn()}>Duplicar</Menu.Item>
            <Menu.Separator />
            <Menu.Item onSelect={fn()}>Arquivar</Menu.Item>
          </Menu.Content>
        </Menu>
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
          'Menu controlado via `open`/`onOpenChange`. Controles externos devem ser direcionais (`Abrir` / `Fechar`), não toggles — um toggle externo entraria em conflito com o `DismissableLayer` (o `pointerdown` já fecha antes do `click` toggle disparar).',
      },
    },
  },
  render: () => {
    function ControlledDemo() {
      const [open, setOpen] = useState(false);
      return (
        <Flex flexDirection="column" gap="medium" alignItems="flex-start">
          <Text as="p" variant="bodySmall" color="text.secondary">
            Estado:{' '}
            <Text as="span" fontWeight="semibold">
              {open ? 'aberto' : 'fechado'}
            </Text>
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
            <Menu open={open} onOpenChange={setOpen}>
              <Menu.Trigger asChild>
                <TriggerButton>Trigger interno</TriggerButton>
              </Menu.Trigger>
              <Menu.Content>
                <Menu.Item onSelect={fn()}>Editar</Menu.Item>
                <Menu.Item onSelect={fn()}>Duplicar</Menu.Item>
                <Menu.Separator />
                <Menu.Item onSelect={fn()}>Arquivar</Menu.Item>
              </Menu.Content>
            </Menu>
          </Flex>
        </Flex>
      );
    }
    return <ControlledDemo />;
  },
};

export const ThemingDensity: Story = {
  name: 'Theming — Densidade (compact / comfortable / spacious)',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Todo o espaçamento interno (`padding` do container, `gap` entre items, `padding`/`minHeight` do item, `marginBlock` do separator) é themable via `createTheme({ components: { menu: {...} } })`. Aninhe um `<ArborProvider theme={...}>` para aplicar densidade em escopo limitado. Override mais específico vence.',
      },
    },
  },
  render: () => {
    const compactTheme = createTheme(themeLight, {
      components: {
        menu: {
          padding: { inline: 'nano', block: 'nano' },
          gap: 'nano',
          item: {
            padding: { inline: 'tiny', block: 'nano' },
            minHeight: 'control.small',
          },
          separator: { marginBlock: 'nano' },
        },
      },
    });

    const spaciousTheme = createTheme(themeLight, {
      components: {
        menu: {
          padding: { inline: 'small', block: 'small' },
          gap: 'small',
          item: {
            padding: { inline: 'medium', block: 'small' },
            minHeight: 'control.medium',
          },
          separator: { marginBlock: 'small' },
        },
      },
    });

    function DensitySample({ label, theme }: { label: string; theme: typeof themeLight }) {
      const content = (
        <Flex flexDirection="column" gap="small" alignItems="flex-start" minWidth="220px">
          <Text as="span" variant="overline" color="text.secondary">
            {label}
          </Text>
          <Menu defaultOpen placement="bottom">
            <Menu.Trigger asChild>
              <TriggerButton>
                <Flex gap="micro" alignItems="center">
                  <Text as="span" variant="bodyMedium">
                    {label}
                  </Text>
                  <Icon name="ChevronDown" size="small" />
                </Flex>
              </TriggerButton>
            </Menu.Trigger>
            <Menu.Content>
              <Menu.Label>Section</Menu.Label>
              <Menu.Item onSelect={fn()}>Editar</Menu.Item>
              <Menu.Item onSelect={fn()}>Duplicar</Menu.Item>
              <Menu.Separator />
              <Menu.Item onSelect={fn()}>Arquivar</Menu.Item>
            </Menu.Content>
          </Menu>
        </Flex>
      );
      return <ArborProvider theme={theme}>{content}</ArborProvider>;
    }

    const defaultTheme = createTheme(themeLight, {});

    return (
      <Box padding="xlarge">
        <Flex gap="xlarge" alignItems="flex-start" flexWrap="wrap">
          <DensitySample label="compact" theme={compactTheme} />
          <DensitySample label="comfortable (default)" theme={defaultTheme} />
          <DensitySample label="spacious" theme={spaciousTheme} />
        </Flex>
      </Box>
    );
  },
};

export const Theming: Story = {
  name: 'Theming via createTheme',
  parameters: {
    docs: {
      description: {
        story:
          'Override completo do `menu` via `createTheme({ components: { menu: {...} } })`. Cores, sombra, offset, borderRadius, padding e tamanhos do item são todos themables.',
      },
    },
  },
  render: () => {
    const customTheme = createTheme(themeLight, {
      components: {
        menu: {
          borderRadius: 'large',
          shadow: 'xl',
          padding: { inline: 'small', block: 'small' },
          offset: 10,
          colors: {
            background: 'brand.bgSubtle',
            border: 'brand.border',
            text: 'text.primary',
          },
          item: {
            borderRadius: 'medium',
            colors: {
              text: 'text.primary',
              textDisabled: 'text.disabled',
              backgroundHover: 'brand.bgElementHover',
              backgroundActive: 'brand.bgElementActive',
            },
          },
        },
      },
    });
    return (
      <ArborProvider theme={customTheme}>
        <Menu defaultOpen>
          <Menu.Trigger asChild>
            <TriggerButton>Tema customizado</TriggerButton>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Label>Brand subtle</Menu.Label>
            <Menu.Item onSelect={fn()}>Editar</Menu.Item>
            <Menu.Item onSelect={fn()}>Duplicar</Menu.Item>
            <Menu.Separator />
            <Menu.Item onSelect={fn()}>Arquivar</Menu.Item>
          </Menu.Content>
        </Menu>
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
          'Use `<Menu.Root>` (alias retrocompatível de `<Menu>`) quando precisar de `open` controlado externamente ou anatomia rica.',
      },
    },
  },
  render: () => (
    <Menu.Root>
      <Menu.Trigger asChild>
        <TriggerButton>Compound API</TriggerButton>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Label>Granular</Menu.Label>
        <Menu.Item onSelect={fn()}>Editar</Menu.Item>
        <Menu.Item onSelect={fn()}>Duplicar</Menu.Item>
        <Menu.Separator />
        <Menu.Item onSelect={fn()}>Arquivar</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};
