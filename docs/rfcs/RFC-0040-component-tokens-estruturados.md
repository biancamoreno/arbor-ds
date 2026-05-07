# RFC-0040 — Component tokens estruturados + emissão de CSS vars

**Status**: Draft
**Autores**: @bia, @arbor-ds-arch
**Data**: 2026-05-06
**PR**: (a definir)
**Depende de**: [RFC-0039](./RFC-0039-paleta-12-papeis-nominais.md) (vocabulário semantic de 12 papéis que os component tokens consomem como aliases)

---

## Motivação

O `docs/ARCHITECTURE_DIRECTION.md` define cinco camadas de tematização (§2.1):

```
1. baseTheme defaults
2. presets de personalidade
3. tokens semantic                ← rico após RFC-0039
4. tokens component               ← inexistente como camada formal
5. CSS vars (web, runtime)        ← emite apenas 2 vars hoje
```

As camadas 4 e 5 estão fracas. Em concreto:

### Camada 4 — component tokens — não existe como pasta

`src/foundations/tokens/` expõe somente `primitives/` e `semantics/`. Não há `tokens/components/`. As recipes em `src/foundations/theme/base-theme.ts` carregam, inline, três tipos distintos de informação que o direcional (§2.2 e §2.3) manda separar:

1. **Cores como referência por string a semantic alias** — saudável. Exemplos: `borderColor: 'border.default'`, `'feedback.critical.base'`, `'interactive.default'`. Override do tema propaga via cascata.
2. **Decisões estruturais themable do componente, cravadas como literais** — problemático. Exemplos vindos de `input` em `base-theme.ts:197-237`:
   ```ts
   borderRadius: 'small'              // alias semantic — ok, mas hardcoded por size
   minHeight: '44px'                  // ❌ literal de touch target
   paddingInline: '12px'              // ❌ literal, não consome spacing
   paddingBlock: '6px'                // ❌ idem
   ```
   O consumidor que quer "input mais arredondado para todo o produto" ou "input mais denso" **só consegue editando a recipe**, o que viola a heurística §3 do direcional ("é binding de um componente específico? → component token") e força uso de `extendTheme()` para algo que deveria estar no contrato canônico.
3. **Mapping variant/state cromático repetido recipe a recipe** — `state.error: { borderColor: 'feedback.critical.base' }` aparece em `input`, e padrões equivalentes em `select`, `field`. Recipe é o lugar de declarar **que existe state error**, não de decidir **qual cor é**. A decisão "estado de erro = critical.base" pertence ao component token; muda lá uma vez, propaga em todos os componentes.

### Camada 5 — CSS vars — emite apenas 2

`src/ecosystem/styled-system/core/provider/provider.tsx:49-53` emite hoje:

```ts
document.documentElement.style.setProperty('--arbor-brand', theme.colors.brand.base);
document.documentElement.style.setProperty('--arbor-surface', theme.colors.surface.default);
```

São as únicas duas. O caso descrito em §2.5 do direcional (`<div style="--arbor-brand-9: #ff0066;">…</div>` para override por subtree sem rebuild) não funciona — `--arbor-brand-9` simplesmente não existe. O canal de subtree-override no web é, hoje, decorativo.

### Bloqueios diretos no roadmap

- **RFC-0045 (presets)**: `shape: 'rounded'` precisa reescrever em bloco os `borderRadius` defaults dos component tokens. Sem a camada existir como mapa, presets não têm onde escrever sem entrar em recipe.
- **RFC-0046 (`extendTheme()`)**: produto consumidor precisa de surface estável de component tokens para sobrescrever sem editar arquivos do DS.
- **RFC-0027 já abriu vocabulário themable de densidade** — `sizes.control` e `sizes.dialog` em `src/foundations/tokens/semantics/sizes/`. Falta o mesmo tratamento generalizado para `input.borderRadius`, `card.padding`, `button.height`, etc., e a **ponte explícita recipe ↔ component token**.

