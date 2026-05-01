# RFC-0027 — Plataforma multi-produto: completar contrato themable

**Status**: Draft
**Autores**: @bia
**Data**: 2026-05-01
**PR**: —

**Origem**: Auditoria multi-produto realizada em 2026-05-01 sobre o estado pós-RFC-0026. Após o fechamento de todas as ondas da RFC-0018 (paridade native), web-only zerado e suíte 894/894 verde, a próxima frente estratégica é validar que o DS efetivamente cumpre sua promessa de plataforma multi-produto: produtos diferentes convivendo sobre a mesma base, com identidade expressa via tema sem editar o DS.

A skill de arquiteto explicita: "a tematização é o canal preferencial dessa diferenciação… quando uma decisão arquitetural cria um caminho que dificulta esse fluxo, vale revisitá-la". Esta RFC formaliza essa revisão.

---

## Motivação

A camada de runtime do styled-system (`useToken()`) resolve aliases por path em runtime, então qualquer recipe que consome alias string (`borderRadius: 'small'`, `color: 'interactive.default'`) já recebe override de tema corretamente. **Onde o sistema falha não é na engine — é no contrato.** Três frentes:

1. **Tipo do tema é fechado** em `'light' | 'dark'`, bloqueando produtos novos no Provider.
2. **Identidade duplicada** em ≥9 papéis semânticos, sem camada de agregação por marca.
3. **Motion não é themable** — fora do `baseTheme`, com helper `transition()` capturando primitivas no module-load.

Some-se a isso o leakage residual de primitivas em recipes legadas (46 referências) e cor literal em 7 componentes native. O DS está a 3 PRs cirúrgicos de cumprir o contrato.

---

## Estado atual

### Engine (saudável)

```ts
// useToken resolve em runtime via theme.path.split('.').reduce(...)
useToken('colors', 'brand.base')      // → resolve do tema ativo
useToken('space', 'small')            // → resolve do tema ativo
useToken('radii', 'small')            // → resolve do tema ativo
```

Recipes novas (input/checkbox/radio/switch/select/dialog/drawer/field) consomem aliases string. Override via `createTheme()` propaga.

### Contrato (com gaps)

```ts
// theme/Theme.ts — FECHADO
export type ArborTheme = (ThemeLight | ThemeDark) & {
  mode: 'light' | 'dark';
  colors: ThemeLight['colors'];
};
```

```ts
// themeLightColors.ts — IDENTIDADE DUPLICADA
brand:       { subtle, soft, base, strong } // 4× aqua.X
interactive: { default, hover, active }     // 3× aqua.X
border:      { interactive }                // 1× aqua.X
icon:        { interactive }                // 1× aqua.X
// total: 9 referências distintas a primitiveColor.aqua
```

```ts
// baseTheme — SEM motion, SEM focusRing
export const baseTheme = {
  borderWidths, radii, sizes, space, opacity,
  lineHeights, fontWeights, fontSizes, fonts,
  zIndices, iconSizes, shadows,
  breakpoints,
  components,
  // ❌ motion: { duration, easing }
  // ❌ focusRing: { width, style, color, offset }
};
```

```ts
// transition.ts — captura primitivas no module-load
import { motionTokens } from '../../../foundations/tokens/primitives/motion';
export function transition(props, duration = 'normal', easing = 'standard') {
  const d = motionTokens.duration[duration]; // ❌ override de tema não chega
  // ...
}
```

### Diagnóstico consolidado

| # | Item | Severidade |
|---|---|---|
| **G1** | `ArborTheme` é união fechada `ThemeLight \| ThemeDark`; bloqueia produtos novos no Provider. | **Crítica** |
| **G2** | Sem camada brand alias; identidade replicada em 9 papéis semânticos sobre a mesma primitive. | **Crítica** |
| **G3** | Motion não está no `baseTheme`; `transition()` captura primitiva; 6 transition strings raw. | **Crítica** |
| **G4** | 46 referências diretas a `borderRadius.X`/`spacing.X`/`fontSize.X` em recipes legadas (`text`/`button`/`badge`/`card`/`chip`/`avatar`/`alert`/`accordion`/`toast`). Pixels literais (`'420px'/'560px'/'720px'/'36px'/'44px'/'52px'/'32px'/'40px'/'48px'/...`). | Alta |
| **G5** | Cor literal em 7 componentes native: `tab-bar.native:15-16,57`, `fab.native:9-11` (TD-005), `accordion.native:154`, `breadcrumb.native:74`, `pagination.native:137`, `nav-bar:69`, `tab-bar:122`, `select.native:226` (sendo que existe `colors.background.overlay`). | Alta |
| **G6** | `focusRing` é constante local em `base-theme.ts:20-24`, não exposto como token. | Média |
| **G7** | `shadows` são strings monolíticas com `rgba(...)` embutido. Override possível mas exige colar string completa. | Média |
| **G8** | Sem density tokens — alturas de control hardcoded. | Média |
| **G9** | `mode: 'light' \| 'dark'` conceitualmente errado: skill diz "mode é nome do tema, não modo". | Média |
| **G10** | Sem teste de matriz de tematização garantindo regressão. | Média |

