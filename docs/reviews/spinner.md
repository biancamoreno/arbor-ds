# Review — `Spinner`

**Fase:** R7 · **Camada:** `feedback` · **Status:** `concluído`
**Revisor:** arbor-ds-arch · **Data:** 2026-05-02 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:**
  - `src/components/spinner/core/spinner.tsx` (33 LOC)
  - `src/components/spinner/core/spinner.native.tsx` (56 LOC)
  - `src/components/spinner/interfaces/SpinnerProps.ts` (17 LOC)
- **Story:** `src/components/spinner/core/spinner.stories.tsx` (3 stories: `Default`, `Sizes`, `CustomColor`).
- **Testes:** `spinner.test.tsx` (10 cases) + `spinner.native.test.tsx` (4 cases).
- **Implementação nativa:** `sim` (paridade — `Animated.loop` rotacionando `Icon`).
- **Classificação cross-platform:** `universal`.
- **Dependências internas:** `Flex`, `Icon`, `useTheme`.
- **Consumidores conhecidos:** `Button` (`button.tsx:139`, `button.native.tsx:187` — loader com `size="sm"`).

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ⚠️ | 3 sizes declarados; story `Sizes` mostra os 3 ✅. **Sem story `Theming`** (matriz produto B) e **sem story `ReducedMotion`**. |
| 1.2 | Tokens semânticos | ❌ | `SIZE_MAP = { sm: 16, md: 24, lg: 40 }` — pixels crus duplicados em `spinner.tsx:6` e `spinner.native.tsx:14`. Não consome `theme.sizes.control` nem `iconSize` (RFC-0028). Produto consumidor não consegue reescalar via tema. |
| 1.3 | Estados visuais | ✅ N/A | Indicador indeterminado — único estado é "girando". |
| 1.4 | Escala de tamanhos coerente com DS | ❌ | `'sm' \| 'md' \| 'lg'` enquanto Icon foi normalizado para `'xsmall' \| 'small' \| 'medium' \| 'large' \| 'xlarge' \| 'hero'` (RFC-0028). **Inconsistência cross-componente.** Button compartilha o mesmo namespace `sm/md/lg` (`Button.ts:14`), o que sugere padrão "control" não-normalizado. **Achado sistêmico** — pertence a R13. |
| 1.5 | Contraste ≥ WCAG AA em light/dark | ⚠️ | Default consome `theme.colors.brand.base`; sem teste explícito de contraste contra `surface.default` em ambos os modos. |
| 1.6 | Microinterações usam `transition()` | ❌ | Web: `'arbor-spin 0.8s linear infinite'` literal. Native: `duration: 800`, `Easing.linear` literais. Não consomem `theme.motion.duration`/`theme.motion.easing` — exatamente o que RFC-0027 PR2 endereçou para outros componentes. |
| 1.7 | Animações respeitam `usePrefersReducedMotion` | ⚠️ | Web ✅ via `REDUCED_MOTION_CSS` global injetado pelo `ArborProvider` (corta animation-duration → `0.01ms`). **Native: ❌** — `Animated.loop` continua rodando independente de `AccessibilityInfo.isReduceMotionEnabled()` (segue R1-C4 pendente). WCAG 2.3.3 quebrado em RN. |
| 1.8 | Ícones usam `<Icon>` do DS | ✅ | `LoaderCircle` via `<Icon>` em ambas as plataformas. |

**Observações livres:**
- O `@keyframes arbor-spin` é injetado via `<style>` global no `provider.tsx:17`. Funciona, mas **acopla Spinner ao ArborProvider montado** — render fora do provider (testes isolados, SSR sem hidratação) congela o ícone. Não é uma falha, mas merece nota arquitetural: o keyframe deveria ser um detalhe interno do componente (style local) ou explicitamente documentado como contrato do provider.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado | ✅ N/A | Sem interação — não-focável. |
| 2.2 | Focus management | ✅ N/A | Sem foco. |
| 2.3 | `role` correto + `aria-*` | ⚠️ | Web: `role="status"` + `aria-label` ✅. Native: `accessibilityRole="progressbar"` + `accessibilityLabel` ✅. **Roles divergentes** entre plataformas — decisão razoável (RN não tem `status`), mas não documentada. Pode confundir QA cross-platform. Sem `aria-live="polite"` explícito (o `role="status"` implica `aria-live="polite"`, mas o anúncio do leitor de tela depende da implementação). |
| 2.4 | Anúncios a leitor de tela | ⚠️ | `role="status"` anuncia mudança de conteúdo, mas o Spinner é puramente decorativo aqui — **o consumidor (ex: Button loading)** quem deveria anunciar "Carregando, botão Enviar". Pode haver anúncio duplo se o Button já anuncia `aria-busy`. |
| 2.5 | Touch target ≥ 44×44 | ✅ N/A | Não-interativo. |
| 2.6 | Controlado × não-controlado | ✅ N/A | Stateless. |
| 2.7 | Evento cancelável | ✅ N/A | — |
| 2.8 | RTL | ✅ N/A | Geometria circular. |

