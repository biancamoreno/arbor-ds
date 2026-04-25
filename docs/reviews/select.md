# Review — `Select`

**Fase:** R6 · **Camada:** `form` · **Status:** `concluído`
**Revisor:** arbor-ds-architect · **Data:** 2026-04-24 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/select/core/select.tsx` (249 LOC) · `src/components/select/context/select-context.ts` · `src/components/select/interfaces/SelectProps.ts`.
- **Story:** `src/components/select/core/select.stories.tsx` (5 stories: Default, WithDefaultValue, WithDisabledItem, Sizes, Disabled).
- **Testes:** `src/components/select/core/select.test.tsx` (23 cases).
- **Implementação nativa:** `não` — sem `select.native.tsx`. JSDoc `@platform web-only` ✅ presente em `select.tsx:1`.
- **Classificação cross-platform:** `web-only` (documentado).
- **Dependências internas:** `Box`, `Flex`, `Clickable`, `useTheme`, `useControllableState`, `useDisclosure`, `useFieldContext`, `markFieldAware`.
- **Consumidores conhecidos:** consumidores externos. Nenhum componente do DS depende dele.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ❌ | Recipe `select` em `base-theme.ts:289` declara 7 slots (`root/trigger/value/icon/content/item/itemText`) + variant `size`. **Componente não consome a recipe** — usa `triggerHeight`/`triggerFontSize`/`triggerPadding` constantes em pixels. |
| 1.2 | Tokens semânticos | ⚠️ | Cores via `theme.colors.surface.default`/`text.primary`/`border.default`/`feedback.critical.base`/`brand.subtle` ✅. **Mas:** `boxShadow: '0 4px 12px rgba(0,0,0,0.1)'` cru, `padding`/`fontSize`/`height`/`zIndex: 50` literais. |
| 1.3 | Estados visuais: default/hover/focus/active/focus-visible/disabled/error | ⚠️ | `disabled` ✅. `error` (via `fieldCtx.invalid`) → muda borda para `feedback.critical.base` ✅. **Faltam:** hover no trigger, hover no item, focus-visible no trigger (`outline: none` removendo o foco). |
| 1.4 | Escala de tamanhos coerente com DS | ✅ | `size: sm \| md \| lg` propagada para height/padding/fontSize. |
| 1.5 | Contraste ≥ WCAG AA em light/dark | ✅ | Tokens semânticos. |
| 1.6 | Microinterações usam `transition()` | ❌ | **Sem transição** em open/close, hover, color. `<SelectContent>` aparece e some sem fade/slide. |
| 1.7 | Animações respeitam `usePrefersReducedMotion` | ✅ N/A | Sem animação. |
| 1.8 | Ícones usam `<Icon>` do DS | ❌ | **Chevron usa caracteres unicode `▲`/`▼`** em `<Box as="span">`. Mesmo anti-pattern de FAB/Counter (HR5-5). Devia ser `<Icon name="ChevronDown" />`. |

**Observações livres:**
- **Sem `Portal`** — `<SelectContent>` é renderizado dentro do `<Select.Root>` (DOM `<Box position="absolute">`). Em qualquer ancestor com `overflow: hidden`/`overflow: auto`, o listbox é cortado. **Bug em produto real.**
- `boxShadow` cru e `zIndex: 50` literal repetem dívidas R1-C3 (shadows tematizadas) e ausência de `zIndex` token semântico para overlays.
- **`outline="none"` no trigger** = mesma falha do FAB (HR4-13) e TextInput (HR5-3). Foco do teclado invisível.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado: Tab, Enter, Space, Esc, setas, Home/End, type-ahead | ❌ | Trigger reage a Enter/Space (toggle) + Esc (close). **Setas (`ArrowDown`/`ArrowUp`) não navegam itens.** **Home/End ausentes.** **Type-ahead ausente.** Padrão WAI-ARIA `combobox` exige tudo isso. |
| 2.2 | Focus management | ❌ | **Ao abrir, foco não vai para o item selecionado nem o primeiro.** **Ao fechar, foco não retorna ao trigger.** Tab navega para fora do select aberto. Padrão WAI-ARIA quebrado. |
| 2.3 | `role` correto + `aria-*` | ⚠️ | `role="combobox"` ✅, `aria-expanded` ✅, `aria-haspopup="listbox"` ✅, `role="listbox"` ✅, `role="option"` + `aria-selected`/`aria-disabled` ✅. **Faltam:** `aria-controls={contentId}` no trigger, `aria-activedescendant={focusedItemId}` para SR rastrear o item ativo durante navegação. |
| 2.4 | Anúncios a leitor de tela | ⚠️ | Estrutura semântica básica ok, mas sem `aria-activedescendant` o leitor não anuncia "Apple, 1 de 3" durante navegação. |
| 2.5 | Touch target ≥ 44×44 | ⚠️ | `sm: 32px`, `md: 40px`, `lg: 48px`. `md` e `sm` abaixo de 44. Items: `padding: '8px 16px'` + `fontSize: 14` → ≈36px altura. Abaixo de 44. |
| 2.6 | Comportamento controlado × não-controlado | ✅ | `useControllableState` ✅. |
| 2.7 | Evento cancelável | ❌ N/A | `useDisclosure` não expõe cancel; close é incondicional após item click. |
| 2.8 | Comportamento em RTL | ⚠️ | `marginLeft: 8` na chevron — em RTL deveria ser inline-end. Sem teste RTL. |

**Observações livres:**
- **Outside-click + Escape global registrados em `document`** — funcional, mas não usa `DismissableLayer` (existe em `ecosystem/primitives/dismissable-layer`). Re-implementação manual onde existe primitive.
- **Stack de overlays não gerenciada** — `useOverlayStack` existe mas Select não usa. Múltiplos selects abertos simultâneos podem ter comportamento de Escape ambíguo.
- **Trigger é `role="combobox"`** — modelo `combobox` (WAI-ARIA 1.2 pattern "Select-Only Combobox"). Correto, mas exige autocomplete-list semantics que o componente não cumpre (`aria-controls`, `aria-activedescendant`, `aria-autocomplete="none"` para select-only).
- **`SelectValue` mostra `selectedValue` (a string raw), não o conteúdo do item selecionado.** UX incomum: item `<Select.Item value="apple">Apple</Select.Item>` selecionado mostra "apple" no trigger, não "Apple". Padrão moderno (Radix, Headless) mantém registry de items + display node.

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API pública mínima | ✅ | 5 sub-componentes; props enxutos. |
| 3.2 | Naming segue convenção | ✅ | `disabled`, `value`, `defaultValue`, `onValueChange` (RFC-0015). |
| 3.3 | Defaults "least surprise" | ⚠️ | `defaultValue = ''` (string vazia, não `undefined`). Causa: `selectedValue || placeholder` fica falsy. ✅ funcional, mas semanticamente "valor selecionado é string vazia" diferente de "nada selecionado". |
| 3.4 | Combinações inválidas via tipo | ⚠️ | `value` + `defaultValue` simultâneos não bloqueados. |
| 3.5 | Polimorfismo via `as` | ❌ | Sem `as`. |
| 3.6 | `forwardRef` + `displayName` | ❌ | **Nenhum dos 5 sub-componentes (`SelectRoot`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`) tem `displayName`.** **Nenhum tem `forwardRef`.** |
| 3.7 | Compound: contratos de slot explícitos | ⚠️ | Slots reais (Trigger/Value/Content/Item são entidades distintas). Sem JSDoc explicando obrigação de incluir `Trigger > Value` e `Content > Item`. |
| 3.8 | Tipos públicos exportados | ✅ | `SelectRootProps`, `SelectTriggerProps`, `SelectValueProps`, `SelectContentProps`, `SelectItemProps`, `SelectOption`, `SelectSize`. |