---

## Proposta

Três PRs em sequência. Cada um autônomo, suíte verde no fim.

### PR 1 — Tipos abertos + camada brand alias *(foundational, não-breaking)*

**Objetivo:** abrir o tipo `ArborTheme` para admitir produtos arbitrários e introduzir a camada de agregação `brand.*` que elimina a duplicação dos 9 papéis.

#### 1.1 — Tipo aberto

```ts
// foundations/theme/Theme.ts — DEPOIS
import type { BaseTheme } from './base-theme';

export type ArborTheme = BaseTheme & {
  mode: string;                       // nome do tema, não modo
  colors: BaseTheme['components'] extends infer _ ? ThemeColors : never;
  // (ou simplesmente): colors: ThemeColors;
};

export type ThemeColors = typeof themeLightColors;
```

`themeLight` e `themeDark` continuam exportando `ThemeLight` e `ThemeDark` como tipos derivados (preservam autocomplete em consumidores que importam o tipo concreto), mas o **Provider** aceita `ArborTheme` (estrutural).

`mode: 'light' | 'dark'` vira `mode: string`. `themeLight.mode = 'light'`, `themeDark.mode = 'dark'`, `themeProductB.mode = 'product-b-light'`. A semântica passa a ser: **identificador do tema**.

#### 1.2 — Brand alias layer

```ts
// foundations/tokens/semantics/color/brand.ts — NOVO
export type BrandPalette = {
  primary:     string;  // cor identitária dominante
  secondary:   string;  // cor identitária secundária
  accent:      string;  // cor de destaque/CTA secundário
  onPrimary:   string;  // texto/ícone sobre primary
  onSecondary: string;  // texto/ícone sobre secondary
};
```

Os 9 papéis semânticos passam a derivar de `brand.primary`:

```ts
// themeLightColors.ts — DEPOIS
import { color as primitive } from '../../primitives';
import type { BrandPalette } from './brand';

const lightBrand: BrandPalette = {
  primary:     primitive.aqua['60'],
  secondary:   primitive.ocean['60'],
  accent:      primitive.emerald['60'],
  onPrimary:   primitive.neutral.white,
  onSecondary: primitive.neutral.white,
};

export const themeLightColors = {
  // ... background, surface, text, etc. (sem mudança)
  brand: {
    primary:     lightBrand.primary,
    secondary:   lightBrand.secondary,
    accent:      lightBrand.accent,
    onPrimary:   lightBrand.onPrimary,
    onSecondary: lightBrand.onSecondary,
    // papéis derivados (mantidos para compat de recipes legadas):
    subtle: primitive.aqua['20'],
    soft:   primitive.aqua['40'],
    base:   lightBrand.primary,         // ← era aqua.60 direto
    strong: primitive.aqua['80'],
  },
  interactive: {
    default:  lightBrand.primary,        // ← era aqua.60 direto
    hover:    primitive.aqua['80'],
    active:   primitive.aqua['100'],
    disabled: primitive.neutral['30'],
  },
  border: {
    // ...
    interactive: lightBrand.primary,     // ← era aqua.60 direto
  },
  icon: {
    // ...
    interactive: lightBrand.primary,     // ← era aqua.60 direto
  },
  // ...
};
```

**Observação:** os papéis derivados (`brand.subtle`/`brand.soft`/`brand.strong`, `interactive.hover`, `interactive.active`) ainda referenciam primitivas concretas (`aqua.20`/`aqua.40`/`aqua.80`/`aqua.100`). Para um produto B trocar a marca completamente, ele override esses papéis explicitamente — ou usa o helper:

#### 1.3 — Helper `createBrandPalette()`