**Observações livres:**
- Default `label = 'Carregando'` (pt-BR) hard-coded. **Não-internacionalizável** sem o consumidor passar `label`. Padrão estabelecido em FileUpload (RFC-0026) é `texts` prop ou aceitar `label`. Aqui o `label` já é prop — só o default é local. **Decisão deliberada do projeto?** Não documentada.

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API mínima; sem props redundantes | ⚠️ | Surface enxuta: `size`, `color`, `label`, `style`, `...props` (HTML). Mas `extends HTMLAttributes<HTMLSpanElement>` vaza ~50 props (eventos mouse, `dir`, `lang`, `tabIndex`, ARIA bruto) para a API pública — anti-pattern listado na rubrica. |
| 3.2 | Naming segue convenção | ❌ | `size: 'sm' \| 'md' \| 'lg'` — divergente da convenção pós-RFC-0028 (`'small' \| 'medium' \| 'large'`). |
| 3.3 | Defaults "least surprise" | ⚠️ | `size='md'` ✅. `color` → `theme.colors.brand.base` ✅. `label='Carregando'` — pt-BR hard-coded (ver 2.4). |
| 3.4 | Combinações inválidas bloqueadas via tipo | ✅ | `size` é union; `color` é string aberta (escape hatch — ver 3.x). |
| 3.5 | Polimorfismo via `as` | ❌ | Não suportado. Spinner sempre renderiza `Flex as="span"` (web) ou `View` (native). Dado que é puramente decorativo e tem role/label próprios, polimorfismo aqui não agregaria valor. **OK manter sem `as`.** |
| 3.6 | `forwardRef` + `displayName` | ❌ | Função simples — sem `forwardRef`, sem `displayName`. Outros componentes do DS têm. Inconsistência. |
| 3.7 | Compound | ✅ N/A | — |
| 3.8 | Tipos públicos exportados | ✅ | `SpinnerProps` exportado em `index.ts`. |

**Surface area atual:**

```ts
export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;
}
```

**Observações livres:**
- **`color: string`** aceita literal qualquer (`'#ff0000'`, `'rgb(...)'`, `'red'`). Contorna o sistema de tokens — produto que troca brand não muda o spinner sem refatorar consumidores. Deveria aceitar token semântico (`'brand.base' | 'feedback.critical.base' | 'text.primary'` etc) ou simplesmente herdar `currentColor` (web já faz internamente!) e deixar o consumidor envolver em `<Box color="...">`.
- **`extends HTMLAttributes<HTMLSpanElement>`** + interface compartilhada com native — **typing leak** (RN ignora `onClick`/`tabIndex`/`dir`). Mesmo anti-pattern fechado em Toast/FileUpload.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | Web e native usam `Flex` + `Icon`. Stories usam `<div>` com `style` inline (TD-024). |
| 4.2 | Sem `style={{...}}` onde há prop equivalente | ❌ | Web: `style={{ width, height, color, animation }}` — `width`/`height` têm prop, `color` tem prop. Só `animation` é escape hatch legítimo. Native: `style={{ width, height }}` — idem. |
| 4.3 | Estrutura de pasta | ✅ | `core/`, `interfaces/`, `index.ts` ✅. Sem `styles/` (não tem recipe — ver 4.4). |
| 4.4 | Estilo via `defineRecipe`/`defineSlotRecipe` | ❌ | Sem recipe. `SIZE_MAP` é constante local. Não permite override de tamanho/cor por tema. Pequeno demais para slot recipe; recipe simples (`spinner` com variant `size`) faria sentido. |
| 4.5 | Sem `any`, sem cast, sem `console.*` | ✅ | Limpo. |
| 4.6 | Cobertura de testes | ⚠️ | 10 cases web (variantes, label, color, style, role) — sólido. 4 cases native — superficial (`renders without crashing` em 3 sizes, sem assertion de transform/animation). **Sem teste de tema** (override de `brand.base` muda a cor renderizada?). **Sem teste de reduced-motion**. |
| 4.7 | Stories | ⚠️ | 3 stories (Default, Sizes, CustomColor). Faltam: `Theming` (matriz produto B), `ReducedMotion`, `InsideButton` (uso composto real). Story `Sizes` viola TD-024 (`<div style>` em vez de `<Flex gap>`). |
| 4.8 | `.native.tsx` presente | ✅ | Sim, com paridade real (não placeholder). |
| 4.9 | Imports respeitam camadas | ✅ | `foundations` → `ecosystem` → `components`. |