### O problema concretamente

Casos reais que **não** se resolvem hoje sem editar arquivo do DS:

1. "Quero todos os inputs do meu produto com radius médio em vez de small" — exige editar `base-theme.ts:202`. Não há `input.borderRadius` em `createTheme()`.
2. "Quero um produto mais denso, com inputs de 36px em vez de 44px" — `presets.density` ainda não existe (RFC-0045) e `input.minHeight` é literal na recipe.
3. "Quero o botão primary do meu app com cor diferente da brand do produto" — exige editar `defaultVariants` ou variant do button na recipe.
4. "Quero alternar tema de marca em runtime no web sem re-render do provider" — CSS vars não cobrem `--arbor-button-primary-bg` nem `--arbor-input-border-radius`.

---

## Proposta

### 1. Materializar `src/foundations/tokens/components/`

Nova pasta sob `src/foundations/tokens/`. Cada componente themable ganha um arquivo:

```
src/foundations/tokens/components/
  index.ts
  button.ts
  input.ts
  card.ts
  field.ts
  tabs.ts
  dialog.ts
  drawer.ts
  chip.ts
  tag.ts
  badge.ts
  alert.ts
  toast.ts
  accordion.ts
  carousel.ts
  switch.ts
  checkbox.ts
  radio.ts
  select.ts
  counter.ts
  popover.ts
  menu.ts
  tooltip.ts
  fab.ts
  pagination.ts
  breadcrumb.ts
  progress-bar.ts
  progress-circle.ts
  spinner.ts
  skeleton.ts
  avatar.ts
  table.ts
```

Todos os componentes themable do DS recebem o mesmo tratamento na execução, em uma só passada (sem ondas).

### 2. Estrutura canônica de um component token

Cada arquivo expõe um objeto com **três blocos opcionais**:

#### 2.1 Globais do componente (sem variant/state)

```ts
// tokens/components/input.ts
export const input = {
  borderRadius: 'small',
  borderWidth:  'hairline',
  height: {
    small:  'control.small',
    medium: 'control.medium',
    large:  'control.large',
  },
  padding: {
    small:  { inline: 'small',  block: 'micro'  },
    medium: { inline: 'medium', block: 'small'  },
    large:  { inline: 'medium', block: 'small'  },
  },
} as const;
```

#### 2.2 Estruturados por variant/state

Quando a recipe varia color/border por estado, o component token estrutura o mapping:

```ts
// tokens/components/input.ts (continuação)
export const inputColors = {
  background: {
    default: 'surface.default',
    filled:  'background.subtle',
  },
  border: {
    default:  'border.default',
    error:    'feedback.critical.solid',
    focus:    'brand.border',                // alias canônico pós-RFC-0039 (brand[7])
    disabled: 'border.subtle',
  },
} as const;
```

#### 2.3 Bindings cruzados (variant × state)

Para componentes onde combinações são reais (Button primary × hover, Tag info × selected):

```ts
// tokens/components/button.ts
export const buttonColors = {
  primary: {
    bg:        'interactive.primary',
    bgHover:   'interactive.primary.hover',
    bgActive:  'interactive.primary.active',
    text:      'text.onBrand',
    border:    'transparent',
  },
  secondary: { /* ... */ },
  ghost:     { /* ... */ },
  danger:    { /* ... */ },
  disabled:  { bg: 'interactive.disabled', text: 'text.disabled' },
} as const;
```

**Regra absoluta**: component tokens **nunca** carregam valor literal — só strings que resolvem em runtime contra primitives/semantics. Validação por lint script (`pnpm test:component-tokens-no-literal`).

### 3. Integração ao tema (`baseTheme`)

`base-theme.ts` ganha o bloco `components`:

