# Review — `Field`

**Fase:** R5 · **Camada:** `form` · **Status:** `concluído`
**Revisor:** arbor-ds-arch · **Data:** 2026-04-24 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/field/core/field.tsx`, `src/components/field/core/field.native.tsx`, `src/components/field/slots/{label,control,description,error}.tsx`, `src/components/field/context/field-context.ts`, `src/components/field/interfaces/FieldProps.ts`.
- **Story:** `src/components/field/core/field.stories.tsx` (4 stories).
- **Testes:** `src/components/field/core/field.test.tsx` (24 cases).
- **Implementação nativa:** `sim` (`field.native.tsx` re-implementa Root + 4 slots; **divergência total**).
- **Classificação cross-platform:** `platform-split` (web usa `ArborTransform` + slot recipe; native re-implementa do zero).
- **Dependências internas:** `ArborTransform`, `useSlotRecipe`, `Box`, `Flex`, `Text` (somente native).
- **Consumidores conhecidos:** `Checkbox`, `Radio`, `Switch`, `Select` (compound) consomem `FieldContext` para herdar `isInvalid`/`isDisabled`/`isRequired`. `TextInput` lê o contexto diretamente.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ⚠️ | Recipe declara variant `size` (sm/md/lg) — story não cobre; native ignora a recipe inteira. |
| 1.2 | Tokens usados são semânticos (sem valores crus) | ⚠️ | Web: ok via slot recipe. Native: `gap="micro"`, `fontSize="sm/xs"`, `color="text.primary/feedback.critical.base"` ok, mas ausência de recipe = drift potencial. |
| 1.3 | Estados visuais presentes | ⚠️ | `isDisabled` não tem feedback visual no Root (apenas é injetado nos filhos via Control). Falta dim/opacity no contêiner. |
| 1.4 | Escala de tamanhos coerente com DS | ⚠️ | Recipe define `size` mas só `Field.Control.minHeight` reage; label/description/error não escalam. |
| 1.5 | Contraste ≥ WCAG AA em light/dark | ✅ | `feedback.critical.base` e `text.primary` são tokens semânticos validados em R1. |
| 1.6 | Microinterações usam `transition()` | ✅ N/A | Field não tem motion próprio. |
| 1.7 | Animações respeitam `usePrefersReducedMotion` | ✅ N/A | Sem animação. |
| 1.8 | Ícones usam `<Icon>` do DS | ✅ N/A | Sem ícones. |

**Observações livres:**
- Asterisco de required (`* `) é texto puro — sem semântica visual de tom além do `feedback.critical.base` no `<span>`. Funcional, mas inconsistente com componentes que usam Icon dedicado para indicar status.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado | ✅ N/A | Field é wrapper semântico — teclado vive no controle injetado. |
| 2.2 | Focus management | ✅ N/A | Wrapper não captura foco. |
| 2.3 | `role` correto + `aria-*` completos | ⚠️ | `Field.Control` injeta `aria-describedby` **sempre** (ainda que `Field.Description` não esteja presente) → aponta para id inexistente. Falha com axe-core. |
| 2.4 | Anúncios a leitor de tela em estados dinâmicos | ✅ | `Field.Error` tem `role="alert"` (live region). |
| 2.5 | Touch target ≥ 44×44 | ✅ N/A | Não interativo. |
| 2.6 | Comportamento controlado × não-controlado | ✅ N/A | Field só carrega flags; estado vive no input. |
| 2.7 | Evento cancelável | ✅ N/A | Sem callbacks. |
| 2.8 | Comportamento em RTL | ✅ N/A | Layout vertical. |

**Observações livres:**
- **Sobreposição de responsabilidades.** `Field.Control` injeta `id`/`aria-describedby`/`aria-required`/`aria-invalid`/`aria-errormessage`/`disabled` via `cloneElement`. `TextInput` **também** lê `useFieldContext()` e seta os mesmos atributos. Resultado: dois caminhos para o mesmo wiring; `cloneElement` sobrescreve, mas a duplicação esconde a fonte da verdade. Se o consumidor passar um `<input>` cru ou um Arbor-Input, o resultado final difere sutilmente.
- `aria-describedby` apontando para id de `Field.Description` ausente quebra `axe rule aria-valid-attr-value`. Solução: condicionar a injeção a `descriptionId` válido (rastrear se `Description` foi renderizado, ou só injetar quando `description` existe — exige refatoração com slot detection).
- `aria-errormessage` em vez de `aria-describedby` para o erro: bom (semântica correta), mas apenas Firefox/JAWS implementam plenamente. Considerar adicionar **também** `aria-describedby` apontando para `errorId` quando `isInvalid` para cobertura ampla.
- Asterisco de required é `aria-hidden="true"` no slot — `aria-required` injetado no controle dá a semântica. ✅
- **Controle não-element** (texto, fragment) faz `Field.Control` retornar `<>{children}</>` sem aviso — aria-* não são injetados, contrato silenciosamente quebrado.

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API pública mínima; sem props redundantes | ✅ | 4 flags (`id`, `isDisabled`, `isRequired`, `isInvalid`) + `style` + `children`. Enxuto. |
| 3.2 | Nomes de props seguem convenção do DS | ⚠️ | Convive `is*` (Field) com `disabled`/`error` (Input/TextArea) — convenção não está consolidada (ver R5 padrão emergente). |
| 3.3 | Defaults "least surprise" | ✅ | Todas flags default `false`; id auto-gerado via `useId()`. |
| 3.4 | Combinações inválidas bloqueadas via tipo | ⚠️ | `Field.Error` renderiza condicionado a `isInvalid` — silencioso quando esquecido. Combinação `isInvalid=true` sem `Field.Error` filho é válida em runtime mas perde mensagem. |
| 3.5 | Polimorfismo via `as` | ❌ | `Field.Root` força `as="div"`. Sem opção de `as="fieldset"` (semântica HTML correta para grupos). |
| 3.6 | `forwardRef` presente; `displayName` definido | ⚠️ | `displayName` aplicado em 2026-04-24 (fix imediato). `forwardRef` ausente em todos os 5 slots — bloqueia ref ao container/label/error para focus management programático. |
| 3.7 | Compound: contratos de slot explícitos | ⚠️ | Documentação inline ausente; comportamento "Description sempre, Error condicional, Label opcional, Control só funciona com 1 elemento" não está em JSDoc. |
| 3.8 | Tipos públicos exportados | ✅ | `FieldRootProps`, `FieldLabelProps`, `FieldControlProps`, `FieldDescriptionProps`, `FieldErrorProps`, `FieldContextValue` exportados. |

**Surface area atual:**

```ts
// FieldRootProps
{
  id?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  style?: CSSProperties;
  children: ReactNode;
}