**Métricas rápidas:**
- LOC: 33 (web) + 56 (native) + 17 (props) = **106 LOC**.
- Nº de testes: **14** (10 web + 4 native).
- Nº de stories: **3**.
- Dependências externas: **0** runtime (Lucide via peerDep do Icon).

**Observações livres:**
- **Duplicação de `SIZE_MAP`** entre `.tsx` e `.native.tsx` — extrair para `interfaces/` ou `internal/`.
- **Web emite `color` no `style`** mas o Icon recebe `color="currentColor"` — funciona porque o `color` do span é herdado. Dependência implícita; uma refatoração ingênua quebra.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público em `src/components/index.ts` | ✅ | — |
| 5.2 | Tipos públicos exportados | ✅ | `SpinnerProps`. |
| 5.3 | Mudança proposta tem changeset | ⚠️ | Sem mudança em curso. |
| 5.4 | Breaking change tem RFC | ❌ | Renomeação de `sm/md/lg → small/medium/large` é breaking — exige RFC sistêmica (Spinner + Button + qualquer outro consumidor). |
| 5.5 | Guia de migração | ❌ | Idem 5.4. |

---

## 6. Resumo executivo

**Score por eixo:** Visual `3/8` (3 N/A) · Comportamental `2/8` (5 N/A) · Funcional `3/8` · Código `5/9` · Governança `2/5`

**Top 3 achados (por impacto):**

1. **S-1 (sistêmico)** — `size` em `'sm' \| 'md' \| 'lg'` divergente do resto do DS. Inconsistência atinge Spinner + Button (pelo menos). Gatilho de RFC sistêmica para R13.
2. **S-2 (themability)** — `SIZE_MAP` em pixels crus + `'arbor-spin 0.8s linear infinite'` literal. Produto consumidor não consegue ajustar tamanho/duração via tema. Viola RFC-0027 (contrato themable mínimo).
3. **S-3 (a11y)** — Spinner native não respeita `prefers-reduced-motion` (R1-C4 pendente). WCAG 2.3.3 quebrado em RN. `Animated.loop` precisa pausar quando `AccessibilityInfo.isReduceMotionEnabled()` for true.

**Outros achados:**
- **S-4** — `extends HTMLAttributes<HTMLSpanElement>` em props compartilhada com native (anti-pattern já fechado em Toast/FileUpload).
- **S-5** — `color: string` aceita literal qualquer; deveria ser token semântico ou herdar via `currentColor` (escape hatch documentado).
- **S-6** — Sem `forwardRef` + `displayName`. Inconsistente com restante do DS.
- **S-7** — Default `label='Carregando'` em pt-BR hard-coded; sem `texts` prop ou prop de i18n.
- **S-8** — Roles divergentes web (`status`) × native (`progressbar`) sem documentação da decisão.
- **S-9** — Stories incompletas (sem Theming/ReducedMotion/InsideButton); story `Sizes` viola TD-024.
- **S-10** — Testes native superficiais (sem assertion de transform); sem teste de tema; sem teste de reduced-motion.
- **S-11** — `style={{ width, height, color }}` em vez de prop declarativa (anti-pattern documentado).
- **S-12** — `SIZE_MAP` duplicado entre `.tsx` e `.native.tsx`.
- **S-13** — `@keyframes arbor-spin` mora no provider; acoplamento implícito não documentado.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores (S-4, S-5, S-6, S-9, S-10, S-11, S-12 cabem em PR de polimento)
- [ ] ❌ Requer mudanças antes da próxima release

S-1, S-2, S-3, S-7, S-8 entram na trilha de RFC/issue (não bloqueiam release; bloqueiam consistência sistêmica).

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review) — **aplicados em 2026-05-02**

