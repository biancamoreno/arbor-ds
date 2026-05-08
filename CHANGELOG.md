# arbor-ds

## Unreleased

### Breaking

- **RFC-0041 PR1 — Polish visual default (foundations + Button piloto):** refinamento coordenado em 8 eixos. Pré-v1 sem consumidores externos; sem aliases legacy. Override pelo tema continua trivial (`createTheme(themeLight, { ... })`).
  - **Brand default trocado de `aqua` para `forestGreen`.** Decisão de identidade alusiva ao nome "arbor" (folha viva). `themeLight.colors.brand.solid` agora é `#1C541A` (forestGreen 90, derivado de ForestGreen 70 `#2D8229` que é a face viva da marca). `themeDark` segue simétrico via `makeDarkColorScale`. Primitive `forestGreen` estendida com steps `110` e `120` (derivados linearmente de `100` ↔ preto). Para reverter: `createTheme(themeLight, { colors: { brand: createBrandPalette('#1BA285').light } })`.
  - **Tipografia:** primitive `fontWeight` ganhou `600`; primitive `fontSize` ganhou `40/48/60/72`. Semantic `fontWeight` ganhou `semibold` (= 600); **`bold` agora redireciona para 600** (antes 700) por decisão de identidade contemporânea (Linear/Vercel/Stripe). `extrabold` (= 700) preservado para ênfase máxima. Semantic `fontSize` ganhou `displaySmall/displayMedium/displayLarge/displayHero`.
  - **Sombras multi-layer:** `shadows.{sm,md,lg,xl,cardHover}` migradas de single-layer (cinza puro alpha 0.08–0.20) para stack multi-layer suave (alpha 0.04–0.14). `cardHover` agora é stack idêntico a `lg`. `shadows.brand.*` (tinted) **fica para PR2** — requer infra de resolução brand→rgb que merece atenção dedicada; PR1 usa `shadows.sm` no hover do Button (lift neutro).
  - **Motion snap:** `motion.duration.fast` 100→120ms, `normal` 200→160ms, `slow` 300→240ms; `motion.easing.standard` migrou de `cubic-bezier(0.4, 0, 0.2, 1)` (Material) para `cubic-bezier(0.16, 1, 0.3, 1)` (easeOutQuart, "Linear/Vercel snap"); `decelerate` para easeOutQuint. `usePrefersReducedMotion` continua zerando duration. Testes com `setTimeout(200)` em transições podem ficar flaky — adaptar.
  - **`controlSize` 36/44/52** (era 32/40/48). Touch target WCAG 2.5.5 nativo em `medium` — overlay `::before` deixa de ser necessário em Button/Input/Select; remanescentes (Switch, Counter button) ainda dependem (TD-016 fica parcialmente fechada). Override desktop denso: `createTheme(themeLight, { sizes: { control: { medium: '40px' } } })`.
  - **`background.subtle` agora é `#FAFAF9`** (off-white quente sutil, "premium" Stripe/Notion-style). Cinza neutro antigo (`sandstone[10]`) realocado em `background.muted` (role novo) para casos que precisam dele. `themeDark.background.muted` mapeia em `neutral[110]`.
  - **Foco visível com glow:** `focus.ringGlow` (semantic novo) é `rgba(brand.solid, 0.20)` em light e `0.25` em dark, pré-computado via helper colocal `hexToRgba` (alpha não é runtime-editável; produto que precisa de outra anatomia substitui o role). CSS global do Provider mudou de `outline transparente + box-shadow stack` para `outline sólido + outline-offset + box-shadow glow externo`. Anatomia (largura/offset/raio do glow) **não** é themable — defaults WCAG 2.4.7/2.4.11.
  - **Button piloto:** `tokens.components.button.fontWeight` 'medium' → 'semibold'. Recipe `button` em `base-theme.ts` ganhou `_hover: { opacity: 0.92 }` e `_active: { opacity: 0.8 }` (fade-only, sem deslocamento físico do componente — decisão pós-review). Aplicável só a `<Button>` no PR1; sweep para os demais ~25 componentes vai no PR2.
  - **Storybook:** nova página `Foundations/Polish v1 — Default visual` com showcase do default forestGreen + Button piloto + 12 swatches de brand + display sizes (40/48/60/72). Aprovação destrava PR2.

### Changed

