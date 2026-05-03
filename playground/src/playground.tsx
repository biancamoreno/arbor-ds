import React from 'react';
import { createTheme, themeDark, themeLight } from '../../src/foundations';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Counter,
  Dialog,
  Drawer,
  Flex,
  Grid,
  Radio,
  SearchInput,
  Select,
  Tabs,
  Text,
  TextArea,
  TextInput,
  Tooltip,
} from '../../src/components';
import { ArborProvider, ArborTransform, useTheme } from '../../src/ecosystem/styled-system';
import './playground.css';

type ThemePresetId = 'light' | 'spruce' | 'dark';

const spruceTheme = createTheme(themeLight, {
  colors: {
    background: {
      contrast: '#eef4ef',
      subtle: '#f7faf8',
      interactive: '#e4eee7',
    },
    surface: {
      highlight: '#f1f7f3',
    },
    border: {
      interactive: '#2f775f',
    },
    interactive: {
      default: '#2f775f',
      hover: '#255f4c',
      active: '#1b4638',
    },
    brand: {
      subtle: '#dceee4',
      soft: '#8bc2a9',
      base: '#2f775f',
      strong: '#1f5543',
    },
  },
});

const themePresets = {
  light: themeLight,
  spruce: spruceTheme,
  dark: themeDark,
} as const;

const themeMeta = {
  light: {
    label: 'Light',
    note: 'Tema base sem override.',
  },
  spruce: {
    label: 'Spruce',
    note: 'Override via createTheme para demonstrar branding.',
  },
  dark: {
    label: 'Dark',
    note: 'Variante escura do sistema.',
  },
} satisfies Record<ThemePresetId, { label: string; note: string }>;

const colorFamilies = [
  {
    title: 'Background',
    items: [
      { name: 'default', path: 'colors.background.default' },
      { name: 'contrast', path: 'colors.background.contrast' },
      { name: 'subtle', path: 'colors.background.subtle' },
    ],
  },
  {
    title: 'Surface',
    items: [
      { name: 'default', path: 'colors.surface.default' },
      { name: 'highlight', path: 'colors.surface.highlight' },
      { name: 'raised', path: 'colors.surface.raised' },
    ],
  },
  {
    title: 'Brand',
    items: [
      { name: 'subtle', path: 'colors.brand.subtle' },
      { name: 'base', path: 'colors.brand.base' },
      { name: 'strong', path: 'colors.brand.strong' },
    ],
  },
  {
    title: 'Feedback',
    items: [
      { name: 'success', path: 'colors.feedback.success.base' },
      { name: 'warning', path: 'colors.feedback.warning.base' },
      { name: 'critical', path: 'colors.feedback.critical.base' },
    ],
  },
];

const codeSample = `import { ArborProvider } from 'arbor-ds/ecosystem';
import { createTheme, themeLight } from 'arbor-ds/foundations';
import { Box, Button, Text } from 'arbor-ds/components';

const theme = createTheme(themeLight, {
  colors: { brand: { base: '#2F775F' } },
});

export function Demo() {
  return (
    <ArborProvider theme={theme}>
      <Box padding="large" borderRadius="large" backgroundColor="surface.raised">
        <Text as="h1" variant="title1">Arbor DS</Text>
        <Button>Render with tokens</Button>
      </Box>
    </ArborProvider>
  );
}`;

function getValueByPath(source: Record<string, unknown>, path: string) {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }

    return undefined;
  }, source);
}