```ts
import * as componentTokens from '../tokens/components';

export const baseTheme: BaseTheme = {
  colors: { /* ... */ },
  spacing: { /* ... */ },
  // ...
  components: componentTokens,           // ← nova chave de primeira classe
  recipes: {
    input: defineSlotRecipe({ /* ... */ }),
    // ...
  },
};
```

`createTheme()` já aceita override de qualquer chave do tema (RFC-0027). Com `components` presente, override fica:

```ts
createTheme(themeLight, {
  components: {
    input: { borderRadius: 'medium' },        // afeta todos os inputs
    button: {
      primary: { bg: '#0066CC' },             // afeta só o primary do button
    },
    card: { padding: { medium: 'large' } },   // padding "medium" do card vira "large"
  },
});
```

Override é **deep merge** — o consumidor reescreve só o que precisa, o resto cai no default do `baseTheme`.

### 4. Recipes consomem component token por string

A recipe **nunca** referencia o objeto `input` diretamente. Usa string com namespace:

```ts
// base-theme.ts — depois
input: defineSlotRecipe({
  slots: ['frame', 'control'] as const,
  base: {
    frame: {
      width: '100%',
      borderRadius:    '$input.borderRadius',
      borderWidth:     '$input.borderWidth',
      borderStyle:     'solid',
      borderColor:     '$input.colors.border.default',
      backgroundColor: '$input.colors.background.default',
      transition: transition(['border-color', 'box-shadow'], 'fast'),
    },
    control: { color: 'text.primary' },
  },
  variants: {
    size: {
      small:  { frame: { minHeight: '$input.height.small',  paddingInline: '$input.padding.small.inline',  paddingBlock: '$input.padding.small.block'  } },
      medium: { frame: { minHeight: '$input.height.medium', paddingInline: '$input.padding.medium.inline', paddingBlock: '$input.padding.medium.block' } },
      large:  { frame: { minHeight: '$input.height.large',  paddingInline: '$input.padding.large.inline',  paddingBlock: '$input.padding.large.block'  } },
    },
    variant: {
      default: { frame: { backgroundColor: '$input.colors.background.default' } },
      filled:  { frame: { backgroundColor: '$input.colors.background.filled'  } },
    },
    state: {
      idle:     {},
      error:    { frame: { borderColor: '$input.colors.border.error'    } },
      disabled: { frame: { borderColor: '$input.colors.border.disabled', opacity: 0.6 } },
    },
  },
  defaultVariants: { size: 'medium', variant: 'default', state: 'idle' },
}),
```

Resolver: extensão do `useSlotRecipe`/engine. Quando encontra string com prefixo `$`, faz lookup em `theme.components` no caminho. Cache por chave de tema. Custo ≈ lookup de objeto + memo. Hoje a engine já resolve `'border.default'` contra `theme.colors`; passa a resolver `'$input.colors.border.error'` contra `theme.components.input.colors.border.error` — mesmo padrão, só amplia a árvore.

### 5. Emissão de CSS vars (web only)

`<ArborProvider>` ganha emissão completa em `useEffect` de tema. Convenção de nome:

```
--arbor-{categoria}-{caminho-com-hifen}
```

Exemplos:

```css
/* Cores semantic (todas, após RFC-0039) */
--arbor-color-brand-1
--arbor-color-brand-2
...
--arbor-color-brand-12
--arbor-color-brand-bg
--arbor-color-brand-solid
--arbor-color-brand-text
--arbor-color-feedback-critical-solid
--arbor-color-surface-default

/* Component tokens — globais */
--arbor-input-border-radius
--arbor-input-border-width
--arbor-input-height-small
--arbor-input-height-medium
--arbor-input-padding-medium-inline

/* Component tokens — variant/state */
--arbor-input-colors-border-default
--arbor-input-colors-border-error
--arbor-button-primary-bg
--arbor-button-primary-bg-hover
--arbor-card-padding-medium

/* Spacing/sizing canônicos */
--arbor-spacing-micro
--arbor-spacing-small
--arbor-spacing-medium
--arbor-radii-small
--arbor-radii-medium
```