- [x] **S-4** — `SpinnerProps` enxuto (sem `extends HTMLAttributes`); surface explícita: `size`, `color?`, `label?`, `style?: CSSProperties`, `className?`. ✅
- [x] **S-6** — `Spinner.displayName = 'Spinner'` (web e native). ✅
- [x] **S-11 (parcial)** — `color` promovido para prop declarativa do `<Flex>` (web); cascata via `currentColor` no Icon preservada. `width`/`height` mantidos via `style` por serem números fixos derivados do `size` (não há prop equivalente — `theme.sizes.control` ainda não consumido aqui; rastreado em S-2 / RFC-0027 follow-up). Story `Sizes` migrada de `<div style>` para `<Flex gap="medium" alignItems="center">`. ✅
- [x] **S-12** — `SIZE_MAP` extraído para `src/components/spinner/internal/sizes.ts`; importado por `.tsx` e `.native.tsx`. Tipo `SpinnerSize` exposto à interface. ✅
- [x] **S-13 (doc)** — JSDoc do `SpinnerProps` atualizado documentando que web depende de `@keyframes arbor-spin` injetado pelo `ArborProvider`. ✅

**Resultado:** Suite **919 → 921/921 verde** (+2 testes — `displayName` web e native). `tsc -b` ✓ · `lint` ✓ · `platform-contract --strict` ✓ · `no-color-literal` ✓.

### Issue (mudança localizada, sem breaking change)

- [ ] **S-9** — adicionar stories `Theming` (matriz produto B), `ReducedMotion` (decorator forçando media query) e `InsideButton` (uso real).
- [ ] **S-10** — testes: tema (override de `brand.base` muda cor renderizada), reduced-motion (web), `transform` real no native (snapshot do `Animated.View` style).
- [ ] **S-8 (doc)** — registrar em `CONTRIBUTING.md` §"Cross-platform a11y" a decisão de `role="status"` (web) × `accessibilityRole="progressbar"` (native).

### RFC (sistêmico ou breaking change)

- [ ] **S-1 / S-2** — **RFC nova: "Naming canônico de `size` em controles cross-componente"**. Escopo: Spinner, Button, IconButton, FAB (se houver) e qualquer outro componente com namespace `sm/md/lg`. Decisão: migrar todos para `'small' \| 'medium' \| 'large'` (alinhado a Icon RFC-0028 e ao restante do DS), ou justificar por que `control` é eixo separado de `icon`/`spacing`. Inclui guia de migração e codemod simples (rename literal). **Trigger:** R7 — múltiplos componentes da fase compartilham a inconsistência. Aguardar achado se repetir em ProgressBar/ProgressCircle antes de redigir; se confirmar, ir como deliverable de R13 ou RFC dedicada (preferência: RFC dedicada — escopo claro, breaking change pequeno).
- [ ] **S-2 (motion)** — Spinner consome `theme.motion.duration.slow`/`theme.motion.easing.linear` via `transition()`/`useTransition()`. Cabe em RFC-0027 follow-up ou issue dedicada.
- [ ] **S-3** — depende de **R1-C4** (`usePrefersReducedMotion.native`) ser implementada primeiro. Adicionar issue separada ligada a C4: "Spinner.native pausa Animated.loop quando reduced motion estiver ativo".
- [ ] **S-7** — decisão de produto (default em inglês × pt-BR). Sem RFC necessária; só precisa de stance documentada e aplicada consistentemente em Spinner + FileUpload + outros componentes com label.

---

## 8. Notas de arquiteto

- **Padrão emergente cross-componente:** `'sm' \| 'md' \| 'lg'` em controles versus `'small' \| 'medium' \| 'large'` em primitivos. Se ProgressBar/ProgressCircle usarem `sm/md/lg`, vira deliverable forte de R7. Se usarem `'small' \| 'medium' \| 'large'`, o problema é só Spinner+Button — ainda RFC, mas escopo menor. **Anotar para reforço durante reviews da fase.**
- **Padrão emergente em feedback indicators:** todos vão tocar motion tokens (Spinner, ProgressBar indeterminate, ProgressCircle). Vale validar se `theme.motion.duration.slow`/`xslow` cobrem (loop spinner ≈800ms; progress indeterminate ≈1500–2000ms). Possível gap.
- **Acoplamento Spinner ↔ ArborProvider:** o `@keyframes` global é elegante para evitar repetição entre Spinner/ProgressBar, mas torna o provider obrigatório para que Spinner gire. Isso é razoável (`useTheme` já obriga o provider), mas merece nota explícita no contrato — nenhum doc registra hoje.
- **Ergonomia da prop `color`:** se a futura RFC de `size` for adiante, vale aproveitar para tipar `color` como `keyof ThemeColors | string` (semântica primária, escape hatch como literal). Padrão usado em `Text` ainda não chegou aqui.
