# Review — `Chip`

**Fase:** R8 · **Camada:** `feedback` · **Status:** `concluído`
**Revisor:** arbor-ds-arch · **Data:** 2026-05-02 · **Versão atual:** `1.0.0-beta`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/chip/{core/chip.tsx, context/chip-context.ts, interfaces/ChipProps.ts, index.ts}`
- **Story:** `src/components/chip/core/chip.stories.tsx`
- **Testes:** `core/chip.test.tsx` (13 cases) · **`core/chip.native.test.tsx` AUSENTE** ⚠️
- **Implementação nativa:** `não` — declarado `@platform shared`, sem teste de paridade.
- **Classificação cross-platform:** `universal (shared declarado, não verificado)`.
- **Dependências internas:** `Box`, `Flex`, `Clickable`, `Icon`.
- **Consumidores conhecidos:** —

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ✅ OK | 3 variants × 2 sizes × 2 tones × selected/disabled cobertos. |
| 1.2 | Tokens semânticos | ⚠️ Melhoria | Cores via `useTheme()` (themable runtime ✅). **CH-1:** `padding: '3px 8px'` (sm) e `'5px 12px'` (md) literais. **CH-2:** `gap="4px"` literal. **CH-3:** `lineHeight: 1.4` literal. **CH-4:** `borderColor: 'transparent'` literal (variant filled) — `border.transparent` ou `'transparent'` via prop seria coerente. |
| 1.3 | Estados visuais | ⚠️ Melhoria | `selected`/`disabled` ✅. **CH-5:** sem hover/focus-visible. |
| 1.4 | Escala coerente | ❌ Quebra | **CH-SP1:** `size: 'sm' \| 'md'` — sintoma SP-1 mais cru do R8 (já aparece como tipo público, não só nas internals). |
| 1.5 | Contraste | ⚠️ Melhoria | Não verificado em matriz; depende da combinação variant × tone × selected. |
| 1.6 | Microinterações via `transition()` | ❌ Quebra | Sem transition. |
| 1.7 | Reduced motion | N/A | |
| 1.8 | Ícones via `<Icon>` | ⚠️ Melhoria | Implementação ✅ (`Icon name='X'` no Remove). **Stories ❌** WithIcon usa emoji `⚡` (carry-over A-8). |

**Observações livres:**
- Tones limitados a `neutral`/`brand` (mesma escassez do Tag) — incoerência cross-componente vs Alert/Toast.
- `Number(theme.opacity.medium)` no opacity disabled — `opacity` já é número; cast supérfluo.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado | ❌ Quebra | **CH-Bug-1:** `Chip.Root` é `<Flex as='span'>`. **Span não é focável**. Mesmo passando `onClick`, `selected` não é navegável por Tab. Docstring contradiz: "Chip é tipicamente interativo (selecionável ou removível)". Para ser interativo, Root deveria ser `Clickable as='button'` (ou ao menos `tabIndex={0}` + `role='button'` + handler de Enter/Space) quando selectable. |
| 2.2 | Focus management | N/A | |
| 2.3 | `role` + `aria-*` | ❌ Quebra | **CH-A11y-1:** Chip selected como `<span>` sem `role='button'` + `aria-pressed`. SR não anuncia "selected". Icon ✅ `aria-hidden`. Remove ✅ `aria-label`. |
| 2.4 | Anúncios SR | ⚠️ Melhoria | Bloqueado por CH-A11y-1. |
| 2.5 | Touch target ≥ 44×44 | ❌ Quebra | **CH-Bug-2:** `Chip.Remove` `width={14} height={14}` — pior do R8 (Alert/Toast = 20). 14px não é nem clicável com precisão num mouse, quanto mais touch. |
| 2.6 | Controlado/não-controlado | ⚠️ Melhoria | Como Tag: `selected` é prop pura. Coerente com pattern do DS. |
| 2.7 | Evento cancelável | N/A | |
| 2.8 | RTL | ✅ OK | Sem direcionais hardcoded. |

**Observações livres:** O conflito entre Chip ser declaradamente "selecionável" e Root ser um `<span>` não-focável é a inconsistência mais grave do R8. Decisão de design: ou Chip vira interativo de verdade (Root = Clickable as='button'/'div' com role='button'+tabindex+aria-pressed), ou desfazemos a promessa de "selecionável" e a propriedade `selected` vira só visual (estilo de "currently active filter") com a interatividade delegada ao Remove.

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API mínima | ✅ OK | 4 slots + 5 props no Root. Bem dimensionado. |
| 3.2 | Naming | ⚠️ Melhoria | `selected`/`disabled` ✅ (RFC-0030 ✅). **CH-SP1:** `size: 'sm' \| 'md'`. |
| 3.3 | Defaults | ✅ OK | Razoáveis. |
| 3.4 | Discriminated unions | N/A | |
| 3.5 | Polimorfismo | ⚠️ Melhoria | Root sempre `<span>`. Vale considerar polimorfismo via `as` se a decisão de CH-Bug-1 for "Chip pode ser button OR span". |
| 3.6 | `forwardRef` + `displayName` | ❌ Quebra | **CH-DN:** zero `displayName` em Root/Label/Icon/Remove. R7 sweep não cobriu — mesma omissão de Alert. |
| 3.7 | Compound | ✅ OK | JSDoc + exemplo. |
| 3.8 | Tipos públicos | ✅ OK | |

**Surface area atual:**
```ts
ChipRootProps   extends HTMLAttributes<HTMLSpanElement>      { children; variant?; size?; selected?; disabled?; tone? }
ChipLabelProps  extends HTMLAttributes<HTMLSpanElement>      { children }
ChipIconProps   extends HTMLAttributes<HTMLSpanElement>      { children }
ChipRemoveProps extends ButtonHTMLAttributes<HTMLButtonElement> { label? }
```

**Observações livres:** **CH-HtmlLeak:** 4× `extends HTMLAttributes/ButtonHTMLAttributes` — pattern R7 carry-over.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ OK | Implementação ✅. **Stories ❌** AllVariants e Tags com `<div style={{ display: 'flex', gap: 8 }}>` (TD-024). |
| 4.2 | Sem `style={{...}}` para CSS coberto por prop | ❌ Quebra | **CH-CSS-1 (Root):** `style={{ padding, fontSize, lineHeight: 1.4, whiteSpace: 'nowrap', ...chipStyle, ...style }}` — `padding`, `fontSize`, `whiteSpace` têm prop equivalente; `lineHeight` é literal. **CH-CSS-2 (Label):** `style={{ lineHeight: 'inherit', ...style }}` — sem prop equivalente direta para `'inherit'`, mas `lineHeight` é prop (avaliar). **CH-CSS-3 (Remove):** `style={{ padding: 0, border: 'none', background: 'none', ...style }}` — todos com prop. |
| 4.3 | Estrutura de pasta | ✅ OK | core/, context/, interfaces/. |
| 4.4 | `defineRecipe`/`defineSlotRecipe` | ❌ Quebra | **CH-Recipe-1:** `getChipStyle` é função local com lógica condicional aninhada (variant × tone × selected). **Caso ideal de slot recipe** — multivariante puro, sem comportamento. Mais clara como recipe que como `if/else`. |
| 4.5 | Sem `any`/cast | ⚠️ Melhoria | `Number(theme.opacity.medium)` cast supérfluo. Sem `as never` ou `as object`. |
| 4.6 | Cobertura de testes | ⚠️ Melhoria | 13 cases — boa quantidade, **substância fraca**: maioria é "renderiza sem quebrar" (`expect(getByText('X')).toBeTruthy()`). Não testa: keyboard interaction, `aria-pressed` (porque ausente), focus, selected aplicando estilo correto, variant aplicando border correto. |
| 4.7 | Story playground | ⚠️ Melhoria | argTypes ✅ no meta. **CH-Story-1:** WithIcon emoji ❌. AllVariants/Tags TD-024 ❌. Falta story `Toggleable` (interactive). |
| 4.8 | `.native.tsx` ou platform-split | ❌ Quebra | **CH-Bug-3:** Declarado `@platform shared` mas **sem `.native.test.tsx`**. Auditoria R7 #8 falou exatamente disto: "@platform shared pode mentir". Risco real porque Chip usa `<Flex as='span'>` (RN ignora `as` — comportamento OK provavelmente, mas não verificado). |
| 4.9 | Imports respeitam camadas | ✅ OK | |

**Métricas rápidas:**
- LOC: 154 (chip.tsx) + 29 (interfaces) + 19 (context) = ~202
- Testes: 13 web + **0 native** ❌
- Stories: 6
- Dependências externas runtime: 0

**Observações livres:**
- Chip é o componente mais complexo do R8 (4 slots + 5 props no Root + context) e é, paradoxalmente, o que mais carrega débito (interatividade quebrada + touch target pior + sem native test + sem displayName + recipe ausente). Sweep aqui é o maior do R8.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público | ✅ OK | |
| 5.2 | Tipos públicos | ✅ OK | 4 interfaces. |
| 5.3 | Changeset | N/A | Pre-v1. |
| 5.4 | Breaking change → RFC | ⚠️ Melhoria | CH-Bug-1 (Root como `<span>` vs interativo) é decisão de API que pode quebrar consumidores. Vale RFC dedicada. |
| 5.5 | Migration guide | N/A | |

---

## 6. Resumo executivo

**Score por eixo:** Visual `2/8` · Comportamental `2/8` · Funcional `5/8` · Código `2/9` · Governança `4/5`

**Top 3 achados (por impacto):**

1. **CH-Bug-1 + CH-A11y-1 — Chip "selecionável" é um span não-focável.** Promessa de API quebrada. Selected não é anunciado nem navegável. **RFC dedicada** (não fix-imediato — escolha de design).
2. **CH-Bug-2 — Touch target Remove de 14×14.** Pior do R8 inteiro. Fix-imediato `minWidth/minHeight={44}` + overlay `::before`.
3. **CH-Bug-3 + CH-DN + CH-HtmlLeak — Sweep R7 esqueceu Chip.** Sem native test, sem displayName, com extends HTMLAttributes. Sweep paralelo a Alert.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [ ] ⚠️ Aprovado com fixes menores
- [x] ❌ Requer mudanças antes da próxima release  *(touch target gravíssimo + interatividade quebrada)*

---

## 7. Follow-ups

### Fix imediato (sweep coletivo R8)

- [ ] **CH-Bug-2** — `Chip.Remove` ganha `minWidth={44}`, `minHeight={44}` + overlay `::before` (TD-016). Mantém visual interno 14×14 se necessário.
- [ ] **CH-Bug-3** — Criar `core/chip.native.test.tsx` com cases de smoke + variants + selected + disabled + Remove press (mesmo padrão Alert.native).
- [ ] **CH-DN** — `displayName` em `Chip.Root`/`Label`/`Icon`/`Remove`.
- [ ] **CH-HtmlLeak** — Remover `extends HTMLAttributes/ButtonHTMLAttributes` das 4 interfaces; substituir por `style?` + `className?` + `onClick?` explícitos. Mesmo do Alert/Toast/Tag.
- [ ] **CH-1** — `padding: '3px 8px'`/`'5px 12px'` literais → tokens (`paddingX='micro'`/`'small'` × `paddingY='nano'`/`'micro'`). Resolvido junto da CH-Recipe-1.
- [ ] **CH-2** — `gap="4px"` → `gap="nano"` ou `gap="micro"`.
- [ ] **CH-3** — `lineHeight: 1.4` literal: investigar se o Text resolve via tipografia tokens. Se sim, remover.
- [ ] **CH-4** — `borderColor: 'transparent'` em filled — manter literal (`'transparent'` é keyword CSS aceitável) mas via prop `borderColor='transparent'`.
- [ ] **CH-CSS-1/2/3** — Style inline → props declarativas em Root, Label, Remove. `whiteSpace='nowrap'` é prop válida.
- [ ] **CH-OpacityCast** — Remover `Number(theme.opacity.medium)`; usar valor direto.
- [ ] **CH-Story-1** — WithIcon troca `⚡` por `<Icon name='Tag'/>` ou similar do iconMap. AllVariants/Tags substituem `<div style={{}}>` por `<Flex gap='small'>`. Adicionar story `Toggleable` interactive.
- [ ] Adicionar `_focusVisible: focusRing` no Remove (TD-014).
- [ ] Adicionar `transition()` para hover/focus.

### Issue (mudança localizada, sem breaking change)

- [ ] **CH-Recipe-1** — Migrar `getChipStyle` para `defineSlotRecipe('chip', { slots: ['root','label','icon','remove'], variants: { variant: { filled, outlined, subtle }, tone: { neutral, brand }, selected: { true, false }, disabled: { true, false } } })`. Issue (não fix-imediato) porque envolve refactor maior + cobertura de combinatória.
- [ ] **CH-Tones-Catalog** — Mesmo gap do Tag: 2 tones. Carry-over para RFC `feedback-tones`.
- [ ] **CH-Test-Substancia** — Adicionar testes que cubram: `aria-pressed` (depois CH-Bug-1), keyboard navigation, classes/styles aplicados por variant. Aumentar substância sem aumentar quantidade.

### RFC (sistêmico ou breaking change)

- [ ] **RFC Chip-Interativo** — Decidir o contrato: (a) Chip.Root vira `Clickable as='button'` quando `selected`/`onClick` passados (interatividade primeira), ou (b) Chip.Root continua span passivo e a interatividade vira responsabilidade exclusiva do `Chip.Remove`/wrapping `<Clickable>` externo (composability primeira). Trade-off: (a) é menos componível mas honra a docstring; (b) é mais purista mas contraria o "selecionável" prometido. Decisão dela.
- [ ] **RFC SP-1** — Chip é a 7ª evidência sólida (`size: 'sm' \| 'md'` no tipo público). Coleção do R8 fechada: Alert (interno), Toast (interno), Tag (sem size), **Chip (público)**.
- [ ] **RFC feedback-tones** — Carry-over.

---

## 8. Notas de arquiteto

- **Chip carrega o maior débito acumulado do R8:** sem native test, sem displayName, surface inflada, touch target pior, recipe ausente, e pior, **interatividade quebrada por design (span "selecionável")**. Sweep R7 + carry-over de Alert resolvem 70% mecanicamente; os 30% restantes (interatividade + recipe) precisam de decisão arquitetural própria.
- **CH-Bug-1 é o achado mais filosófico do R8:** revela ambiguidade sobre o que Chip *é*. Vale RFC dedicada porque `selected` no DOM `<span>` é só visual e não passa em audit a11y. Recomendação: `<Chip selectable selected onSelectedChange={...}>` migra para Clickable internamente; sem essas props, fica span passivo.
- **`@platform shared` mente para Chip — confirma suspeita do R7 #8.** Padrão emergente para R13 (consolidação): script que valida que todo `@platform shared` tem `.native.test.tsx` correspondente.
- **Tag e Chip juntos:** dois componentes que **deveriam compartilhar slot recipe** (mesma escala visual de pílula) mas hoje cada um tem sua função `getXStyle` local, **com 2 tones cada e nenhum tone de feedback**. Refactor pós-R8 candidato: `pill` recipe compartilhada com Tag e Chip como variantes (Tag = elementar, Chip = compound).
- **R8 fecha com 7 componentes do DS sem displayName** (4 do Chip + 3 do Alert + 1 do Tag se contar a omissão de forwardRef). Prova que o R7 sweep precisa virar regra de lint, não checklist manual.
