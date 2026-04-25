# R5 — Field + Input

**Período:** 2026-04-24
**Estado da base ao iniciar:** R4 fechada (Button/ButtonGroup/FAB), 544/544 testes verdes, lint verde.
**Estado ao concluir:** 544/544 testes verdes, lint sem warnings. 5 fixes triviais aplicados, 2 achados críticos, 1 dead code mapeado, padrões emergentes para R6.

---

## Contexto

R5 audita a base de formulários: o compound `Field` (Root + Label + Control + Description + Error) e a família `Input` (`TextInput`, `TextArea`, `SearchInput`, `Counter`, `FileUpload`). É a primeira fase pós-R4 que toca componentes com **estado controlado**, **integração compound ↔ átomo** (Field ↔ TextInput), e **divergência cross-platform real** (Field tem `.native.tsx` próprio).

A pergunta da auditoria:
1. O contrato Field ↔ Input está consistente?
2. Os átomos consomem o styled-system corretamente, ou bypassam via `style={...}`?
3. Onde estão os gaps de a11y, testes, theming?
4. O que vai sangrar para R6 (Checkbox/Radio/Switch/Select) se não for resolvido agora?

---

## Achados consolidados

### Críticos / Bugs

| ID | Componente | Achado | Status |
|---|---|---|---|
| **CR5-1** | TextInput / TextArea | Recipe `input` declarada em `base-theme.ts:183` é **dead recipe** — substituída em runtime por `getFieldFrameStyle` imperativo em `shared.tsx`. Theming dinâmico, dark mode, overrides via `createTheme` não afetam a família. Mesmo padrão se replicará em R6. | Issue + RFC. Não é fix trivial (refatoração de `shared.tsx` + adoção de slot recipe). |
| **CR5-2** | Field.Control | Injeta `aria-describedby="${fieldId}-description"` **sempre**, mesmo sem `Field.Description` no DOM. Aponta para id inexistente — quebra `axe rule aria-valid-attr-value`. | Issue. Resolução exige rastreio de slots renderizados (refactor de Context). |
| **CR5-3** | TextArea / SearchInput / Counter / FileUpload | **Zero testes** em 4 dos 5 componentes da família. Counter e FileUpload são UI complexa (estado interno, drag-and-drop, validação) sem proteção de regressão. | Issue. Sweep de testes. |
| **CR5-4** | input/core/select.tsx | **Dead code** — 191 LOC com `<div>`, `<button>`, `<span>` crus + `style={{}}` + cores hardcoded. Não exportado em `input/core/index.ts`, substituído por `src/components/select/`. Confunde contribuidores e contradiz CLAUDE.md. | Issue. Remoção de arquivo + interface (verificar zero referências). |

### High

| ID | Componente | Achado | Status |
|---|---|---|---|
| **HR5-1** | Field (web + native) | Versão native **diverge totalmente**: re-implementa todos os 5 slots sem usar a recipe; sem testes; sem `style` prop; sem JSDoc explicando a divisão. | Issue. Estratégia: re-implementar a partir de primitives (com `useTheme`) ou aceitar split formal com testes próprios. |
| **HR5-2** | Field | `useSlotRecipe('field', {})` é chamado sem variants — `defaultVariants.size = 'md'` aplica mas a API pública não permite trocar. Variant `size` é decoração morta. | ✅ Identificado. Issue F-4: propagar `size` via `<Field.Root size="md">`. |
| **HR5-3** | TextInput | `outline="none"` no input element quebra focus visible — mesmo padrão do FAB HR4-13. Sem feedback de teclado. | Issue. Substituir por `:focus-visible` token. |
| **HR5-4** | TextInput | `aria-describedby` sempre setado (mesmo path do CR5-2). Combina com Field.Control duplicando o trabalho. | Issue (compartilhado com CR5-2). |
| **HR5-5** | Counter | Hardcoded `'white'`, `'background-color 0.2s'`, `'3rem'`, e `'−'`/`'+'` strings. Quebra dark mode + sem Icon. Sem `forwardRef`. | Issue. Sweep dedicado (Counter precisa de migração visual). |
| **HR5-6** | Counter | Sem `role="spinbutton"`, sem `aria-valuenow/valuemin/valuemax`, sem suporte a setas teclado. A11y de NumberInput quebrada. | Issue. |
| **HR5-7** | FileUpload | **Strings em inglês** ("Drag and drop or click to upload", "File uploaded", "Uploading...", "Maximum N files allowed", "Remove", "is too large"). Resto do projeto é pt-BR (`"Limpar"` em TextInput). Drift de i18n. | Issue. Tradução. |
| **HR5-8** | FileUpload | Emojis (📤, ⏳) como ícones; sem Icon do DS. Sem `role="button"` na zona de drop, sem suporte a teclado (Enter/Space). Sem `forwardRef`. | Issue. |
| **HR5-9** | FileUpload | `validateFiles` retorna `{ valid, errors }` mas só `valid` é consumido — erros internos somem. Sem `aria-live` em loading. | Issue. Expor via `onValidationError` callback. |
| **HR5-10** | TextInput, TextArea | Hardcodes em `style`: `border: 'none'`, `backgroundColor: 'transparent'`, `fontFamily: 'inherit'`, `fontSize: ...`. Props declarativas equivalentes existem. | Issue. |
| **HR5-11** | TextInput, TextArea, Counter, FileUpload, SearchInput | **Convenção `is*` × `disabled`/`error`**: Field usa `isDisabled/isInvalid/isRequired`; Input usa `disabled/error`. Sem unificação. | RFC candidata. Decisão sistêmica antes de R6. |
| **HR5-12** | TextInput | `effectiveError = fieldCtx?.isInvalid ? (error ?? ' ') : error` — string em branco como sentinel para acionar visual de erro sem mensagem. Hack frágil. | Issue. Refatorar para flag separada de cor/borda. |
| **HR5-13** | TextInput | `extends Omit<InputHTMLAttributes, 'size'>` — surface area pública gigante implícita. Versionamento difícil. | RFC candidata. Padrão Radix UI: `nativeProps` curado. |
| **HR5-14** | TextArea, SearchInput, Counter, FileUpload | **Não consomem `useFieldContext`**. Quando colocados dentro de `<Field>`, não reagem a `isInvalid/isRequired/isDisabled`. Apenas TextInput é Field-aware. | Issue. Padrão a propagar. |

