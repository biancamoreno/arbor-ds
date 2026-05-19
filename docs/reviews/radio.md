# Review — `Radio`

**Fase:** R6 · **Camada:** `form` · **Status:** `concluído`
**Revisor:** arbor-ds-arch · **Data:** 2026-04-24 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/radio/core/radio.tsx` · `src/components/radio/context/radio-context.ts` · `src/components/radio/interfaces/RadioProps.ts`.
- **Story:** `src/components/radio/core/radio.stories.tsx` (5 stories: Default, WithDescription, Group, Disabled, Sizes).
- **Testes:** `src/components/radio/core/radio.test.tsx` (18 cases).
- **Implementação nativa:** `não` — sem `radio.native.tsx`. **Não documentado como `web-only`** na interface (silêncio).
- **Classificação cross-platform:** `web-only` (de fato; sem doc explícito).
- **Dependências internas:** `Box`, `Flex`, `Text`, `useTheme`, `useControllableState`, `useFieldContext`, `markFieldAware`, `transition`.
- **Consumidores conhecidos:** consumidores externos. Nenhum componente do DS depende dele.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ❌ | Recipe `radio` em `base-theme.ts:244` declara slots `root/control/indicator/label/description` + variant `size`. **Componente não consome a recipe** — usa `sizeMap` constante interna em pixels (`12px/16px/20px`). |
| 1.2 | Tokens semânticos | ⚠️ | Cores via `theme.colors.brand.base`, `border.default`, `border.strong`, `surface.default` ✅. Mas `padding`, `titleSize`, `descriptionSize` em pixels crus (`12px`, `14px`, `10px`). `theme.space.small` ✅ no `gap`. **Inconsistência:** mistura tokens (gap) e crus (padding) no mesmo `style`. |
| 1.3 | Estados visuais: default/hover/focus/active/focus-visible/disabled/error | ❌ | **Sem hover, sem focus, sem focus-visible, sem error.** Apenas `disabled` → `opacity: 0.6` + `cursor: not-allowed`. O `<input>` real é `position: absolute; opacity: 0; pointerEvents: none` — nunca recebe foco visual. **Foco do teclado fica invisível.** |
| 1.4 | Escala de tamanhos coerente com DS | ⚠️ | Prop `size: 'sm' \| 'md' \| 'lg'` exposta. `sizeMap` interno aplica `padding`/`titleSize`/`descriptionSize`. Mas `Indicator` é `width: 20`, `height: 20` **fixo** — não escala com `size`. **Bug de proporção.** |
| 1.5 | Contraste ≥ WCAG AA em light/dark | ✅ | Tokens semânticos em uso. |
| 1.6 | Microinterações usam `transition()` | ✅ | `transition(['border-color','background-color','box-shadow'], 'fast')` no card; `transition(['background-color'], 'fast')` no inner do indicator. |
| 1.7 | Animações respeitam `usePrefersReducedMotion` | ❌ | `transition()` aplica sempre. Sem hook `usePrefersReducedMotion` para anular. |
| 1.8 | Ícones usam `<Icon>` do DS | ✅ N/A | Sem ícones; o "dot" é `<Box width={10} height={10} borderRadius="full">`. |

**Observações livres:**
- **Indicator não escala com `size`** — em `lg` (padding 20px, fonte 20px), o círculo continua 20×20. Visualmente desproporcional.
- O componente desenha tudo: o `<input>` é puramente para semântica (escondido). Visual é 100% custom. ✓ **Consequência:** estados visuais (foco, hover, error) precisam ser mapeados manualmente — hoje **nenhum** está mapeado.
- `boxShadow: '0 0 0 2px ${theme.colors.brand.subtle}'` — token sólido aplicado em sombra crua (sem RFC de elevation).

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado: Tab, Space, Enter, setas | ⚠️ | `<input type=radio>` é nativamente focável — Space toggle. Mas **`opacity: 0; pointerEvents: none`** torna foco invisível. **Sem navegação por setas entre radios** (comportamento nativo de radiogroup só funciona se inputs compartilham `name` E o user passa por todos com Tab — quebra o padrão WAI-ARIA "single tab stop, arrow navigation"). |
| 2.2 | Focus management | ❌ | Sem indicador visual de foco — o input está visualmente oculto. Usuário de teclado não sabe onde está. |
| 2.3 | `role` correto + `aria-*` | ✅ | `<input type=radio>` ✅. `aria-describedby/required/invalid/errormessage` consumidos do FieldContext (RFC-0014). |
| 2.4 | Anúncios a leitor de tela | ✅ | Nativo. |
| 2.5 | Touch target ≥ 44×44 | ⚠️ | Card inteiro é clicável (via `<label>`); para `size='sm'` (padding 12), altura ≈ 50px ✅; para textos curtos sem description, talvez 36–40px ⚠️. |
| 2.6 | Comportamento controlado × não-controlado | ✅ | `useControllableState` correto. |
| 2.7 | Evento cancelável | ✅ N/A | — |
| 2.8 | Comportamento em RTL | ⚠️ | Usa `flexDirection: row` implícito (ícone à direita por `justifyContent: space-between`). RTL provavelmente espelha ✅, mas sem teste. |

**Observações livres:**
- **`disabled` lógica usa `||` em vez de `??`** — `radio.tsx:37`:
  ```ts
  const effectiveDisabled = disabled || (fieldCtx?.disabled ?? false);
  ```
  Diferente de Checkbox/Switch/Select que usam `??`. Consequência: passar `disabled={false}` explícito **não anula** `Field.disabled`. Inconsistente com o contrato canônico Field-aware (RFC-0014: prop local vence).
- **Sem RadioGroup** — o usuário compõe `<div role="radiogroup">` ao redor de `Radio.Root`s, cada um com mesmo `name`. Padrão HTML clássico funciona, mas:
  - Sem navegação por setas (não há gerenciador compartilhado de roving tabindex).
  - Sem propagação de `disabled`/`required`/`invalid` para todos os filhos.
  - Sem coleta de `value` único do grupo via callback.
  Caller faz tudo manualmente. **Lacuna de produto significativa.**
- **Teste `does not call onCheckedChange when disabled`** apenas verifica `input.disabled === true` e que callback não foi chamado — **não dispara click** (`fireEvent.click`). Falsa cobertura.

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API pública mínima | ✅ | `RadioRootProps`: 9 props enxutos. |
| 3.2 | Naming segue convenção do DS | ⚠️ | `disabled`/`checked`/`onCheckedChange` ✅ RFC-0013/0015. `value` (HTML attribute) — ok. **Mas:** Radio mantém prop `name` para grupos manuais; não há `RadioGroup` que abstraia. |
| 3.3 | Defaults "least surprise" | ✅ | `defaultChecked = false`, `disabled = false`, `size = 'md'`. |
| 3.4 | Combinações inválidas via tipo | ⚠️ | `value` é obrigatório (✅). Mas `checked` + `defaultChecked` simultâneos não bloqueados. |
| 3.5 | Polimorfismo via `as` | ❌ | Sem `as`. |
| 3.6 | `forwardRef` + `displayName` | ❌ | Nenhum dos 4 sub-componentes (`RadioRoot`, `RadioIndicator`, `RadioLabel`, `RadioDescription`) tem `displayName`. **Nenhum tem `forwardRef`.** |
| 3.7 | Compound: contratos de slot explícitos | ⚠️ | Sem JSDoc. Mesmo padrão Field — implícito. |
| 3.8 | Tipos públicos exportados | ✅ | `RadioRootProps`, `RadioIndicatorProps`, `RadioLabelProps`, `RadioDescriptionProps`, `RadioSize` em `index.ts`. |

**Surface area atual:**

```ts
// RadioRootProps
{
  value: string;          // obrigatório (HTML radio attribute)
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;           // string compartilhado para grupos manuais
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

// RadioIndicatorProps { style?: CSSProperties }
// RadioLabelProps { children: ReactNode }
// RadioDescriptionProps { children: ReactNode }
```

**Observações livres:**
- **`size: 'sm'` quebra a Indicator** — só afeta padding/font do card. Indicator fixo. Drift de proporção.
- **`name` em cada Radio** = forma legacy. Modern API: `<RadioGroup name="x" value={...} onValueChange={...}>` gerencia.
- **Teste `Group` na story usa `<div style={...}>` cru com `role="radiogroup"`** — mostra exatamente o gap: o consumidor monta o div manualmente.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | `Box as="label"`, `Box as="input"`, `Flex`, `Text`, `Box as="span"`. ✅ |
| 4.2 | Sem `style={{...}}` onde há prop equivalente | ⚠️ | Múltiplos `style={{ gap, padding, border, backgroundColor, boxShadow, transition }}` — **`gap`, `padding`, `backgroundColor`, `transition` têm prop declarativa equivalente.** Tela de oportunidade de migração. |
| 4.3 | Estrutura de pasta aplicada | ✅ | `core/`, `interfaces/`, `context/`. |
| 4.4 | Estilo via `defineRecipe`/`defineSlotRecipe` | ❌ | Recipe `radio` declarada em `base-theme.ts:244` mas **dead recipe** (não há `useSlotRecipe('radio', ...)`). |
| 4.5 | Sem `any`, `console.*` | ✅ | Limpo. |
| 4.6 | Testes cobrem estados, variantes, a11y, interações | ⚠️ | 18 cases: render, controlled/uncontrolled, disabled (mas teste fraco), FieldContext (5 cases). **Faltam:** keyboard (setas, Tab), focus management, sizes, RTL, hover/focus visuais, behavior dentro de radiogroup, click no card vs. click no indicator. |
| 4.7 | Story cobre default + variantes + composição | ⚠️ | 5 stories. **Story `Group` usa `<div style>` cru** (anti-pattern documentado). **Faltam:** integração com `<Field>` completo, dark theme, story controlada (parent gerenciando seleção entre N radios), story de erro/required. |
| 4.8 | `.native.tsx` presente ou platform-split documentado | ❌ | Sem `radio.native.tsx`. Sem JSDoc `@platform web-only` na interface. **Drift cross-platform silencioso** — usuário RN importa `Radio` e quebra em runtime. |
| 4.9 | Imports respeitam camadas | ✅ | foundations → ecosystem → components. |

**Métricas rápidas:**

- LOC: `radio.tsx` 168 · `RadioProps.ts` 27 · `radio-context.ts` 18 → **213 LOC.**
- Nº de testes: 18
- Nº de stories: 5
- Dependências externas: 0

**Observações livres:**
- **`disabled` com `||` em vez de `??`** (radio.tsx:37) é bug sutil. Outras Field-aware components usam `??`.
- **`<input>` invisível** = padrão técnico válido (custom radio sobre HTML semântico) **se** o foco do `<input>` for refletido visualmente em outro lugar (ex: `peer-focus` em CSS, ou `usePressFocus` próprio). Hoje, **nada reflete o foco** — usuário de teclado fica perdido.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público em `src/components/index.ts` | ✅ | `export * from './radio'`. |
| 5.2 | Tipos públicos exportados | ✅ | 4 tipos + `RadioSize`. |
| 5.3 | Mudança proposta tem changeset | N/A | — |
| 5.4 | Breaking change tem RFC | N/A | — |
| 5.5 | Guia de migração | N/A | — |

**Observações livres:**
- Re-export `Radio` do index aceita tanto `Radio` (alias `RadioRoot`) quanto `Radio.Root`. Compound API ok mas não documentada.

---

## 6. Resumo executivo

**Score por eixo:** Visual `2/8` ❌ · Comportamental `3/8` ⚠️ · Funcional `4/8` ⚠️ · Código `4/9` ⚠️ · Governança `5/5` ✅

**Top 3 achados (por impacto):**

1. **Foco invisível por teclado + sem navegação por setas** (#2.1/#2.2). O `<input>` está oculto e não há reflexo de `:focus` em nenhum elemento. Usuário de teclado não navega o Radio. **Prioridade crítica de a11y.**
2. **Falta `RadioGroup` compound** (#3.2/#7). O caso canônico (selecionar uma de N opções) requer o consumidor montar `<div role="radiogroup">` cru, gerenciar `value` compartilhado e setar `name` em cada filho manualmente. **Prioridade alta** — RFC.
3. **`disabled` lógica usa `||` (inconsistente com Checkbox/Switch/Select)** (`radio.tsx:37`). Quebra contrato Field-aware (RFC-0014). **Prioridade média** — fix de 1 linha.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores (listados abaixo)
- [ ] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] **R-1** Trocar `disabled || (fieldCtx?.disabled ?? false)` por `disabled ?? fieldCtx?.disabled ?? false` em `radio.tsx:37`. Alinhar com Checkbox/Switch/Select.
- [ ] **R-2** Adicionar `displayName` em `RadioRoot`, `RadioIndicator`, `RadioLabel`, `RadioDescription`.
- [ ] **R-3** Adicionar JSDoc `@platform web-only` em `RadioProps.ts` enquanto `radio.native.tsx` não existir.

### Issue (mudança localizada, sem breaking change)

- [ ] **R-4** `forwardRef` em `RadioRoot` (sweep TD-007).
- [ ] **R-5** Adicionar foco visível (`:focus-visible` no `<input>` ou `peer`-style no card via `<Box as="label">` — ou refletir foco em `boxShadow` adicional do card).
- [ ] **R-6** `Indicator` deve escalar com `size` (sm: 16, md: 20, lg: 24 — alinhar com switch.tsx).
- [ ] **R-7** Refatorar a aplicação de `transition()` para respeitar `usePrefersReducedMotion`.
- [ ] **R-8** Promover `gap`, `padding`, `backgroundColor`, `transition` de `style={...}` para props declarativas onde existem.
- [ ] **R-9** Testes: keyboard (Tab + setas), focus visible, disabled real (`fireEvent.click` em vez de só ler `disabled`), sizes, integração `<Field>`, RTL.
- [ ] **R-10** Story: integração com `<Field>` completo (label/description/error). Refatorar story `Group` para usar `<RadioGroup>` quando este existir; até lá, usar `Flex flexDirection="column" gap="8px">` em vez de `<div style>`.
- [ ] **R-11** Definir comportamento native: criar `radio.native.tsx` ou aceitar formal `web-only` com warning de import em runtime.

### RFC (sistêmico ou breaking change)

- [ ] **RFC candidata: `RadioGroup` compound** — `<RadioGroup name="..." value={...} onValueChange={...}>` gerencia estado, propaga `disabled`/`required`/`invalid`, implementa roving tabindex (Tab vai a um item; setas navegam dentro). Caso de uso primário do Radio.
- [ ] **RFC candidata: Recipes mortas em R6** (compartilhada com Checkbox/Switch/Select) — TD-008 padrão.
- [ ] **RFC candidata: Estratégia native para componentes form** — Radio/Select/RadioCard sem native impl; decidir entre re-implementar ou marcar formalmente `web-only` com guard.
- [ ] **RFC candidata: Foco visível custom para inputs ocultos** — quando o DS desenha visual próprio sobre `<input>` oculto, padrão para refletir `:focus-visible` do input no elemento desenhado (peer-style, ou via prop `aria-activedescendant` + estado).

---

## 8. Notas de arquiteto

- **Foco invisível é a falha de a11y mais grave de R6.** Radio é caso clássico: input nativo oculto + visual custom. Sem reflexo de foco, é WCAG 2.4.7 quebrado. Padrão a corrigir antes de R6 fechar.
- **Inconsistência `disabled || …` vs `disabled ?? …`** — sintoma de copy/paste não revisado. Vale CONTRIBUTING.md doc: "Field-aware components: prop local vence Field via `??`, nunca `||`".
- **Sub-componentes sem displayName são reincidência de R2/R3/R5** (mesmo problema mapeado em F-1 e MR5-1). Padrão a varrer em sweep coordenado pós-R6.
- **`size` afetando padding mas não Indicator** indica que o pensamento "size é altura do card, não do controle" foi parcial. Switch tem `trackSize` + `thumbSize` mapeados juntos — Radio deveria ter `cardPadding` + `indicatorSize` mapeados juntos.
- **`<input>` posicionado absoluto com `opacity: 0`** é uma técnica conhecida (visually-hidden). Falta a contraparte: o visual desenhado precisa ser **ele mesmo** focável OU refletir o foco do input. Hoje o input recebe foco mas o card não muda — usuário fica cego.
- **`Radio.Indicator` retorna estilizado mas é renderizado dentro de uma `<Flex>` que já desenha "um aspect" do indicator** (boxShadow brand.subtle no card). Visual de "selecionado" é dado por **3 sinais simultâneos** (indicator preenchido, fundo brand.subtle, borda brand.base, boxShadow). Coerente com card-style mas exagerado — Radio canônico é o círculo. Vale separar em duas variantes (`variant="card" | "button" | "minimal"`) ou unificar com `RadioCard`.
