import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Dialog } from './dialog';
import { Box, Clickable, Flex, Icon, Text } from '../../core';
import { Checkbox } from '../../checkbox';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';

const meta = {
  title: 'Overlay/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj;

/**
 * Trigger outlined padronizado — mesmo idioma das stories de Menu/Popover/Tooltip.
 * `forwardRef` + spread `...rest` para `Dialog.Trigger` (`asChild`) injetar
 * `onClick`/`ref`/`aria-*` corretamente.
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

const PrimaryButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function PrimaryButton({ children, ...rest }, ref) {
    return (
      <Clickable
        as="button"
        type="button"
        paddingX="medium"
        paddingY="small"
        borderRadius="small"
        backgroundColor="brand.solid"
        color="text.inverse"
        borderWidth={0}
        innerRef={ref as React.Ref<HTMLButtonElement>}
        {...rest}
      >
        {children}
      </Clickable>
    );
  },
);

const DangerButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function DangerButton({ children, ...rest }, ref) {
    return (
      <Clickable
        as="button"
        type="button"
        paddingX="medium"
        paddingY="small"
        borderRadius="small"
        backgroundColor="feedback.critical.solid"
        color="text.inverse"
        borderWidth={0}
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
    <Dialog>
      <Dialog.Trigger asChild>
        <TriggerButton>Abrir Dialog</TriggerButton>
      </Dialog.Trigger>
      <Dialog.Overlay />
      <Dialog.Content>
        <Dialog.Title>Confirmar ação</Dialog.Title>
        <Dialog.Description>
          Tem certeza que deseja continuar? Esta ação não pode ser desfeita.
        </Dialog.Description>
        <Flex justifyContent="flex-end" gap="small" marginTop="small">
          <Dialog.Close>
            <TriggerButton>Cancelar</TriggerButton>
          </Dialog.Close>
          <PrimaryButton onClick={fn()}>Continuar</PrimaryButton>
        </Flex>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog>
  ),
};

export const Anatomia: Story = {
  name: 'Anatomia (Trigger → Overlay → Content → Title/Description/Close)',
  render: () => (
    <Flex flexDirection="column" gap="medium" alignItems="flex-start">
      <Text as="p" variant="overline" color="text.secondary">
        Compound completo
      </Text>
      <Dialog defaultOpen>
        <Dialog.Trigger asChild>
          <TriggerButton>Trigger</TriggerButton>
        </Dialog.Trigger>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>Description sustenta o aria-describedby.</Dialog.Description>
          <Text as="p" variant="bodySmall" color="text.secondary">
            Slot livre para conteúdo arbitrário (form, lista, ilustração).
          </Text>
          <Flex justifyContent="flex-end" gap="small" marginTop="small">
            <Dialog.Close>
              <TriggerButton>Action</TriggerButton>
            </Dialog.Close>
          </Flex>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog>
    </Flex>
  ),
};

export const Sizes: Story = {
  name: 'Tamanhos (small / medium / large)',
  render: () => (
    <Flex gap="medium" flexWrap="wrap">
      {(['small', 'medium', 'large'] as const).map((size) => (
        <Dialog key={size}>
          <Dialog.Trigger asChild>
            <TriggerButton>size=&quot;{size}&quot;</TriggerButton>
          </Dialog.Trigger>
          <Dialog.Overlay />
          <Dialog.Content size={size}>
            <Dialog.Title>Dialog {size}</Dialog.Title>
            <Dialog.Description>
              MaxWidth e padding mapeados em `dialog.size.{size}.*` — themables.
            </Dialog.Description>
            <Dialog.Close />
          </Dialog.Content>
        </Dialog>
      ))}
    </Flex>
  ),
};

export const WithDescription: Story = {
  name: 'Title + Description (a11y completo)',
  parameters: {
    docs: {
      description: {
        story:
          '`Dialog.Title` popula `aria-labelledby`; `Dialog.Description` popula `aria-describedby` automaticamente. Tipografia controlada por `dialog.title.typography.*` e `dialog.description.typography.*`.',
      },
    },
  },
  render: () => (
    <Dialog defaultOpen>
      <Dialog.Overlay />
      <Dialog.Content>
        <Dialog.Title>Atualizar perfil</Dialog.Title>
        <Dialog.Description>
          As alterações ficam visíveis para qualquer pessoa que acesse seu perfil público.
        </Dialog.Description>
        <Flex justifyContent="flex-end" gap="small" marginTop="medium">
          <Dialog.Close>
            <TriggerButton>Cancelar</TriggerButton>
          </Dialog.Close>
          <PrimaryButton onClick={fn()}>Salvar</PrimaryButton>
        </Flex>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog>
  ),
};

export const DestructiveAction: Story = {
  name: 'Ação destrutiva (confirmação)',
  parameters: {
    docs: {
      description: {
        story:
          'Pattern canônico para confirmação de ação irreversível — Title descreve, Description detalha consequência, ação primária usa cor `feedback.critical.solid`.',
      },
    },
  },
  render: () => (
    <Dialog>
      <Dialog.Trigger asChild>
        <DangerButton>
          <Flex gap="micro" alignItems="center">
            <Icon name="Trash2" size="small" />
            <Text as="span" variant="bodyMedium">
              Excluir conta
            </Text>
          </Flex>
        </DangerButton>
      </Dialog.Trigger>
      <Dialog.Overlay />
      <Dialog.Content size="small">
        <Dialog.Title>Excluir conta permanentemente?</Dialog.Title>
        <Dialog.Description>
          Todos os seus dados, projetos e histórico serão removidos imediatamente. Esta ação não pode ser desfeita.
        </Dialog.Description>
        <Flex justifyContent="flex-end" gap="small" marginTop="medium">
          <Dialog.Close>
            <TriggerButton>Cancelar</TriggerButton>
          </Dialog.Close>
          <DangerButton onClick={fn()}>Sim, excluir</DangerButton>
        </Flex>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog>
  ),
};

export const Controlled: Story = {
  name: 'Controlado externamente',
  parameters: {
    docs: {
      description: {
        story:
          'Dialog controlado via `open`/`onOpenChange`. Controles externos devem ser **direcionais** (Abrir/Fechar separados) — toggle entra em conflito com `DismissableLayer` em alguns casos.',
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
              <TriggerButton onClick={() => setOpen(false)}>Fechar via estado externo</TriggerButton>
            ) : (
              <TriggerButton onClick={() => setOpen(true)}>Abrir via estado externo</TriggerButton>
            )}
          </Flex>
          <Dialog open={open} onOpenChange={setOpen}>
            <Dialog.Overlay />
            <Dialog.Content>
              <Dialog.Title>Dialog controlado</Dialog.Title>
              <Dialog.Description>
                Aberto via prop `open`. `onOpenChange` é o único caminho de sincronização (Escape, clique no overlay, Close).
              </Dialog.Description>
              <Dialog.Close />
            </Dialog.Content>
          </Dialog>
        </Flex>
      );
    }
    return <ControlledDemo />;
  },
};

export const KeyboardNavigation: Story = {
  name: 'Navegação por teclado (WAI-ARIA APG)',
  parameters: {
    docs: {
      description: {
        story:
          'Dialog modal segue o pattern [WAI-ARIA APG Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Tab/Shift+Tab circulam **apenas** dentro do dialog (foco trapado); Escape fecha e devolve foco ao trigger.',
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
          ['Enter / Space', 'Abre o dialog'],
          ['Tab / Shift+Tab', 'Circula foco dentro (trap)'],
          ['Esc', 'Fecha e devolve foco ao trigger'],
          ['Click no overlay', 'Fecha'],
          ['Click no Close (X)', 'Fecha'],
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

      <Dialog>
        <Dialog.Trigger asChild>
          <TriggerButton>Teste aqui</TriggerButton>
        </Dialog.Trigger>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Teste de navegação</Dialog.Title>
          <Dialog.Description>Use Tab para circular entre os botões; Esc para fechar.</Dialog.Description>
          <Flex justifyContent="flex-end" gap="small" marginTop="medium">
            <Dialog.Close>
              <TriggerButton>Botão 1</TriggerButton>
            </Dialog.Close>
            <Dialog.Close>
              <TriggerButton>Botão 2</TriggerButton>
            </Dialog.Close>
            <PrimaryButton onClick={fn()}>Confirmar</PrimaryButton>
          </Flex>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog>
    </Flex>
  ),
};

export const ThemingDensity: Story = {
  name: 'Theming — Densidade (compact / comfortable / spacious)',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Padding e gap internos são themables via `dialog.size.{size}.padding` + `dialog.gap`. Aninhe `<ArborProvider theme={...}>` para aplicar densidade em escopo limitado.',
      },
    },
  },
  render: () => {
    const compact = createTheme(themeLight, {
      components: {
        dialog: {
          gap: 'nano',
          size: {
            small: { maxWidth: 'dialog.small', padding: 'small' },
            medium: { maxWidth: 'dialog.medium', padding: 'small' },
            large: { maxWidth: 'dialog.large', padding: 'small' },
          },
        },
      },
    });

    const spacious = createTheme(themeLight, {
      components: {
        dialog: {
          gap: 'medium',
          size: {
            small: { maxWidth: 'dialog.small', padding: 'large' },
            medium: { maxWidth: 'dialog.medium', padding: 'xlarge' },
            large: { maxWidth: 'dialog.large', padding: 'xlarge' },
          },
        },
      },
    });

    const def = createTheme(themeLight, {});

    function Sample({ label, theme }: { label: string; theme: typeof themeLight }) {
      return (
        <ArborProvider theme={theme}>
          <Flex flexDirection="column" gap="small" alignItems="flex-start" minWidth="220px">
            <Text as="span" variant="overline" color="text.secondary">
              {label}
            </Text>
            <Dialog defaultOpen>
              <Dialog.Overlay />
              <Dialog.Content>
                <Dialog.Title>Densidade {label}</Dialog.Title>
                <Dialog.Description>Padding e gap propagam pelo tema.</Dialog.Description>
                <Dialog.Close />
              </Dialog.Content>
            </Dialog>
            <TriggerButton>Sample</TriggerButton>
          </Flex>
        </ArborProvider>
      );
    }

    return (
      <Box padding="xlarge">
        <Flex gap="xlarge" alignItems="flex-start" flexWrap="wrap">
          <Sample label="compact" theme={compact} />
          <Sample label="comfortable" theme={def} />
          <Sample label="spacious" theme={spacious} />
        </Flex>
      </Box>
    );
  },
};

export const Theming: Story = {
  name: 'Theming via createTheme (cores + sombra + radius)',
  parameters: {
    docs: {
      description: {
        story:
          'Override completo do `dialog` via `createTheme({ components: { dialog: {...} } })`. Cores, sombra, borderRadius, padding e tipografia de Title/Description são themables.',
      },
    },
  },
  render: () => {
    const custom = createTheme(themeLight, {
      components: {
        dialog: {
          borderRadius: 'xlarge',
          shadow: 'lg',
          gap: 'medium',
          colors: {
            background: 'brand.bgSubtle',
            border: 'brand.border',
            overlay: 'background.overlay',
            title: 'brand.text',
            description: 'text.secondary',
          },
          title: {
            typography: {
              fontSize: 'xlarge',
              fontWeight: 'bold',
              lineHeight: 'large',
              letterSpacing: 'tight',
            },
          },
        },
      },
    });

    return (
      <ArborProvider theme={custom}>
        <Dialog defaultOpen>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Title>Tema customizado</Dialog.Title>
            <Dialog.Description>
              Background, borda, título e radius vêm do tema do produto.
            </Dialog.Description>
            <Dialog.Close />
          </Dialog.Content>
        </Dialog>
      </ArborProvider>
    );
  },
};

export const UnsavedGuard: Story = {
  name: 'Guarda de alterações não salvas (onInteractOutside / onEscapeKeyDown)',
  parameters: {
    docs: {
      description: {
        story:
          'Pattern para form com mudanças não salvas: `onInteractOutside` e `onEscapeKeyDown` recebem o evento; `event.preventDefault()` impede o fechamento. Esc e clique fora ficam interceptados enquanto `dirty=true`; X e botão Cancelar continuam fechando normalmente.',
      },
    },
  },
  render: () => {
    function UnsavedDemo() {
      const [open, setOpen] = useState(false);
      const [dirty, setDirty] = useState(false);
      const [blocked, setBlocked] = useState(0);

      const guard = (e: { preventDefault: () => void }) => {
        if (!dirty) return;
        e.preventDefault();
        setBlocked((c) => c + 1);
      };

      const openForm = () => {
        setBlocked(0);
        setOpen(true);
      };

      return (
        <Flex flexDirection="column" gap="medium" alignItems="flex-start">
          <Text as="p" variant="bodySmall" color="text.secondary">
            Estado externo: dirty=
            <Text as="span" variant="bodySmall" fontWeight="semibold">{String(dirty)}</Text>
          </Text>
          <TriggerButton onClick={openForm}>Abrir form</TriggerButton>
          <Dialog
            open={open}
            onOpenChange={setOpen}
            onInteractOutside={guard}
            onEscapeKeyDown={guard}
          >
            <Dialog.Overlay />
            <Dialog.Content>
              <Dialog.Title>Editar perfil</Dialog.Title>
              <Dialog.Description>
                Marque o checkbox abaixo para simular form com alterações não salvas. Com `dirty=true`,
                Esc e clique fora ficam bloqueados.
              </Dialog.Description>
              <Flex marginTop="small">
                <Checkbox
                  checked={dirty}
                  onCheckedChange={setDirty}
                  label="Tenho alterações não salvas"
                />
              </Flex>
              {blocked > 0 && (
                <Box
                  paddingX="small"
                  paddingY="micro"
                  borderRadius="small"
                  backgroundColor="feedback.warning.bgSubtle"
                  marginTop="small"
                >
                  <Text as="span" variant="bodySmall" color="feedback.warning.text">
                    Tentativas de fechar bloqueadas: {blocked} — use "Descartar" ou "Salvar".
                  </Text>
                </Box>
              )}
              <Flex justifyContent="flex-end" gap="small" marginTop="medium">
                <Dialog.Close>
                  <TriggerButton onClick={() => setDirty(false)}>Descartar</TriggerButton>
                </Dialog.Close>
                <PrimaryButton onClick={() => { setDirty(false); setOpen(false); }}>Salvar</PrimaryButton>
              </Flex>
              {/* X intencionalmente omitido — incompatível com a semântica
                  "guarda de alterações". As saídas legítimas aqui são
                  Descartar e Salvar. */}
            </Dialog.Content>
          </Dialog>
        </Flex>
      );
    }
    return <UnsavedDemo />;
  },
};

