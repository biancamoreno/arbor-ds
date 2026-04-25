# RFC-0017 — Recipes mortas em R6 (Checkbox / Radio / Switch / Select)

**Status**: Accepted
**Autores**: @bia
**Data**: 2026-04-25
**Implementada**: 2026-04-25
**PR**: (commit local, sem PR remoto)

**Origem**: R6 review (`CR6-6`) · referência precedente: TD-008 (resolvido)

> **Status: Accepted (2026-04-25)** — todas as 4 recipes (`checkbox`, `radio`, `switch`, `select`) consumidas via `useSlotRecipe` em web; native consome onde a abstração permite (Checkbox total; Switch parcial via `theme.colors.*` por limitação do `RNSwitch` primitive). TD-015 fechado pelo caminho B (Switch elementar — `Switch.Track`/`Switch.Thumb` removidos do export). 646 testes verdes (637 → 646 com 9 smoke tests novos). Stories `Theming` adicionadas em cada componente.

---

## Motivação

`base-theme.ts` declara recipes para os 5 componentes de R6. Quatro delas — `checkbox`, `radio`, `switch`, `select` — **não são consumidas** pelos componentes correspondentes. O visual é sempre desenhado com hardcodes inline (`width: '18px'`, `borderRadius: 4`, etc.).

Inventário ao abrir esta RFC:

| Recipe | Linhas em `base-theme.ts` | Consumida via `useSlotRecipe`? |
|---|---|---|
| `checkbox` | 226–242 | ❌ |
| `radio` | 244–261 | ❌ |
| `switch` | 263–287 | ❌ |
| `select` | 289–324 | ❌ |
| `field` (R5) | — | ✅ (RFC-0014) |
| `input` (R5) | — | ✅ (TD-008, 2026-04-24) |

### Por que importa

É **a mesma raiz de TD-008**. A recipe declarada parece autoritativa para quem lê o tema; o consumidor que tenta `createTheme(themeLight, { components: { checkbox: { ... } } })` **não vê efeito** — silenciosamente. Falha de DX que vira frustração de adoção.

Sintomas observáveis:
- **Theming dinâmico quebrado** — dark mode token-driven não afeta os 4 componentes.
- **`createTheme` overrides ignorados** — cliente externo não consegue rebrandar Checkbox/Radio/Switch/Select.
- **Surface area mentirosa** — recipe existe, é tipada, é exportada, mas é dead weight.
- **Cumulativo** — cada novo componente que copia esse padrão dobra a dívida.

### Por que agora

1. **Antes de R7** — feedback indicators (Spinner, ProgressBar, ProgressCircle) também declaram recipes. Resolver o padrão antes evita repetir o erro.
2. **TD-008 já validou a abordagem** — `input` foi migrado para slot recipe consumida via `useSlotRecipe`. Existe playbook.
3. **R6-D (RadioCard) e R6-F (Select combobox)** vão refatorar Radio/Select. Mais barato consolidar recipe junto.

---

## Proposta

Para cada uma das 4 recipes, decidir entre dois caminhos com critério objetivo:

### Critério de decisão

| Pergunta | Resposta → caminho |
|---|---|
| O componente tem **3+ variantes visuais** previstas (incluindo size, state, intent)? | **Sim → consumir** (caminho A) |
| O componente é **rebrandeável** por consumidor externo (cores, raios, tipografia)? | **Sim → consumir** (caminho A) |
| O visual é trivial e estável (sem variantes além de size)? | **Não → remover** (caminho B) |
| Existe paridade com versão `.native.tsx`? | **Sim → consumir** (caminho A, reaproveita tokens cross-platform) |

### Decisão por componente

| Componente | Caminho | Justificativa |
|---|---|---|
| `checkbox` | **A — consumir** | Tem `.native.tsx` (paridade), rebrandable, 3 sizes |
| `radio` | **A — consumir** | RadioCard depende dela (RFC-0019), 3 sizes, rebrandable |
| `switch` | **A — consumir** | Tem `.native.tsx`, 3 sizes (track/thumb dimensionados), rebrandable |
| `select` | **A — consumir** | 7 slots reais (`trigger`/`content`/`item`/etc), 3 sizes, parte da RFC-0020 |

**Nenhum componente entra no caminho B nesta RFC.** Todas as 4 recipes serão consumidas — não há candidato óbvio para remoção.

### Caminho A — consumir via `useSlotRecipe`

Para cada componente:

