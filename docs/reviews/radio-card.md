# Review — `RadioCard`

**Fase:** R6 · **Camada:** `form` · **Status:** `concluído`
**Revisor:** arbor-ds-arch · **Data:** 2026-04-24 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/radio-card/core/radio-card.tsx` (149 LOC) · `src/components/radio-card/interfaces/RadioCardProps.ts`.
- **Story:** `src/components/radio-card/core/radio-card.stories.tsx` (4 stories: Default, Group, Disabled, Sizes).
- **Testes:** **❌ não existem**. Sem `radio-card.test.tsx`.
- **Implementação nativa:** `não` — sem `radio-card.native.tsx`. JSDoc `@platform web-only` ✅ presente em `RadioCardProps.ts:4`.
- **Classificação cross-platform:** `web-only` (documentado).
- **Dependências internas:** `Box`, `Flex`, `Text`, `useTheme`, `transition`.
- **Consumidores conhecidos:** consumidores externos. Nenhum componente do DS depende dele.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ⚠️ | **Sem recipe** — RadioCard não tem entrada em `base-theme.ts` (diferente dos outros R6). `sizeMap` interno em pixels (12/16/20). |
| 1.2 | Tokens semânticos | ⚠️ | Cores via `theme.colors.brand.base`/`brand.subtle`/`border.default`/`border.strong`/`surface.default`/`text.primary`/`text.secondary` ✅. **Mas:** `padding`, `titleSize`, `descriptionSize` em pixels crus. `theme.space.small` no `gap` ✅. Mistura inconsistente. |
| 1.3 | Estados visuais: default/hover/focus/active/focus-visible/disabled/error | ❌ | Sem hover/focus/error. Apenas `disabled` → `opacity: 0.6` + `cursor: not-allowed`. Mesmo problema do Radio: `<input>` está `opacity: 0; pointerEvents: none`. **Foco do teclado invisível.** |
| 1.4 | Escala de tamanhos coerente | ⚠️ | Bug visual em sm/md: ambos têm `titleSize: '16px'` e `descriptionSize: '10px'` — só diferem no `padding`. **`md` é igual a `sm` exceto pela altura.** |
| 1.5 | Contraste ≥ WCAG AA em light/dark | ✅ | Tokens semânticos em uso. |
| 1.6 | Microinterações usam `transition()` | ✅ | `transition(['border-color','background-color','box-shadow'], 'fast')`. |
| 1.7 | Animações respeitam `usePrefersReducedMotion` | ❌ | Sem hook. |
| 1.8 | Ícones usam `<Icon>` | ✅ N/A | Indicator = círculo com `<Box width=10 height=10>`. |

**Observações livres:**
- **Duplicação visual com `Radio`** — RadioCard é, na prática, `<Radio.Root size="lg">` com `label`/`description` como props em vez de slots. Diferenças:
  - RadioCard usa props `label`/`description`; Radio usa slots `<Radio.Label>`/`<Radio.Description>`.
  - RadioCard tem `forwardRef`; Radio não.
  - RadioCard tem `default export`; Radio não.
  - RadioCard sem context; Radio com `RadioContext`.
  - RadioCard sem `useFieldContext`; Radio com.
  - RadioCard sem `markFieldAware`; Radio com.
  Sintetizando: **dois caminhos divergentes para o mesmo problema**.
- `boxShadow: '0 0 0 2px brand.subtle'` cru — sem token de elevation.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado: Tab, Space, setas | ⚠️ | `<input type=radio>` é focável via Tab + Space. Mesmo problema do Radio: visual oculto. **Sem navegação por setas.** |
| 2.2 | Focus management | ❌ | `<input>` invisível — foco não reflete em nenhum elemento do card. |
| 2.3 | `role` correto + `aria-*` | ❌ | **`role="radio"` no `<Flex>` visual** + `aria-checked={isChecked}` ✅ MAS **o `<input type=radio>` real também existe simultaneamente** = **dois elementos com `role=radio`** para o mesmo controle. Quebra acessibilidade: leitor anuncia 2 radios. **Bug a11y crítico.** |
| 2.4 | Anúncios a leitor de tela | ❌ | Mesma raiz: dois `role=radio` confundem screen reader. |
| 2.5 | Touch target ≥ 44×44 | ✅ | Card inteiro é clicável; padding 12+ → ≥ 44px ✅ na maioria dos casos. |
| 2.6 | Comportamento controlado × não-controlado | ⚠️ | `useState(defaultChecked)` interno + `checked ?? internalChecked`. **Não usa `useControllableState`** padrão. Quando `checked` é definido, fluxo controlado funciona, mas ao trocar de controlado→não-controlado em runtime, comportamento indefinido. |
| 2.7 | Evento cancelável | ✅ N/A | — |
| 2.8 | Comportamento em RTL | ⚠️ | Layout `space-between` ↔ espelha em RTL ✅ teoricamente; sem teste. |

**Observações livres:**
- **Não consome `FieldContext`** — não importa `useFieldContext`, não chama `markFieldAware`. Quando colocado dentro de `<Field>`, **não recebe** `disabled`/`required`/`invalid`/`aria-describedby`. Diferente de Checkbox/Radio/Switch/Select. **Lacuna grande de contrato Field-aware (RFC-0014).**
- **`role="radio"` duplicado**: `<input type=radio>` (semântica nativa) + `<Flex role="radio" aria-checked>` (semântica custom). **Remover um dos dois** — convenção: hide o input só visualmente E remove `role` do `<Flex>` (deixa só visual), OU use `<input>` totalmente accessible E remove `role` do `<Flex>`.

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API pública mínima | ⚠️ | `RadioCardProps extends Omit<InputHTMLAttributes, 'children'\|'onChange'\|'size'\|'type'>` → surface area ampla implícita (HR5-13). |
| 3.2 | Naming segue convenção | ⚠️ | `disabled`, `checked`, `defaultChecked`, `onCheckedChange` ✅. **`label`, `description` como props em vez de slots** — divergente do padrão compound usado em Radio/Checkbox/Switch/Select. |
| 3.3 | Defaults "least surprise" | ✅ | `defaultChecked = false`, `disabled = false`, `size = 'md'`. |
| 3.4 | Combinações inválidas via tipo | ❌ | `value` é obrigatório ✅. `checked` + `defaultChecked` simultâneos não bloqueados. |
| 3.5 | Polimorfismo via `as` | ❌ | Sem `as`. |
| 3.6 | `forwardRef` + `displayName` | ✅ | Forwardref + displayName presentes. |
| 3.7 | Compound: contratos de slot explícitos | ❌ N/A | **Não é compound** — props em vez de slots. Inconsistente com o resto de R6. |
| 3.8 | Tipos públicos exportados | ✅ | `RadioCardProps` via interfaces/index.ts. |

**Surface area atual:**

```ts
export interface RadioCardProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'onChange' | 'size' | 'type'> {
  label: ReactNode;
  description?: ReactNode;
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onCheckedChange?: (checked: boolean) => void;
  children?: ReactNode;
}
```

**Observações livres:**
- **`children` é prop separada de `label`/`description`** — escapa a hatch para conteúdo arbitrário no card. Aceitável, mas sem JSDoc.
- **`default export`** redundante com `export const RadioCard` — o único componente de R6 com default export. Ruído.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | `Box as="label"`, `Box as="input"`, `Flex`, `Text`. |
| 4.2 | Sem `style={{...}}` onde há prop equivalente | ⚠️ | Mesmo padrão de Radio: `style={{ gap, padding, border, backgroundColor, boxShadow, transition, ...style }}` — vários têm prop. |
| 4.3 | Estrutura de pasta aplicada | ⚠️ | `core/`, `interfaces/`. **Sem `context/`** (não é compound). **Sem `utils/`/`accessibility/`** (ok). |
| 4.4 | Estilo via `defineRecipe`/`defineSlotRecipe` | ❌ | **Não há recipe nem mesmo declarada** em `base-theme.ts`. (Outros R6 ao menos declaram a recipe — RadioCard nem isso.) |
| 4.5 | Sem `any`, `console.*` | ✅ | Limpo. |
| 4.6 | Testes cobrem estados, variantes, a11y, interações | ❌ | **Cobertura zero — não existe arquivo de teste.** Igual ao gap CR5-3 (TextArea/SearchInput/Counter/FileUpload). |
| 4.7 | Story cobre default + variantes + composição | ⚠️ | 4 stories. Story `Group` usa `<div style>` cru (anti-pattern documentado). **Faltam:** integração com `<Field>` (impossível hoje — RadioCard não é Field-aware), controlado, dark theme, focus state. |
| 4.8 | `.native.tsx` presente ou platform-split documentado | ✅ | `web-only` documentado em `RadioCardProps.ts:4`. |
| 4.9 | Imports respeitam camadas | ✅ | foundations → ecosystem → components. |

**Métricas rápidas:**

- LOC: `radio-card.tsx` 149 · `RadioCardProps.ts` 19 → **168 LOC.**
- Nº de testes: **0**
- Nº de stories: 4
- Dependências externas: 0

**Observações livres:**
- **Cobertura zero é o achado mais grave.** Componente de produto com lógica de estado interno + render condicional sem nenhuma proteção contra regressão.
- **Não usa `useControllableState`** — re-implementa o padrão controlled/uncontrolled na mão. Inconsistente com Checkbox/Radio/Switch/Select que usam o hook.
- **Não chama `markFieldAware`** — Field-aware contract quebrado.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público em `src/components/index.ts` | ✅ | `export * from './radio-card'`. |
| 5.2 | Tipos públicos exportados | ✅ | `RadioCardProps`. |
| 5.3 | Mudança proposta tem changeset | N/A | — |
| 5.4 | Breaking change tem RFC | N/A | — |
| 5.5 | Guia de migração | N/A | — |

**Observações livres:**
- `default export` (`radio-card.tsx:149`) divergente das demais convenções (resto usa só named export).

---

## 6. Resumo executivo

**Score por eixo:** Visual `2/8` ❌ · Comportamental `2/8` ❌ · Funcional `4/8` ⚠️ · Código `5/9` ⚠️ · Governança `5/5` ✅

**Top 3 achados (por impacto):**

1. **`role="radio"` duplicado em DOM (input + flex)** (#2.3) — confunde leitores de tela. **Prioridade crítica de a11y.** Fix trivial: remover `role="radio"` do `<Flex>`.
2. **Cobertura de teste zero** (#4.6). Componente complexo sem proteção. **Prioridade alta** — escrever suíte mínima (replicar Radio + casos próprios).
3. **Não é Field-aware** (#2.3 ext.) — colocado dentro de `<Field>` não recebe `disabled`/`invalid`/`required`. Inconsistente com todos os outros R6. **Prioridade alta** — adicionar `useFieldContext` + `markFieldAware`.

**Achado adicional sistêmico:** **RadioCard duplica Radio funcionalmente.** Mesmo controle, render visual quase idêntico (`<Radio.Root size="lg">` com slots `Label`/`Description` produz visual igual). RFC candidata: deprecar RadioCard e expor variant `Radio variant="card"` ou `Radio` com `<Radio.Root>` em layout adequado.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [ ] ⚠️ Aprovado com fixes menores
- [x] ❌ Requer mudanças antes da próxima release

> Classificação ❌: bug a11y de `role` duplicado + cobertura zero combinados merecem fix antes de release. **OU** decisão de deprecar a favor de Radio.

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] **RC-1** Remover `role="radio"` do `<Flex>` em `radio-card.tsx:77` (mantém só o `<input type=radio>` semântico).
- [ ] **RC-2** Remover `default export` de `radio-card.tsx:149`.
- [ ] **RC-3** Refatorar story `Group` para `<Flex flexDirection="column" gap="12px">`.

### Issue (mudança localizada, sem breaking change)

- [ ] **RC-4** Criar suíte de testes (`radio-card.test.tsx`) — anatomy, controlled/uncontrolled, FieldContext (após RC-5), keyboard, disabled, sizes.
- [ ] **RC-5** Adicionar `useFieldContext` + `markFieldAware(RadioCard)` para alinhar com R6 Field-aware contract.
- [ ] **RC-6** Trocar `useState(defaultChecked) + checked ?? internalChecked` por `useControllableState`.
- [ ] **RC-7** Resolver foco invisível: refletir `:focus-visible` do input via `boxShadow`/`outline` no card visual.
- [ ] **RC-8** Bug visual `sm` × `md` indistinguível em fonte: ajustar `sizeMap` para `sm: 14px`, `md: 16px`, `lg: 20px` no title.
- [ ] **RC-9** Promover `gap`, `padding`, `backgroundColor`, `transition` para props declarativas onde existem.
- [ ] **RC-10** Respeitar `usePrefersReducedMotion`.

### RFC (sistêmico ou breaking change)

- [ ] **RFC candidata: Deprecar `RadioCard` em favor de `Radio variant="card"` ou unificar APIs** — duplicação atual cria dois pontos de manutenção para o mesmo problema. Decisão entre:
  - (a) Deprecar `RadioCard`, oferecer `<Radio.Root variant="card" label description>` com slots ou props.
  - (b) Manter ambos, mas alinhar contratos (Field-aware, useControllableState, displayName, slots).
  - (c) Tornar `RadioCard` uma composição declarativa de `Radio` (apenas convenience wrapper).
- [ ] **RFC candidata: `RadioGroup`** (compartilhada com Radio) — RadioCard tipicamente vem em grupos.
- [ ] **RFC candidata: Recipe `radio-card`** — atualmente nem declarada. Decidir entre adicionar ou consolidar com `radio` recipe (variant `card` × `default`).
- [ ] **RFC candidata: `extends InputHTMLAttributes` em `RadioCardProps`** — surface area ampla implícita (HR5-13).

---

## 8. Notas de arquiteto

- **`RadioCard` é o caso limítrofe entre "componente próprio" e "variant de Radio"**. A duplicação atual é o pior dos dois mundos: mesma intenção visual, contratos divergentes, manutenção dobrada. RFC para decidir antes de R6 fechar.
- **`role="radio"` duplicado é sintoma de "guarda-redundante"** — autor querendo dar semântica via aria-* além do input nativo. Mas `<input type=radio>` já carrega `role=radio`; adicionar de novo no wrapper duplica e confunde. Padrão a evitar em R6 e além.
- **Falta de `useControllableState`** indica que esse componente foi escrito antes do hook ser canonizado. Sweep coordenado vale: identificar todos os componentes que reimplementam o padrão controlled/uncontrolled na mão.
- **`@platform web-only` documentado é exemplo positivo** que outros R6 (Radio, Select) deveriam copiar.
- **`extends InputHTMLAttributes`** vaza props HTML para a API pública. Caller pode passar `onClick`, `onFocus`, `onMouseDown` etc.; em alguns deles, comportamento é silenciosamente ignorado (`onClick` no `<input>` invisível? `<label>` outer? `<Flex>` role?). Surface area ambígua. RFC `nativeProps` curado.
