# R7 — Feedback / Indicadores (consolidação)

**Status:** ✅ concluído (2026-05-02)
**Revisor:** arbor-ds-arch
**Componentes:** [Spinner](./spinner.md) · [Skeleton](./skeleton.md) · [Badge](./badge.md) · [ProgressBar](./progress-bar.md) · [ProgressCircle](./progress-circle.md)

---

## Resumo executivo

| Componente | Score (Visual / Compor. / Funcional / Código / Gov.) | Top achado | Classificação |
|---|---|---|---|
| **Spinner** | 3/2/3/5/2 | SP-1 sistêmico (`sm/md/lg`); SP-2 motion themable | ⚠️ aprovado com fixes (aplicados) |
| **Skeleton** | 2/1/4/5/3 | SK-1 (label suprimível); SK-12 (keyframe local→provider) | ⚠️ aprovado com fixes (aplicados) |
| **Badge** | 2/0/3/4/3 | B-3 recipe morta; B-12 a11y do Anchor | ⚠️ aprovado com fixes (parcial — B-3 pendente) |
| **ProgressBar** | 2/2/4/5/3 | PB-5 paridade native quebrada; PB-1 sistêmico | ⚠️ aprovado com fixes (parcial — PB-4/PB-5 pendentes) |
| **ProgressCircle** | 2/1/5/5/5 | PC-1 refuta SP-1 universal; modelo arquitetural de R7 | ✅ aprovado (fixes aplicados) |

**Suite ao final da fase:** **923/923 verde** (912 antes da fase + 11 novos: 7 Skeleton + 2 Spinner + 1 Badge + 1 ProgressBar). `tsc -b` ✓ · `lint` ✓ · `platform-contract --strict` ✓ · `no-color-literal` ✓.

---

## Patterns sistêmicos identificados

### 1. SP-1 — `sm/md/lg` em controles vs. `small/medium/large` em primitivos

**Confirmado em 4 consumidores:** Spinner, Button, Badge, ProgressBar.
**Refutado em 2:** Skeleton (size é width/height runtime-dynamic), ProgressCircle (size em px).

**Insight:** o pattern atinge **controles com tamanhos pré-definidos**, não todos os componentes. **Componentes geometria-driven** (Skeleton, ProgressCircle, Image) usam `number`/`string` corretamente — a inconsistência é local aos controles.

**Action:** **RFC dedicada** — escopo cirúrgico (rename literal nos 4 consumidores + codemod). Sem alias/depreciado (TD-012).

---

### 2. Pattern "extends HTMLAttributes leakage"

**Atingidos (corrigidos):**
- Spinner (SP-4) ✅
- Skeleton (SK-4) ✅
- Badge (B-2/B-18) ✅
- ProgressBar (PB-2) ✅

**Modelo correto:** ProgressCircle (PC-3) — JSDoc explícito: "Não estende `SVGAttributes` para preservar paridade cross-platform".

**Padrão emergente para CONTRIBUTING:** componentes `@platform shared` ou `native-ready` **não devem estender `HTMLAttributes`/`SVGAttributes`/`*HTMLElement`**. Surface enxuta com `style?: CSSProperties` + `className?: string` explícitos.

**Action:** **status: fechado em R7.** Vale documentar a regra em CONTRIBUTING para sweep R8 (Alert/Toast/Tag/Chip).

---

### 3. Pattern "motion themable parcial"

**Atingidos:**
- Spinner: literal em web e native (`0.8s linear` / `duration: 800`)
- Skeleton: literal em ambas (`1.4s ease-in-out` / `duration: 700`)
- ProgressBar: determinate ✅, indeterminate literal (`2.1s cubic-bezier(...)`)
- ProgressCircle: determinate ✅, indeterminate literal (`1.2s linear` / `duration: 1200`)

**Pattern:** componentes consomem `transition()` no caminho **determinístico**, mas o caminho **indeterminate** (loop infinito) usa CSS `animation` ou `Animated.loop` direto — fora do alcance de `transition()`.

**Action:** issue cross-componente. Possíveis caminhos:
- (a) Helper novo `loopAnimation(name, duration, easing)` que consome `theme.motion`.
- (b) Migrar literais para constantes derivadas de `theme.motion` em runtime (perde otimização de classname static).
- (c) Aceitar limitação e documentar.