1. **Auditar slots reais.** A lista de slots da recipe (`'root' | 'indicator' | 'label' | 'description'` etc.) deve casar com o que o componente realmente renderiza. Ajustar a recipe se faltar slot ou houver fantasma (HR6-2 — Switch slots).
2. **Consumir via hook.** Substituir hardcodes por `const slots = useSlotRecipe('checkbox', { size, state })` + spread por slot.
3. **Mapear `state` real.** Cada componente tem estados visuais (`idle` / `checked` / `disabled` / `invalid`). Adicionar à recipe se não existir.
4. **Manter pixel-paridade visual com a release atual.** Esta RFC não muda o visual; só move de hardcode → token-consumed.

```tsx
// Antes (Checkbox web atual)
<Box style={{ width: 18, height: 18, borderRadius: 4, ... }} />

// Depois
const slots = useSlotRecipe('checkbox', { size, state });
<ArborTransform {...slots.indicator} />
```

5. **Native consume a mesma recipe.** Onde `.native.tsx` existe (Checkbox, Switch), o native consome via `useSlotRecipe` também. Garante paridade web ↔ native em theming.

### Ordem de execução proposta

1. **Checkbox** — menor (4 slots), tem `.native.tsx` para validar paridade. Serve de piloto.
2. **Switch** — depende da decisão de R6-E (Switch.Track/Thumb slots fantasma). Resolve RFC + TD-015 juntos.
3. **Radio** — pré-condição de RFC-0019 (RadioCard).
4. **Select** — slots maiores, parte de RFC-0020. Pode ir junto com refator do combobox.

---

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **Remover as 4 recipes do theme** | Quebra a expectativa de rebranding. R6 já tem caso de uso real (Checkbox custom em e-commerce, Select com brand color). |
| **Consumir só algumas (ex.: Checkbox + Switch)** | Inconsistência. Consumidor não saberia quais componentes aceitam override e quais não. Reproduz exatamente o problema de TD-008 (recipe `input` vs `frame`). |
| **Adiar para depois de R7** | R7 vai introduzir mais recipes (Spinner, ProgressBar). Sem padrão consolidado, dobra superfície. |
| **Adicionar warning de runtime para overrides ignorados** | Paliativo. Resolve a frustração silenciosa mas não a raiz. |

---

## Impactos e trade-offs

- **Breaking change?** **Não** — visual permanece pixel-equivalente. Surface area pública inalterada.
- **Impacto em bundle size**: marginal (≤ 2 kB). Recipes já estão no bundle como dead weight; passam a ser executadas.
- **Impacto em performance**: marginal. `useSlotRecipe` adiciona um hook resolve por mount; cacheado por theme.
- **Impacto em DX**: **alto positivo**. `createTheme` passa a funcionar para os 4 componentes. Override consistente com Field/Input.
- **Impacto em acessibilidade**: zero direto. Indireto positivo: paridade web ↔ native em theming reduz divergência (relacionado a TD-009).
- **Codemod necessário?** Não — refator interno.

### Riscos

| Risco | Mitigação |
|---|---|
| Pixel-drift acidental durante migração | Snapshots visuais via Storybook + revisão lado-a-lado. Testes web de R6 já cobrem comportamento. |
| Slot definido na recipe não existir no componente real (Switch) | Tratar como bloqueante de R6-E. Se Switch.Track/Thumb forem removidos (TD-015), recipe perde os slots. |
| `state` variant não cobrir todas combinações reais (`checked + disabled`) | Adicionar `compoundVariants` na recipe. Padrão já validado em `field`/`input`. |

---

## Critérios de aceite

- [ ] Cada uma das 4 recipes tem `state` cobrindo `idle`, `checked`/`active`, `disabled`, `invalid` (onde aplicável).
- [ ] Cada componente consome sua recipe via `useSlotRecipe` em web.
- [ ] Onde existe `.native.tsx`, o native também consome via `useSlotRecipe`.
- [ ] `createTheme(themeLight, { components: { checkbox: { ... } } })` afeta o visual visível.
- [ ] Nenhum hardcode de cor, raio, dimensão ou border permanece nos componentes — tudo vem da recipe ou de tokens semânticos.
- [ ] Storybook mostra `Theming` story para cada componente provando o override.
- [ ] Suite de testes existente continua verde (web + native).

---

## Notas de implementação

### Dependência com outras RFCs

- **RFC-0019 (RadioCard)** consome `radio` recipe — precisa da migração antes ou junto.
- **RFC-0020 (Select combobox)** vai refatorar Select; consolidar recipe na mesma PR é mais barato que duas passadas.
- **TD-015 (Switch slots fantasma)** define o conjunto final de slots. Resolver antes da migração de Switch.

### Referência consolidada

- [TD-008](../TECH_DEBT.md#td-008) — recipe `input` migrada para slot recipe `frame`/`control`. Mesmo playbook.
- [`docs/reviews/R6-form-selection.md`](../reviews/R6-form-selection.md) — achados consolidados.