export const NonDismissible: Story = {
  name: 'Não-dispensável (wizard / fluxo crítico)',
  parameters: {
    docs: {
      description: {
        story:
          '`closeOnOverlayClick={false}` + `closeOnEscape={false}` para fluxos onde o usuário precisa concluir uma ação antes de sair. A única saída é via ação explícita do consumer (botão "Concluir"/"Pular").',
      },
    },
  },
  render: () => {
    function NonDismissibleDemo() {
      const [open, setOpen] = useState(false);
      const [blocked, setBlocked] = useState(0);

      const guard = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setBlocked((c) => c + 1);
      };

      const openWizard = () => {
        setBlocked(0);
        setOpen(true);
      };

      return (
        <Flex flexDirection="column" gap="medium" alignItems="flex-start">
          <TriggerButton onClick={openWizard}>Iniciar wizard</TriggerButton>
          <Dialog
            open={open}
            onOpenChange={setOpen}
            closeOnOverlayClick={false}
            closeOnEscape={false}
            onInteractOutside={guard}
            onEscapeKeyDown={guard}
          >
            <Dialog.Overlay />
            <Dialog.Content>
              <Dialog.Title>Etapa 1 de 3</Dialog.Title>
              <Dialog.Description>
                Esc e clique fora estão desabilitados — só fecha via botão explícito abaixo.
                Experimente apertar Esc ou clicar fora.
              </Dialog.Description>
              {blocked > 0 && (
                <Box
                  paddingX="small"
                  paddingY="micro"
                  borderRadius="small"
                  backgroundColor="feedback.info.bgSubtle"
                  marginTop="small"
                >
                  <Text as="span" variant="bodySmall" color="feedback.info.text">
                    Tentativas de fechar bloqueadas: {blocked} — use "Pular wizard" ou "Avançar".
                  </Text>
                </Box>
              )}
              <Flex justifyContent="flex-end" gap="small" marginTop="medium">
                <TriggerButton onClick={() => setOpen(false)}>Pular wizard</TriggerButton>
                <PrimaryButton onClick={() => setOpen(false)}>Avançar</PrimaryButton>
              </Flex>
            </Dialog.Content>
          </Dialog>
        </Flex>
      );
    }
    return <NonDismissibleDemo />;
  },
};

export const AdvancedCompound: Story = {
  name: 'API compound — controle granular',
  parameters: {
    docs: {
      description: {
        story:
          'Use `<Dialog.Root>` (alias retrocompatível de `<Dialog>`) quando precisar de `open` controlado externamente ou anatomia rica (header customizado, sidebar interna etc.).',
      },
    },
  },
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <TriggerButton>Compound API</TriggerButton>
      </Dialog.Trigger>
      <Dialog.Overlay />
      <Dialog.Content size="large">
        <Dialog.Title>Anatomia rica</Dialog.Title>
        <Dialog.Description>
          Slot livre permite header customizado, lista de items, formulário, etc.
        </Dialog.Description>
        <Box
          marginTop="small"
          padding="medium"
          borderRadius="medium"
          backgroundColor="background.subtle"
        >
          <Text as="p" variant="bodySmall" color="text.secondary">
            Área para conteúdo customizado.
          </Text>
        </Box>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  ),
};
