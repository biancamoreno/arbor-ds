# Review — `ProgressBar`

**Fase:** R7 · **Camada:** `feedback` · **Status:** `concluído`
**Revisor:** arbor-ds-architect · **Data:** 2026-05-02 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:**
  - `src/components/progress-bar/core/progress-bar.tsx` (68 LOC)
  - `src/components/progress-bar/interfaces/ProgressBarProps.ts` (16 LOC)
- **Story:** `progress-bar.stories.tsx` (4 stories: `Default`, `AllTones`, `Sizes`, `Complete`).
- **Testes:** `progress-bar.test.tsx` (13 cases) + `progress-bar.native.test.tsx` (3 cases).
- **Implementação nativa:** `não` — declarado `@platform shared` (mesmo arquivo serve web e native via Box). **Mas:** animação `indeterminate` usa `@keyframes` CSS — não funciona em RN (ver PB-5).
- **Classificação cross-platform:** `shared` (declarado), **com bug de paridade** em variant indeterminate.
- **Dependências internas:** `Box`, `useTheme`, `transition`.
- **Consumidores conhecidos:** nenhum interno.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ⚠️ | 4 stories cobrem `progress`, `tone × 4`, `size × 3`, `Complete`. **Sem `Indeterminate` story** (variant existe, sem demo). **Sem `Theming` story.** |
| 1.2 | Tokens semânticos | ⚠️ | Cores via `theme.colors.{brand,feedback}.*` ✅. Layout via tokens (`borderRadius="full"`, `backgroundColor="background.subtle"`) ✅. **Mas:** `HEIGHT_MAP = { sm: 4, md: 8, lg: 12 }` literal, `width: '35%'` no fill indeterminate literal. |
| 1.3 | Estados visuais | ✅ N/A | Estados: determinate (0–100) e indeterminate. Ambos cobertos. |
| 1.4 | Escala coerente com DS | ❌ | `'sm' \| 'md' \| 'lg'` — **quarto consumidor** confirmando o pattern SP-1 (Spinner + Button + Badge + ProgressBar). |
| 1.5 | Contraste ≥ WCAG AA | ⚠️ | Fill (`brand.base` etc) sobre `background.subtle` deve cumprir; sem teste explícito. |
| 1.6 | `transition()` em microinterações | ⚠️ | **Determinate ✅** consome `transition(['width'], 'slow', 'standard')`. **Indeterminate ❌** usa `'2.1s cubic-bezier(0.65,0.815,0.735,0.395)'` literal. Inconsistência interna. |
| 1.7 | `usePrefersReducedMotion` | ⚠️ | Web ✅ via `REDUCED_MOTION_CSS` global. **Native: indeterminate não anima de qualquer jeito (PB-5)**, então não há regressão a corrigir. |
| 1.8 | Ícones do DS | ✅ N/A | — |

**Observações livres:**
- **Recipe `progressBar` não existe em `base-theme.ts`** (verificado via grep). Componente rola sem recipe — diferente de Badge (recipe declarada e morta) e Card/Button (recipes consumidas). Padrão emergente: Skeleton, Spinner, ProgressBar **não têm recipe declarada**; Badge **tem mas não consome**. Inconsistência sistêmica.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado | ✅ N/A | Não-focável. |
| 2.2 | Focus management | ✅ N/A | — |
| 2.3 | `role` correto + `aria-*` | ✅ | `role="progressbar"`, `aria-valuenow`/`aria-valuemin`/`aria-valuemax`, `aria-label`, `aria-busy={indeterminate}`. **Determinate apaga `aria-valuenow` quando `indeterminate=true`** ✅ (segue WAI-ARIA). |
| 2.4 | Anúncios a leitor de tela | ⚠️ | `aria-label` é **opcional sem default** — Spinner/Skeleton têm default `'Carregando'`, ProgressBar não. Inconsistência de API. Sem `label`, leitor pode anunciar só "75 de 100" — sem contexto. |
| 2.5 | Touch target | ✅ N/A | — |
| 2.6 | Controlado | ✅ N/A | — |
| 2.7 | Cancelável | ✅ N/A | — |
| 2.8 | RTL | ⚠️ | Fill cresce de `left` (left:0 implícito do `position:relative`). Em RTL deveria crescer de `right`. Sem `insetInlineStart`. Não testado. |

