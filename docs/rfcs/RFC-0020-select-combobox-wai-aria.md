# RFC-0020 — Select cumprindo WAI-ARIA "Select-Only Combobox"

**Status**: Draft
**Autores**: @bia
**Data**: 2026-04-25
**PR**: (a abrir)

**Origem**: R6 review (`CR6-3`, `CR6-4`, `HR6-10`, `HR6-11`, `SE-*`)

---

## Motivação

`Select` web atual está **funcionalmente abaixo** da especificação WAI-ARIA "Select-Only Combobox" (não-editável, value único). Em uso real isso vira:

- Teclado quebrado: usuário com Tab + Enter consegue abrir, mas não navegar entre itens nem confirmar com setas.
- Leitores de tela (NVDA, VoiceOver) anunciam menos do que deveriam: sem `aria-activedescendant`, o item ativo não é narrado durante navegação.
- UX inconsistente: comparar com `<select>` HTML nativo ou Headless UI / Radix UI — qualquer um deles tem comportamento que o nosso não tem.
- Listbox cortado dentro de containers com `overflow: hidden` (Modal, Card com `overflow:auto`).

### Inventário de gaps vs WAI-ARIA APG (Authoring Practices Guide)

| Capítulo APG | Status atual | Falha |
|---|---|---|
| `combobox`/`listbox`/`option` roles | ✅ ✅ ✅ | OK |
| `aria-haspopup="listbox"` | ✅ | OK |
| `aria-expanded` no trigger | ✅ | OK |
| `aria-controls` no trigger apontando pro listbox | ❌ | Trigger não conhece o id do listbox |
| `aria-activedescendant` no trigger | ❌ | Listbox usa `tabIndex={0}` por item — modelo wrong |
| Setas ↑/↓ navegam entre itens | ❌ | Nenhuma implementação |
| Home/End vão pro primeiro/último | ❌ | — |
| PageUp/PageDown saltam ±10 itens | ❌ | — |
| Type-ahead (digite "ab" → vai pro item começando com "ab") | ❌ | — |
| Enter/Space no item selecionam **e fecham** | ✅ | OK |
| Escape fecha **e devolve foco ao trigger** | ⚠️ | Fecha mas foco não retorna explicitamente |
| Foco vai pro item ativo (ou primeiro) ao abrir | ❌ | Foco fica no trigger; item ativo não é highlightado |
| `aria-selected` no item correto | ✅ | OK |
| `aria-disabled` em item desabilitado | ✅ | OK |
| Listbox em `Portal` para escapar `overflow` | ❌ | Render inline; CR6-4 |
| Outside-click fecha (com `DismissableLayer`) | ⚠️ | Implementação manual com `document.addEventListener` (SE-13) |
| Touch target ≥ 44×44 nos items (R6-I) | ❌ | `padding: '8px 16px'` + `fontSize: 14` ≈ 36px |
| `:focus-visible` no trigger | ❌ | `outline:none` sem substituto (HR6-11) |
| Chevron via Icon real | ❌ | `▲`/`▼` unicode (HR6-10) |
| **Display-text** ≠ `value` (SelectValue mostrando "Cartão de crédito" para `value="card"`) | ❌ | Mostra `selectedValue` cru |
| Dark mode token-driven | ❌ | Hardcodes `triggerHeight`/`triggerPadding`/`triggerFontSize` (CR6-6 → RFC-0017) |

R6 review classifica este conjunto como "peça mais relevante de R6". Adiar significa entregar Select que falha em formulários de produto reais (checkout, filtros).

### Por que agora

- TD-013 fechou (RFC-0016) → testes web e contract paritário possíveis.
- Nenhum produto deve consumir Select em RN (RFC-0018 mantém `web-only`) — esta RFC só foca web.
- R7 (feedback indicators) começa logo. Sem Select sólido, formulários do playground continuam falhando teclado.

---

## Proposta

Refator amplo de `Select` para cumprir o padrão Select-Only Combobox, com **focus-management activedescendant**.

Cinco eixos:

### 1. Modelo de foco — activedescendant

O foco do DOM **permanece no trigger** durante toda a interação aberta. O item "ativo" (currently highlighted) é controlado via `aria-activedescendant` no trigger apontando para o `id` do `<li>`.

```tsx
<button
  role="combobox"
  aria-haspopup="listbox"
  aria-expanded={isOpen}
  aria-controls={listboxId}
  aria-activedescendant={isOpen ? activeItemId : undefined}
>
  …
</button>
<ul id={listboxId} role="listbox" tabIndex={-1}>
  <li id="opt-1" role="option" aria-selected={value === '1'}>…</li>
  <li id="opt-2" role="option" aria-selected={value === '2'}>…</li>
</ul>
```

**Por que activedescendant e não roving tabindex:** combobox padrão (não editável) na APG recomenda activedescendant. Mantém modelo simples — o trigger é o único "tabbable", item nunca recebe foco real. Roving tabindex é o modelo de listbox standalone, não combobox.

### 2. Item registry no `SelectContext`

`SelectContext` ganha um registry de items. `SelectItem` se auto-registra na montagem.

