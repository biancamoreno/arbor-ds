import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Drawer } from './drawer';
import { Box, Clickable, Flex, Icon, Text } from '../../core';
import { Checkbox } from '../../checkbox';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';

const meta = {
  title: 'Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj;

/** Trigger outlined padronizado (idioma Menu/Popover/Dialog). */
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

// ── PCV-33: API plana (RFC-0043) é o caminho default ─────────────────────

export const Default: Story = {
  name: 'API plana (RFC-0043 — recomendado)',
  parameters: {
    docs: {
      description: {
        story:
          'Caso default sob RFC-0043: top-level aceita `title`/`description`/`footer`/`trigger`. O componente monta Header (Title+Description) + Body (children) + Footer automaticamente. Para layouts não-triviais, recorra ao compound (`Drawer.Root`).',
      },
    },
  },
  render: () => (
    <Drawer
      trigger={<TriggerButton>Abrir filtros</TriggerButton>}
      title="Filtros"
      description="Refine os resultados da busca."
      footer={
        <>
          <Drawer.Close>
            <TriggerButton>Limpar</TriggerButton>
          </Drawer.Close>
          <PrimaryButton onClick={fn()}>Aplicar</PrimaryButton>
        </>
      }
    >
      <Flex flexDirection="column" gap="small">
        <Text as="p" variant="bodySmall" color="text.secondary">
          Body livre via children — forms, listas, navegação.
        </Text>
        <Checkbox label="Em estoque" />
        <Checkbox label="Promoção" />
        <Checkbox label="Frete grátis" />
      </Flex>
    </Drawer>
  ),
};

export const Anatomia: Story = {
  name: 'Anatomia (Header/Body/Footer)',
  render: () => (
    <Flex flexDirection="column" gap="medium" alignItems="flex-start">
      <Text as="p" variant="overline" color="text.secondary">
        Anatomia plana
      </Text>
      <Drawer
        defaultOpen
        title="Title"
        description="Description sustenta o aria-describedby."
        footer={
          <>
            <Drawer.Close>
              <TriggerButton>Cancelar</TriggerButton>
            </Drawer.Close>
            <PrimaryButton onClick={fn()}>Confirmar</PrimaryButton>
          </>
        }
      >
        <Text as="p" variant="bodySmall" color="text.secondary">
          Slot livre para conteúdo arbitrário — preenche o Body entre Header e Footer.
        </Text>
      </Drawer>
    </Flex>
  ),
};

export const Placements: Story = {
  name: 'Placements (left / right / top / bottom)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Box padding="xlarge">
      <Flex gap="medium" flexWrap="wrap">
        {(['left', 'right', 'top', 'bottom'] as const).map((placement) => (
          <Drawer
            key={placement}
            placement={placement}
            trigger={<TriggerButton>placement=&quot;{placement}&quot;</TriggerButton>}
            title={`Drawer ${placement}`}
            description={`Slide-in a partir da borda ${placement}.`}
            footer={
              <Drawer.Close>
                <TriggerButton>Fechar</TriggerButton>
              </Drawer.Close>
            }
          />
        ))}
      </Flex>
    </Box>
  ),
};

export const Sizes: Story = {
  name: 'Tamanhos (small / medium / large)',
  render: () => (
    <Flex gap="medium" flexWrap="wrap">
      {(['small', 'medium', 'large'] as const).map((size) => (
        <Drawer
          key={size}
          size={size}
          trigger={<TriggerButton>size=&quot;{size}&quot;</TriggerButton>}
          title={`Drawer ${size}`}
          description="Largura controlada por `drawer.size.{size}.width` — themable."
          footer={
            <Drawer.Close>
              <TriggerButton>Fechar</TriggerButton>
            </Drawer.Close>
          }
        />
      ))}
    </Flex>
  ),
};

export const AlertDrawer: Story = {
  name: "role='alertdialog' (confirmação destrutiva)",
  parameters: {
    docs: {
      description: {
        story:
          '`role="alertdialog"` ajusta a semântica WAI-ARIA: screen readers anunciam assertivamente. Em native mapeia para `accessibilityRole="alert"`. Combine com `closeOnOverlayClick={false}` para forçar decisão explícita.',
      },
    },
  },
  render: () => (
    <Drawer
      role="alertdialog"
      placement="bottom"
      closeOnOverlayClick={false}
      size="small"
      trigger={
        <DangerButton>
          <Flex gap="micro" alignItems="center">
            <Icon name="Trash2" size="small" />
            <Text as="span" variant="bodyMedium">Excluir item</Text>
          </Flex>
        </DangerButton>
      }
      title="Excluir este item?"
      description="A ação não pode ser desfeita."
      footer={
        <>
          <Drawer.Close>
            <TriggerButton>Cancelar</TriggerButton>
          </Drawer.Close>
          <DangerButton onClick={fn()}>Sim, excluir</DangerButton>
        </>
      }
    />
  ),
};

