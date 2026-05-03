# RFC-0032 — Catálogo `FeedbackTone` cross-componente

**Status**: **Accepted (2026-05-02) — Implementada (2026-05-02)**
**Autores**: arbor-ds-architect
**Data**: 2026-05-02
**Origem**: pattern sistêmico #7 catalogado nos reviews R7 (consolidado de Badge/ProgressBar/ProgressCircle) e R8 (consolidado de Alert/Toast/Tag/Chip). Promovido a RFC dedicada após sub-onda 8.A fechar `feedback.info.*` em foundations.

---

## Motivação

Após sub-onda 8.A, `themeLight/DarkColors` tem o conjunto canônico de tones de feedback:

```
neutral · brand · success · warning · critical · info
```

Cada um expõe `{ subtle, base, strong }`. Mas **nenhum tipo TypeScript reflete esse conjunto**, e cada componente de feedback declara o seu próprio subset arbitrário:

| Componente | Tones expostos | Falta |
|---|---|---|
| `BadgeProps.tone` | `neutral · brand · success · warning · critical · info` | — (canônico) |
| `AlertProps.tone` | `info · success · warning · critical` | `neutral`, `brand` |
| `ToastProps.tone` | `neutral · info · success · warning · critical` | `brand` |
| `ProgressBarProps.tone` | `brand · success · warning · critical` | `neutral`, `info` |
| `ProgressCircleProps.tone` | `brand · success · warning · critical` | `neutral`, `info` |
| `TagProps.tone` | `neutral · brand` | `success · warning · critical · info` |
| `ChipRootProps.tone` | `neutral · brand` | `success · warning · critical · info` |

Três problemas práticos:

1. **Drift de implementação.** `Alert` resolve cores via `TONE_COLORS` Record local. `Toast` resolve via `TONE_BORDER` local. `Tag` extraiu para `internal/tag-colors.ts` na sub-onda 8.B, `Chip` ainda tem `getChipColors` local. **5 implementações da mesma decisão**: "dado um tone, qual é a cor base/subtle/strong?". Mudar uma esquece as outras (caso real do `status.info` — só o Alert tinha o bug visível).
2. **Surface inconsistente para o consumidor.** Quem precisa de `<ProgressBar tone='info'>` não consegue (ProgressBar não expõe `info`). Quem precisa de `<Tag tone='warning'>` para indicar status não consegue (Tag/Chip não expõem feedback tones).
3. **Contrato de tematização invisível.** Quando um produto consumidor faz `createTheme()` e quer ajustar a paleta de feedback, não há um único ponto de override. Cada componente lê de cores diferentes (Badge via `feedback.X`, ProgressBar via mistura `brand.base`/`feedback.X.base`).

### Por que isso virou RFC e não fix mecânico

A pergunta "Tag/Chip devem aceitar tones de feedback?" não é trivial. Tons de feedback em pílulas pequenas têm trade-off: ganham expressividade (`<Chip tone='warning'>Pendente</Chip>`) mas podem virar carnaval visual em filtros agrupados. Decisão precisa ser explícita.

---

## Proposta

### 1. Tipo canônico em foundations

Criar `src/foundations/tokens/semantics/color/feedback-tone.ts`:

```ts
/**
 * Conjunto canônico de tones de feedback do Arbor-DS.
 * Espelha as chaves disponíveis em `theme.colors.feedback.*` mais
 * `neutral` e `brand` (que vivem em namespaces próprios).
 *
 * Cada componente de feedback (Alert, Toast, Badge, ProgressBar,
 * ProgressCircle, Tag, Chip) deve declarar `tone?: FeedbackTone` —
 * ou um subset explicitamente justificado em CONTRIBUTING.md.
 */
export type FeedbackTone =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'critical'
  | 'info';

export type FeedbackToneSlot = 'subtle' | 'base' | 'strong';
```

Re-exportado de `src/foundations/index.ts`.

### 2. Helper de resolução em foundations