- **Button consome a recipe `button` via `useRecipe`** — antes aplicava `variantStyles` lendo `theme.colors.*` direto e fixava `paddingInline`/`paddingBlock` em px hardcoded local. Agora override via `createTheme({ components: { button: { colors: { primary: { bg: '...' } } } } })` propaga ao CSS renderizado (validado em `component-tokens-cascade.test.tsx`). Mesma raiz de TD-008/RFC-0017 antes do slot recipe vir. Token `button` ganhou variant `danger` (alinhada com a interface) + slot `padding.{block}`. Recipe `button` ganhou cascata completa (`borderColor`, `transition`, `borderStyle`). ButtonGroup `attached` continua colapsando radii via override pontual.

### Breaking

- **RFC-0040 PR1 — Component tokens estruturados + reconciliação `theme.recipes`:** a chave `theme.components` (que carregava recipes desde sempre) foi renomeada para `theme.recipes` para alinhar com o vocabulário que o resto da engine já usa (`useRecipe`, `defineRecipe`, `RecipeConfig`, pasta `recipes/`). A chave `theme.components` agora carrega **tokens de componente** (camada 4 da cascata documentada em `docs/ARCHITECTURE_DIRECTION.md` §2.1).
  - **Override de recipes:** quem usava `createTheme(themeLight, { components: { input: { slots, base, variants } } })` deve passar a usar `createTheme(themeLight, { recipes: { input: { ... } } })`. Sem aliases legacy (precedente TD-012). Codemod aplicado em todas as stories/tests internos.
  - Tipo `ThemeComponents` em `src/foundations/theme/types.ts` renomeado para `ThemeRecipes`.
  - Nova pasta `src/foundations/tokens/components/` com 20 arquivos (input, button, card, field, tabs, dialog, drawer, chip, tag, badge, alert, toast, accordion, carousel, switch, checkbox, radio, select, avatar, tooltip). Cada arquivo expõe um objeto de strings que resolvem em runtime (alias semantic ou referência cruzada). Sem literais de cor/timing — gate `pnpm test:component-tokens-no-literal`.
  - Engine ganha resolver `$<token>.<path>`: recipes em `base-theme.ts` consomem `'$input.padding.medium.inline'` em vez de `'12px'`. Resolver é recursivo — uma string retornada continua sendo resolvida no scale corrente até um valor concreto. Sweep total das 19 recipes — gate `pnpm test:recipe-no-component-literal`.
  - Tokens semantic novos: `sizes.touchTarget = { minimum: '44px', dense: '48px' }` (consolida WCAG 2.5.5 que vivia hardcoded em 5 recipes); `opacity.disabled = 0.6` (eliminou 5 ocorrências literais).
  - **Override de tokens:** `createTheme(themeLight, { components: { input: { borderRadius: 'large' } } })` propaga via cascata — toda recipe que consome `$input.borderRadius` reflete o novo valor. Funciona em web e native. Validado em `src/__tests__/component-tokens-cascade.test.tsx`.
  - **Limitações conhecidas (não bloqueiam release):** `<ArborProvider>` ainda emite só `--arbor-brand` e `--arbor-surface` como CSS vars; emissão completa fica para PR2 da RFC-0040. `Button` componente aplica estilos manualmente em vez de consumir a recipe — override de `components.button.colors.primary.bg` não chega ao CSS hoje (mesma raiz de TD-008/RFC-0017 antes do slot recipe vir; refactor pequeno na fila).