**Decisão deferida** para issue dedicada — não é bloqueante.

---

### 4. Pattern "reduced motion native quebrado"

**Atingidos:**
- Spinner.native (SP-3)
- Skeleton.native (SK-3)
- ProgressCircle.native (PC-14)

**Web:** todos respeitam via `REDUCED_MOTION_CSS` global injetado pelo `ArborProvider` ✅.
**Native:** `Animated.loop` continua rodando independente de `AccessibilityInfo.isReduceMotionEnabled()`. **WCAG 2.3.3 quebrado em RN.**

**Bloqueado por:** **R1-C4** (`usePrefersReducedMotion.native`) — issue conhecida do R1 ainda pendente.

**Action:** **destravar R1-C4 prioritariamente** ou abrir issue cross-componente "pause de Animated.loop em reduced motion" depois que C4 entregar o hook native.

---

### 5. Pattern "label hard-coded em pt-BR / sem default"

| Componente | Default | Override |
|---|---|---|
| Spinner | `'Carregando'` | `label?` |
| Skeleton | `'Carregando'` (após SK-1) | `label?: string \| false` |
| ProgressBar | (sem default) | `label?` |
| ProgressCircle | (sem default) | `label?` |
| Badge | N/A | — |

**Inconsistência cross-componente:** Spinner/Skeleton têm default, ProgressBar/ProgressCircle não. Algumas labels em pt-BR hard-coded — não internacionalizável.

**Action:** decisão de produto pendente em CONTRIBUTING:
- (a) Default sempre em inglês (`'Loading'`) — neutralidade internacional.
- (b) Default sempre em pt-BR e produto i18n é responsabilidade do consumidor (envolver em `<I18nProvider>`).
- (c) Sem default; `label` obrigatório.

**Sweep cross-componente** ao fim de R7 + R8 (Alert/Toast também terão labels).

---

### 6. Pattern "recipes mortas ou ausentes"

| Componente | Recipe declarada? | Recipe consumida? |
|---|---|---|
| Spinner | ❌ | ❌ |
| Skeleton | ❌ | ❌ |
| Badge | ✅ (`badge` em `base-theme.ts:499`) | ❌ — lookup imperativo de 38 LOC |
| ProgressBar | ❌ | ❌ |
| ProgressCircle | ❌ | ❌ |

**Inconsistência sistêmica:** ContexT (TD-008) padronizou Input via `defineSlotRecipe`. Em R7, **só Badge tem recipe (e está morta)**. Não há política clara sobre quando criar recipe.

**Action:** **RFC ou nota em CONTRIBUTING** definindo o critério: "use recipe quando: variant × variant > 4 combinações, OU theming por produto for relevante para o eixo (cor/spacing/radii), OU houver slot composto". **Migrar Badge para slot recipe** vira issue dedicada (B-3) com pré-condições B-4/B-5.

---

### 7. Pattern "feedback tones inconsistentes"

| Componente | Tones cobertos |
|---|---|
| Badge | 6 (`neutral`, `brand`, `success`, `warning`, `critical`, `info`) |
| ProgressBar | 4 (`brand`, `success`, `warning`, `critical`) |
| ProgressCircle | 4 (`brand`, `success`, `warning`, `critical`) |

**Inconsistência:** Badge admite `neutral`/`info`; barras de progresso não.

**Plus:** Badge cai em `'transparent'` literal para `info subtle` — **token `feedback.info.subtle` ausente** (`status.info` solo em `colors.status.*`).

**Action:**
- (a) Criar `type FeedbackTone = 'neutral' | 'brand' | 'success' | 'warning' | 'critical' | 'info'` em `foundations` e tipo derivado para componentes que admitem subset.
- (b) Adicionar `theme.colors.feedback.info.{base,subtle,strong}` ao baseTheme.
- (c) Decidir cross-componente: ProgressBar/Circle com `info`/`neutral`? Ou justificar que progresso não admite "neutro/info" semanticamente.

**Cabe em sweep R8** (Alert/Toast também terão tones).

---

### 8. Pattern "@platform shared mente para indeterminate"