### Medium

| ID | Componente | Achado | Status |
|---|---|---|---|
| **MR5-1** | Field (5 slots web + 5 native) | `displayName` ausente em todos. | ✅ Fix aplicado em 2026-04-24 (10 arquivos tocados). |
| **MR5-2** | TextInput, TextArea | `Box innerRef={ref}` (legacy) → `Box ref={ref}` (RFC-0001 canônico). | ✅ Fix aplicado em 2026-04-24. |
| **MR5-3** | SearchInput | `<Box as="span">Q</Box>` literal → `<Icon name="Search" size="sm" decorative />`. | ✅ Fix aplicado em 2026-04-24. |
| **MR5-4** | input.stories.tsx | Story `Sizes` com `<div style={{ display: 'flex', ... }}>` cru. | ✅ Fix aplicado: `<Flex flexDirection="column" gap="12px">`. |
| **MR5-5** | Counter | `index.ts:1` exporta `default` redundantemente — único componente da família com default export. | Issue. Remover. |
| **MR5-6** | TextInput | Touch target `size='sm'` (`minHeight: 32px`) abaixo de WCAG 44px. | Issue. Documentar como uso restrito ou aumentar. |
| **MR5-7** | Counter | Botões sm `24×24px` — touch target ruim. | Issue. |
| **MR5-8** | TextInput | Stories ausentes para `clearable`, `leftIcon`, `rightIcon`, integração com Field. | Issue. |
| **MR5-9** | Field slots | Cast `(slots as Record<string, unknown>).label as Record<string, unknown>` repetido em 4 arquivos. | Bloqueado por **RFC-0007** (`useRecipe` tipagem genérica). |
| **MR5-10** | Field slots | Slots aceitam só `{ children }` — sem `style`/`className`/`as`/`id` próprio. Composição limitada. | Issue. |
| **MR5-11** | Field.Root | `as="div"` forçado — sem `as="fieldset"` para grupos (radio/checkbox grouping semântico). | RFC candidata: polimorfismo Field.Root. |
| **MR5-12** | TextArea | `showCharCount + maxLength` exigência de combinação não validada por tipo. | Issue. Discriminated union. |
| **MR5-13** | FileUpload | `transition: 'all 0.2s'` literal — `all` é anti-pattern de performance. | Issue. |
| **MR5-14** | Counter | `pointerEvents: 'none'` no wrapper E `disabled` nos botões — redundante. Remove um. | Issue. |
| **MR5-15** | `getFieldSizeStyles` × `field` recipe size variant × Counter `sizeMap` | **Três escalas de size paralelas** (`32/40/48` em FieldFrameStyle, `32/40/48` em recipe, `24/32/40` em Counter). Drift garantido. | Issue. Consolidar em token único. |
| **MR5-16** | TextInput | `leftIcon`/`rightIcon` (visual) vs convenção `startIcon`/`endIcon` (lógico, RTL-aware). | RFC candidata. |

### Low

| ID | Componente | Achado | Status |
|---|---|---|---|
| **LR5-1** | Field | `useFieldContext()` exposto publicamente sem JSDoc. | Documentar. |
| **LR5-2** | shared.tsx | `eslint-disable react-refresh/only-export-components` — esconde acoplamento (mistura função + componente em mesmo arquivo). | Trivial; vale separar. |

---

## Padrões emergentes (cruzando R1–R5)