**Observações livres:**
- API a11y é a melhor de R7 até agora — uma das **únicas implementações cumprindo WAI-ARIA progressbar pattern integralmente**.

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API mínima | ⚠️ | `progress` (obrigatório), `indeterminate?`, `label?`, `size?`, `tone?` — surface enxuta. **Mas extends `HTMLAttributes<HTMLDivElement>`** — typing leak (PB-2). |
| 3.2 | Naming | ❌ | `size: 'sm' \| 'md' \| 'lg'` (PB-1). |
| 3.3 | Defaults | ⚠️ | `indeterminate=false`, `size='md'`, `tone='brand'` ✅. **`label` sem default** — diferente de Spinner. |
| 3.4 | Combinações inválidas via tipo | ✅ | `indeterminate=true` ignora `progress`. Implementação trata via `aria-valuenow={indeterminate ? undefined : ...}`. **Tipo poderia forçar discriminated union:** `{ indeterminate: true; progress?: never } \| { indeterminate?: false; progress: number }`. |
| 3.5 | Polimorfismo via `as` | ❌ | Sem `as`. Decisão razoável (componente é puramente decorativo). |
| 3.6 | `forwardRef` + `displayName` | ❌ | Sem ambos. |
| 3.7 | Compound | ✅ N/A | — |
| 3.8 | Tipos públicos exportados | ✅ | `ProgressBarProps`. |

**Surface area atual:**

```ts
export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  progress: number;
  indeterminate?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'brand' | 'success' | 'warning' | 'critical';
}
```

**Observações livres:**
- `tone` aqui só tem 4 opções (sem `info`, `neutral`). Badge tem 6. **Inconsistência cross-componente** — qual é o "tone canônico" do DS? Vale padronizar (sweep R8).
- Tipo de `progress` é `number` aberto; clamp é runtime. Documentação do tipo poderia ser `number /* 0..100 */`.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | Box ✅. Stories violam (`<div style>`). |
| 4.2 | Sem `style={{...}}` desnecessário | ⚠️ | `style={{ height, ...style }}` — `height` é literal de `HEIGHT_MAP[size]`, podia ser prop. **Mas** mantém compatibilidade com testes que inspecionam `.style.height` (mesmo dilema SK-5). Fill bar `style={{ width: '35%' \| `${n}%`, backgroundColor, animation, transition }}` — `width` é runtime-dynamic ✅, `backgroundColor` tem prop, `animation`/`transition` são escape hatch. |
| 4.3 | Estrutura de pasta | ✅ | — |
| 4.4 | Estilo via `defineRecipe` | ❌ | Sem recipe. Possível, dado que tone × size é simples. Cabe em sweep coletivo de recipes (B-3). |
| 4.5 | Sem `any`, sem cast | ✅ | Limpo. |
| 4.6 | Cobertura de testes | ⚠️ | 13 cases web — sólido em a11y/clamp/size/tone. 3 native superficiais (`renders without crashing`). **Sem teste de tema. Sem teste de animação real.** |
| 4.7 | Stories | ⚠️ | 4 stories. AllTones/Sizes violam TD-024 (`<div style>`). **Sem `Indeterminate` story** apesar do variant existir. Sem `Theming`. |
| 4.8 | `.native.tsx` presente | ⚠️ | Declarado `@platform shared` — mesmo arquivo serve. **Mas** indeterminate **não funciona em RN** (PB-5 — `style.animation` ignorado). Considerar split: `.native.tsx` com `Animated.loop` para o fill indeterminate. |
| 4.9 | Imports respeitam camadas | ✅ | — |