**Surface area atual:**

```ts
// SelectRootProps
{
  value?: string;
  defaultValue?: string;     // default '' — sentinel "vazio"
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  style?: CSSProperties;
  children: ReactNode;
}

// SelectOption interface declarada mas não consumida pelo compound
// (parece resíduo de uma API "flat" anterior)

// SelectItem renderiza children como display + setá value como rótulo do trigger
// (DX confuso — valor cru aparece, não children)
```

**Observações livres:**
- **`SelectOption` interface exportada mas não usada** — código morto na API pública. Confunde consumidor (acha que pode usar `<Select options={options}>`).
- **`placeholder` em duplicidade** — está em `SelectRootProps` E em `SelectValueProps`. O do Root nunca é lido. Resíduo.
- **`style` em `SelectRootProps`** — é repassado? Olhando o código: **não**. Story `Default` faz `<Select.Root ... style={{ width: 280 }}>` e o style cai por terra (Root não consome `style`, Box wrapper não recebe). **Mais um resíduo silencioso.**

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | `Box`, `Flex`, `Clickable`. |
| 4.2 | Sem `style={{...}}` onde há prop equivalente | ⚠️ | Vários: `style={{ height, padding, fontSize, border, backgroundColor, color, boxSizing }}` no trigger; `style={{ top, left, right, zIndex, margin, padding, listStyle, border, boxShadow, maxHeight, overflowY }}` no content. **Várias têm prop.** |
| 4.3 | Estrutura de pasta aplicada | ✅ | `core/`, `interfaces/`, `context/`. |
| 4.4 | Estilo via `defineRecipe`/`defineSlotRecipe` | ❌ | Recipe `select` declarada mas dead. |
| 4.5 | Sem `any`, `console.*` | ✅ | Limpo. |
| 4.6 | Testes cobrem estados, variantes, a11y, interações | ⚠️ | 23 cases cobrem: render, open/close (click + Escape), aria-* básicos, disabled, FieldContext (3). **Faltam:** keyboard real (setas, Home/End, type-ahead, Tab), focus management (trigger ↔ content), portal/overflow, `aria-controls`/`aria-activedescendant`, sizes (testes só renderizam sem asserir tamanho), RTL, dark theme. |
| 4.7 | Story cobre default + variantes + composição | ⚠️ | 5 stories. **Stories usam `<div style>` em vez de `<Flex>`.** Faltam: integração `<Field>`, controlado, dark theme, conteúdo longo (overflow), portal demo. |
| 4.8 | `.native.tsx` presente ou platform-split documentado | ✅ | `web-only` documentado em `select.tsx:1` (JSDoc) e na interface. |
| 4.9 | Imports respeitam camadas | ✅ | foundations → ecosystem → components. |