```ts
// foundations/theme/create-brand-palette.ts — NOVO
import type { BrandPalette } from '../tokens/semantics/color/brand';

export type BrandShades = {
  subtle: string;   // ~10–20 lightness sobre primary
  soft:   string;   // ~40 lightness
  base:   string;   // primary
  strong: string;   // ~80 lightness
  hover:  string;   // ~80 lightness
  active: string;   // ~100 lightness
};

export function createBrandPalette(
  primary: string,
  shades: Partial<BrandShades> = {}
): BrandPalette & BrandShades {
  // implementação inicial: aceita override completo;
  // versão futura pode derivar shades automaticamente via OKLCH.
  return {
    primary,
    secondary:   shades.soft ?? primary,
    accent:      shades.strong ?? primary,
    onPrimary:   '#ffffff',
    onSecondary: '#ffffff',
    subtle: shades.subtle ?? primary,
    soft:   shades.soft   ?? primary,
    base:   primary,
    strong: shades.strong ?? primary,
    hover:  shades.hover  ?? primary,
    active: shades.active ?? primary,
  };
}
```

Versão inicial **não deriva shades automaticamente** — exige que o produto forneça os 6 shades. Fica registrado como evolução natural (TD futura: derivação OKLCH).

#### 1.4 — Snippet "Criando um produto" no CONTRIBUTING

```ts
// app do produto B
import { ArborProvider, createTheme, themeLight, createBrandPalette } from 'arbor-ds';

const violetBrand = createBrandPalette('#7C3AED', {
  subtle: '#EDE9FE',
  soft:   '#C4B5FD',
  strong: '#5B21B6',
  hover:  '#5B21B6',
  active: '#4C1D95',
});

const productBLight = createTheme(themeLight, {
  mode: 'product-b-light',
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

export function App() {
  return <ArborProvider theme={productBLight}>{/* ... */}</ArborProvider>;
}
```

#### 1.5 — Migração de consumidores

Zero mudança em consumidores. Os papéis semânticos antigos (`brand.base`/`interactive.default`/etc.) preservam nome e tipo. Quem já consome `colors.brand.base` continua funcionando.

---

### PR 2 — Motion themable + transition runtime-aware

**Objetivo:** trazer motion para dentro do contrato themable e tornar `transition` capaz de responder a override.