function OverviewSection({
  activeTheme,
  onOpenDialog,
  onOpenDrawer,
}: {
  activeTheme: ThemePresetId;
  onOpenDialog: () => void;
  onOpenDrawer: () => void;
}) {
  const theme = useTheme();

  return (
    <div className="playground-stack">
      <section className="playground-hero">
        <div className="playground-panel playground-panel-hero">
          <div className="playground-hero-copy">
            <Badge tone="brand">Arbor DS Playground</Badge>
            <Text as="h1" variant="title1" style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)', lineHeight: 0.98 }}>
              Foundations, styled system and component primitives.
            </Text>
            <Text
              as="p"
              variant="body"
              style={{
                color: theme.colors.text.secondary,
                maxWidth: '62ch',
                lineHeight: 1.7,
              }}
            >
              O playground agora demonstra o Arbor como design system: tema, tokens, ArborTransform e componentes base.
              A superficie publica ficou restrita a elementos realmente reutilizaveis do sistema.
            </Text>
            <div className="playground-actions">
              <Button onClick={onOpenDialog}>Abrir dialog</Button>
              <Button variant="secondary" onClick={onOpenDrawer}>
                Abrir drawer
              </Button>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <span className="playground-inline-chip">{themeMeta[activeTheme].label}</span>
                </Tooltip.Trigger>
                <Tooltip.Content>Theme ativo no provider</Tooltip.Content>
              </Tooltip.Root>
            </div>
          </div>

          <div className="playground-hero-rail">
            <article className="playground-gradient-card">
              <span>Current theme</span>
              <strong>{themeMeta[activeTheme].label}</strong>
              <p>{themeMeta[activeTheme].note}</p>
            </article>

            <article className="playground-mini-grid">
              <div>
                <strong>Foundations</strong>
                <p>Tokens, breakpoints, typography, radii and semantic colors.</p>
              </div>
              <div>
                <strong>Styled system</strong>
                <p>ArborProvider, ArborTransform, hooks and responsive style props.</p>
              </div>
              <div>
                <strong>Components</strong>
                <p>Core layout primitives, inputs, feedback and overlays.</p>
              </div>
            </article>
          </div>
        </div>

        <div className="playground-hero-aside">
          <div className="playground-panel playground-kpi-grid">
            <article>
              <span>3 camadas</span>
              <strong>Foundations + ecosystem + components</strong>
            </article>
            <article>
              <span>1 engine</span>
              <strong>ArborTransform tipado sobre tokens</strong>
            </article>
            <article>
              <span>0 dominio</span>
              <strong>Sem fluxos ou componentes ligados a um produto especifico</strong>
            </article>
          </div>

          <div className="playground-panel">
            <Text as="h2" variant="title2">
              ArborTransform em uso
            </Text>
            <ArborTransform
              as="div"
              padding="large"
              borderRadius="large"
              borderWidth="hairline"
              borderStyle="solid"
              borderColor="border.subtle"
              backgroundColor="surface.raised"
              display="flex"
              flexDirection="column"
              gap="small"
            >
              <Badge tone="success">Token-driven</Badge>
              <Text as="p" variant="body">
                Este bloco usa props do styled system com tokens semanticos do tema atual.
              </Text>
              <Text as="span" variant="caption" style={{ color: theme.colors.text.secondary }}>
                padding=&quot;large&quot; borderColor=&quot;border.subtle&quot;
              </Text>
            </ArborTransform>
          </div>
        </div>
      </section>

      <section className="playground-panel">
        <div className="playground-section-head">
          <Text as="h2" variant="title2">
            Arquitetura publica
          </Text>
          <Text as="p" variant="body" style={{ color: theme.colors.text.secondary }}>
            O pacote ficou restrito ao que e reaproveitavel em qualquer produto.
          </Text>
        </div>

        <Grid className="playground-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {[
            {
              title: 'Foundations',
              body: 'Tema, tokens primitivos e semanticos, escalas de espaco, tipografia e z-index.',
            },
            {
              title: 'Ecosystem',
              body: 'Provider, hooks, ArborTransform, utilitarios e engine do styled system.',
            },
            {
              title: 'Components',
              body: 'Blocos base para layout, entrada de dados, feedback, navegacao e overlays.',
            },
          ].map((item) => (
            <article key={item.title} className="playground-surface-card">
              <Text as="h3" variant="title2">
                {item.title}
              </Text>
              <Text as="p" variant="body" style={{ color: theme.colors.text.secondary }}>
                {item.body}
              </Text>
            </article>
          ))}
        </Grid>
      </section>

      <section className="playground-code-block">
        <pre>
          <code>{codeSample}</code>
        </pre>
      </section>
    </div>
  );
}