Geração automática a partir de `walkTokenTree(theme)` — flatten recursivo de `theme.colors`, `theme.spacing`, `theme.radii`, `theme.shadows`, `theme.motion`, `theme.components`. Saída: objeto `{ '--arbor-…': value }` aplicado de uma vez via `setProperty` em batch.

#### Override por subtree (caso de uso)

```html
<!-- Marca alternativa por seção, sem rebuild do provider -->
<div style="
  --arbor-color-brand-9: #ff0066;
  --arbor-button-primary-bg: var(--arbor-color-brand-9);
">
  <Button>Botão na marca da seção</Button>
</div>
```

**Limite de plataforma** (igual §2.5 do direcional): React Native **não** consome CSS vars. Continua resolvendo via `theme.components` em runtime. Times que precisam de paridade rigorosa entre web e native usam **somente** `createTheme()` como canal de override. CSS vars são bônus de produtividade web.

#### Pegadinha que fica resolvida

O CSS global atual em `provider.tsx:26-29`:

```css
[data-arbor-focusable]:focus-visible {
  box-shadow: 0 0 0 2px var(--arbor-surface, #fff), 0 0 0 4px var(--arbor-brand, #3b82f6);
}
```

Hoje cai no fallback `#3b82f6` em qualquer subtree onde a marca diverge — porque o provider só seta a CSS var no `<html>`. Com emissão completa, qualquer subtree pode redefinir `--arbor-color-focus-ring` localmente sem hack.

### 6. Override em camadas — ordem canônica

Ordem de resolução de um valor (do mais específico ao mais amplo):

```
1. style inline / prop literal       (escape hatch absoluto)
2. CSS var no subtree (web only)     (override runtime)
3. theme.components[name].…          (override do produto via createTheme)
4. baseTheme.components[name].…      (default do DS)
5. recipe base/variant               (declara qual chave consultar)
6. theme.colors / theme.sizing       (alias semantic resolvido)
7. primitive                         (valor bruto)
```

Esta é a operacionalização literal da cascata §2.1 do direcional, agora com a camada 4 implementada.

---

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **A. Manter component tokens dispersos pelas recipes** | Status quo. Bloqueia presets (RFC-0045) e `extendTheme()` (RFC-0046). Override exige editar recipe = editar o DS. |
| **B. Tokens de componente como objeto único `theme.componentTokens`** | Funciona, mas hostiliza split de arquivo, lazy import e tree-shaking. Pasta `tokens/components/` com 1 arquivo por componente é o padrão de mercado (Chakra v3, Radix Themes, Tamagui). |
| **C. Recipes consomem `theme.components` direto, sem prefixo `$`** | Ambíguo: `'border.default'` pode ser `theme.colors.border.default` **ou** `theme.components.X.border.default`. Prefixo `$` deixa o lookup explícito. |
| **D. Emitir todas as CSS vars sempre, mesmo em SSR** | SSR já injeta o tema serializado via styled-components/styled-system. Emitir vars duas vezes (server + client) cria flicker. Mantém o padrão atual: CSS vars em `useEffect` no client. |
| **E. CSS vars com nome curto (`--btn-primary-bg`) em vez de `--arbor-button-primary-bg`** | Curto colide com Tailwind, Radix, Chakra. Prefixo `arbor-` é namespace e custa ~6 caracteres por var — irrelevante. |
| **F. Component tokens carregam valores literais (px, rgba)** | Quebra a regra do direcional §2.3. Component tokens são a camada **acima** da recipe e devem ser ainda mais semânticos. Lint guard impede regressão. |

---

## Impactos e trade-offs

- **Breaking change?** Sem consumidores externos — irrelevante. Internamente, sweep total junto com a migração.
- **Impacto em bundle size**:
  - **JS**: ~+1–2 KB minified (objetos de component tokens — strings curtas, alta compressibilidade gzip).
  - **CSS injetado em runtime**: ~3–5 KB de declarações de CSS vars no `<html>` (web-only). Gzip ~80%.