**Atingido:** ProgressBar (PB-5).

`@platform shared` (mesmo arquivo `.tsx` para web e native via Box) **não funciona** quando o componente usa `@keyframes` CSS em algum branch. Em RN, `style.animation` é silenciosamente ignorado — produto que ativar `indeterminate` em mobile vê barra estática a 35%.

**Outros componentes em risco:** qualquer `@platform shared` que use `animation`/`transition` CSS deve ser auditado. **Ação preventiva:** auditar Alert/Toast/Tag/Chip em R8 com este filtro.

**Action:** issue dedicada "ProgressBar.native via Animated.loop" + auditoria preventiva R8.

---

### 9. Pattern "stories violam TD-024"

**Atingidos (corrigidos):**
- Spinner stories.Sizes ✅
- Skeleton stories.CardSkeleton ✅
- Badge stories.AllTones/Subtle/Sizes/WithAnchor ✅ (cor literal `#eee` removida)
- ProgressBar stories.AllTones/Sizes ✅
- ProgressCircle stories.AllTones/Sizes — **pendente**

**Status TD-024:** **5 de 6 stories migradas em R7.** Pode encerrar TD-024 após sweep ProgressCircle stories + sweep R8.

---

### 10. Padrão "displayName ausente"

**Atingidos (corrigidos):**
- Spinner ✅
- Skeleton ✅
- Badge ✅ (Badge + Badge.Anchor)
- ProgressBar ✅

**Já tinha:** ProgressCircle.

**Status:** R7 padronizado.

---

### 11. Padrão "duplicação cross-platform de fillColor"

**ProgressCircle:** `fillColor` lookup duplicado entre `.tsx` e `.native.tsx`. **Corrigido (PC-10)** via `internal/colors.ts` exportando `getToneColor(tone, theme)`.

**Outros componentes em R7 não sofrem:** Spinner usa `theme.colors.brand.base` direto; Skeleton usa `theme.colors.background.subtle/interactive`; ProgressBar tem lookup mas só em um arquivo (`@platform shared`).

**Insight:** quando `@platform shared` virar `platform-split` (PB-5 fix), ProgressBar também vai duplicar. **Vale extrair `getFeedbackToneColor()` em `foundations`** (utility cross-componente para R8 — Alert/Toast).

---

### 12. A11y do Badge.Anchor

**Caso isolado** (não-pattern). Badge.Anchor sem suporte a screen reader resulta em "3" anunciado sem contexto sobre uma `<button>Notificações</button>`.

**Action:** issue dedicada — adicionar prop `srLabel?: string` no Anchor.

---

## Fixes aplicados em R7 (commit pendente)

### Sweep coletivo

- **Provider:** `@keyframes arbor-shimmer` movido para `GLOBAL_CSS` (centralizando todos os 4 keyframes).
- **`extends HTMLAttributes` removido** de: SpinnerProps, SkeletonProps, BadgeProps, BadgeAnchorProps, ProgressBarProps. Surface enxuta + `style?: CSSProperties` + `className?` explícitos.
- **`displayName` adicionado** em: Spinner, Skeleton, Badge, Badge.Anchor, ProgressBar.
- **Stories TD-024 sweep:** 5 stories migradas para Box/Flex com tokens.
- **Cor literal `#eee`** removida da story `Badge.WithAnchor`.

### Spinner (SP-4/6/11/12/13)

- `SIZE_MAP` extraído para `internal/sizes.ts`.
- `color` promovido para prop declarativa em Flex (cascata via `currentColor`).
- JSDoc documentando dependência de `@keyframes arbor-spin` no Provider.

### Skeleton (SK-4/6/9/11/12/1+7)

- `injectKeyframes()` removido — keyframe agora mora no Provider.
- Cast `Number(theme.radii.nano) || 4` removido (radii é número direto).
- Prop `label?: string | false` adicionada (alinha com Spinner). `label={false}` suprime role + marca `aria-hidden`/`accessibilityElementsHidden`.
- Story nova `SuppressedAnnouncement`.

### Badge (B-2/11/13/15)

- `BadgeRoot.displayName = 'Badge'`, `BadgeAnchor.displayName = 'Badge.Anchor'`.
- `backgroundColor`/`color`/`borderColor` promovidos para prop declarativa em Flex.

