# Review — `Checkbox`

**Fase:** R6 · **Camada:** `form` · **Status:** `concluído`
**Revisor:** arbor-ds-architect · **Data:** 2026-04-24 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/checkbox/core/checkbox.tsx` (web) · `src/components/checkbox/core/checkbox.native.tsx` (native) · `src/components/checkbox/context/checkbox-context.ts` · `src/components/checkbox/interfaces/CheckboxProps.ts`.
- **Story:** `src/components/checkbox/core/checkbox.stories.tsx` (5 stories: Default, WithDescription, Indeterminate, Disabled, Group).
- **Testes:** `src/components/checkbox/core/checkbox.test.tsx` (16 cases — anatomy + FieldContext integration).
- **Implementação nativa:** `sim` — `.native.tsx` re-implementa indicator visual (sem RN Checkbox nativo).
- **Classificação cross-platform:** `platform-split` (web usa input HTML + `accentColor`; native desenha visual em `View`).
- **Dependências internas:** `Box`, `Flex`, `Text`, `useTheme`, `useControllableState`, `useFieldContext`, `markFieldAware`.
- **Consumidores conhecidos:** consumidores externos (apps); compõe com `Field`. Nenhum componente do DS depende dele.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ❌ | Recipe `checkbox` em `base-theme.ts:226` declara slots `root/indicator/label/description` + variant `size`. **Componente não consome a recipe** — todos os estilos são hardcoded em props/`style`. Variants `size` declaradas mas inalcançáveis. |
| 1.2 | Tokens semânticos (sem valores crus) | ⚠️ | Web: `accentColor: theme.colors.interactive.default` ✅ token; mas `width={18}`, `height={18}`, `marginTop={2}` em pixels crus. Native: `borderRadius: 4`, `borderWidth: 2`, `width/height: 18, 10, 2` — todos crus. |
| 1.3 | Estados visuais: default/hover/focus/active/focus-visible/disabled/error | ❌ | Sem estilo de **hover**, **focus**, **focus-visible**, **error**. `disabled` apenas via `opacity: 0.6` e `cursor: not-allowed`. **Browser nativo do `<input type=checkbox>` desenha foco padrão do SO** — visual diverge entre Chrome/Safari/Firefox e não respeita tokens do DS. |
| 1.4 | Escala de tamanhos coerente com DS | ❌ | Sem prop `size` na API pública (recipe define sm/md/lg mas não chega ao componente). Tamanho fixo em `18px`. |
| 1.5 | Contraste ≥ WCAG AA em light/dark | ⚠️ | Cor de marca (`interactive.default`) via `accentColor` — depende do browser pintar em valor sólido legível. Native usa `text.inverse` sobre `interactive.default` (ok se tokens validados em R1). |
| 1.6 | Microinterações usam `transition()` | ❌ | Sem transição em mudança de estado checked → unchecked (web depende do browser; native sem animação). |
| 1.7 | Animações respeitam `usePrefersReducedMotion` | ✅ N/A | Sem animação. |
| 1.8 | Ícones usam `<Icon>` do DS | ⚠️ | Web: marca de check é desenhada pelo browser via `accentColor`. Native: marca é um `<Box>` retangular rotacionado em `-45deg` com hardcoded `width: 10, height: 2` — **não usa Icon, não tem traço de "✓" real**, é uma aproximação visual. Quebra paridade visual web ↔ native. |

**Observações livres:**
- **Decisão de usar `accentColor` no web é pragmática** mas custa controle visual. Não há como pintar borda própria, fundo customizado ou estilo de foco do DS. O resultado visual depende inteiramente do user agent. Para um DS com pretensão de consistência cross-browser, é uma dívida.
- **Native não desenha um check real** — desenha um retângulo rotacionado 45°. Indeterminate desenha o mesmo retângulo sem rotação. Sem icon system, perde-se semântica visual.
- **Indicator native lê `theme.colors` direto via `useTheme`** — sem recipe, sem variant `size`. Mesmo padrão de TD-005 (Field.native).

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado: Tab, Space, Enter | ⚠️ | Web: `<input type=checkbox>` é nativamente focável e Space toggle. ✅ Mas **Enter não toggle** (comportamento nativo de checkbox). Native: `Pressable` com `accessibilityRole="checkbox"` reage a Space (em RNW); RN puro ainda não tem foco de teclado real. |
| 2.2 | Focus management | ❌ | Sem `:focus-visible` styling. Foco visual = ring nativo do browser, sem controle pelo DS. |
| 2.3 | `role` correto + `aria-*` completos | ⚠️ | `role` herdado (input type=checkbox). `aria-describedby`, `aria-required`, `aria-invalid`, `aria-errormessage` consumidos do `FieldContext` corretamente (RFC-0014). **Falta:** `aria-label` quando há `Checkbox.Label` interno mas não há Field externo. |
| 2.4 | Anúncios a leitor de tela | ⚠️ | `aria-checked` herdado do nativo (web). Native: `accessibilityState={{ checked, disabled }}` ✅. Indeterminate: web `input.indeterminate = true` setado via `useEffect`; **leitores anunciam "mixed"** ✅. Native: indeterminate visualmente diferente mas **sem `accessibilityState={{ checked: 'mixed' }}`** — leitores RN anunciam apenas checked/unchecked. |
| 2.5 | Touch target ≥ 44×44 | ⚠️ | Indicator é 18×18 — abaixo de 44. Mitigado quando `<Checkbox.Label>` está presente (toda a área do `<label>` toggle). Mas Indicator standalone (story `Indeterminate` sem label) tem touch target ruim. |
| 2.6 | Comportamento controlado × não-controlado | ✅ | `useControllableState` resolve corretamente; testes cobrem ambos. |
| 2.7 | Evento cancelável | ✅ N/A | Sem fluxo cancelável. |
| 2.8 | Comportamento em RTL | ⚠️ | `flexDirection: row` + `gap` — em RTL o indicator vai para direita. Sem teste. |

**Observações livres:**
- **`name` e `value` props existem na interface mas não são repassados ao input** — em `checkbox.tsx:22`, `name: _name, value: _value` são destruturados com prefixo `_` (convenção "unused"). **Bug funcional:** form submission não inclui o checkbox. Casos de uso reais (forms HTML clássicos, FormData, `<form action=...>`) quebram.
- **Indeterminate é prop de leitura** (caller controla) — após click, `onCheckedChange(true)` é chamado mas `indeterminate` não muda automaticamente. Caller precisa limpar `indeterminate` manualmente. **Sem JSDoc explicando.**
- **Click na label toggle** — funciona via `<Flex as="label" htmlFor={inputId}>`. ✅ Padrão HTML.
- **Click no indicator standalone** triggera o input ✅ (mesmo `<label>` o envolve).

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API pública mínima | ⚠️ | `CheckboxRoot`: 9 props. `CheckboxIndicator extends Omit<InputHTMLAttributes, 'type'\|'checked'\|'onChange'\|'disabled'\|'size'>` → surface area HUGE implícita (mesmo padrão HR5-13 de TextInput). |
| 3.2 | Naming segue convenção do DS | ✅ | `disabled`, `checked`, `defaultChecked`, `onCheckedChange`, `indeterminate` — RFC-0013 (sem `is*`) + RFC-0015 (sem `onChange`). |
| 3.3 | Defaults "least surprise" | ✅ | `defaultChecked = false`, `indeterminate = false`. |
| 3.4 | Combinações inválidas bloqueadas via tipo | ⚠️ | `checked` + `defaultChecked` simultâneos não bloqueados (lib aceita; `useControllableState` privilegia `value`). Sem discriminated union. |
| 3.5 | Polimorfismo via `as` | ❌ | Sem `as`. |
| 3.6 | `forwardRef` + `displayName` | ⚠️ | `Checkbox.Indicator` tem `forwardRef` + displayName. **`CheckboxRoot` não tem `forwardRef`.** `CheckboxLabel` e `CheckboxDescription` sem displayName. `CheckboxRoot.displayName = 'Checkbox'`. |
| 3.7 | Compound: contratos de slot explícitos | ⚠️ | Indicator/Label/Description sem JSDoc de uso. Compound API (`Checkbox.Root`/`Checkbox.Indicator`) ok mas `Checkbox` (default) é alias de `CheckboxRoot` (`Object.assign`). Atalho útil mas não documentado. |
| 3.8 | Tipos públicos exportados | ✅ | `CheckboxRootProps`, `CheckboxIndicatorProps`, `CheckboxLabelProps`, `CheckboxDescriptionProps` — todos via `interfaces/index.ts`. |

**Surface area atual:**

```ts
// CheckboxRootProps
{
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  id?: string;
  name?: string;          // ← não repassado ao input (bug)
  value?: string;         // ← não repassado ao input (bug)
  children: ReactNode;
}