export const Controlled: Story = {
  name: 'Controlado externamente',
  parameters: {
    docs: {
      description: {
        story:
          'Drawer controlado via `open`/`onOpenChange`. Controles externos devem ser direcionais (Abrir/Fechar separados) para evitar conflito com `DismissableLayer`.',
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
              <TriggerButton onClick={() => setOpen(false)}>Fechar via estado</TriggerButton>
            ) : (
              <TriggerButton onClick={() => setOpen(true)}>Abrir via estado</TriggerButton>
            )}
          </Flex>
          <Drawer
            open={open}
            onOpenChange={setOpen}
            title="Drawer controlado"
            description="Aberto via prop `open`. `onOpenChange` é o único caminho de sincronização."
            footer={
              <PrimaryButton onClick={() => setOpen(false)}>Confirmar</PrimaryButton>
            }
          />
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
          'Drawer modal segue o pattern [WAI-ARIA APG Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Tab/Shift+Tab circulam apenas dentro (foco trapado); Escape fecha e devolve foco ao trigger.',
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
          ['Enter / Space', 'Abre o drawer'],
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

      <Drawer
        trigger={<TriggerButton>Teste aqui</TriggerButton>}
        title="Teste de navegação"
        description="Use Tab para circular entre os botões; Esc para fechar."
        footer={
          <>
            <Drawer.Close>
              <TriggerButton>Botão 1</TriggerButton>
            </Drawer.Close>
            <Drawer.Close>
              <TriggerButton>Botão 2</TriggerButton>
            </Drawer.Close>
            <PrimaryButton onClick={fn()}>Confirmar</PrimaryButton>
          </>
        }
      />
    </Flex>
  ),
};

export const InitialFocus: Story = {
  name: 'initialFocusRef — foco inicial customizado',
  parameters: {
    docs: {
      description: {
        story:
          'Por default o foco vai para o primeiro tabável. Use `initialFocusRef` para apontar para o campo principal do drawer (ex.: busca em listas, primeiro campo em forms).',
      },
    },
  },
  render: () => {
    function FocusDemo() {
      const searchRef = React.useRef<HTMLInputElement>(null);
      const [open, setOpen] = useState(false);

      return (
        <Drawer
          open={open}
          onOpenChange={setOpen}
          initialFocusRef={searchRef}
          placement="left"
          trigger={<TriggerButton>Buscar</TriggerButton>}
          title="Busca rápida"
          description="O campo de busca recebe foco automaticamente ao abrir."
          footer={
            <PrimaryButton onClick={() => setOpen(false)}>Fechar</PrimaryButton>
          }
        >
          <Flex flexDirection="column" gap="small">
            <Text as="label" variant="bodySmall" color="text.secondary">
              Digite para buscar
            </Text>
            <Box
              as="input"
              ref={searchRef as React.Ref<HTMLInputElement>}
              type="text"
              placeholder="ex.: documentos"
              paddingX="small"
              paddingY="micro"
              borderRadius="small"
              borderWidth="hairline"
              borderStyle="solid"
              borderColor="border.default"
            />
          </Flex>
        </Drawer>
      );
    }
    return <FocusDemo />;
  },
};

export const UnsavedGuard: Story = {
  name: 'Guarda de alterações (onInteractOutside / onEscapeKeyDown)',
  parameters: {
    docs: {
      description: {
        story:
          'Pattern para form com mudanças não salvas: `onInteractOutside` e `onEscapeKeyDown` recebem evento; `preventDefault()` impede o fechamento. Esc e clique fora bloqueados enquanto `dirty=true`; botões explícitos continuam fechando.',
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
          <Drawer
            open={open}
            onOpenChange={setOpen}
            onInteractOutside={guard}
            onEscapeKeyDown={guard}
            title="Editar perfil"
            description="Marque o checkbox para simular form com alterações não salvas."
            footer={
              <>
                <Drawer.Close>
                  <TriggerButton onClick={() => setDirty(false)}>Descartar</TriggerButton>
                </Drawer.Close>
                <PrimaryButton onClick={() => { setDirty(false); setOpen(false); }}>Salvar</PrimaryButton>
              </>
            }
          >
            <Flex flexDirection="column" gap="small">
              <Checkbox
                checked={dirty}
                onCheckedChange={setDirty}
                label="Tenho alterações não salvas"
              />
              {blocked > 0 && (
                <Box
                  paddingX="small"
                  paddingY="micro"
                  borderRadius="small"
                  backgroundColor="feedback.warning.bgSubtle"
                >
                  <Text as="span" variant="bodySmall" color="feedback.warning.text">
                    Tentativas bloqueadas: {blocked} — use Descartar ou Salvar.
                  </Text>
                </Box>
              )}
            </Flex>
          </Drawer>
        </Flex>
      );
    }
    return <UnsavedDemo />;
  },
};