```ts
// src/foundations/theme/get-feedback-tone-color.ts
import type { ArborTheme } from './arbor-theme';
import type { FeedbackTone, FeedbackToneSlot } from '../tokens/semantics/color/feedback-tone';

export function getFeedbackToneColor(
  theme: ArborTheme,
  tone: FeedbackTone,
  slot: FeedbackToneSlot,
): string {
  if (tone === 'neutral') {
    return slot === 'subtle' ? theme.colors.background.subtle
      : slot === 'strong' ? theme.colors.text.primary
      : theme.colors.text.secondary;
  }
  if (tone === 'brand') {
    return slot === 'subtle' ? theme.colors.brand.subtle
      : slot === 'strong' ? theme.colors.brand.strong
      : theme.colors.brand.base;
  }
  return theme.colors.feedback[tone][slot];
}
```

Substitui as 5 implementações locais. Consumido por Alert, Toast, Toast.native, Badge, ProgressBar, ProgressCircle (e `internal/tag-colors.ts`/`getChipColors` quando RFC-0033 fechar).

### 3. Subsets documentados por componente

Cada componente declara subset com motivo explícito em CONTRIBUTING.md. Padrão:

| Componente | Subset proposto | Motivo |
|---|---|---|
| `Badge` | **canônico (6)** | Indicador puro, escala bem em qualquer tone. |
| `Alert` | **canônico (6)** | `info/success/warning/critical` continuam principais; `neutral` cobre "nota informativa sem urgência"; `brand` cobre "anúncio do produto". |
| `Toast` | **canônico (6)** | Mesma justificativa; ganhar `brand` desbloqueia "novidade do produto" sem hack de border. |
| `ProgressBar` | `brand · success · warning · critical · info` (sem `neutral`) | `neutral` num progress não comunica nada (cinza+cinza vira invisível). `info` é justo (download de update). |
| `ProgressCircle` | mesmo de ProgressBar | Coerência. |
| `Tag` | `neutral · brand · success · warning · critical · info` (canônico) | Filtros e categorização ganham expressividade. **Risco de carnaval** mitigado por: tone default `neutral`, recipe `subtle` por padrão (não `solid`). |
| `Chip` | mesmo de Tag | Ver acima. |

### 4. Migração interna (sem breaking)

Cada componente:
- substitui `TONE_COLORS`/`TONE_BORDER`/`getXColors` local por `getFeedbackToneColor(theme, tone, slot)`.
- expande o tipo `tone?` para o subset declarado (Tag/Chip ganham 4 tones; ProgressBar/Circle ganham `info`; Alert/Toast ganham `neutral`/`brand`).
- documenta no JSDoc da prop o subset exato.

**Não há remoção de tones existentes**, então não é breaking — só adições.

### 5. Lint guard contra drift

`scripts/check-feedback-tone-coverage.ts` (novo): valida que toda interface `*Props.ts` que declara `tone?:` usa um subset ou o tipo `FeedbackTone` direto, não literais inline. Roda em CI no mesmo gate de `check-no-color-literal`.

---

## Plano de execução

3 sub-ondas sequenciais:

### PR 1 — Foundations

- `feedback-tone.ts` (tipo + helper).
- Export em `src/foundations/index.ts`.
- 1 teste unitário do helper cobrindo 6 tones × 3 slots × light/dark theme = 36 asserts.

### PR 2 — Migração de consumidores

- Alert / Toast / Toast.native: trocar Records locais pelo helper. Tipo `tone` expandido.
- Badge: substituir mapeamento direto por helper.
- ProgressBar / ProgressCircle / ProgressCircle.native: helper + adicionar `info` ao tipo.
- Tag / Tag.native (`internal/tag-colors.ts`): helper + expandir tipo para canônico.
- Chip / Chip.native (quando RFC-0033 fechar): mesma ordem. Pode ficar fora deste PR e entrar junto com RFC-0033.

### PR 3 — Lint + docs

- `scripts/check-feedback-tone-coverage.ts` + entrada em `package.json` (`pnpm test:feedback-tones`).
- CONTRIBUTING.md ganha §"Feedback tones" com tabela de subsets por componente e regra "novo componente de feedback usa `FeedbackTone` direto, salvo justificativa".
- Storybook: stories de Tag/Chip ganham `WithFeedbackTones` mostrando o ciclo completo.