- **RFC-0039 — Paleta com 12 papéis nominais:** cada família themable (`brand`, `gray`, `feedback.{info,success,warning,critical}`) passa a expor uma `ColorScale` de 12 steps (numérico `1..12` + alias nominal Radix-style: `bg/bgSubtle/bgElement/bgElementHover/bgElementActive/borderSubtle/border/borderHover/solid/solidHover/text/textContrast`).
  - Vocabulário antigo (`subtle/soft/base/strong`) **removido sem aliases** (precedente TD-012). Codemod aplicado em todo o repo:
    - `brand.subtle` → `brand.bgElement` · `brand.soft` → `brand.bgElementActive` · `brand.base` → `brand.solid` · `brand.strong` → `brand.solidHover`
    - `feedback.X.subtle` → `feedback.X.bgElement` · `feedback.X.base` → `feedback.X.solid` · `feedback.X.strong` → `feedback.X.solidHover`
  - Campos legados de identidade (`brand.{primary,secondary,accent,onPrimary,onSecondary}`) e tipos `BrandPalette`/`BrandShades` **removidos** — `theme.colors.brand` é agora uma `ColorScale` pura.
  - Calibração visual deliberada: `brand.solid` (= `aqua.90`) é mais escuro/saturado que o antigo `brand.base` (= `aqua.60`). Componentes que usavam `brand.base` para ícone/borda passam a renderizar com tom mais forte. Contraste com texto inverse melhora de AA limítrofe para AAA.
  - **`createBrandPalette('#hex')`** reescrito: nova assinatura recebe a cor `solid` da marca (1 string) e retorna `{ light: ColorScale; dark: ColorScale }` — escala de 12 papéis gerada por interpolação sRGB. Override por step disponível via segundo argumento.
  - **`themeLightColors`/`themeDarkColors`** ganham `gray` (sobre primitive `neutral`) como família themable de 12 papéis.
  - Primitives `emerald`, `red`, `orange`, `neutral` estendidas com steps `110` e `120` (text/textContrast). Script `scripts/extend-palette.js` pode regenerar.
  - Novo gate CI: `pnpm test:contrast` valida pares canônicos WCAG (text/bg AA, textContrast/bg AAA, border/bg AA non-text, text.inverse sobre solid AA) em light + dark. `gray` e `feedback.warning` têm exceções convencionais documentadas no script.
  - Helper `getFeedbackToneColor(theme, tone, slot)` mantém API pública (`'subtle'|'base'|'strong'`) mas mapeia internamente para os papéis canônicos: `subtle → bgElement`, `base → solid`, `strong → text`.

### Added

- **RFC-0034 PR2.C — `Carousel` `orientation: 'vertical'`:** novo prop `orientation?: 'horizontal' | 'vertical'` (default `'horizontal'`) em `<Carousel>`. Web troca `scroll-snap-type` para o eixo Y, calcula altura do slide em vez de largura, e mapeia `ArrowUp`/`ArrowDown` no Tabs pattern; `tablist` ganha `aria-orientation="vertical"`. Native passa `horizontal={false}` à `FlatList` interna e dimensiona o slide via `height` + `marginBottom`. Recipe `carousel` ganhou variant `orientation`. Indicators continuam dispostos horizontalmente (convenção visual, decisão deliberada). Em vertical web o consumidor define a altura do `Carousel.Content` — sem default mágico, alinhado com Embla/Swiper.
- **RFC-0034 PR2.D — `Carousel` `lazy?: boolean`:** novo prop opt-in para virtualização leve. Web: items fora da janela expandida (`rootMargin: 200px`) renderizam placeholder vazio; quando entram, montam children e permanecem montados (sticky — preserva estado de form/video/IO). Cria um segundo `IntersectionObserver` apenas quando `lazy=true`. Native: aplica defaults `windowSize: 3` + `removeClippedSubviews: true` na `FlatList`; `nativeListProps` continua o escape hatch para sobrescrever. Princípio Embla — virtualização é opt-in, não default.
- Stories `VerticalOrientation` e `LazyMounting` (esta com snapshot dos índices montados).
- TD-035 (RFC-0034 v1) marcada **Resolved**.

### Breaking

- **RFC-0031 (SP-1):** props `size`/`padding` de componentes normalizadas para o vocabulário `xsmall | small | medium | large | xlarge`, alinhando-se à camada de primitivos (`spacing`, `borderRadius`, `fontSize`, `iconSize`). Antes: `xs | sm | md | lg | xl`. Afetadas: `Avatar`, `Badge`, `Button`, `Card.padding`, `Checkbox`, `Chip`, `Counter`, `Dialog`, `Drawer`, `FloatingActionButton`, `Field`/`TextInput`/`TextArea`, `ProgressBar`, `Radio`, `Select`, `Switch`, `Tabs`, `Spinner` (consistência interna). Tokens de densidade `sizes.control.{sm,md,lg}` e `sizes.dialog.{sm,md,lg}` renomeados para `{small,medium,large}`. Sem aliases legacy nem janela de transição (precedente TD-012).

## 1.0.0

Primeiro release estável do Arbor-DS. Design system cross-platform, tipado e themable, pronto para sustentar múltiplos produtos sobre a mesma base — Web, iOS e Android.

### Foundations