**Métricas rápidas:**

- LOC: `select.tsx` 249 · `SelectProps.ts` 40 · `select-context.ts` 21 → **310 LOC.**
- Nº de testes: 23
- Nº de stories: 5
- Dependências externas: 0

**Observações livres:**
- **Maior componente de R6** (310 LOC). Concentra mais lógica e mais buracos: re-implementa outside click, gerencia listbox/items, sem Portal, sem focus management.
- **`Clickable` no trigger** ✅ — bom uso. Mas Clickable não cobre o caso "outline none + focus visible" sem custom styling.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público em `src/components/index.ts` | ✅ | `export * from './select'`. |
| 5.2 | Tipos públicos exportados | ✅ | 7 tipos. |
| 5.3 | Mudança proposta tem changeset | N/A | — |
| 5.4 | Breaking change tem RFC | N/A | — |
| 5.5 | Guia de migração | N/A | — |

**Observações livres:**
- **`SelectOption` exportado mas inutilizado** = resíduo na API pública. Remover ou ressuscitar via `<Select options={[...]}>` shorthand (RFC).

---

## 6. Resumo executivo

**Score por eixo:** Visual `3/8` ❌ · Comportamental `2/8` ❌ · Funcional `4/8` ⚠️ · Código `5/9` ⚠️ · Governança `4/5` ⚠️

**Top 3 achados (por impacto):**