**Métricas rápidas:**
- LOC: 68 (componente) + 16 (props) = **84 LOC**.
- Nº de testes: **16** (13 web + 3 native).
- Nº de stories: **4**.
- Dependências externas: **0** runtime.

**Observações livres:**
- `fillColor` é objeto recriado a cada render. Inline ok para 4 entradas; recipe resolveria.
- **`@keyframes arbor-progress-indeterminate`** é injetado pelo `ArborProvider` (`provider.tsx:21-25`) ✅. Centralizado.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público | ✅ | `ProgressBar` + `ProgressBarProps`. |
| 5.2 | Tipos exportados | ✅ | — |
| 5.3 | Changeset | ⚠️ | N/A. |
| 5.4 | Breaking change tem RFC | ⚠️ | Renomear `sm/md/lg` é breaking (SP-1). Adicionar `Animated.loop` em `.native.tsx` é não-breaking. |
| 5.5 | Migration guide | ✅ N/A | — |

---

## 6. Resumo executivo

**Score por eixo:** Visual `2/8` (3 N/A) · Comportamental `2/8` (5 N/A) · Funcional `4/8` · Código `5/9` · Governança `3/5`

**Top 3 achados:**

1. **PB-5 (paridade quebrada)** — `@platform shared` declara universalidade, mas variant `indeterminate` usa `@keyframes` CSS — **silenciosamente não anima em RN**. Bug latente: produto que mostrar progress indeterminate na app mobile vê uma barra estática a 35%. **Solução:** split `.native.tsx` com `Animated.loop` para o fill indeterminate (igual Skeleton/Spinner já fazem).
2. **PB-1 (sistêmico)** — quarto consumidor confirmando `sm/md/lg` (Spinner, Button, Badge, ProgressBar). **Pattern fechado — RFC sistêmica é deliverable forte.**
3. **PB-2 (typing leak)** — `extends HTMLAttributes<HTMLDivElement>` em `@platform shared`. Mesma família SP-4/SK-4/B-2.

**Outros achados:**
- **PB-4** — duração indeterminate `'2.1s cubic-bezier(...)'` literal; determinate usa `transition()` ✅. Inconsistência interna; migrar indeterminate para tokens.
- **PB-6** — `HEIGHT_MAP` em pixels literais (mesmo SP-12).
- **PB-9** — sem `forwardRef` + `displayName`.
- **PB-12** — stories AllTones/Sizes violam TD-024; sem `Indeterminate` story.
- **PB-13** — `tone` cobre só 4 opções (sem `neutral`/`info`); Badge cobre 6. Inconsistência cross-componente.
- **PB-14** — testes native superficiais.
- **PB-15** — `label?` sem default; Spinner/Skeleton têm `'Carregando'`. Inconsistência API.
- **PB-clamp-typesafe** — discriminated union `{indeterminate}|{progress}` reforçaria contrato no tipo.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores (PB-2/PB-9/PB-12 cabem em sweep; PB-5 é fix de média complexidade — cria `.native.tsx`; PB-4 é fix de uma linha)
- [ ] ❌ Requer mudanças antes da próxima release

PB-5 (cross-platform broken) é o único que cheira a "antes da release" — produto que confiar em `@platform shared` e ativar indeterminate em app mobile vai ver bug. **Recomendação:** corrigir em fix imediato.

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review) — **parcial em 2026-05-02**

- [x] **PB-2** — `ProgressBarProps` enxuto (sem `extends HTMLAttributes`); `style?: CSSProperties` + `className?` explícitos. ✅
- [ ] **PB-4** — pendente. Migrar indeterminate animation para tokens. Cabe em sweep coletivo de motion (família SP-2/SK-2/PC-6).
- [ ] **PB-5** — pendente. **Não cabe em fix imediato** — exige `.native.tsx` novo + testes + Animated.loop. Vira issue dedicada.
- [x] **PB-9** — `ProgressBar.displayName = 'ProgressBar'`. ✅
- [x] **PB-12** — story `Indeterminate` adicionada (com nota explícita sobre PB-5). `AllTones`/`Sizes` migradas para `<Flex flexDirection="column" gap="small" width={400}>`. ✅