function FoundationsSection() {
  const theme = useTheme();

  return (
    <div className="playground-stack">
      <section className="playground-panel">
        <div className="playground-section-head">
          <Text as="h2" variant="title2">
            Semantic color tokens
          </Text>
          <Text as="p" variant="body" style={{ color: theme.colors.text.secondary }}>
            Amostras diretas do tema resolvido no provider.
          </Text>
        </div>

        <div className="playground-token-grid">
          {colorFamilies.map((family) => (
            <article key={family.title} className="playground-surface-card">
              <Text as="h3" variant="title2">
                {family.title}
              </Text>
              <div className="playground-swatch-list">
                {family.items.map((item) => {
                  const value = String(getValueByPath(theme as unknown as Record<string, unknown>, item.path));
                  return (
                    <div key={item.path} className="playground-swatch-row">
                      <span className="playground-swatch" style={{ backgroundColor: value }} />
                      <div>
                        <strong>{item.name}</strong>
                        <small>{value}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="playground-foundation-grid">
        <article className="playground-panel">
          <div className="playground-section-head">
            <Text as="h2" variant="title2">
              Typography scale
            </Text>
            <Text as="p" variant="body" style={{ color: theme.colors.text.secondary }}>
              Variantes expostas pelo componente Text.
            </Text>
          </div>

          <div className="playground-type-stack">
            <Text as="p" variant="title1">
              title1 / Arbor DS
            </Text>
            <Text as="p" variant="title2">
              title2 / Theme-driven interfaces
            </Text>
            <Text as="p" variant="body">
              body / Texto corrido para documentacao e UI copy.
            </Text>
            <Text as="p" variant="caption" style={{ color: theme.colors.text.secondary }}>
              caption / Supporting information and metadata.
            </Text>
            <Text as="span" variant="tag" style={{ color: theme.colors.brand.strong }}>
              tag / uppercase accent
            </Text>
          </div>
        </article>

        <article className="playground-panel">
          <div className="playground-section-head">
            <Text as="h2" variant="title2">
              Space and radii
            </Text>
            <Text as="p" variant="body" style={{ color: theme.colors.text.secondary }}>
              Escalas semanticas do tema base.
            </Text>
          </div>

          <div className="playground-scale-stack">
            {[
              { label: 'space.small', value: theme.space.small },
              { label: 'space.medium', value: theme.space.medium },
              { label: 'space.large', value: theme.space.large },
              { label: 'radii.small', value: theme.radii.small },
              { label: 'radii.medium', value: theme.radii.medium },
              { label: 'radii.large', value: theme.radii.large },
            ].map((item) => (
              <div key={item.label} className="playground-scale-row">
                <div>
                  <strong>{item.label}</strong>
                  <small>{String(item.value)}</small>
                </div>
                <span className="playground-scale-demo" style={{ width: String(item.value), borderRadius: String(item.value) }} />
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

function ComponentsSection({
  searchValue,
  setSearchValue,
  textValue,
  setTextValue,
  notesValue,
  setNotesValue,
  selectValue,
  setSelectValue,
  counterValue,
  setCounterValue,
  compactMode,
  setCompactMode,
  density,
  setDensity,
}: {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  textValue: string;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  notesValue: string;
  setNotesValue: React.Dispatch<React.SetStateAction<string>>;
  selectValue: string | number | undefined;
  setSelectValue: React.Dispatch<React.SetStateAction<string | number | undefined>>;
  counterValue: number;
  setCounterValue: React.Dispatch<React.SetStateAction<number>>;
  compactMode: boolean;
  setCompactMode: React.Dispatch<React.SetStateAction<boolean>>;
  density: 'comfortable' | 'compact';
  setDensity: React.Dispatch<React.SetStateAction<'comfortable' | 'compact'>>;
}) {
  const theme = useTheme();

  return (
    <div className="playground-stack">
      <section className="playground-foundation-grid">
        <article className="playground-panel">
          <div className="playground-section-head">
            <Text as="h2" variant="title2">
              Inputs
            </Text>
            <Text as="p" variant="body" style={{ color: theme.colors.text.secondary }}>
              Campos base para coleta e refinamento de entrada.
            </Text>
          </div>

          <div className="playground-form-grid">
            <SearchInput
              label="SearchInput"
              placeholder="Buscar token, componente ou hook"
              value={searchValue}
              onValueChange={setSearchValue}
              helperText="Pressione Enter para acionar onSearch."
            />
            <TextInput
              label="TextInput"
              placeholder="Nome do showcase"
              value={textValue}
              onValueChange={setTextValue}
              clearable
              helperText="Campo simples com helper text e acao de limpar."
            />
            <Select
              label="Select"
              value={selectValue}
              onChange={setSelectValue}
              options={[
                { value: 'web', label: 'Web' },
                { value: 'native', label: 'Native' },
                { value: 'shared', label: 'Shared' },
              ]}
              placeholder="Selecione a superficie"
            />
            <TextArea
              label="TextArea"
              value={notesValue}
              onValueChange={setNotesValue}
              rows={5}
              maxLength={180}
              showCharCount
              helperText="Descricao de uso ou observacao para a demonstracao."
            />
          </div>
        </article>

        <article className="playground-panel">
          <div className="playground-section-head">
            <Text as="h2" variant="title2">
              Selection and feedback
            </Text>
            <Text as="p" variant="body" style={{ color: theme.colors.text.secondary }}>
              Estados composaveis sobre o mesmo tema.
            </Text>
          </div>

          <div className="playground-stack">
            <Flex gap="small" flexWrap="wrap">
              <Badge tone="brand">brand</Badge>
              <Badge tone="success">success</Badge>
              <Badge tone="warning">warning</Badge>
              <Badge tone="critical">critical</Badge>
            </Flex>

            <Checkbox.Root checked={compactMode} onCheckedChange={setCompactMode}>
              <Checkbox.Indicator />
              <Flex flexDirection="column" gap="2px">
                <Checkbox.Label>Compact mode</Checkbox.Label>
                <Checkbox.Description>Exemplo de estado booleano para densidade de interface.</Checkbox.Description>
              </Flex>
            </Checkbox.Root>

            <Flex flexDirection="column" gap="small">
              <Radio.Root
                name="density"
                value="comfortable"
                checked={density === 'comfortable'}
                onCheckedChange={(checked) => checked && setDensity('comfortable')}
              >
                <Radio.Indicator />
                <Radio.Label>Comfortable</Radio.Label>
              </Radio.Root>
              <Radio.Root
                name="density"
                value="compact"
                checked={density === 'compact'}
                onCheckedChange={(checked) => checked && setDensity('compact')}
              >
                <Radio.Indicator />
                <Radio.Label>Compact</Radio.Label>
              </Radio.Root>
            </Flex>

            <Counter label="Density scale" value={counterValue} onValueChange={setCounterValue} min={1} max={8} />
          </div>
        </article>
      </section>

      <section className="playground-panel">
        <div className="playground-section-head">
          <Text as="h2" variant="title2">
            Core composition
          </Text>
          <Text as="p" variant="body" style={{ color: theme.colors.text.secondary }}>
            Exemplo simples combinando Container, Grid, Flex, Box e Text.
          </Text>
        </div>

        <Container>
          <Grid className="playground-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <Box className="playground-surface-card">
              <Text as="h3" variant="title2">
                Query
              </Text>
              <Text as="p" variant="body" style={{ color: theme.colors.text.secondary }}>
                {searchValue || 'Nenhuma busca acionada ainda.'}
              </Text>
            </Box>
            <Box className="playground-surface-card">
              <Text as="h3" variant="title2">
                Surface
              </Text>
              <Text as="p" variant="body" style={{ color: theme.colors.text.secondary }}>
                {String(selectValue ?? 'Nao selecionado')}
              </Text>
            </Box>
            <Box className="playground-surface-card">
              <Text as="h3" variant="title2">
                Density
              </Text>
              <Text as="p" variant="body" style={{ color: theme.colors.text.secondary }}>
                {density} / scale {counterValue}
              </Text>
            </Box>
          </Grid>
        </Container>
      </section>
    </div>
  );
}

function OverlaysSection({
  onOpenDialog,
  onOpenDrawer,
}: {
  onOpenDialog: () => void;
  onOpenDrawer: () => void;
}) {
  const theme = useTheme();

  return (
    <div className="playground-stack">
      <section className="playground-foundation-grid">
        <article className="playground-panel">
          <div className="playground-section-head">
            <Text as="h2" variant="title2">
              Dialog
            </Text>
            <Text as="p" variant="body" style={{ color: theme.colors.text.secondary }}>
              Dialogo com titulo, descricao, conteudo e footer.
            </Text>
          </div>

          <div className="playground-stack">
            <Text as="p" variant="body">
              Use para confirmacoes, formularios curtos e interrupcoes focadas.
            </Text>
            <Button onClick={onOpenDialog}>Open dialog</Button>
          </div>
        </article>

        <article className="playground-panel">
          <div className="playground-section-head">
            <Text as="h2" variant="title2">
              Drawer
            </Text>
            <Text as="p" variant="body" style={{ color: theme.colors.text.secondary }}>
              Painel lateral para contexto complementar sem trocar de pagina.
            </Text>
          </div>

          <div className="playground-stack">
            <Text as="p" variant="body">
              Use para filtros, inspecao de propriedades e fluxos secundarios.
            </Text>
            <Button variant="secondary" onClick={onOpenDrawer}>
              Open drawer
            </Button>
          </div>
        </article>
      </section>
    </div>
  );
}

function PlaygroundContent({
  activeTheme,
  setActiveTheme,
}: {
  activeTheme: ThemePresetId;
  setActiveTheme: React.Dispatch<React.SetStateAction<ThemePresetId>>;
}) {
  const theme = useTheme();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('theme');
  const [textValue, setTextValue] = React.useState('Arbor DS');
  const [notesValue, setNotesValue] = React.useState(
    'Playground voltado ao nucleo do design system, sem blocos especificos de produto.',
  );
  const [selectValue, setSelectValue] = React.useState<string | number | undefined>('shared');
  const [counterValue, setCounterValue] = React.useState(3);
  const [compactMode, setCompactMode] = React.useState(false);
  const [density, setDensity] = React.useState<'comfortable' | 'compact'>('comfortable');

  const tabItems = [
    {
      id: 'overview',
      label: 'Overview',
      badge: <Badge tone="brand">Core</Badge>,
      content: (
        <OverviewSection
          activeTheme={activeTheme}
          onOpenDialog={() => setIsDialogOpen(true)}
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />
      ),
    },
    {
      id: 'foundations',
      label: 'Foundations',
      content: <FoundationsSection />,
    },
    {
      id: 'components',
      label: 'Components',
      content: (
        <ComponentsSection
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          textValue={textValue}
          setTextValue={setTextValue}
          notesValue={notesValue}
          setNotesValue={setNotesValue}
          selectValue={selectValue}
          setSelectValue={setSelectValue}
          counterValue={counterValue}
          setCounterValue={setCounterValue}
          compactMode={compactMode}
          setCompactMode={setCompactMode}
          density={density}
          setDensity={setDensity}
        />
      ),
    },
    {
      id: 'overlays',
      label: 'Overlays',
      content: (
        <OverlaysSection
          onOpenDialog={() => setIsDialogOpen(true)}
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />
      ),
    },
  ];

  return (
    <div className="playground-shell">
      <div className="playground-backdrop playground-backdrop-left" />
      <div className="playground-backdrop playground-backdrop-right" />

      <Container>
        <div className="playground-frame">
          <header className="playground-topbar">
            <div className="playground-brand">
              <div className="playground-brand-mark">A</div>
              <div>
                <strong>Arbor DS</strong>
                <span>Design system architecture playground</span>
              </div>
            </div>

            <div className="playground-theme-switcher">
              {(Object.keys(themePresets) as ThemePresetId[]).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={preset === activeTheme ? 'is-active' : ''}
                  onClick={() => setActiveTheme(preset)}
                >
                  {themeMeta[preset].label}
                </button>
              ))}
            </div>
          </header>

          <main className="playground-main">
            <Tabs items={tabItems} variant="pill" size="small" />
          </main>
        </div>
      </Container>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Overlay />
        <Dialog.Content size="medium">
          <Dialog.Title>Arbor Dialog</Dialog.Title>
          <Dialog.Description>
            Overlay de referencia para confirmacoes, mensagens ou formularios curtos.
          </Dialog.Description>
          <Flex flexDirection="column" gap="small">
            <Text as="p" variant="body" style={{ color: theme.colors.text.secondary }}>
              O dialog herda o tema ativo do ArborProvider e demonstra composicao simples com textos e actions.
            </Text>
            <Badge tone="success">Theme-aware overlay</Badge>
          </Flex>
          <Flex justifyContent="flex-end" gap="small">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>Confirmar</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Drawer.Root isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title>Arbor Drawer</Drawer.Title>
          <Text as="p" variant="body" style={{ color: theme.colors.text.secondary }}>
            Painel auxiliar para inspecao de estados do playground.
          </Text>
          <div className="playground-stack">
            <div className="playground-inspector-item">
              <span>Theme</span>
              <strong>{themeMeta[activeTheme].label}</strong>
            </div>
            <div className="playground-inspector-item">
              <span>Search</span>
              <strong>{searchValue}</strong>
            </div>
            <div className="playground-inspector-item">
              <span>Density</span>
              <strong>
                {density} / {counterValue}
              </strong>
            </div>
            <div className="playground-inspector-item">
              <span>Compact mode</span>
              <strong>{compactMode ? 'enabled' : 'disabled'}</strong>
            </div>
          </div>
          <Flex justifyContent="flex-end">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
              Fechar painel
            </Button>
          </Flex>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  );
}

export function Playground() {
  const [activeTheme, setActiveTheme] = React.useState<ThemePresetId>('spruce');

  return (
    <ArborProvider theme={themePresets[activeTheme]}>
      <PlaygroundContent activeTheme={activeTheme} setActiveTheme={setActiveTheme} />
    </ArborProvider>
  );
}