---

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **Manter subsets ad-hoc; só consolidar tipo nos foundations** | Não resolve o drift de implementação (5 mapeadores locais persistem). Custo de manter sincronizados aumenta com cada novo componente. |
| **Forçar `FeedbackTone` (canônico 6) em todos sem subset** | ProgressBar com `tone='neutral'` é UX ruim (cinza sobre cinza). Forçar paridade visual cega contraria o princípio "API forte é a que diz não". |
| **Slot recipe via `defineSlotRecipe('feedback', { variants: { tone, slot } })`** | Não escala — cada componente tem anatomia diferente (Alert tem ícone+border, Badge é pílula, ProgressBar é trilha). Recipe seria fragmentária. Helper + recipe local por componente é o pragmatismo. |
| **`tone` aceitando string arbitrária + token path (`'feedback.custom.base'`)** | Quebra discoverability (autocomplete morre); abre porta a tones não-WCAG-validados; rebaixa a11y. |
| **Renomear o conjunto (`status` em vez de `feedback`)** | Conflita com `colors.status.*` legado (TD-030). `feedback` é o termo já entronizado em `theme.colors.feedback.*` — mantido. |

---

## Impactos e trade-offs

| Eixo | Avaliação |
|---|---|
| **Breaking change** | **Não** — só adições de tones. Consumidores existentes continuam válidos. |
| **Bundle** | Neutro (helper substitui Records já presentes). |
| **Performance** | 0 (mesmo lookup). |
| **DX** | **Positivo** — vocabulário cross-componente, autocomplete previsível, override por `createTheme()` propaga uniformemente. |
| **A11y** | Neutro a positivo — helper centraliza decisões de contraste. |
| **Tematização** | **Positivo** — produto override `theme.colors.feedback.warning.base` e propaga para Alert/Toast/Badge/ProgressBar/Tag/Chip simultaneamente. |
| **Codemod** | Não necessário (consumidores existentes mantêm uso). Adições são opt-in. |

---

## Critérios de aceite

- [ ] `src/foundations/tokens/semantics/color/feedback-tone.ts` exporta `FeedbackTone` + `FeedbackToneSlot`.
- [ ] `src/foundations/theme/get-feedback-tone-color.ts` exporta helper único; testes 36 asserts (6 × 3 × 2 themes) verdes.
- [ ] Alert / Toast / Toast.native / Badge / ProgressBar / ProgressCircle (ProgressCircle.native) / Tag / Tag.native consomem o helper.
- [ ] `grep -rE "TONE_COLORS|TONE_BORDER|getTagColors|getChipColors" src/components` retorna 0 hits após migração (nomes locais sumiram).
- [ ] CONTRIBUTING.md §"Feedback tones" ativa.
- [ ] `pnpm test:feedback-tones` (script novo) verde.
- [ ] `pnpm test` verde (940 + ~36 novos = ~976).
- [ ] Suite verde em `pnpm tsc -b` · `pnpm lint` · `pnpm test:platform-contract --strict` · `pnpm test:no-color-literal`.
- [ ] Stories Storybook `Badge.AllTones`, `Alert.AllTones`, `Toast.AllTones`, `ProgressBar.AllTones`, `Tag.AllTones`, `Chip.AllTones` reflitam o subset declarado.

---

## Notas de implementação

- **Sequência:** PR 1 → PR 2 (sem dependência entre si para Alert/Toast/Badge/ProgressBar; Tag pode ir junto). Chip fica para depois da RFC-0033 (tone interage com `selected`).
- **Risco em ProgressBar/Circle:** adicionar `info` à tabela de tones implica que `--arbor-progress-tone=info` precisa estar coberto pelas stories — adicionar `Indeterminate` + `Info` ao set.
- **Risco em Tag/Chip:** expansão de 2 → 6 tones desbloqueia uso "filtro com cor de status" mas cabe nota em CONTRIBUTING desencorajando carnaval (regra: 1 tone de feedback por grupo de filtros).
- **Side-effect positivo (TD-030):** com helper único, `colors.status.{info,notice,highlight}` deixa de ter qualquer consumidor, justificando remoção (TD-030 fecha junto).
- **Preparatório TD-034:** o helper desbloqueia o slot recipe completo de Tag/Chip (TD-034). Sem ele, o recipe teria que duplicar resoluções de cor.
- **Compatibilidade RFC-0027 (themable):** o helper usa `theme.colors.feedback[tone]`, então override produto-a-produto via `createTheme({ colors: { feedback: { warning: { base: '#...' } } } })` propaga sem editar componentes.