### ProgressBar (PB-2/9/12)

- Story nova `Indeterminate` (com nota explícita sobre PB-5).

### ProgressCircle (PC-8/10/11)

- JSDoc da interface corrigido: `@platform shared` → `@platform native-ready`.
- Slot `children?` removido da interface (YAGNI).
- `getToneColor(tone, theme)` extraído para `internal/colors.ts`. Drift web↔native eliminado.

---

## Follow-ups pendentes

### RFC

- **SP-1** — RFC de naming canônico de `size` (`sm/md/lg → small/medium/large`). 4 consumidores confirmados (Spinner, Button, Badge, ProgressBar). Codemod simples. **Aguardar review R4 (Button) ser revisitada** ou simplesmente incluir Button no escopo.

### Issue (não-bloqueante)

- **PB-5** — `progress-bar.native.tsx` com `Animated.loop` no fill indeterminate. Quebra `@platform shared`; vira `native-ready`.
- **B-3** — migrar Badge para `defineSlotRecipe` (após B-4/B-5).
- **B-4 / B-5** — `theme.colors.feedback.info.{base,subtle,strong}` adicionado; `colors.status.info` aliasado ou removido.
- **B-12** — prop `srLabel?` em `BadgeAnchor`.
- **B-count** — `count?`/`max?` em Badge para badges numéricos com truncamento (`99+`).
- **PC-15 / PB-clamp-typesafe** — discriminated union para `progress`/`indeterminate`.
- **Tones cross-componente** — `type FeedbackTone` em `foundations` + decisão sobre ProgressBar/Circle admitir `info`/`neutral`.
- **Motion indeterminate themable** — helper `loopAnimation()` ou similar.
- **Label default cross-componente** — sweep CONTRIBUTING.
- **TD-024** — sweep ProgressCircle stories + R8.
- **Reduced motion native** — bloqueado por **R1-C4** (`usePrefersReducedMotion.native`).
- **Recipe policy** — RFC ou nota em CONTRIBUTING definindo "quando criar recipe".

### Cross-componente (R7+R8)

- **`getFeedbackToneColor()` utility** em `foundations` (preempt PB-5 split + R8 Alert/Toast).
- **Auditoria preventiva** de `@platform shared` que use `animation`/`transition` CSS — listar componentes em risco antes de R8.

---

## Definition of Done R7

- [x] 5 reviews preenchidos (5 eixos por componente).
- [x] Achados ❌ aplicados como fix imediato (10 fixes aplicados).
- [x] Achados ⚠️ catalogados como issue/RFC (lista acima).
- [x] `pnpm test` verde (923/923).
- [x] `tsc -b`/`lint`/`platform-contract --strict`/`no-color-literal` verdes.
- [x] Entradas em `MEMORY.md` para padrões emergentes (este consolidado).

---

## Notas de arquiteto

**ProgressCircle é o componente mais maduro de R7.** Foi o único a passar a barra arquitetural integralmente desde a sua entrega original (RFC-0023). **Catalogar como referência em CONTRIBUTING §"Componentes cross-platform — checklist":**

- [ ] Interface não estende `HTMLAttributes`/`SVGAttributes` (vaza para RN).
- [ ] `displayName` declarado.
- [ ] Tokens via prop declarativa quando possível; `style` só para escape hatch genuíno.
- [ ] Paridade native real (não placeholder).
- [ ] Cobertura de testes profunda em ambas plataformas.
- [ ] PeerDeps de RN documentadas via RFC.

**A maior dívida de R7 é PB-5** — `@platform shared` mente sobre indeterminate. É o tipo de bug que só aparece em produto real (web não pega). Vale priorizar a issue dedicada.

**A RFC de SP-1** virou deliverable forte com escopo cirúrgico. Pattern fechado: 4 consumidores controle-driven; 2 não-atingidos (geometria-driven). Codemod trivial. Boa primeira RFC pós-R7.

**Recipes mortas/ausentes** é o achado mais sistêmico do DS hoje — atinge R6 (recipes Input/control via slot — TD-008 fechada), R7 (Badge declarada e morta; outros sem). Vale uma decisão arquitetural antes de R8 chegar.