- **Impacto em performance**:
  - Resolução de recipe: 1 lookup adicional por chave `$` em árvore plana.
  - Emissão de CSS vars: 1 efeito por troca de tema, batch único de `setProperty`.
- **Impacto em DX**:
  - **Forte positivo**: produto consumidor finalmente consegue customizar componente sem editar o DS. Auto-complete em `createTheme({ components: { … } })` lista os tokens. CSS vars no DevTools tornam debug visual trivial.
  - **Negativo controlado**: novo namespace de tokens com aproximadamente 200–300 chaves públicas. Mitigado por geração automática a partir do tipo `BaseTheme` e pela documentação por componente em Storybook.
- **Impacto em acessibilidade**: neutro estrutural. Como side-effect, o focus ring CSS hoje em `provider.tsx:26-29` deixa de cair em fallback hardcoded — passa a respeitar `--arbor-color-focus-ring` derivado de `colors.focus.ring`.
- **Impacto em theming multi-produto**: **forte positivo**. Cada produto pode ter `button.primary.bg` próprio sem tocar o DS, e a matriz produto da RFC-0027 ganha cobertura sobre componentes inteiros.
- **Cross-platform**: contrato canônico de override via `createTheme().components` é idêntico em web e native. CSS vars são bônus web-only documentado.

---

## Critérios de aceite

- [ ] Pasta `src/foundations/tokens/components/` criada, com 1 arquivo por componente themable e `index.ts` re-exportando.
- [ ] Tipo `BaseTheme.components` adicionado em `src/foundations/theme/types.ts`, com inferência por componente.
- [ ] `baseTheme.components` populado a partir de `tokens/components/`.
- [ ] `createTheme()` aceita `{ components: { … } }` com deep merge contra default.
- [ ] Resolver de recipes (`useSlotRecipe`/`useRecipe`) reconhece prefixo `$` e faz lookup em `theme.components`.
- [ ] **Todas** as recipes em `base-theme.ts` migradas: zero literal estrutural (px, rgba, ms) sobrando — só alias semantic ou alias `$`.
- [ ] `<ArborProvider>` (web) emite CSS vars completas para `theme.colors`, `theme.spacing`, `theme.radii`, `theme.shadows`, `theme.motion`, `theme.components` no `<html>`.
- [ ] CSS global atual (`[data-arbor-focusable]:focus-visible`) refatorado para consumir `--arbor-color-focus-ring`.
- [ ] Lint guard `pnpm test:component-tokens-no-literal` impede valor literal em arquivos de `tokens/components/`.
- [ ] Lint guard `pnpm test:recipe-no-component-literal` impede que recipe carregue valor estrutural sem alias `$` (apenas alias semantic ou alias `$` permitidos).
- [ ] Storybook ganha página "Component Tokens" listando, por componente, as chaves disponíveis e os defaults.
- [ ] Storybook ganha página "CSS Vars" demonstrando override por subtree em runtime (DevTools-friendly).
- [ ] Docs `docs/THEMING.md` (criar se não existir) documenta cascade completa com exemplo de override por camada.
- [ ] Testes de matriz produto (RFC-0027 PR3) ampliados para cobrir override em `theme.components`.
- [ ] Testes verdes (suite atual + novos testes de cascade e CSS var emission).
- [ ] `docs/ARCHITECTURE_DIRECTION.md` referenciado na motivação.

---

## Notas de implementação

### Execução em 2 PRs

Sem consumidores externos, a RFC entrega em **2 PRs** — um pela reestruturação de tokens/recipes, outro pela emissão completa de CSS vars (que não toca lógica de recipe).

#### PR1 — Camada `tokens/components/` + resolver `$` + migração total das recipes