// Field.Root | Field.Label | Field.Control | Field.Description | Field.Error
// Slots aceitam apenas { children: ReactNode } — zero customização.
```

**Observações livres:**
- Slots **não aceitam props adicionais** (`className`, `style`, `as`, `id` próprio). Bloqueia composições legítimas (label com classe utilitária, description com link customizado).
- `Field.Control` **assume um único elemento** — passar dois inputs (radio group, por ex.) faz `cloneElement` injetar id duplicado em apenas um dos elementos. Não é o caso de uso de Field, mas o erro é silencioso.
- **Recipe variants subutilizadas.** `field` recipe tem variant `size` mas `useSlotRecipe('field', {})` é chamado sem variants — apenas `defaultVariants.size = 'md'` aplica. Não há prop `size` em `FieldRootProps` nem propagação para os slots.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | Usa `ArborTransform as="..."`. |
| 4.2 | Sem `style={{...}}` onde há prop equivalente | ⚠️ | `Field.Root` aceita `style` (escape hatch); `field.stories.tsx` usa `style={{ width: 320 }}` — aceitável (sem token de width arbitrário). |
| 4.3 | Estrutura de pasta aplicada | ✅ | `core/`, `interfaces/`, `slots/`, `context/`. |
| 4.4 | Estilo via `defineRecipe`/`defineSlotRecipe` | ⚠️ | Web usa `useSlotRecipe('field', {})`. Native **não** consome a recipe — re-implementa estilos hardcoded. |
| 4.5 | Sem `any`, `console.*` | ⚠️ | `(slots as Record<string, unknown>).root as Record<string, unknown> \| undefined` aparece em 4 slots (`field.tsx`, `label.tsx`, `description.tsx`, `error.tsx`). Cast sem justificativa documentada — sintoma de tipagem fraca em `useSlotRecipe`. |
| 4.6 | Testes cobrem estados, variantes, a11y, interações | ⚠️ | 24 testes; cobrem id/aria/disabled/required/invalid e composição. **Faltam:** focus management, native renderer, recipe variants, slot order independence, error in standalone (sem Provider FieldContext, comportamento "render mesmo sem isInvalid"). |
| 4.7 | Story cobre default + variantes + composição | ⚠️ | 4 stories (Default, Required, WithError, Disabled). Faltam: composição completa (label+description+error simultâneos), `size`, story de native (impossível em Storybook web). |
| 4.8 | `.native.tsx` presente ou platform-split documentado | ⚠️ | Presente, mas com **divergência total**: native re-implementa toda a árvore de slots ao invés de delegar a primitives. Sem JSDoc explicando a divisão. |
| 4.9 | Imports respeitam camadas | ✅ | foundations → ecosystem → components. |

**Métricas rápidas:**

- LOC: `field.tsx` 41 · `field.native.tsx` 93 · slots 27+27+20+23 = 97 · context 17 → **245 LOC totais.**
- Nº de testes: 24
- Nº de stories: 4
- Dependências externas: 0 (runtime).

**Observações livres:**
- **Cast pattern `as Record<string, unknown>`** vaza para 4 arquivos. Causa raiz: `useSlotRecipe` retorna `unknown`. Resolver em RFC-0007 (já open) liberaria os 4 slots.
- **Native diverge em mais de UI** — a versão native:
  1. Não consome o slot recipe.
  2. Não tem `Field.Root style` prop.
  3. Não conecta `Description.id`/`Error.id` via `htmlFor`/`for` (nem aplicável em RN, mas precisaria `accessibilityLabelledBy`/`accessibilityDescribedBy` no controle).
  4. Não testa nenhum caso (cobertura zero).
- **Field.Control não diferencia "controle Arbor" de "elemento HTML cru"**. Para inputs Arbor que já leem `useFieldContext()` (TextInput), os atributos são duplamente atribuídos. Não há bug, mas há retrabalho e ambiguidade de contrato.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público em `src/components/index.ts` correto | ✅ | `export * from './field'` → expõe `Field`, `useFieldContext`, `FieldContextValue` e 5 tipos de props. |
| 5.2 | Tipos públicos exportados | ✅ | Conforme. |
| 5.3 | Mudança proposta tem changeset entry | N/A | Esta review não muda contrato — fixes triviais (displayName) entram em changeset patch. |
| 5.4 | Breaking change tem RFC | N/A | Sem breaking nesta sessão. |
| 5.5 | Guia de migração se há consumidores | N/A | Sem mudança quebrando. |

**Observações livres:**
- `useFieldContext()` é exposto publicamente mas não documentado fora do código. Consumidores externos podem instanciar Field próprio — risco de drift.

---

## 6. Resumo executivo

**Score por eixo:** Visual `4/8` ⚠️ · Comportamental `5/8` ⚠️ · Funcional `4/8` ⚠️ · Código `5/9` ⚠️ · Governança `5/5` ✅

**Top 3 achados (por impacto):**

1. **A11y — `aria-describedby` sempre apontando para `descriptionId` mesmo sem `Field.Description`** (#2.3). Quebra `axe rule aria-valid-attr-value` e confunde leitores de tela. **Prioridade alta.**
2. **`Field.native` em divergência arquitetural** com versão web — sem recipe, sem testes, com APIs (style prop) faltando, e contrato a11y diferente. **Prioridade alta** (TD candidata).
3. **Sobreposição de responsabilidades Field.Control × inputs context-aware** — quem injeta o `aria-*`? Hoje os dois fazem; `cloneElement` ganha. Definir contrato canônico.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores (listados abaixo)
- [ ] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review) — aplicado em 2026-04-24

- [x] `displayName` em `FieldRoot`, `FieldLabel`, `FieldControl`, `FieldDescription`, `FieldError` (web).
- [x] `displayName` nos 5 slots da versão native.

### Issue (mudança localizada, sem breaking change)

- [ ] **F-1** Field.Control: condicionar injeção de `aria-describedby` à existência real do slot Description (rastrear em context, ou só injetar quando descriptionId é consumido).
- [ ] **F-2** Field.Control: também injetar `aria-describedby` apontando para `errorId` quando `isInvalid` (cobertura de leitores que não suportam `aria-errormessage`).
- [ ] **F-3** Slots aceitarem props adicionais (`style`, `className`, `id` próprio para a Description/Error quando consumidor quer ID estável).
- [ ] **F-4** Recipe variant `size` propagada via `<Field.Root size="md">` → afetando label/description/error proporcionalmente.
- [ ] **F-5** Field.native: implementar testes (cobertura zero hoje).
- [ ] **F-6** Field.native: ler tokens via `useTheme()` em vez de hardcode duplicado (ver TD-005 padrão para .native).
- [ ] **F-7** JSDoc em `Field`/slots documentando contrato de composição (Label opcional, Control único elemento, Description sempre exportada, Error condicional).
- [ ] **F-8** Stories adicionais: composição completa (label+control+description+error), variant `size`, integração Field+Checkbox/Radio/Switch.
- [ ] **F-9** Cast `(slots as Record<string, unknown>)` — bloqueado por **RFC-0007** (`useRecipe` tipagem genérica).
- [ ] **F-10** `forwardRef` no `Field.Root` (ref ao container) — alinhar com sweep TD-007.

### RFC (sistêmico ou breaking change)

- [ ] **RFC candidata: Convenção `is*` vs. `disabled`/`error`** — Field usa `isDisabled`, `isRequired`, `isInvalid`; Input/TextArea usa `disabled`, `error`. Decidir e propagar (ver R5 padrão #1).
- [ ] **RFC candidata: Polimorfismo de `Field.Root` (`as="fieldset"`)** — habilitar semântica HTML para grupos (radio/checkbox grouping).
- [ ] **RFC candidata: Contrato canônico de wiring Field ↔ controles**. Ou:
  - (a) `Field.Control` é a fonte de verdade e injeta tudo (controles Arbor não leem context).
  - (b) Controles Arbor são a fonte (Field.Control é "passthrough" sem injeção).
  - (c) Modo híbrido explícito (default = injeção; controles podem opt-out via prop).
- [ ] **RFC candidata: Estratégia Field.native** — implementar a partir do primitive system (sem re-implementação) ou aceitar formalmente split com testes próprios.

---

## 8. Notas de arquiteto

- **`useSlotRecipe('field', {})` sem variants é code smell**: o `defaultVariants.size = 'md'` salva o caso default mas a API pública não permite trocar — variant é decoração morta. Padrão a verificar em outros compounds (Card, Dialog, Drawer).
- **`Field.Control` com `cloneElement` é frágil para componentes que aceitam ref**: se o consumidor passar `<TextInput ref={r}>`, `cloneElement(child, injectedProps)` preserva o ref mas se houver conflito de `id` o segundo ganha — confirmar comportamento em testes.
- **Padrão emergente: "Field-aware components"**. TextInput lê `useFieldContext` direto; outros futuros (DatePicker, RichEditor) precisarão fazer o mesmo. Vale documentar em CONTRIBUTING como receita oficial: "Componentes de input devem ler `useFieldContext` para integração automática".
- **Slot recipe vs. props locais — quem ganha?** Hoje `slots.root` spread vem antes de `style` (style ganha). Já em `label.tsx`, `slots.label` vem **depois** de `color={ctx?.isInvalid ? ...}` (recipe ganha). Inconsistência: ordem de spread varia por slot. Padrão "invariantes por último" do R2 não foi aplicado.
- **`FieldRoot.style` é o único escape hatch declarativo do componente**. Não há `width`, `padding`, ou wrapper props. Para layouts reais (e.g., grid de form), o consumidor envolve Field em `<Box>`. Decisão razoável de minimalismo, mas precisa documentar.