export const InsideOverflowClip: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Box padding="large">
      <Text as="p" color="text.secondary" marginBottom="medium">
        O container abaixo tem <Text as="code">overflow: hidden</Text>; o Drawer renderiza via Portal em <Text as="code">document.body</Text> e escapa do clip.
      </Text>
      <Box
        width="220px"
        height="100px"
        overflow="hidden"
        borderWidth="hairline"
        borderStyle="dashed"
        borderColor="border.subtle"
        borderRadius="medium"
        padding="medium"
      >
        <Drawer
          trigger={<TriggerButton>Abrir</TriggerButton>}
          title="Drawer escapa do clip"
          description="Renderizado via Portal em document.body."
          footer={
            <Drawer.Close>
              <TriggerButton>Fechar</TriggerButton>
            </Drawer.Close>
          }
        />
      </Box>
    </Box>
  ),
};

// ── Theming ───────────────────────────────────────────────────────────────

export const ThemingDensity: Story = {
  name: 'Theming — Densidade (compact / comfortable / spacious)',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Padding e gap internos são themables via `drawer.size.{size}.padding` + `drawer.gap`. Aninhe `<ArborProvider theme={...}>` para aplicar densidade em escopo limitado.',
      },
    },
  },
  render: () => {
    const compact = createTheme(themeLight, {
      components: {
        drawer: {
          gap: 'nano',
          size: {
            small: { width: 'drawer.width.small', height: 'drawer.height.small', padding: 'small' },
            medium: { width: 'drawer.width.medium', height: 'drawer.height.medium', padding: 'small' },
            large: { width: 'drawer.width.large', height: 'drawer.height.large', padding: 'small' },
          },
        },
      },
    });

    const spacious = createTheme(themeLight, {
      components: {
        drawer: {
          gap: 'medium',
          size: {
            small: { width: 'drawer.width.small', height: 'drawer.height.small', padding: 'large' },
            medium: { width: 'drawer.width.medium', height: 'drawer.height.medium', padding: 'xlarge' },
            large: { width: 'drawer.width.large', height: 'drawer.height.large', padding: 'xlarge' },
          },
        },
      },
    });

    const def = createTheme(themeLight, {});

    function Sample({ label, theme: t }: { label: string; theme: typeof themeLight }) {
      return (
        <ArborProvider theme={t}>
          <Flex flexDirection="column" gap="small" alignItems="flex-start" minWidth="220px">
            <Text as="span" variant="overline" color="text.secondary">
              {label}
            </Text>
            <Drawer
              defaultOpen
              title={`Densidade ${label}`}
              description="Padding e gap propagam pelo tema."
            />
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
  name: 'Theming via createTheme (cores + radius + tipografia)',
  parameters: {
    docs: {
      description: {
        story:
          'Override completo via `createTheme({ components: { drawer: {...} } })`. Cores, borderRadius (cantos arredondados para "lifted drawer"), padding e tipografia são themables.',
      },
    },
  },
  render: () => {
    const custom = createTheme(themeLight, {
      components: {
        drawer: {
          borderRadius: 'large',
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
        <Drawer
          defaultOpen
          title="Tema customizado"
          description="Background, borda, título e radius vêm do tema do produto."
          footer={
            <PrimaryButton onClick={fn()}>Aplicar</PrimaryButton>
          }
        />
      </ArborProvider>
    );
  },
};

// ── Compound (avançado) ───────────────────────────────────────────────────

export const AdvancedCompound: Story = {
  name: 'API compound — controle granular (Header/Body/Footer)',
  parameters: {
    docs: {
      description: {
        story:
          'Use `<Drawer.Root>` quando precisar de anatomia rica ou ordem semântica custom. Os slots `<Drawer.Header>`/`<Drawer.Body>`/`<Drawer.Footer>` mapeiam para o mesmo recipe consumido pela API plana — visual paritário, controle total.',
      },
    },
  },
  render: () => (
    <Drawer.Root placement="left">
      <Drawer.Trigger asChild>
        <TriggerButton>Compound API</TriggerButton>
      </Drawer.Trigger>
      <Drawer.Overlay />
      <Drawer.Content size="large">
        <Drawer.Header>
          <Drawer.Title>Anatomia rica</Drawer.Title>
          <Drawer.Description>
            Header agrupa Title + Description; Body recebe markup livre; Footer alinha ações à direita.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <Box padding="medium" borderRadius="medium" backgroundColor="background.subtle">
            <Text as="p" variant="bodySmall" color="text.secondary">
              Área para conteúdo customizado (navegação, form, listas).
            </Text>
          </Box>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>
            <TriggerButton>Cancelar</TriggerButton>
          </Drawer.Close>
          <PrimaryButton onClick={fn()}>Salvar</PrimaryButton>
        </Drawer.Footer>
        <Drawer.Close />
      </Drawer.Content>
    </Drawer.Root>
  ),
};
