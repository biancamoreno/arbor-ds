# Review — `Tag`

**Fase:** R8 · **Camada:** `feedback` · **Status:** `concluído`
**Revisor:** arbor-ds-arch · **Data:** 2026-05-02 · **Versão atual:** `1.0.0-beta`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/tag/{core/{tag.tsx, tag.native.tsx}, interfaces/TagProps.ts, index.ts}`
- **Story:** `src/components/tag/core/tag.stories.tsx`
- **Testes:** `core/tag.native.test.tsx` (7) · **`core/tag.test.tsx` AUSENTE** ❌
- **Implementação nativa:** `sim` (`tag.native.tsx`).
- **Classificação cross-platform:** `platform-split`.
- **Dependências internas:** `Clickable`, `Text` (native).
- **Consumidores conhecidos:** —

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ✅ OK | tone × selected × disabled cobertos. |
| 1.2 | Tokens semânticos | ⚠️ Melhoria | Tokens usados via `useTheme()` (`theme.colors.brand.X`, `theme.colors.text.primary`, etc.) — themable em runtime ✅, mas **TG-1:** `gap="6px"` literal (devia ser token `nano`/`micro`). **TG-2:** `padding: '6px 12px'` literal no style web; `paddingHorizontal: 12 + paddingVertical: 6` literais native. **TG-3:** `fontSize: theme.fontSizes.xsmall` web ok, mas `fontSize: 12 + fontWeight: '500'` literais native. |
| 1.3 | Estados visuais: hover/focus/active/disabled/selected | ⚠️ Melhoria | `selected` ✅, `disabled` ✅ (com `cursor: 'not-allowed'` web e `opacity: 0.5` native). Mas **sem hover/focus-visible** — mesmo gap dos outros R8. |
| 1.4 | Escala de tamanhos coerente | N/A | Tag não expõe `size`. Decisão simples. |
| 1.5 | Contraste WCAG AA | ⚠️ Melhoria | `theme.colors.brand.subtle` + `text.brand.strong` — depende de validação por matriz. Não verificado. |
| 1.6 | Microinterações via `transition()` | ❌ Quebra | Sem transition no hover/focus/selected. Carry-over R7. |
| 1.7 | Reduced motion | N/A | Sem motion. |
| 1.8 | Ícones via `<Icon>` | N/A | Tag não suporta ícone (decisão: ícone é território do Chip). |

**Observações livres:**
- Apenas **2 tones** (`neutral`/`brand`) — diferente de Alert (4: info/success/warning/critical), Toast (5: + neutral), Badge (6 pelo R7). Inconsistência cross-componente (carry-over R7 #7).
- Padding e fontSize duplicados web/native em valores literais — **TG-Drift latente** (mudar em um sem o outro produz visual divergente).

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado | ✅ OK | Clickable (Tab/Enter/Space). |
| 2.2 | Focus management | N/A | |
| 2.3 | `role` + `aria-*` | ✅ OK | Native: `accessibilityRole='button'` + `accessibilityState={{ selected, disabled }}`. Web: herda de Clickable as=`button`. **Faltando web:** `aria-pressed={selected}` (toggle-button semantics). Hoje só o estilo expressa `selected`; SR não anuncia o estado. |
| 2.4 | Anúncios SR | ⚠️ Melhoria | Por causa do gap `aria-pressed` web. |
| 2.5 | Touch target ≥ 44×44 | ❌ Quebra | Sem `minHeight`/`minWidth`. Padding `6px 12px` resulta em ~28px de altura. **TG-4:** TD-016 não aplicada. |
| 2.6 | Controlado/não-controlado | ✅ OK | `selected` é prop pura; consumidor controla via `onClick`. Coerente para componente leve. |
| 2.7 | Evento cancelável | N/A | |
| 2.8 | RTL | ✅ OK | Sem `marginLeft`/`textAlign:'left'`/borders direcionais hardcoded. Padding simétrico. |

**Observações livres:** native test cobre `accessibilityState.selected/disabled` ✅, mas **não testa o `aria-pressed` no web** porque web não tem teste (4.6).

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API mínima | ✅ OK | `tone`/`selected` + ButtonHTMLAttributes. Enxuta. |
| 3.2 | Naming | ✅ OK | `selected: boolean` (não `isSelected` — RFC-0030 ✅). `tone` consistente. |
| 3.3 | Defaults | ✅ OK | `tone='neutral'`, `selected=false`. |
| 3.4 | Discriminated unions | N/A | |
| 3.5 | Polimorfismo `as` | N/A | Sempre `<button>`. Decisão razoável. |
| 3.6 | `forwardRef` + `displayName` | ⚠️ Melhoria | `displayName='Tag'` ✅ (web e native). **Sem `forwardRef`** — pattern legado (TD-007 carry-over). |
| 3.7 | Compound | N/A | Tag é flat. |
| 3.8 | Tipos públicos | ✅ OK | |

**Surface area atual:**
```ts
TagProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  tone?: 'neutral' | 'brand';
  selected?: boolean;
}
```

**Observações livres:** **TG-5:** `extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>` — pattern R7 (`extends HTMLAttributes` leak) precisa também sair daqui. Native usa `as object` cast (4.5) porque a interface DOM-only não traduz para RN. Drift de surface entre web e native silencioso.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ OK | Implementação ✅ (Clickable + Text). **Stories ❌** AllTones com `<div style={{ display: 'flex', gap: 8 }}>` — TD-024. |
| 4.2 | Sem `style={{...}}` para CSS coberto por prop | ❌ Quebra | **TG-CSS-1 (web):** `style={{ padding: '6px 12px', fontSize: ..., ...colors, ...style }}` — padding tem prop, fontSize tem prop, backgroundColor/borderColor/color têm prop. **TG-CSS-2 (native):** `style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor, borderColor, opacity, ...style }}` + `<Text style={{ color, fontSize, fontWeight }}>` — todos com prop equivalente. |
| 4.3 | Estrutura de pasta | ✅ OK | core/, interfaces/. |
| 4.4 | `defineRecipe`/`defineSlotRecipe` | ❌ Quebra | **TG-Recipe-1:** `getTagStyle` (web) e `getTagColors` (native) — **duplicados** em ambas plataformas com a mesma lógica. Risco de drift real. Slot recipe (`tag.frame` × `tone × selected × disabled`) resolveria com fonte única. |
| 4.5 | Sem `any`/cast | ⚠️ Melhoria | Native: `{...(props as object)}` — cast porque `TagProps` herda DOM. Resolver consertando 3.5. |
| 4.6 | Cobertura de testes | ❌ Quebra | **TG-Bug-1:** **`tag.test.tsx` web AUSENTE.** Native tem 7 cases (role, selected, disabled, onClick, brand). Web tem zero. Inversão grosseira da paridade — em todo R7 web costuma ter mais. |
| 4.7 | Story cobre default + variantes + states + playground | ⚠️ Melhoria | 4 stories (Default/Brand/Selected/AllTones). **TG-Story-1:** AllTones com `<div style={{ display: 'flex', gap: 8 }}>` (TD-024). argTypes ✅ no meta — playground funciona automaticamente. Falta story interactive `Toggleable` (selected controlado por click) e story `InsideList` (caso real de uso). |
| 4.8 | `.native.tsx` ou platform-split | ✅ OK | platform-split. |
| 4.9 | Imports respeitam camadas | ✅ OK | |

**Métricas rápidas:**
- LOC: 60 (tag.tsx) + 90 (tag.native.tsx) + 13 (interfaces) = ~163
- Testes: **0 web** + 7 native ❌
- Stories: 4
- Dependências externas runtime: 0

**Observações livres:**
- O fato de `getTagColors` ser duplicado web↔native dá oportunidade de **slot recipe ser fix-imediato** (não issue) — não há tokens quebrados como Alert/Toast, então a recipe pode ser feita já.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público | ✅ OK | |
| 5.2 | Tipos públicos | ✅ OK | |
| 5.3 | Changeset | N/A | Pre-v1. |
| 5.4 | Breaking change → RFC | N/A | |
| 5.5 | Migration guide | N/A | |

---

## 6. Resumo executivo

**Score por eixo:** Visual `3/8` · Comportamental `4/8` · Funcional `5/8` · Código `4/9` · Governança `5/5`

**Top 3 achados (por impacto):**

1. **TG-Bug-1 — Web sem teste.** Único componente do R8 sem `.test.tsx` web. Risco silencioso (mudanças no web não têm gate). Fix-imediato: replicar os 7 cases native (`getByRole`, `selected`, `disabled`, `onClick`, `brand`, `aria-pressed`).
2. **TG-Recipe-1 — `getTagColors` duplicado web↔native.** Drift latente real. Migrar para slot recipe (`tag.frame`) com `tone × selected` é fix-imediato porque não depende de outros tokens.
3. **TG-CSS-1/2 + TG-2/3 — Padding e fontSize literais em ambos.** `6px 12px`, `12`, `'500'` — sweep mecânico para tokens semânticos (`padding-x={'small'}`, `padding-y={'micro'}`, `fontSize='xsmall'`, `fontWeight='medium'`).

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores  *(nenhum bug funcional crítico, mas debt de tokens + ausência de teste)*
- [ ] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (sweep coletivo R8)

- [ ] **TG-Bug-1** — Criar `core/tag.test.tsx` com cases mínimos: render, role=button, `selected`/`disabled`, `onClick`, `aria-pressed`, tone='brand'.
- [ ] **TG-1** — `gap="6px"` → `gap="nano"` (se já existir token de gap nano = 4px) ou `gap="micro"`.
- [ ] **TG-2** — Web: `padding: '6px 12px'` → `paddingX="small" paddingY="micro"` (ou via slot recipe). Native: idem.
- [ ] **TG-3** — Web: `fontSize: theme.fontSizes.xsmall` → `fontSize="xsmall"` (prop). Native: `fontSize: 12 + fontWeight: '500'` → `fontSize="xsmall" fontWeight="medium"` (Text já tem prop).
- [ ] **TG-4** — Adicionar `minHeight={44}` (e overlay `::before` se padding visual deve ficar pequeno). TD-016.
- [ ] **TG-CSS-1** — Web: remover style inline e mover tudo para props declarativas. Mesmo do Alert/Toast.
- [ ] **TG-CSS-2** — Native: idem; o `<Text>` interno consome props (`color="text.inverse"`, `fontSize="xsmall"`).
- [ ] **TG-5** — Substituir `extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>` por: `{ children: ReactNode; tone?; selected?; disabled?; onClick?: () => void; className?: string; style?: CSSProperties }`. Pattern R7. Resolve cast (4.5) por consequência.
- [ ] **TG-Recipe-1** — Migrar `getTagStyle`/`getTagColors` para `defineSlotRecipe('tag', { slots:['frame','label'], variants: { tone: { neutral, brand }, selected: { true, false }, disabled: {...} } })`. Web e native consomem via `useSlotRecipe`. Elimina duplicação.
- [ ] **TG-A11y-1** — Web: adicionar `aria-pressed={selected}` no `<button>` (toggle-button semantics). Native já tem `accessibilityState.selected`. Cobrir no novo `tag.test.tsx`.
- [ ] **TG-Story-1** — AllTones substitui `<div style={{}}>` por `<Flex gap='small'>`. Adicionar story `Toggleable` (state local controlando `selected`).
- [ ] Adicionar `_focusVisible: focusRing` (TD-014).
- [ ] Adicionar `transition()` para hover/focus/selected.

### Issue (mudança localizada, sem breaking change)

- [ ] **TG-Tones-Catalog** — Tag tem só `neutral`/`brand`; Alert tem `info/success/warning/critical`; Toast tem `+neutral`; Badge tem 6. Inconsistência cross-componente (carry-over R7 #7). Decidir em RFC `feedback-tones` qual o catálogo canônico — Tag pode (ou não) ganhar `success`/`warning` para casos de "filtro ativo" semântico.
- [ ] **TG-NoIcon** — Tag não suporta ícone (`<Tag><Icon name="Hash"/>label</Tag>` quebra layout porque `gap="6px"` mas não há slot estruturado). Decisão de produto: Tag = pill simples, Chip = pill rica. Documentar em CONTRIBUTING para impedir feature creep.

### RFC (sistêmico ou breaking change)

- [ ] **RFC SP-1** — Tag não expõe `size`, mas usa `xsmall`/`small` via theme. Carry-over.
- [ ] **RFC feedback-tones** — Catálogo cross-componente (carry-over A-CRIT-1 / T-CRIT-1).

---

## 8. Notas de arquiteto

- **Inversão de paridade Tag (web ❌, native ✅) é única no R8.** Provavelmente artefato histórico (Tag deve ter sido refactorada para `Clickable` durante RFC-0018 onda 5 e o teste web não acompanhou). Pattern emergente para **CONTRIBUTING:** "ao migrar um componente para `Clickable`, garantir que `<nome>.test.tsx` cobre os mesmos contratos que o `.native.test.tsx`".
- **Tag é o caso ideal para validar `defineSlotRecipe` cross-platform** porque já tem dois locais idênticos (`getTagStyle`/`getTagColors`) e não depende de tokens quebrados (Alert/Toast bloqueiam). Pode virar **referência arquitetural** — junto do ProgressCircle do R7 — de "componente que passou a barra integralmente".
- **Decisão Tag vs Chip clara:** Tag = pílula simples (sem ícone, sem close). Chip = pílula rica (com ícone, com close, possivelmente com avatar). Manter intencional, documentar em CONTRIBUTING para evitar duplicação acidental.
- **`useTheme()` para resolver cor é anti-pattern leve:** funciona (themable em runtime) mas perde tree-shaking estático e força re-render quando tema muda. `useSlotRecipe` resolve em runtime no engine, mais coerente. Migrar como parte de TG-Recipe-1.