### Issue (mudança localizada, sem breaking change)

- [ ] **PB-6** — extrair `HEIGHT_MAP` para `internal/sizes.ts` (mesmo padrão SP-12). Eventualmente migrar para `theme.sizes.control` (família SP-2).
- [ ] **PB-13** — alinhar `tone` com Badge (adicionar `neutral`, `info`) ou registrar decisão "ProgressBar não admite info/neutral porque progresso é semanticamente positivo/preventivo".
- [ ] **PB-14** — testes native: clamp real, tone, tema, animação indeterminate (snapshot do `Animated.Value`).
- [ ] **PB-15** — decidir: `label?` opcional ou default `'Carregando'` (alinhar com Spinner/Skeleton). Sweep cross-componente em R7+R8.
- [ ] **PB-clamp-typesafe** — refatorar tipo para discriminated union `{ indeterminate: true; progress?: never } | { indeterminate?: false; progress: number }`. Breaking se consumidor passa `progress` com `indeterminate=true`. Aceitável (TS detecta na compilação).

### RFC (sistêmico ou breaking change)

- [ ] **PB-1** — RFC de naming canônico de `size` agora tem **4 consumidores confirmados** (Spinner, Button, Badge, ProgressBar). **Pattern fechado.** Falta auditar ProgressCircle (provável quinto). RFC dedicada vira deliverable forte de R7. Escopo: rename `sm/md/lg → small/medium/large` em todos, com codemod (replace literal). Breaking change pequeno + guia de migração.

---

## 8. Notas de arquiteto

- **PB-1 fecha o pattern em 4 consumidores.** Vale redigir a RFC já — espera ProgressCircle só para confirmar (provável). Escopo:
  - Spinner: `'sm' | 'md' | 'lg'` → `'small' | 'medium' | 'large'`
  - Button: idem
  - Badge: `'sm' | 'md'` → `'small' | 'medium'`
  - ProgressBar: idem
  - ProgressCircle: provavelmente idem
  - Sem alias/depreciado (decisão TD-012 — projeto preferiu rip-and-replace).
- **PB-5 é o achado mais sério da fase.** `@platform shared` é uma **promessa de paridade** que aqui mente. Indeterminate não anima em RN. O componente foi declarado universal antes de ter validação visual no Expo. Vale auditar **todos** os `@platform shared` do DS para esse mesmo problema (qualquer componente que use `@keyframes` ou `style.animation` está nesta categoria). Possível trigger: TD-027 follow-up ou nova TD.
- **Padrão emergente "tone × tone × tone":** Badge tem 6 tones, ProgressBar tem 4, Alert/Toast provavelmente têm 4 ou 6. **Quem é a fonte de verdade?** Vale uma decisão arquitetural cross-componente (`type FeedbackTone = 'neutral' | 'brand' | 'success' | 'warning' | 'critical' | 'info'`) reutilizada por todos. Cabe em RFC de governança em R8.
- **Padrão emergente "label opcional sem default vs. default em pt-BR":** Spinner+Skeleton têm `'Carregando'`; ProgressBar não. **Decisão de produto pendente** (sweep R7+R8 em CONTRIBUTING).
- **Padrão emergente "recipes parciais":** Badge tem recipe morta. ProgressBar não tem recipe. Spinner/Skeleton tampouco. Card/Button consomem ✅. **Política do DS sobre quando usar recipe** ainda não está clara — alguns componentes pequenos não usam, outros usam. Vale uma RFC ou nota em CONTRIBUTING definindo "use recipe quando: variant × variant > 4 combinações OU theming for relevante".