> **Atualização (2026-05-01):** `focusRing` themable foi **deferido** para [TD-026](../TECH_DEBT.md#td-026). O caminho exige refactor da engine de pseudos para resolver subprops via scale `focusRing` (não-trivial, fora do escopo do PR 2). Hoje `focusRing` continua como const local em `base-theme.ts:20-24`; cor responde ao tema via alias `interactive.default`, mas `outlineWidth`/`outlineOffset`/`outlineStyle` ficam fixos.

#### 2.1 — Motion no baseTheme

```ts
// foundations/tokens/semantics/motion.ts — NOVO
import { motionTokens } from '../primitives/motion';

export const motion = {
  duration: { ...motionTokens.duration }, // semantic = primitive por enquanto
  easing:   { ...motionTokens.easing },
};

export type Motion = typeof motion;
```

```ts
// foundations/theme/base-theme.ts
import { motion } from '../tokens/semantics/motion';

export const baseTheme = {
  // ...
  motion,
  focusRing,  // ver 2.2
  // ...
};
```

#### 2.2 — focusRing como token

```ts
// foundations/tokens/semantics/focus-ring.ts — NOVO
export const focusRing = {
  width:  '2px',
  style:  'solid',
  color:  'interactive.default',  // alias; resolve em runtime
  offset: '2px',
};

export type FocusRing = typeof focusRing;
```

A constante local em `base-theme.ts:20-24` é removida. Recipes que usam `_focusVisible: focusRing` passam a consumir o token via alias:

```ts
// DEPOIS
indicator: {
  // ...
  _focusVisible: {
    outlineWidth:  'focusRing.width',
    outlineStyle:  'focusRing.style',
    outlineColor:  'focusRing.color',  // já resolve interactive.default
    outlineOffset: 'focusRing.offset',
  },
},
```

(Alternativa: criar prop composta `_focusRing: 'default'` na engine. Avaliar custo na implementação.)

#### 2.3 — `useTransition()` runtime-aware

```ts
// ecosystem/utils/functions/use-transition.ts — NOVO
import { useTheme } from '../../styled-system/adapters';

type Duration = 'instant' | 'fast' | 'normal' | 'slow' | 'slower';
type Easing = 'standard' | 'decelerate' | 'accelerate' | 'sharp';

export function useTransition() {
  const theme = useTheme();
  return (props: string | string[], duration: Duration = 'normal', easing: Easing = 'standard') => {
    const d = theme.motion.duration[duration];
    const e = theme.motion.easing[easing];
    const list = Array.isArray(props) ? props : [props];
    return list.map((p) => `${p} ${d} ${e}`).join(', ');
  };
}
```

Helper estático `transition()` é preservado para casos sem hook (recipes globais que não querem assinar tema). **Mas** as 6 transition strings raw em recipes/componentes migram para o helper:

```ts
// base-theme.ts — recipe radio (DEPOIS)
control: {
  // ...
  transition: transition(['border-color', 'background-color'], 'fast'),
}
// switch.track:
transition: transition('background-color', 'normal'),
// switch.thumb:
transition: transition('transform', 'normal'),
```

`counter.tsx:107,176` e `radio.tsx:107` migram para `transition([...], 'normal')` ou consomem `useTransition()` quando o motion themable importar.

#### 2.4 — Native motion via `useMotion()`

```ts
// ecosystem/utils/functions/use-motion.ts — NOVO
import { useTheme } from '../../styled-system/adapters';

export function useMotion() {
  const theme = useTheme();
  return {
    duration: (key: Duration) => parseInt(theme.motion.duration[key], 10), // ms numérico
    easing:   (key: Easing) => theme.motion.easing[key],                   // string para Animated
  };
}
```

Native pode passar `Animated.timing(value, { duration: motion.duration('normal'), useNativeDriver: true })`.

---

### PR 3 — Sweep recipes legadas + sweep native + matriz de teste

**Objetivo:** eliminar leakage residual e garantir regressão via teste.

#### 3.1 — Sweep recipes em `base-theme.ts`

Substituir 46 referências:

| De | Para |
|---|---|
| `borderRadius.small` | `'small'` |
| `borderRadius.medium` | `'medium'` |
| `borderRadius.full` | `'full'` |
| `spacing.small` / `spacing.medium` / `spacing.large` | `'small'` / `'medium'` / `'large'` |
| `fontSize.sm` / `fontSize.small` / `fontSize.md` / `fontSize.xsmall` | `'sm'` / `'small'` / `'md'` / `'xsmall'` |
| `fontWeight.medium` | `'medium'` |
| `letterSpacing.normal` / `letterSpacing.tight` / `letterSpacing.tightest` | `'normal'` / `'tight'` / `'tightest'` |
| `lineHeight: '20px'` (literal) | `lineHeight: 'small'` (após criar alias) |
| `'1px'` (borderWidth literal) | `'hairline'` |
| `'2px'` | `'thin'` |
| `'4px'` (borderLeftWidth do alert) | `'thin'` * 2 ou novo alias `medium` |
| `'white'` literal em button.primary | `'text.inverse'` |

Recipes afetadas: `text`, `button`, `badge`, `card`, `chip`, `avatar`, `alert`, `accordion`, `toast`.

#### 3.2 — Pixels literais → density tokens

Introduzir:

```ts
// foundations/tokens/semantics/sizes/control.ts — NOVO
export const controlSize = {
  sm: '32px',
  md: '40px',
  lg: '48px',
};

// foundations/tokens/semantics/sizes/dialog.ts — NOVO
export const dialogSize = {
  sm: '420px',
  md: '560px',
  lg: '720px',
};
```

Adicionar a `baseTheme.sizes` namespaceado: `sizes.control.sm`, `sizes.dialog.md`. Recipes consomem via alias string. Produto pode override `sizes.control` para densidade compacta.

Switch track widths (`'36px'/'44px'/'52px'`), thumb sizes (`'16px'/'20px'/'24px'`) e avatar sizes (`'24px'/'32px'/'40px'/'48px'/'64px'`) ficam como literais por agora — são proporções intrínsecas ao componente, não decisão de marca. Caso surja produto pedindo, abre TD dedicada.

#### 3.3 — Sweep native components

| Arquivo | Linhas | Ação |
|---|---|---|
| `tab-bar.native.tsx` | 15-16, 57 | `useTheme()` → `colors.brand.base`, `colors.text.secondary`, `colors.feedback.critical.base` |
| `fab.native.tsx` | 9-11 | `useTheme()` para resolver variantes (fecha **TD-005**) |
| `accordion.native.tsx` | 154 | `useTheme()` → `colors.text.{disabled,primary}` |
| `breadcrumb.native.tsx` | 74 | `useTheme()` → `colors.brand.base` |
| `pagination.native.tsx` | 137 | `useTheme()` → `colors.text.disabled` |
| `nav-bar.tsx` | 69 | Blur → consumir token (ver 3.4) |
| `tab-bar.tsx` | 122 | Idem |
| `select.native.tsx` | 226 | `colors.background.overlay` (já existe!) |
| `icon.native.tsx` | 28 | `colors.text.primary` em vez de `'#000000'` |

#### 3.4 — Tokens de blur (`nav-bar`/`tab-bar`)

Adicionar `colors.surface.translucent` ou `colors.background.glass` ao tema:

```ts
// themeLightColors.ts
surface: {
  default:     primitiveColor.neutral.white,
  highlight:   primitiveColor.sandstone['10'],
  raised:      primitiveColor.neutral.white,
  translucent: 'rgba(255, 255, 255, 0.85)',  // NOVO
},
```

`nav-bar.tsx:69` e `tab-bar.tsx:122` consomem via prop `backgroundColor="surface.translucent"`.

#### 3.5 — Matriz de teste

```ts
// foundations/theme/theme-matrix.test.tsx — NOVO
describe('multi-product theming matrix', () => {
  const productB = createTheme(themeLight, {
    mode: 'product-b',
    colors: {
      brand: { primary: '#7C3AED', /*...*/ },
      interactive: { default: '#7C3AED' /*...*/ },
    },
    motion: { duration: { fast: '50ms' } },
    radii:  { small: '8px' },
  });

  it.each([
    ['Button', <Button>X</Button>],
    ['Input',  <Input />],
    ['Switch', <Switch />],
    // ...
  ])('product B identity reaches %s', (_, node) => {
    const { container } = render(
      <ArborProvider theme={productB}>{node}</ArborProvider>
    );
    // assertions visuais via getComputedStyle
  });
});
```

#### 3.6 — Lint anti-literal

```js
// scripts/check-no-color-literal.js — NOVO
// grep recursivo em src/components, exclui *.stories.tsx, *.test.tsx, *.svg
// regex: /rgba\(|#[0-9A-Fa-f]{3,6}/
// falha se hit > 0
```

Adicionar a `pnpm lint` ou hook `pre-commit`.

---

## Decisões e trade-offs

### Por que abrir `ArborTheme` agora?

Sem isso, produtos novos não passam no Provider. É bloqueio direto, não otimização.

**Alternativa rejeitada**: manter união e adicionar produtos via merge declarado. Falha porque cada produto novo exige PR no DS — quebra autonomia do consumidor.

### Por que brand alias e não pure semantic?

Hoje `brand.base` é alias semântico, mas quem trocar a marca precisa atualizar 9 entradas independentes. Camada brand reduz a 1 ponto de mudança (`brand.primary`) com derivações explícitas.

**Alternativa avaliada**: derivação automática de shades via OKLCH/HSL. Rejeitada para esta RFC — adiciona dependência (culori) e complexidade. Registrada como TD futura.

### Por que `transition()` runtime via hook em vez de helper estático?

Helper estático não consulta tema; override de motion não chega. Hook é a única forma honesta de fazer motion themable. Helper estático é preservado para casos onde tema não importa (animações fora de árvore React).

### Por que pixels literais (switch track, avatar) ficam?

São proporções intrínsecas ao componente, não decisões de marca. Trocar avatar de `40px` para `36px` é decisão de density (futura). `medium` em `sizes` representa espaçamento, não dimensão de control. Manter explícito reduz acoplamento.

### Risco do PR 3

Volume alto. 46 substituições mecânicas + 7 native + 1 matriz + 1 lint. Mitigação: PRs internos em waves se necessário, mas mantemos um único PR conceitual. Suíte 894 testes captura regressão imediata.

---

## Plano de execução

| PR | Escopo | Risco | Suíte esperada |
|---|---|---|---|
| **PR 1** | `ArborTheme` aberto + brand alias + `createBrandPalette` + CONTRIBUTING§"Criando um produto" | Baixo | 894 (sem novos testes funcionais) |
| **PR 2** | Motion+focusRing no `baseTheme` + `useTransition`/`useMotion` + 6 transition strings migradas | Médio | 894 + 2 (override propaga) |
| **PR 3** | Sweep 46 refs em recipes + 7 native + matriz + lint anti-literal | Alto (volume) | 894 + matriz (~10–15) |

Cada PR autônomo. Suíte verde no fim de cada um. Push só com aprovação explícita.

**TDs fechadas no caminho**: TD-005 (fab.native theming).

---

## Critérios de aceitação

- [ ] **PR 1**: `<ArborProvider theme={produtoB}>` tipa sem erro; `themeLight`/`themeDark` continuam funcionando; suíte 894/894.
- [ ] **PR 1**: `themeLightColors.brand` tem `primary/secondary/accent/onPrimary/onSecondary`; helper `createBrandPalette()` funcional.
- [ ] **PR 1**: CONTRIBUTING.md tem §"Criando um produto" com snippet copiável.
- [ ] **PR 2**: `baseTheme.motion` e `baseTheme.focusRing` existem; `themeLight.motion.duration.fast` resolve.
- [ ] **PR 2**: `useTransition()` retorna função que respeita override do tema.
- [ ] **PR 2**: 0 ocorrências de `transition: ['"]` em `src/foundations` + `src/components` (exceto helpers).
- [ ] **PR 3**: 0 referências diretas a `borderRadius.X`/`fontSize.X`/`spacing.X`/`fontWeight.X`/`letterSpacing.X` em `src/foundations/theme/base-theme.ts`.
- [ ] **PR 3**: 0 ocorrências de `rgba(`/`#hex` em `src/components/**/*.{ts,tsx}` exceto `*.stories.tsx`/`*.test.tsx`/SVG (script `check-no-color-literal.js` verde).
- [ ] **PR 3**: matriz de tematização — produto B com identidade distinta — verde.
- [ ] **PR 3**: TD-005 fechada em `docs/TECH_DEBT.md`.
- [ ] Suíte total ≥ 894 verde.
- [ ] `pnpm lint` + `pnpm tsc -b` verdes.
- [ ] `check-platform-contract --strict` verde.

---

## Apêndice — Auditoria detalhada

### Cor literal em componentes (`src/components`)

```
accordion/core/accordion.native.tsx:154    '#9CA3AF' / '#1A1A1A'
breadcrumb/core/breadcrumb.native.tsx:74   '#18736A'
fab/core/fab.native.tsx:9-11               '#18736A' '#E5F4F3' '#FFFFFF' '#1A1A1A'
fab/core/fab.native.tsx:62                 '#000' (shadowColor)
icon/core/icon.native.tsx:28               '#000000' (currentColor fallback)
nav-bar/core/nav-bar.tsx:69                'rgba(255,255,255,0.85)'
pagination/core/pagination.native.tsx:137  '#9CA3AF'
select/core/select.native.tsx:226          'rgba(0,0,0,0.4)' [↳ existe colors.background.overlay]
tab-bar/core/tab-bar.native.tsx:15-16,57   '#18736A' '#6B7280' '#E53E3E'
tab-bar/core/tab-bar.tsx:122               'rgba(255,255,255,0.85)'
```

### Transition strings raw

```
base-theme.ts:288  radio.control      'border-color 0.15s ease, background-color 0.15s ease'
base-theme.ts:340  switch.track       'background-color 0.2s ease'
base-theme.ts:346  switch.thumb       'transform 0.2s ease'
counter.tsx:107                       'background-color 0.2s'
counter.tsx:176                       'background-color 0.2s'
radio.tsx:107                         'background-color 0.15s ease'
```

### Imports diretos de primitives em `base-theme.ts` (46 total, amostra)

```
linha 135  borderRadius: borderRadius.small
linha 137  fontWeight: fontWeight.medium
linha 152  paddingLeft: spacing.small
linha 154  fontSize: fontSize.sm
linha 499  borderRadius: borderRadius.full      (badge)
linha 504  fontSize: fontSize.xsmall            (badge)
linha 515  borderRadius: borderRadius.medium    (card)
linha 527  padding: spacing.medium              (card)
linha 538  borderRadius: borderRadius.full      (chip)
linha 556  fontWeight: fontWeight.medium        (avatar.fallback)
linha 575  fontWeight: fontWeight.medium        (alert.title)
linha 599  fontWeight: fontWeight.medium        (toast.title)
[...]
```