// CheckboxIndicatorProps extends Omit<InputHTMLAttributes<HTMLInputElement>,
//   'type' | 'checked' | 'onChange' | 'disabled' | 'size'> { style?: CSSProperties }
```

**Observações livres:**
- **Comentário `@platform web-only` no `CheckboxProps.ts:3` está errado** — existe `checkbox.native.tsx` que importa `CheckboxRootProps`. Doc stale.
- **Sem `CheckboxGroup`** — caso de uso "selecione múltiplas opções" não tem componente compound. Caller compõe `<div role="group">…</div>` manualmente.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | Web: `Box as="input"` ok. Native: **`Pressable` direto** — viola CLAUDE.md (deveria ser `Clickable`). |
| 4.2 | Sem `style={{...}}` onde há prop equivalente | ⚠️ | Web: `style={{ accentColor, ...style }}` aceitável (sem prop equivalente). Native: `style={{ width, height, marginTop, borderRadius, borderWidth, borderColor, backgroundColor }}` — **vários têm prop declarativa equivalente.** Padrão a corrigir. |
| 4.3 | Estrutura de pasta aplicada | ✅ | `core/`, `interfaces/`, `context/`. (Sem `utils/` nem `accessibility/`, mas não necessário.) |
| 4.4 | Estilo via `defineRecipe`/`defineSlotRecipe` | ❌ | Recipe `checkbox` declarada em `base-theme.ts:226` mas **dead recipe** (não há `useSlotRecipe('checkbox', ...)`). Mesmo padrão TD-008/CR5-1. |
| 4.5 | Sem `any`, `console.*` | ✅ | Limpo. |
| 4.6 | Testes cobrem estados, variantes, a11y, interações | ⚠️ | 16 testes cobrem: render, controlled/uncontrolled, indeterminate, disabled+click bloqueado, FieldContext (4 cases). **Faltam:** focus management, keyboard (Space/Enter), touch target, native renderer, recipe variants, RTL, anúncio de "mixed" em SR, label click toggle. |
| 4.7 | Story cobre default + variantes + composição | ⚠️ | 5 stories. **Faltam:** integração com `<Field>` completo (label+desc+error), `<input>` em form com submit (validação `name`/`value`), keyboard navigation, dark theme. |
| 4.8 | `.native.tsx` presente ou platform-split documentado | ⚠️ | Presente, mas: re-implementa indicator com `<View>` + `style={}` + tokens via `useTheme()` (sem recipe), usa `Pressable` direto, **sem testes**. Divergência visual com web (rotação custom em vez de Icon). |
| 4.9 | Imports respeitam camadas | ✅ | foundations → ecosystem → components. |

**Métricas rápidas:**

- LOC: `checkbox.tsx` 125 · `checkbox.native.tsx` 98 · `CheckboxProps.ts` 30 · `checkbox-context.ts` 18 → **271 LOC totais.**
- Nº de testes: 16 (web only)
- Nº de stories: 5
- Dependências externas: 0 (runtime)

**Observações livres:**
- **Recipe morta (`checkbox`)** = dívida arquitetural sistemática. R6 confirma o padrão de R5: 4 das 5 recipes (`checkbox`, `radio`, `switch`, `select` — falta confirmar) declaradas no theme **não são consumidas**. Theming dinâmico, dark mode token-driven, overrides via `createTheme` não afetam o componente.
- **`forwardRef` ausente em CheckboxRoot** — bloqueia ref ao container/label para focus management programático em forms.
- **`name` e `value` ignorados** = bug funcional silencioso.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público em `src/components/index.ts` | ✅ | `export * from './checkbox'`. |
| 5.2 | Tipos públicos exportados | ✅ | 4 tipos via interfaces/index.ts. |
| 5.3 | Mudança proposta tem changeset | N/A | Esta review não muda contrato. |
| 5.4 | Breaking change tem RFC | N/A | Sem breaking nesta sessão. |
| 5.5 | Guia de migração | N/A | — |

**Observações livres:**
- `Checkbox` (default) é o alias mais usado, mas a forma compound (`Checkbox.Root`/`.Indicator`) é a recomendada. Sem doc explicando preferência.

---

## 6. Resumo executivo

**Score por eixo:** Visual `1/8` ❌ · Comportamental `3/8` ⚠️ · Funcional `4/8` ⚠️ · Código `4/9` ⚠️ · Governança `5/5` ✅

**Top 3 achados (por impacto):**

1. **Bug funcional: `name` e `value` ignorados pelo `<input>`** (#3.1, `checkbox.tsx:22`). Form submissions HTML clássicas perdem o checkbox. **Prioridade crítica** — fix trivial (parar de prefixar com `_` e repassar ao `Box as="input"`).
2. **Recipe `checkbox` declarada × não consumida** (#1.1/#4.4). Variant `size` morta na API; theming dinâmico não afeta o componente. Mesmo padrão de TD-008. **Prioridade alta** — RFC sistêmica (não fix isolado).
3. **`accentColor` web + visual cru native = inconsistência cross-browser e cross-platform** (#1.2/#1.8). Sem foco do DS, sem hover, sem ícone real. **Prioridade média-alta** — decisão de arquitetura: aceitar dependência do user agent ou desenhar Indicator custom como Switch.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores (listados abaixo)
- [ ] ❌ Requer mudanças antes da próxima release

> Classificação ⚠️ é honesta: o componente **funciona** para o caso comum. Os 3 achados acima são dívidas sustentadas, não bloqueios.

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] **CB-1** Repassar `name` e `value` para `<Box as="input">` no web (`checkbox.tsx:22`). Bug funcional. Aplicar **agora**.
- [ ] **CB-2** Adicionar `displayName` em `CheckboxLabel`, `CheckboxDescription` (web + native).
- [ ] **CB-3** Atualizar JSDoc `@platform web-only` em `CheckboxProps.ts:3` — está incorreto (existe native).

### Issue (mudança localizada, sem breaking change)

- [ ] **CB-4** `forwardRef` em `CheckboxRoot` (sweep TD-007).
- [ ] **CB-5** `Checkbox.Indicator` web: estado de `:focus-visible` com token `focus.ring` quando definido (depende de RFC futura R1).
- [ ] **CB-6** Native: trocar `Pressable` por `Clickable` (CLAUDE.md compliance).
- [ ] **CB-7** Native: substituir hardcodes (`width: 18`, `borderRadius: 4`, `borderWidth: 2`) por props declarativas equivalentes ou tokens via recipe.
- [ ] **CB-8** Native: usar `<Icon name="Check" />` no estado checked e `<Icon name="Minus" />` no estado indeterminate em vez de `<Box>` rotacionado.
- [ ] **CB-9** Native: setar `accessibilityState={{ checked: 'mixed' }}` quando `indeterminate=true && !isChecked`.
- [ ] **CB-10** Testes: focus management, keyboard (Space toggle), label click toggle, touch target, RTL, dark theme.
- [ ] **CB-11** Testes nativos: cobertura zero hoje. Replicar suíte web.
- [ ] **CB-12** Stories: integração `<Field>` completa, form com submit, dark theme.
- [ ] **CB-13** JSDoc explicando contrato de `indeterminate` (caller deve limpar após `onCheckedChange`).

### RFC (sistêmico ou breaking change)

- [ ] **RFC candidata: Recipes mortas em R6** (`checkbox`, `radio`, `switch`, `select`) — sweep coordenado, mesmo padrão de TD-008. Decidir: implementar consumo via `useSlotRecipe` ou remover do theme.
- [ ] **RFC candidata: `CheckboxGroup` (e sibling para `Switch`/`Radio`)** — gerenciar estado coletivo `value: string[] | string`, emit `onValueChange`, contexto compartilhado (`name`). Cobre o caso real de "lista de checkboxes" sem o consumidor montar manualmente.
- [ ] **RFC candidata: Custom Indicator visual cross-platform** — substituir `accentColor` (web) e Box rotacionado (native) por SVG/Icon próprio com paridade entre plataformas. Permite estados (focus/hover/error) consistentes.
- [ ] **RFC candidata: `extends InputHTMLAttributes` em `CheckboxIndicatorProps`** (mesmo de HR5-13 TextInput) — surface area implícita ampla; preferir `nativeProps` curado.

---

## 8. Notas de arquiteto

- **Padrão emergente: "Recipe declarada, recipe ignorada"** — agora confirmado em 4+ componentes (input/Field resolvido em TD-008, e R6 inteira a fazer). Vale RFC sistêmica que **define quando declarar uma recipe é obrigatório consumir** — declaração sem consumo é dívida deliberada, não código morto neutro. Hoje as recipes do theme dão a impressão de que o sistema é theme-driven; na prática é hardcoded-driven.
- **`useFieldContext` + `markFieldAware` está consistente entre R5 (TextInput) e R6 (Checkbox/Switch/Select)** — RFC-0014 funcionou. Padrão a documentar em CONTRIBUTING como "como criar um Field-aware component".
- **`accentColor` no `<input>`** é uma decisão híbrida que parece simples e na prática quebra a coerência do DS. Padrão a evitar em RFC futura: "componentes interativos do DS desenham seu próprio visual; nunca dependem de styling nativo do user agent além de input semântico".
- **`name`/`value` "esquecidos"** (CB-1) é sintoma de teste insuficiente — o suite testa `onCheckedChange` mas não testa form submission. Adicionar caso "form submit envia o valor correto" pega esse tipo de regressão.
- **Indeterminate como prop de leitura, não de estado interno** — modelagem estranha. A semântica HTML é a mesma (indeterminate é puramente visual; checked/unchecked é o estado real), mas a API expõe mistura entre prop visual (indeterminate) e prop de estado (checked). Documentar ou refatorar para `state: 'unchecked' | 'checked' | 'indeterminate'` discriminada.