- Cria `src/foundations/tokens/components/` com 1 arquivo por componente themable (lista completa da §1).
- Adiciona `BaseTheme.components` em `types.ts` e popula `baseTheme.components`.
- Estende resolver da engine (`useSlotRecipe`/`useRecipe`) para reconhecer prefixo `$`.
- **Sweep total**: todas as recipes em `base-theme.ts` migradas para consumir `$…`. Literais estruturais (px, rgba, ms) eliminados na mesma passada.
- Lint guards `test:component-tokens-no-literal` e `test:recipe-no-component-literal` ativados desde o início.
- Testes de override via `createTheme({ components: {…} })` para pelo menos input, button, card, field, tabs, dialog.
- Matriz produto (RFC-0027 PR3) ampliada para validar override de component tokens.

#### PR2 — Emissão de CSS vars + Storybook + docs

- `<ArborProvider>` ganha `walkTokenTree` + emissão batch de CSS vars no `<html>`.
- CSS global em `provider.tsx` refatorado para consumir `--arbor-color-focus-ring`.
- Storybook: página "Component Tokens" + página "CSS Vars" com exemplo de override por subtree.
- `docs/THEMING.md` finalizado com seção "Cascade completa: 5 níveis de override".
- Suite de testes web valida que CSS vars críticas são emitidas (`--arbor-color-brand-9`, `--arbor-input-border-radius`, `--arbor-button-primary-bg`).

### Riscos identificados

1. **Surface de override aberta demais**: uma vez que `components.button.primary.bg` é público, consumidores podem se acoplar a chaves internas. Mitigação: documentação por componente declara explicitamente quais chaves são **estáveis** (parte do contrato) e quais são **internas** (sujeitas a mudança em minor). Tipo TS marca as internas com sufixo `_internal` ou as omite do tipo público.
2. **Custo de CSS var emission em troca rápida de tema**: produto que troca tema 30x/seg paga 1 batch por troca. Mitigação: batch único + dedupe quando valor não muda. Em prática, troca de tema é evento raro.
3. **Resolução de presets (RFC-0045) sobrepõe component tokens**: presets reescrevem `radii.*`, que reflete em `input.borderRadius` se o token defaultar para `'small'`. Ordem é: preset aplica primeiro, override de `components` aplica depois — RFC-0045 garante essa ordem no `createTheme()`.
4. **`$` como prefixo de alias entra em conflito com algum valor legítimo?**: improvável (CSS não usa `$` em valores). Já há precedente em styled-system / Stitches / Panda. Caso futuro mostre conflito, troca por `@input.borderRadius` é mecânica (codemod).

### Dependências

- **RFC-0039** (paleta 12 papéis): necessária para que component tokens consumam aliases ricos (`'brand.solid'`, `'brand.border'`, `'brand.bgElement'`) em vez do vocabulário antigo de 4 papéis.
- **Habilita**: RFC-0045 (presets reescrevem `tokens/components/*` em bloco), RFC-0046 (`extendTheme()` opera sobre a árvore `components`), RFC-0027 PR4 (matriz produto cobre override de component tokens).

### Referências externas

- [Chakra UI v3 — semantic tokens & recipes](https://www.chakra-ui.com/docs/theming/recipes)
- [Tamagui — component tokens & themes](https://tamagui.dev/docs/intro/themes)
- [Radix Themes — CSS vars structure](https://www.radix-ui.com/themes/docs/theme/overview)
- [Panda CSS — recipes & token aliasing](https://panda-css.com/docs/concepts/recipes)
- `docs/ARCHITECTURE_DIRECTION.md` §2.1 (cascade), §2.2 (camadas), §2.3 (recipes), §2.5 (CSS vars)
- `docs/rfcs/RFC-0027-multi-product-themable-contract.md` (`createTheme()` + matriz produto + density tokens)
- `docs/rfcs/RFC-0039-paleta-12-papeis-nominais.md` (vocabulário semantic consumido pelos component tokens)