```ts
type SelectItemEntry = {
  value: string;
  displayText: string;       // texto plain extraído de `children`
  disabled: boolean;
  id: string;                // `${selectId}-opt-${index}`
};

type SelectContextValue = {
  // … atuais
  items: SelectItemEntry[];
  registerItem: (entry: SelectItemEntry) => void;
  unregisterItem: (id: string) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};
```

Habilita:

- **`SelectValue` mostra display-text correto** (`items.find(i => i.value === selectedValue)?.displayText` em vez de `selectedValue` cru).
- **Type-ahead** itera pelo registry casando `displayText`.
- **Setas ↑/↓** sabem ordem.
- **Home/End** vão para `items[0]`/`items[items.length-1]`.

### 3. Keyboard map completa

| Tecla | Quando trigger focado e fechado | Quando trigger focado e aberto |
|---|---|---|
| `Enter` / `Space` / `Down` / `Alt+Down` | Abre + foca item selecionado (ou primeiro) | — |
| `Up` / `Alt+Up` | Abre + foca último item | — |
| `Escape` | — | Fecha + restaura foco ao trigger |
| `Tab` / `Shift+Tab` | Move para próximo/anterior tabbable | Fecha + move para próximo/anterior tabbable |
| `↓` | — | activeIndex++ (com wrap-around opcional) |
| `↑` | — | activeIndex-- |
| `Home` | — | activeIndex = 0 |
| `End` | — | activeIndex = items.length - 1 |
| `PageDown` | — | activeIndex += 10 (clamp) |
| `PageUp` | — | activeIndex -= 10 (clamp) |
| `Enter` / `Space` | (já coberto acima — abre) | Seleciona item ativo + fecha + restaura foco |
| Letra(s) | — | Type-ahead: casa primeiro item cujo `displayText` começa com a string acumulada (timeout 500ms) |

### 4. Render via `Portal` + `DismissableLayer`

- `SelectContent` é renderizado em `<Portal>` (primitive já existe — `src/ecosystem/primitives/portal/`). Escapa de qualquer `overflow:hidden`.
- Outside-click + Escape via `<DismissableLayer onDismiss={close}>` — substitui implementação manual.
- Position do listbox: usar API moderna (`anchorRef` + `floating-ui` se chegarmos a esse ponto, ou cálculo simples baseado em `getBoundingClientRect` no MVP).

```tsx
{isOpen && (
  <Portal>
    <DismissableLayer onDismiss={close}>
      <ul role="listbox" id={listboxId} style={positionStyle}>
        {/* items */}
      </ul>
    </DismissableLayer>
  </Portal>
)}
```

### 5. Polish visual + a11y

- **Chevron via Icon real** (HR6-10): `<Icon name="ChevronDown" decorative size="sm" />`. Animação de rotação 180° ligada a `isOpen`.
- **`:focus-visible`** no trigger via `boxShadow: 0 0 0 2px brand.subtle`. Resolve HR6-11 e parte de HR6-1 (foco visível).
- **Touch target items ≥ 44×44** (R6-I): `minHeight: 44px` em `sm`, `md`, `lg` — não shrink por size.
- **Recipe consumida** (CR6-6 / RFC-0017): hardcodes `triggerHeight`/`Padding`/`FontSize` → `useSlotRecipe('select', { size, state })`. Esta RFC depende de RFC-0017 ser aplicada antes ou em paralelo.
- **Scroll into view** ao mudar `activeIndex`: `items[activeIndex].element.scrollIntoView({ block: 'nearest' })`.

---

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **Roving tabindex (foco real entre items)** | APG recomenda activedescendant para combobox. Roving torna a implementação mais cara em RN se algum dia for portada (foco real custoso) e introduz inconsistência com `<select>` nativo. |
| **`<select>` HTML nativo** | Zero customização visual, sem variants, sem item rico (Icon + label + description), sem tema. Não atende caso de uso do DS. |
| **Adotar Radix UI Select internamente** | Adiciona dependência runtime. RDS é "zero deps de runtime" (CLAUDE.md). Substituir um problema por outro. |
| **MVP sem type-ahead, sem PageUp/Down** | Type-ahead é expectativa básica de combobox; usuário acostumado com `<select>` espera. PageUp/Down é trivial após setas. Não vale entregar incompleto. |
| **Adiar Portal para outra RFC** | CR6-4 é bug em produção (Select dentro de Modal). Sem Portal, refator não fecha. |

---

## Impactos e trade-offs

- **Breaking change?** **Sim**, dois pontos:
  1. `SelectValue` passa a mostrar display-text por padrão (era `value`). Quem queria `value` cru precisa migrar para `<SelectValue render={({ value }) => value}>` — ou aceitar (uso real esperava display).
  2. `SelectContent` renderiza em Portal — quebra qualquer CSS que escopa pelo ancestor (raro, mas possível).