- Tokens em três camadas (`primitives` → `semantics` → `components`) cobrindo cor, tipografia, espaçamento, raios, sombras, motion, foco, densidade e z-index.
- Camada de **brand alias** (`brand.{primary,secondary,accent,onPrimary,onSecondary}`) e helper `createBrandPalette()` para consolidar identidade num ponto único.
- `motion` themable (`duration`/`easing`) com helpers `transition()` (estático) e `useTransition()` (runtime-aware).
- `focus.ring` desacoplado de `interactive.default` — produtos podem definir cor de foco própria sem arrastar a cor interativa.
- Tokens de densidade (`sizes.control`, `sizes.dialog`) consumidos por recipes para variações compactas/confortáveis sem mexer em primitives.

### Theming multi-produto

- `ArborTheme` é interface **estrutural aberta** (`BaseTheme & { mode: string; colors: ThemeColors }`) — admite produtos arbitrários sem alteração no DS.
- `createTheme(base, override)` permite que um produto ajuste cor, tipografia, raios, sombras, motion e densidade sem editar nenhum arquivo da biblioteca.
- Lint anti-literal (`pnpm test:no-color-literal`) impede regressão para `#hex`/`rgba(...)` em código de runtime.
- Matriz de testes produto × componente garante que overrides propagam por toda a árvore.

### Cross-platform completo

- 100% das ~35 famílias de componentes têm implementação Web (`*.tsx`) **e** native (`*.native.tsx`), com paridade de API e de testes.
- Inventário web-only zero — `pnpm test:platform-contract --strict` verde sem warnings.
- Engine de estilo (`ArborTransform`) compartilhada entre plataformas, com adapters por plataforma quando necessário.
- `react-native-svg` formalizada como peerDependency para suporte a `Icon` e `ProgressCircle` em RN.

### Acessibilidade como contrato

- Foco visível (WCAG 2.4.7) garantido via `_focusVisibleWithin` na engine.
- Touch target (WCAG 2.5.5, 44×44) garantido via `minHeight` + overlay `::before` em todos os controles interativos.
- Combobox WAI-ARIA-compliant em `Select` (activedescendant, type-ahead diacrítico-aware, navegação por teclado completa).
- Overlays (`Dialog`, `Drawer`, `Popover`, `Menu`, `Tooltip`) renderizados via `Portal` + `DismissableLayer` para escapar de ancestrais com `overflow: hidden`.

### Componentes

Layout: `Box`, `Flex`, `Grid`, `Container`, `Center`, `Square`, `Circle`, `Spacer`, `Clickable`, `Image`, `Icon`, `Text`.

Forms: `Field` (compound), `TextInput`, `TextArea`, `Counter`, `Checkbox`, `Radio`, `Switch`, `Select`, `FileUpload`.

Overlays: `Dialog`, `Drawer`, `Tooltip`, `Popover`, `Menu`, `Toast`/`Toaster`.

Conteúdo: `Card`, `Avatar`, `Chip`, `Tag`, `Badge`, `Alert`, `Skeleton`, `Spinner`, `ProgressBar`, `ProgressCircle`, `Accordion`.

Navegação: `NavBar` (top app bar), `TabBar` (bottom), `Tabs`, `Breadcrumb`, `Pagination`, `Button`, `IconButton`, `ButtonGroup`, `FloatingActionButton`.

Dados: `Table` (com slots `Head`/`Row`/`Cell`/`Section`).

### Tooling

- Build em duas saídas (ES + CJS) com emissão de `.d.ts` via `vite-plugin-dts` para todos os entry points (`.`, `./native`, `./foundations`, `./ecosystem`).
- Suíte Jest multi-project (web + native) com 910/910 testes verdes.
- Storybook 10 com 100% dos componentes documentados, showcase de tematização multi-produto e toolbar para alternar entre `Light`/`Dark`/`Product B`.
- Governança: changesets, commitlint + husky, size-limit, dependency-cruiser, RFCs versionadas, `docs/TECH_DEBT.md` formal.

### Pacote npm

- `package.json` com `exports` map cobrindo `import`/`require`/`types` em cada entry.
- `files` field restringindo o tarball a `dist`, `README`, `LICENSE` e `CHANGELOG`.
- Dependências de runtime zero — apenas peerDependencies (`react`, `react-dom`, `react-native`, `react-native-svg`, `react-native-web`, `lucide-react`, `lucide-react-native`).

---

### Initial stable release

- Initial stable release — design system cross-platform com styled-system, temas, tokens semânticos, form components, overlays, navegação, feedback, e documentação viva via Storybook.