1. **Acessibilidade quebrada para teclado e leitor de tela** (#2.1/#2.2/#2.3). Sem setas, Home/End, type-ahead. Sem foco no item ativo. Sem retorno de foco ao trigger no close. Sem `aria-controls`/`aria-activedescendant`. **Prioridade crítica.**
2. **Sem Portal** (#1.1 obs). Listbox cortado por qualquer ancestor com overflow. **Prioridade crítica** em produto real (form em modal, em card scrollável, em sidebar).
3. **`SelectValue` mostra value raw, não children do `Item`** (#2.x obs). UX confuso — selecionar "Apple" mostra "apple" no trigger. **Prioridade alta** — conserto exige registry de items.

**Achado adicional sistêmico:** **APIs residuais** (`SelectOption`, `placeholder` em Root, `style` em Root) = código morto na surface pública. Limpar antes de release.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [ ] ⚠️ Aprovado com fixes menores
- [x] ❌ Requer mudanças antes da próxima release

> Componente atual é um stub a11y-mínimo de Select. Não é seguro para produção em formulários reais sem fixes ❌ acima.

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] **SE-1** Remover `placeholder?` de `SelectRootProps` (não é consumido).
- [ ] **SE-2** Remover `style?` de `SelectRootProps` (não é consumido).
- [ ] **SE-3** Remover `SelectOption` interface (não é consumido).
- [ ] **SE-4** Atualizar story `Default` removendo `style={{ width: 280 }}` órfão (envolver em `<Box width="280px">` ou similar).
- [ ] **SE-5** Adicionar `displayName` em `SelectRoot` (`'Select.Root'`), `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`.
- [ ] **SE-6** Refatorar stories para usar `<Flex>` em vez de `<div style={...}>`.

### Issue (mudança localizada, sem breaking change)

- [ ] **SE-7** `forwardRef` em `SelectTrigger` (ref ao botão para focus management).
- [ ] **SE-8** Substituir `▲`/`▼` por `<Icon name="ChevronDown" />` (com rotação via CSS quando aberto).
- [ ] **SE-9** Foco visível no trigger: substituir `outline="none"` por `:focus-visible` token.
- [ ] **SE-10** Promover `height/padding/fontSize/border/backgroundColor/color/boxSizing` de `style={...}` para props declarativas.
- [ ] **SE-11** `transition()` em open/close do Content (e respeitar `usePrefersReducedMotion`).
- [ ] **SE-12** Touch target ≥ 44×44 em `sm` e `md`.
- [ ] **SE-13** Substituir outside-click manual por `DismissableLayer` (`ecosystem/primitives`).
- [ ] **SE-14** Usar `useOverlayStack` para gerenciar múltiplos selects abertos.
- [ ] **SE-15** Stories: integração `<Field>`, controlado, dark theme, conteúdo longo, portal demo.
- [ ] **SE-16** Testes: keyboard (setas/Home/End/type-ahead), focus management, RTL, dark theme.

### RFC (sistêmico ou breaking change)

- [ ] **RFC candidata: Select cumprindo WAI-ARIA "Select-Only Combobox"** — adicionar setas/Home/End/type-ahead, focus management completo, `aria-controls`/`aria-activedescendant`. Esta é a mudança mais relevante de R6 e provavelmente exige refatoração ampla. Prioridade alta.
- [ ] **RFC candidata: Render via `Portal` para overlays** — Select.Content + futuro Popover/Menu/Tooltip do R11. Padrão a definir antes de R11.
- [ ] **RFC candidata: Item registry e display vs value** — `Select.Item` registra `{ value, displayNode }` no contexto; `Select.Value` lê displayNode do registry. Padrão Radix-like. Resolve UX e habilita itens com layouts ricos (icon + texto, descrição, badge).
- [ ] **RFC candidata: Recipes mortas em R6** (compartilhada).
- [ ] **RFC candidata: Estratégia native para Select** — formal `web-only` com guard de import OU implementar via `Picker` do RN.

---

## 8. Notas de arquiteto

- **Select é o componente mais subentregue de R6.** Tem a aparência de Select pronto, mas a a11y completa (a única que importa para um Select) está ausente. Em produção, usuários de teclado e SR não conseguem usá-lo. Vale priorizar antes de fechar R6.
- **`SelectValue` mostrar value raw** é sintoma de pensar "value = display" no momento da modelagem. Caso de uso real (item com ícone + texto + badge) exige separação. RFC vale.
- **Re-implementação de outside click + Escape em vez de `DismissableLayer`** = exemplo claro de "primitive existe, componente não usa". CONTRIBUTING precisa enumerar primitivas e mandato de uso.
- **`SelectOption` interface morta** indica refactor anterior incompleto. Sweep "código morto na API pública" vale rodar em todos os componentes pós-R6.
- **`SelectContent` é renderizado inline, não em portal** — para R11 (Dialog/Drawer/Popover) o padrão Portal será central. Decidir agora poupa retrabalho.
- **Padrão emergente confirmado** — todos os 5 R6 têm:
  - Recipe declarada × não consumida.
  - Foco invisível em input oculto OU outline=none.
  - Touch target abaixo de 44×44 em pelo menos um size.
  - `style={{...}}` aplicando o que props declarativas resolveriam.
  - `forwardRef` ausente no Root.
  - `displayName` parcial ou ausente.
  Tudo somado, indica que R6 precisa de **revisita coordenada** (sweep) após decisões de RFC, em vez de fixes ponto-a-ponto.