- **Impacto em bundle size**: ~ +2 kB (registry + keyboard handlers). Compensado parcialmente por remoção de `outside-click manual + ▲/▼ unicode + hardcodes`.
- **Impacto em performance**: imperceptível. Item registry é List ≤ ~50 entries em uso típico.
- **Impacto em DX**:
  - **Ganho:** API canônica WAI-ARIA. Funciona como `<select>` para teclado e leitores de tela. Display-text via children (intuitivo).
  - **Custo:** consumidor que dependia de Select como "item registrado por children" sem registry pode precisar refatorar (e.g., quem injetava items dinamicamente em loops profundos).
- **Impacto em acessibilidade**: **massivo positivo**. Sai de "parcialmente acessível" para "WAI-ARIA APG conforme".
- **Codemod necessário?** **Não obrigatório.** Migração de SelectValue é manual + opcional. Maioria dos usuários não percebe a mudança.

### Riscos

| Risco | Mitigação |
|---|---|
| Position do listbox em scroll/resize quebra | MVP usa `getBoundingClientRect`; em iteração futura considerar floating-ui como dep dev-only. |
| Item rico (Icon + Description) quebra extração de displayText | Fallback: `displayText` opcional via prop `<SelectItem displayText="...">`; senão extrai recursivo do children procurando primeiro `<Text>` ou string. |
| Múltiplos selects abertos simultaneamente | Out-of-scope. Adicionar `useOverlayStack` se surgir caso de uso (SE-14). |
| `aria-activedescendant` em RN — promovem implementar native algum dia | Não é problema desta RFC. RFC-0018 mantém `web-only`. Quando promover, abrir RFC com strategy native específica. |
| Type-ahead com idiomas com diacríticos (pt-BR) | `String.prototype.normalize('NFD').replace(/[̀-ͯ]/g, '')` para casar "Sao" com "São". |

---

## Critérios de aceite

### A11y

- [ ] Trigger expõe `aria-controls`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-activedescendant` (quando aberto).
- [ ] Listbox tem `id` único e `role="listbox"`.
- [ ] Items têm `id` único, `role="option"`, `aria-selected`, `aria-disabled` (quando aplicável).
- [ ] **Keyboard:** todos os mapeamentos da tabela funcionam (testes automatizados).
- [ ] Foco volta ao trigger quando fecha (Escape, click outside, seleção).
- [ ] Type-ahead funciona com diacríticos pt-BR.

### Visual

- [ ] Chevron via `<Icon name="ChevronDown" />` com rotação 180° em open.
- [ ] `:focus-visible` no trigger tem indicador (boxShadow de brand).
- [ ] Items têm `minHeight ≥ 44px` em todos os sizes.
- [ ] Hardcodes substituídos por `useSlotRecipe('select', { size, state })`.

### Comportamento

- [ ] `SelectValue` mostra display-text via item registry.
- [ ] `SelectContent` renderiza em `<Portal>`.
- [ ] Outside-click + Escape via `<DismissableLayer>`.
- [ ] Scroll-into-view ao navegar com setas se item ativo está fora do viewport do listbox.

### Testes

- [ ] Suite ≥ 25 cases cobrindo: setas, Home/End, PageUp/Down, type-ahead, foco volta no close, item registry, display-text, Portal escape de overflow.
- [ ] Test de paridade com `<select>` HTML nativo: mesma sequência de teclas produz mesmo `selectedValue`.

### Stories

- [ ] Story `KeyboardOnly`: listbox completo navegável só com teclado.
- [ ] Story `InsideModal`: prova Portal funcionando.
- [ ] Story `LongList`: 50+ items com type-ahead e scroll-into-view.
- [ ] Story `WithFieldContext`: integração com Field, ARIA describedby/errormessage.
- [ ] Story `Theming`: prova `useSlotRecipe` aceita override.

---

## Notas de implementação

### Dependência com outras RFCs

- **RFC-0017 (recipes mortas)** — esta RFC consome `useSlotRecipe('select', …)`. Aplicar antes ou em paralelo.
- **RFC-0018 (web-only)** — mantém Select web-only. Não há `select.native.tsx` no escopo.
- **RFC-0019 (RadioCard)** — sem dependência mútua, mas as duas refatoram componentes adjacentes; coordenar PRs.

### Reaproveitamento de primitives

- `<Portal>` (já existe — `src/ecosystem/primitives/portal/`).
- `<DismissableLayer>` (já existe — `src/ecosystem/primitives/dismissable-layer/`).
- `<FocusScope>` (existe, **não usado** nesta RFC — activedescendant não exige focus trap).

### Impactos colaterais positivos

Esta RFC **antecipa decisões de R11** (Dialog/Drawer/Tooltip/Popover/Menu) — todos vão precisar de Portal + DismissableLayer. Implementar bem aqui paga em R11.

### Não-objetivo

- **Multi-select** — fora do escopo. RFC dedicada se surgir caso de uso.
- **Editable combobox** (com input de texto) — fora do escopo. Combobox editável é outro pattern WAI-ARIA, mais complexo.
- **Async / virtual list** — fora. Item registry assume lista síncrona ≤ ~200 itens.

### Referência

- WAI-ARIA APG — [Combobox: Select-Only](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/)
- [`docs/reviews/select.md`](../reviews/select.md) — review individual com inventário SE-*.
- [`docs/reviews/_followups.md`](../reviews/_followups.md) — SE-1 a SE-16.
