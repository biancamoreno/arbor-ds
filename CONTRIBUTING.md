# Contributing to Arbor DS

## Setup

```bash
git clone https://github.com/<org>/arbor-ds
cd arbor-ds
pnpm install
pnpm dev        # playground em http://localhost:5173
pnpm storybook  # docs em http://localhost:6006
```

## Fluxo de PR

1. Crie uma branch a partir de `main`.
2. Faça as alterações e adicione testes.
3. Crie um changeset descrevendo o impacto:
   ```bash
   pnpm changeset
   ```
4. Abra o PR para `main`.
5. O CI deve passar: lint, typecheck, testes, build, size-limit.
6. Após merge, o bot de release abrirá um PR de versão automaticamente.

## Convenções de commit

Este repositório usa [Conventional Commits](https://www.conventionalcommits.org/).

| Prefixo | Quando usar |
|---|---|
| `feat:` | Nova feature sem quebrar API existente |
| `fix:` | Correção de bug |
| `feat!:` / `fix!:` | Breaking change (requer RFC aceito) |
| `refactor:` | Refatoração interna sem mudança de comportamento |
| `docs:` | Documentação, stories, MDX |
| `test:` | Testes unitários, comportamentais, a11y |
| `chore:` | Tooling, CI, dependências, build |
| `perf:` | Melhoria de performance |
| `style:` | Formatação, tokens visuais sem lógica |

O `commit-msg` hook valida o formato automaticamente via commitlint.

## Como criar um changeset

```bash
pnpm changeset
```

Siga as instruções interativas:
- Selecione o pacote `arbor-ds`.
- Escolha o nível: `patch` (bug fix), `minor` (nova feature), `major` (breaking change).
- Escreva um resumo em uma linha do que mudou.

O arquivo gerado em `.changeset/` deve ser commitado junto com as alterações.

## Fluxo de release

O workflow `release.yml` é **tag-gated** — push em `main` não publica. Para publicar uma nova versão:

1. PRs com changesets são mergeados para `main`.
2. Quando for hora de release, alguém com permissão roda localmente:
   ```bash
   pnpm changeset version   # consome changesets pendentes, bumpa versão, atualiza CHANGELOG
   git add . && git commit -m "chore: version packages"
   git push origin main
   ```
3. Em seguida, cria-se a tag e faz-se o push:
   ```bash
   git tag -a v<x.y.z> -m "Release v<x.y.z>"
   git push origin v<x.y.z>
   ```
4. O push da tag dispara o workflow `Release`, que executa `pnpm changeset publish` → publica `arbor-ds` no npm.
5. Alternativamente, o release pode ser disparado manualmente via Actions UI (`workflow_dispatch`).

## Definition of Done (por componente)

Para um componente ser considerado estável e mergeável:

- [ ] Props tipadas sem `any` sem justificativa.
- [ ] Recipe em `theme.recipes` (se aplicável).
- [ ] Implementação `.native.tsx` (se classificado como `shared`).
- [ ] Tag `@platform` documentada nos tipos (`web`, `native`, `shared`).
- [ ] ≥ 15 testes cobrindo comportamento e acessibilidade.
- [ ] Zero violations críticas de `axe`.
- [ ] Story no Storybook com `autodocs` habilitado.
- [ ] MDX com uso correto, uso incorreto, props table e notas de a11y.
- [ ] Changeset criado se a API pública foi modificada.

## Convenções de implementação

Padrões consolidados nas reviews R1–R3 (2026-04-24). Aplicáveis a todo componente novo ou refatoração.

### 1. Invariantes por último

Em primitives com contrato semântico (Center, Square, Circle, Flex, Grid etc.), as props que o componente **garante** (invariantes) vão **depois** do spread de `{...props}`, para impedir que o consumidor sobrescreva o contrato:

```tsx
// ✅ Correto — invariantes ganham
<ArborTransform {...props} display="flex" alignItems="center" />

// ❌ Errado — consumidor pode quebrar o contrato
<ArborTransform display="flex" alignItems="center" {...props} />
```

### 2. `Omit` das props que o componente controla

Quando uma prop é invariante, `Omit<ArborTransformProps, 'alignItems'>` na interface complementa a blindagem em compile-time:

```tsx
// CenterProps explicitamente omite props que Center controla
export type CenterProps = Omit<ArborTransformProps, 'display' | 'alignItems' | 'justifyContent'>;
```

### 3. `displayName` obrigatório

Todo componente público deve definir `displayName` — incluindo os sem `forwardRef`. Importante para React DevTools, mensagens de erro e snapshots.

```tsx
export const Box = forwardRef<HTMLElement, BoxProps>(function Box(...) { ... });
Box.displayName = 'Box';
```

### 4. Cross-platform por definição — sem `web-only`

**Todo componente público do Arbor-DS funciona em web, iOS e Android.** A tag `@platform web-only` é classificação **inválida** (RFC-0018) — sua presença em qualquer arquivo do `src/` é um bug a corrigir.

Os dois únicos níveis válidos:

| Tag | Significado | Quando usar |
|---|---|---|
| `@platform shared` | Mesma implementação `.tsx` em web e native; delega a `ArborTransform` ou primitives shared. | Box, Flex, Center, Card, Badge, etc. |
| `@platform native-ready` | Implementação dedicada `.native.tsx` por divergência arquitetural ou uso de APIs RN-only. | Text, Image, Field, Checkbox, Switch, Select (após onda 3 da RFC-0018), etc. |

Primitives que delegam 100% ao `ArborTransform` **não precisam** de `.native.tsx` — o engine já resolve por plataforma via `styled-component.ts` (web) e `styled-component.native.ts` (native). Crie `.native.tsx` apenas quando a implementação **realmente diverge** (ex: Field usa `<label>+<input>` na web e `<Pressable>+accessibilityRole` na native).

> **Em migração:** 12 componentes ainda estão em `web-only` ([TD-017](docs/TECH_DEBT.md#td-017)). Pull requests novos não podem introduzir mais. Componentes existentes serão migrados em ondas via [RFC-0018](docs/rfcs/RFC-0018-paridade-native-completa-do-ds.md).

### 5. Stories usam apenas componentes do DS

Sem `<div>`, `<span>`, `<button>` crus em stories. Sem `style={{...}}` quando há prop declarativa equivalente.

```tsx
// ❌ Errado
<div style={{ display: 'flex', gap: '8px' }}>
  <span style={{ color: 'red' }}>label</span>
</div>

// ✅ Correto
<Flex gap="8px">
  <Text as="span" color="red">label</Text>
</Flex>
```

Escape hatch via `style={{...}}` é aceitável apenas para CSS sem prop equivalente (`outline`, `gridTemplateColumns`, `wordBreak`, `backdropFilter` etc.).

### 6. Componentes `platform-split` têm warning de dev para limitações

Componentes com implementações `.tsx` e `.native.tsx` divergentes devem alertar em modo dev sobre props que não funcionam em alguma plataforma:

```tsx
if (process.env.NODE_ENV !== 'production') {
  if (color === 'currentColor' && Platform.OS !== 'web') {
    console.warn('[Icon] color="currentColor" não é suportado em React Native.');
  }
}
```

Exemplos: `Icon.native` para `currentColor`, `Clickable` para `as !== 'button'/'a'` sem `role`.

### 7. Naming de props e eventos

**Props booleanas (RFC-0013, completada por RFC-0030):** API pública usa nomes alinhados com HTML/ARIA, **sem prefixo `is`**.

```tsx
// ✅ Correto
<Field disabled required invalid />
<Dialog open onOpenChange={…} />
<Drawer open onOpenChange={…} />
<Tooltip open onOpenChange={…} />
<Popover open onOpenChange={…} />
<Menu open onOpenChange={…} />
<Checkbox checked indeterminate />
<Pagination.Button current>2</Pagination.Button>
<ButtonGroup disabled>…</ButtonGroup>

// ❌ Errado
<Field isDisabled isRequired isInvalid />
<Dialog isOpen />
<Pagination.Button isActive />
```

A mesma regra vale para **contextos internos**: `DrawerContextValue.open`, `CheckboxContextValue.checked`, `RadioContextValue.disabled`. Não há `isFoo` na superfície entre componentes.

**Variáveis locais derivadas dentro do componente** podem usar `is*` para legibilidade — RFC-0013 Convenção 2:

```tsx
const isInteractive = !disabled && !readOnly;
const isActive = activeIndex === currentIndex;
```

**Exceção registrada — `useDisclosure()`:** o hook utilitário retorna `{ isOpen, open, close, toggle }`. Manter `isOpen` neste retorno é deliberado: `open` é tanto a flag quanto o nome da ação no mesmo objeto, e essa colisão tornaria o hook inutilizável (`{ open: opened }` não é melhor que `isOpen`). Como o retorno é variável local na call site, a convenção 2 cobre o caso.

**Eventos de mudança de estado controlado (RFC-0015):** usar `on{Verbo}Change` com assinatura **value-only**.

```tsx
// ✅ Correto — nome explícito + assinatura value-only
onCheckedChange?: (checked: boolean) => void;
onValueChange?: (value: T) => void;
onOpenChange?: (open: boolean) => void;

// ❌ Errado — onChange ambíguo (conflita com onChange HTML)
onChange?: (checked: boolean) => void;

// ❌ Errado — assinatura estendida (consumidor já tem `value` no escopo do JSX)
onCheckedChange?: (checked: boolean, value: string) => void;
```

**Exceção legítima:** componentes que envolvem `<input>`/`<textarea>` podem aceitar `onChange` HTML adicional **com semântica preservada** (`(e: ChangeEvent) => void`). Não redefinir o significado de `onChange`.

**Eventos pontuais (não-Change):** seguem `on{Verbo}` simples — `onSubmit`, `onSelect`. `Change` é reservado para par `value`/`onValueChange`.

**`onClose` × `onOpenChange` em overlays (RFC-0030):** overlays controláveis (Dialog/Drawer/Tooltip/Popover/Menu) **não** expõem `onClose`. Usam `onOpenChange(open)`, que é estritamente mais informativo — cobre abertura e fechamento, e é compatível com `useControllableState`. `onClose` permanece **apenas** em superfícies de ciclo de vida finito não-controlável (Toast com auto-dismiss).

### 8. Foco visível em componentes com input oculto (WCAG 2.4.7)

Componentes que escondem o `<input>` real (`position:absolute; opacity:0; pointerEvents:none`) e desenham um controle visual próprio (Radio, Switch, Counter, etc.) **devem refletir o `:focus-visible` do input no controle desenhado**. Sem isso, o usuário com teclado não enxerga onde está e o formulário viola WCAG 2.4.7 (AA).

Padrão técnico DS:

```tsx
// No slot do wrapper que contém o input + visual:
_focusVisibleWithin: {
  outline: '2px solid',
  outlineColor: 'interactive.default',
  outlineOffset: '2px',
}

// Quando o input já é visível (ex: Checkbox.Indicator usa <Box as="input">):
_focusVisible: {
  outline: '2px solid',
  outlineColor: 'interactive.default',
  outlineOffset: '2px',
}
```

`_focusVisibleWithin` resolve para `&:has(:focus-visible)` — reage só ao foco por teclado, suportado em todos os navegadores modernos. O wrapper deve ter `borderRadius` apropriado para o anel acompanhar a forma do controle. Cada componente novo desse padrão precisa de **1 teste assertivo** verificando a regra de outline no stylesheet gerado.

### 9. Touch target ≥ 44×44 (WCAG 2.5.5)

Todo elemento interativo (botão, trigger, item de lista, ícone clicável, input) **deve ter área de toque mínima de 44×44 CSS pixels** em qualquer size do componente. Sem exceção. Aplica para web e native.

**Caminho preferido — bumpar `minHeight` na recipe:**

```ts
// Em base-theme.ts
size: {
  sm: { control: { minHeight: '44px' } },  // não menos que 44
  md: { control: { minHeight: '44px' } },
  lg: { control: { minHeight: '48px' } },
}
```

**Quando o visual precisa ser menor que 44 (ex: Counter compacto, Switch),** preserve o visual e expanda apenas a área de toque com overlay invisível via `_before`:

```tsx
<Clickable
  position="relative"
  _before={{
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '44px',
    minHeight: '44px',
  }}
  style={{ width: 24, height: 24 /* visual compacto */ }}
>
  …
</Clickable>
```

O `::before` herda os event handlers do parent — clicar no overlay dispara `onClick` do botão. **Cada componente novo interativo precisa de teste assertivo** verificando `min-height >= 44` (no slot via recipe) ou regra `::before{min-width:44px;min-height:44px}` (no overlay).

### 10. Card — discriminated union `interactive` + anatomia reflow (RFC-0036)

`Card` separa **identidade** (`variant`) de **comportamento** (`interactive`). A discriminated union força a11y no nível de tipo:

```tsx
// Decorativo (default)
<Card variant="elevated" padding="medium">
  <Card.Body>...</Card.Body>
</Card>

// Interativo — TS exige onClick + aria-label
<Card interactive onClick={open} aria-label="Abrir produto X">
  <Card.Body>...</Card.Body>
</Card>
```

Sem `'hover'` decorativo — quando interativo, hover/active são affordances reais que dependem de `onClick`. `interactive: true` vira `<button>` (web) / `<Pressable>` (native).

**Anatomia reflow:** cada slot dona seu padding. `header`/`body`/`footer` recebem o padding da variant; `media` não. `Card.Media` fica edge-to-edge **por construção** — sem context, sem margin negativa, sem hack:

```tsx
<Card padding="large">
  <Card.Media><Image src={url} alt="" /></Card.Media>  {/* edge-to-edge */}
  <Card.Body>...</Card.Body>                            {/* padding large */}
</Card>
```

Hover/active themable via `interactive: true` na slot recipe — produto consumidor sobreescreve via `createTheme({ recipes: { card: { variants: { interactive: { true: { root: { _hover: { boxShadow: '...' } } } } } } } })`. Em RN, `_hover`/`_active` são no-ops naturais; nada quebra.

### 11. Accordion — discriminated union por `type` + slot recipe themable (RFC-0037)

`Accordion` separa contrato de modo via discriminated union por `type`. O type system impede combinações inválidas (ex.: `defaultValue: string[]` em `single`):

```tsx
// Single (default) — collapsible default true
<Accordion defaultValue="faq-1" onValueChange={(v: string) => save(v)}>
  <Accordion.Item value="faq-1">
    <Accordion.Trigger>Como cancelar?</Accordion.Trigger>
    <Accordion.Content>Acesse Configurações…</Accordion.Content>
  </Accordion.Item>
</Accordion>

// Single + collapsible=false — clicar no aberto não fecha
<Accordion type="single" collapsible={false} defaultValue="faq-1">
  ...
</Accordion>

// Multiple — value/defaultValue são string[]
<Accordion type="multiple" defaultValue={['a', 'b']} onValueChange={(v: string[]) => save(v)}>
  ...
</Accordion>
```

Anatomia (`root`, `item`, `trigger`, `triggerIcon`, `content`, `contentInner`) + estado (`open`/`closed` para o ícone) resolvidos pela slot recipe `accordion` — override completo via `createTheme`.

**Web:**
- Keyboard nav: `ArrowUp`/`ArrowDown` (wrap), `Home`/`End`. A ordem de foco usa `compareDocumentPosition` em vez de ordem de registro, então itens condicionais não quebram a navegação.
- `aria-disabled` em items desabilitados (redundante com `disabled` em `<button>` para SR que ignoram um ou outro).
- Foco visível WCAG 2.4.7 via `_focusVisible` no trigger (slot recipe).
- Animação de altura via `gridTemplateRows: 0fr → 1fr` (inline `style` por necessidade do engine).

**Native:**
- Sem keyboard nav (touch-only); sem rotate (chevron alterna `ChevronDown` ↔ `ChevronUp`).
- Render condicional de `Content` (`if (!open) return null`).
- Mesma slot recipe — `triggerIcon.transform` é no-op natural.

### 12. Tabs — `variant`/`size` em `Tabs.List` + Home/End + foco visível em Content (RFC-0038)

`variant` (`underline` | `pill`) e `size` (SP-1 completo: `xsmall`/`small`/`medium`/`large`/`xlarge`) vivem em `Tabs.List` — decisão de identidade do grupo, não do trigger individual:

```tsx
<Tabs defaultValue="overview">
  <Tabs.List variant="pill" size="small" fullWidth>
    <Tabs.Trigger value="overview">Visão geral</Tabs.Trigger>
    <Tabs.Trigger value="reviews">Avaliações</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="overview">…</Tabs.Content>
  <Tabs.Content value="reviews">…</Tabs.Content>
</Tabs>
```

Anatomia (`root`, `list`, `trigger`, `content`) + axes (`variant`, `size`, `orientation`, `state`) resolvidos pela slot recipe `tabs`. Estado ativo é modelado via variant `state: 'active' | 'inactive'` (engine não tem `_selected`); identidade no Trigger combina `compoundVariants` com `variant`. Override completo via `createTheme`.

**Web:**
- Keyboard nav: `ArrowLeft`/`ArrowRight` (horizontal) ou `ArrowUp`/`ArrowDown` (vertical), `Home`/`End`. DOM-order via `compareDocumentPosition`.
- Foco visível WCAG 2.4.7 no Trigger **e no Content** (sem `outline: none`; Content precisa anunciar foco quando recebe `tabIndex=0` por requisito ARIA).
- IDs únicos via `useId()` (suporta múltiplos `Tabs` na mesma página).

**Native:**
- Mesma slot recipe; pseudos `_focusVisible`/`_hover` são no-ops naturais em RN.
- `Tabs.Content` usa `accessibilityLabelledBy` (RN não tem `tabpanel`).

### 13. Avatar — `<Image>` do DS + tokens themable + paridade native (RFC-0035)

`Avatar.Image` consome o `<Image>` do DS (RFC-0011/0012) — paridade web/native automática. Tamanhos resolvem via `theme.sizes.avatar.{size}` e sobreposição de `AvatarGroup` via `theme.sizes.avatarOverlap.{size}` — produto consumidor ajusta densidade sem editar o componente:

```tsx
<Avatar size="medium">
  <Avatar.Image src={user.photo} alt={user.name} />
  <Avatar.Fallback delayMs={300}>{getInitials(user.name)}</Avatar.Fallback>
</Avatar>

<AvatarGroup size="medium" max={3}>
  {users.map(u => (
    <Avatar key={u.id}>
      <Avatar.Image src={u.photo} alt={u.name} />
      <Avatar.Fallback>{getInitials(u.name)}</Avatar.Fallback>
    </Avatar>
  ))}
</AvatarGroup>
```

**Anel de empilhamento (web):** `boxShadow: 'avatarRing'` resolve para `'0 0 0 2px var(--arbor-surface, #fff)'`. O `ArborProvider` emite `--arbor-surface` no `document.documentElement` por tema, então a cor do anel acompanha automaticamente light/dark/branding sem reler o token.

**Anel (native):** sem `boxShadow`. Substituído por `borderWidth: 2` + `borderColor: 'surface.default'` — mesma intenção visual, suportada pelo runtime.

**Sem extends `HTMLAttributes`/`ImgHTMLAttributes`:** API cross-platform pura (`className` + `style` apenas).

## RFCs

Mudanças que afetam API pública, breaking changes ou decisões arquiteturais relevantes requerem RFC.

Crie um arquivo em `docs/rfcs/` usando o template `RFC-0000-template.md`.

O RFC precisa ser aceito antes de iniciar a implementação.

## Política de depreciação

- Breaking changes requerem RFC aceito.
- API depreciada permanece por 2 minor versions com JSDoc `@deprecated`.
- Breaking changes de API pública requerem codemod para facilitar a migração.

## Testes cross-platform

A suite Jest roda dois projects (RFC-0016): `web` (jsdom + RNW alias) e `native` (jest-expo + RN). `pnpm test` executa ambos. Detalhes em [`docs/TESTING.md`](docs/TESTING.md).

### Convenção de naming

- `*.test.tsx` — teste **web**. Roda em jsdom.
- `*.native.test.tsx` — teste **native**. Roda em jest-expo. O resolver pega `.native.tsx` automaticamente quando o teste importa o componente.

Não use `*.web.test.tsx` — web é o default; assimetria reflete a plataforma majoritária.

### Onde testar

| Característica do componente | Web | Native |
|---|---|---|
| Re-render só de estilo (delega 100% para `ArborTransform`) | Suficiente | Opcional |
| Lógica RN-específica (gestos, animação, `Pressable`, `accessibilityRole`/`accessibilityState`) | Recomendado | **Obrigatório** |
| Compound Field-aware com a11y (`Field`, `Checkbox`, `Switch`, `Radio`, `Select`) | **Obrigatório** | **Obrigatório** — paridade de contrato |
| Divergência arquitetural deliberada (ex.: hardcode em `fab.native.tsx` até TD-004) | n/a | **Obrigatório** — trava a divergência |

`scripts/check-platform-contract.js` falha o build quando um arquivo `.native.tsx` existe sem `.native.test.tsx` irmão. Adicionar `.native.tsx` sem teste não passa em CI.

### Princípios de redação

- **Comportamentais, não snapshot.** Visual regression em RN é problema de Storybook native, fora do escopo do unit.
- **Asserções por intenção pública** (`getByLabelText`, `getByRole`, `accessibilityState`), não por implementação interna.
- **Sem mocks de styled-system.** Se o teste falhar porque o styled-system mudou, é exatamente isso que a suite native quer detectar.

## FileUpload em RN — caminhos recomendados

Por decisão arquitetural ([RFC-0026](docs/rfcs/RFC-0026-fileupload-caso-fronteira.md)), `FileUpload.native` é um **placeholder visualmente paritário** com o web em estado idle: renderiza a drop zone dashed, **não captura toque** e não abre picker. O bloco de preview (`previewUrl` + `onRemove`) funciona normalmente em ambas as plataformas.

A escolha de lib de captura fica por conta do produto consumidor, porque "upload de arquivo" em mobile raramente é um picker genérico — é câmera, galeria, scanner ou áudio gravado. Cada caso usa lib diferente. O slot `children` permite injetar a integração preferida sem perder o frame visual da drop zone.

### Decidindo a lib

| Caso de uso | Lib recomendada | Notas |
|---|---|---|
| Documento genérico (PDF, planilha, .zip) | `expo-document-picker` | Cobre Android/iOS; suporta `multiple`, `type` MIME. |
| Foto da galeria + foto via câmera | `expo-image-picker` | API única para `launchImageLibraryAsync` e `launchCameraAsync`. Default para fluxos de avatar/perfil. |
| Captura ao vivo de câmera (preview embedded, scanner, KYC) | `expo-camera` | Quando o produto precisa de viewfinder dentro do app, não dialog do sistema. |
| Gravação de áudio | `expo-av` | Para upload de voz; combinar com UI custom de waveform/timer. |
| Bare RN (sem Expo) | `react-native-document-picker` ou `react-native-image-picker` | Comunidade mantida; setup nativo (`pod install`/`gradle sync`). |

A maturidade do ecossistema Expo torna `expo-*` a escolha default em 2026; o DS não bloqueia nenhuma das alternativas.

### Snippet — integração via `children` (Expo, document picker)

```tsx
import * as DocumentPicker from 'expo-document-picker';
import { FileUpload, Clickable, Icon, Text } from 'arbor-ds/native';

function ProfileDocumentUpload({ onPick }: { onPick: (uri: string) => void }) {
  const handlePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
    if (!result.canceled) onPick(result.assets[0].uri);
  };

  return (
    <FileUpload>
      <Clickable
        onClick={handlePick}
        accessibilityRole="button"
        accessibilityLabel="Selecionar documento"
        flexDirection="column"
        alignItems="center"
        gap="micro"
      >
        <Icon name="Upload" size="xl" color="text.secondary" decorative />
        <Text fontSize="small" fontWeight="semibold" color="text.primary">
          Toque para selecionar um documento
        </Text>
      </Clickable>
    </FileUpload>
  );
}
```

O `FileUpload` envelope mantém o frame visual paritário (border dashed, padding, background). O `children` é um `Clickable` que dispara o picker e é o único elemento interativo — o frame em si não captura toque (por design do placeholder).

### Snippet — preview controlado pelo consumidor

`previewUrl` + `onRemove` funcionam idênticos web↔native. Após o upload concluir, o consumidor passa a URI:

```tsx
const [uri, setUri] = useState<string | undefined>();

return (
  <FileUpload
    previewUrl={uri}
    onRemove={() => setUri(undefined)}
  >
    {/* drop zone customizada (idle) */}
  </FileUpload>
);
```

### Quando esperar implementação real native

[TD-025](docs/TECH_DEBT.md#td-025) registra a porta de saída para o caminho **(a)** com peer dep `expo-document-picker`. Gatilho mensurável: 3+ produtos consumidores documentando necessidade real em < 6 meses, OU 1 caso de produto crítico (KYC, autenticação regulamentada). Sem o gatilho, o placeholder é a decisão arquitetural correta.

## Criando um produto

O Arbor-DS é uma plataforma multi-produto. Cada produto consumidor expressa sua identidade visual via tema, sem precisar editar arquivos do DS. O fluxo canônico:

### 1. Defina a paleta de marca

```ts
import { createBrandPalette } from 'arbor-ds';

const violetBrand = createBrandPalette({
  primary:   '#7C3AED',  // identidade dominante
  secondary: '#0EA5E9',  // identidade secundária (CTA alternativo, links)
  accent:    '#10B981',  // destaque/realce
  onPrimary: '#FFFFFF',  // texto/ícone sobre primary
  onSecondary: '#FFFFFF',
  // shades derivados (necessários enquanto a derivação automática não chega):
  subtle: '#EDE9FE',     // bg sutil para hover/selected
  soft:   '#C4B5FD',     // states intermediários
  strong: '#5B21B6',     // hover/pressed
  hover:  '#5B21B6',
  active: '#4C1D95',
});
```

`createBrandPalette()` retorna um objeto com os 11 papéis da camada brand alias. Apenas `primary` é obrigatório — os outros têm fallback para `primary`, mas para um resultado visualmente correto forneça pelo menos `subtle`/`soft`/`strong`/`hover`/`active`.

### 2. Construa o tema do produto

```ts
import { createTheme, themeLight } from 'arbor-ds';

const productALight = createTheme(themeLight, {
  mode: 'product-a-light',  // identificador do tema, não modo claro/escuro
  colors: {
    brand: violetBrand,
    interactive: {
      default: violetBrand.primary,
      hover:   violetBrand.hover,
      active:  violetBrand.active,
    },
    border: { interactive: violetBrand.primary },
    icon:   { interactive: violetBrand.primary },
  },
});
```

Os papéis `interactive.*`/`border.interactive`/`icon.interactive` precisam ser overridados explicitamente porque por padrão eles apontam para a primitive `aqua.X`. Esta é a única "ginástica" pendente — uma evolução futura derivará esses 4 papéis automaticamente da `brand.primary`.

### 3. Plugue o tema no Provider

```tsx
import { ArborProvider } from 'arbor-ds';

export function App() {
  return (
    <ArborProvider theme={productALight}>
      {/* árvore do produto */}
    </ArborProvider>
  );
}
```

`ArborTheme` é estrutural — o Provider aceita qualquer tema que estenda a base. Não há união fechada de `'light' | 'dark'`.

### Pontos de extensão disponíveis hoje

- **`colors`**: cor identitária + papéis semânticos (`brand`, `interactive`, `border`, `icon`, `text`, `surface`, `background`, `feedback`, `status`).
- **`radii`**: raios (`none`, `nano`, `small`, `medium`, `large`, `full`).
- **`space` / `sizes`**: escala de espaçamento (`none`, `nano`, `micro`, `tiny`, `small`, `medium`, `large`, `huge`, `giant`).
- **`fontSizes`** / **`fontWeights`** / **`lineHeights`** / **`letterSpacings`** / **`fonts`**: voz tipográfica.
- **`shadows`**: elevação (`sm`/`md`/`lg`/`xl`).
- **`opacity`** / **`zIndices`** / **`iconSizes`** / **`borderWidths`**.
- **`components`**: overrides por recipe (`button.variants.primary.backgroundColor`, etc.) para casos onde o produto precisa ajustar a anatomia além da identidade.

### Pontos ainda não themable (RFC-0027 PRs 2 e 3)

- **`motion`**: durações/easings (PR 2).
- **`focusRing`**: anel de foco (PR 2).
- **Recipes legadas** (`text`/`button`/`badge`/`card`/`chip`/`avatar`/`alert`/`accordion`/`toast`) ainda capturam alguns valores no module-load (PR 3).

Acompanhe o progresso da [RFC-0027](docs/rfcs/RFC-0027-multi-product-themable-contract.md).

## Icon — catálogo curado

API:

```tsx
import { Icon } from 'arbor-ds';

<Icon name="Check" size="medium" />
<Icon name="ChevronDown" size="small" decorative />
<Icon name="CircleAlert" decorative={false} aria-label="Erro" />
```

`<Icon>` aceita apenas nomes do **catálogo curado** do DS (~140 ícones essenciais), não o catálogo completo do `lucide-react`. O catálogo é mantido em:

- `src/components/core/icon/internal/icon-map.ts` (web — `lucide-react`)
- `src/components/core/icon/internal/icon-map.native.ts` (native — `lucide-react-native`)

Esse desenho ([RFC-0028](docs/rfcs/RFC-0028-icon-componente-em-vez-de-string.md)) é o que permite o tree-shake do bundle do consumidor: o lookup contra um objeto literal estático elimina ícones não usados em build-time. Lookup contra `lucide.icons` arrastaria ~1500 ícones (~600 kB) para o app.

### Adicionar um ícone novo

1. Verifique o nome em [lucide.dev](https://lucide.dev) (PascalCase: `ArrowLeft`, `CheckCheck`).
2. Adicione o import nomeado em **ambos** os arquivos (`icon-map.ts` e `icon-map.native.ts`), na seção temática apropriada (Navigation, Status, Actions, User/Auth, Communication, Files, E-commerce, Rating, Time, Media, UI/Theme, Layout, Tech, Highlight).
3. Adicione a chave correspondente em `iconMap` (mesma seção).
4. Rode `pnpm test -- icon-map.parity` — o gate cross-platform deve passar.

A curadoria é deliberada: ícones precisam ter aplicação clara em produto. Ícones muito específicos de domínio (ex: `Pizza`, `Croissant`) ficam fora — produto que precisa abre PR justificando.

### Tamanho

Aceita token semântico (`xsmall`/`small`/`medium`/`large`/`xlarge`/`hero`) ou número bruto (escape hatch).

| Token | px | Uso |
|---|---|---|
| `xsmall` | 12 | inline em texto pequeno |
| `small` | 16 | buttons sm, chips, tags |
| `medium` | 20 | default — buttons md, inputs, alerts |
| `large` | 24 | buttons lg, headers de section |
| `xlarge` | 32 | hero icons em cards |
| `hero` | 48 | empty states, onboarding |

## Feedback tones

O Arbor-DS expõe o tipo canônico **`FeedbackTone`** em `foundations`:

```ts
type FeedbackTone =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'critical'
  | 'info';
```

A resolução de cor por `tone × slot` (`subtle`/`base`/`strong`) é
centralizada no helper `getFeedbackToneColor(theme, tone, slot)` —
**não há mapeamento local em componente**. Isso elimina drift entre
Alert/Toast/Badge/ProgressBar/ProgressCircle/Tag/Chip e garante que
override de `theme.colors.feedback.*` via `createTheme()` propaga
uniformemente.

### Subset por componente

Cada componente declara `tone?: FeedbackTone` ou um subset com
justificativa explícita:

| Componente | Subset | Justificativa |
|---|---|---|
| `Badge` | canônico (6) | Indicador puro escala em qualquer tone. |
| `Alert` | canônico (6) | `neutral`/`brand` cobrem nota informativa e anúncio. |
| `Toast` | canônico (6) | `brand` cobre "novidade do produto". |
| `Tag` | canônico (6) | Filtros/categorização ganham expressividade. |
| `Chip` | canônico (6) | Idem Tag (interatividade real virá pela RFC-0033). |
| `ProgressBar` | `Exclude<FeedbackTone, 'neutral'>` | Cinza sobre cinza não comunica progresso. |
| `ProgressCircle` | `Exclude<FeedbackTone, 'neutral'>` | Paridade com `ProgressBar`. |

### Diretriz de uso (filtros agrupados)

Em conjuntos de Tag/Chip filtráveis, **use no máximo 1 tone de
feedback por grupo**. Carnaval visual (`success` + `warning` +
`critical` lado a lado) quebra a varredura e dilui o sinal — o
neutro/`brand` deve ser o tone padrão.

### Lint guard

```bash
pnpm test:feedback-tones
```

Falha se alguma interface `*Props.ts` declara `tone?:` como literal
em vez de consumir `FeedbackTone` (ou subset via `Exclude`/`Pick`).

Ver [RFC-0032](docs/rfcs/RFC-0032-feedback-tones-cross-componente.md).

---

## Scripts úteis

```bash
pnpm test                       # Todos os testes (web + native)
pnpm test -- --selectProjects web    # Só suite web
pnpm test -- --selectProjects native # Só suite native
pnpm lint                       # ESLint
pnpm typecheck                  # TypeScript
pnpm build:lib                  # Build da biblioteca
pnpm size                       # Verificar budget de bundle
pnpm storybook                  # Docs interativa
pnpm tokens:validate            # Validar tokens
pnpm depcheck                   # Verificar fronteiras de dependência
pnpm test:platform-contract     # Paridade .tsx ↔ .native.tsx ↔ .native.test.tsx
pnpm test:no-color-literal      # Sem cores literais em componentes (RFC-0027)
pnpm test:feedback-tones        # Toda prop `tone?` consome FeedbackTone (RFC-0032)
```