1. **Imperative styling on top of styled-system.** `getFieldFrameStyle` retorna `CSSProperties` que é spread em `style={...}`. Quebra theming dinâmico, mata recipes, multiplica pontos de mudança. **Provável que se repita em R6 (Checkbox/Radio/Switch/Select).** RFC sistêmica vale mais que fix por componente.

2. **Recipe declarada × recipe consumida — drift.** Mesmo Field tem variant `size` no recipe que não chega à API pública. Padrão a auditar em todos os compounds (Card, Dialog, Drawer já mapeados em fases anteriores).

3. **Field-aware components — contrato emergente não documentado.** TextInput consome `useFieldContext` direto; TextArea/SearchInput/Counter/FileUpload não. R6 vai ter o mesmo gap. Documentar agora em CONTRIBUTING.

4. **i18n drift.** "Limpar" (TextInput, pt-BR) vs. "Remove" / "Drag and drop" (FileUpload, en). Sem decisão de ownership: consumidor traduz? Lib carrega strings tematizáveis? Vale RFC + implementação.

5. **Hardcoded values em componentes pós-core (continuação de R4).** Counter e FileUpload têm os mesmos sintomas de FAB: cores literais (`'white'`), transitions hardcoded (`'all 0.2s'`), strings de ícone (`'−'`, `'+'`, emojis). Padrão **muito recorrente** — provavelmente um sweep "purge hardcodes" vale a pena após R6.

6. **Forward ref ausente em camadas pós-core (continuação de TD-007).** Counter e FileUpload sem `forwardRef` (`React.FC`). Aumentando o inventário do sweep.

7. **Dead code arquivado — `select.tsx`.** Arquivo de 191 LOC, não exportado, esquecido pós-migração. Padrão a varrer (`grep` por arquivos não importados em árvores `core/`).

8. **`extends HTMLAttributes` sem curadoria.** TextInput herda toda a interface de `<input>` — DX boa, governança ruim. Padrão a discutir em RFC (Radix usa `nativeProps`, MUI usa `slotProps`).

---

## Decisões de arquitetura — 2026-04-24

**Recipe `input` morta (CR5-1) — issue + RFC, não fix imediato.** Migrar `getFieldFrameStyle` para slot recipe exige re-modelar `TextInput` para consumir `useSlotRecipe('input', { size, variant })` e validar que dark mode + theming dinâmico funcionam. Trabalho de 1 dia, não cabe em PR de review. RFC define escopo.

**Field.Control + TextInput injetando aria-* duplicado (CR5-2 + HR5-4) — tratar juntos em RFC dedicada.** Não é bug isolado; é decisão de "quem é a fonte da verdade do wiring". Três opções no `field.md` (a/b/c). RFC define.

**Cobertura de testes (CR5-3) — issue, não fix imediato.** Escrever 4 arquivos de teste cabe em PR único, mas vale após R6 — Checkbox/Radio/Switch/Select compartilharão padrões de teste com Field-aware, e o template comum vale ser definido junto.

**Dead code `select.tsx` (CR5-4) — issue, não delete imediato.** Confirmar via grep abrangente (incluindo Storybook builds e referências em docs) antes de deletar. Risco baixo mas ainda assim cuidado.

**Convenção `is*` × `disabled` (HR5-11) — RFC sistêmica antes de R6.** R6 (Checkbox/Radio/Switch/Select) vai precisar decidir entre `isChecked`/`checked`, `isOn`/`on`, etc. Resolver agora evita propagar inconsistência.

**Counter e FileUpload — vale revisita coordenada.** São candidatos óbvios a sweep "purge hardcodes" mas não é justo pegar agora (escopo R5 = Field + Input base). Marcar como reincidência em R7 (feedback indicators) ou em sweep dedicado pós-R6.

---

## Gate para R6 (Checkbox + Radio + RadioCard + Switch + Select)

- [x] R5 review documentado em `field.md`, `input.md` e este consolidado.
- [x] Fixes triviais aplicados sem regressão (544/544 verdes).
- [x] Padrões emergentes documentados (8 itens).
- [ ] **Decisão sobre RFC de convenção `is*` × `disabled`** (HR5-11) — fortemente recomendado **antes** de R6 começar; R6 vai ampliar a inconsistência.
- [ ] **Decisão sobre Field.Control × Field-aware contract** (CR5-2 + HR5-4 + HR5-14) — também antes de R6, porque Checkbox/Radio/Switch vão consumir o mesmo padrão.
- [ ] (Não bloqueante) Decidir se sweep "purge hardcodes" vai ocorrer pós-R6 ou esperar R7.
- [ ] (Não bloqueante) RFC de recipe morta (CR5-1) — pode rodar em paralelo a R6.

R6 pode iniciar mesmo com as RFCs em draft, **desde que** a decisão de naming (HR5-11) seja tomada antes do primeiro componente de R6 ser tocado — caso contrário, naming inconsistente vai ser propagado.
