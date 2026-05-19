# Review — `Input` (família `TextInput` · `TextArea` · `SearchInput` · `Counter` · `FileUpload`)

**Fase:** R5 · **Camada:** `form` · **Status:** `concluído`
**Revisor:** arbor-ds-arch · **Data:** 2026-04-24 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:**
  - `src/components/input/core/textinput.tsx` (TextInput) — primário desta review.
  - `src/components/input/core/textarea.tsx` (TextArea).
  - `src/components/input/core/search-input.tsx` (SearchInput).
  - `src/components/input/core/counter.tsx` (Counter).
  - `src/components/input/core/fileupload.tsx` (FileUpload).
  - `src/components/input/core/shared.tsx` (`getFieldColors`, `getFieldFrameStyle`, `FieldShell`).
  - `src/components/input/core/select.tsx` — **dead code** (não exportado em `index.ts`, substituído por `src/components/select/`).
  - `src/components/input/interfaces/{TextInputProps, TextAreaProps, SearchInputProps, CounterProps, FileUploadProps, SelectProps, shared}.ts`.
- **Story:** `src/components/input/core/input.stories.tsx` (8 stories, foca em TextInput).
- **Testes:** `src/components/input/core/input.test.tsx` (24 cases — TextInput standalone + integração com FieldContext). **Sem testes** para TextArea, SearchInput, Counter, FileUpload.
- **Implementação nativa:** `não` (web-only, registrado em `interfaces/shared.ts`).
- **Classificação cross-platform:** `web-first`.
- **Dependências internas:** `Box`, `Flex`, `Clickable`, `Icon`, `Text`; `useTheme`; `useFieldContext`; `transition()`.
- **Consumidores conhecidos:** `Field.Control` (envoltório); SearchInput consome TextInput; nenhum outro componente do DS consome a família além de Field.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook | ⚠️ | TextInput tem `Default`, `WithHelperText`, `WithError`, `Filled`, `Sizes`, `Disabled`, `Search` (delega), `Textarea` (delega). **Falta** story para `clearable`, `leftIcon`, `rightIcon`, integração com Field, Counter, FileUpload. |
| 1.2 | Tokens semânticos (sem valores crus) | ❌ | TextInput hardcoded: `paddingInline: '12px'`, `fontFamily: 'inherit'`, `border: 'none'`, `backgroundColor: 'transparent'`. Counter hardcoded: `'white'`, `'3rem'`, `'background-color 0.2s'`. FileUpload hardcoded: `'1rem'`, `'2rem'`, `'2px dashed`, `'all 0.2s'`, `'80px'`. |
| 1.3 | Estados visuais (default/hover/active/focus/focus-visible/disabled/loading/error/readonly) | ❌ | **Faltando hover/focus-visible** em TextInput (recipe `transition` cobre só `border-color`/`box-shadow` mas não há regra `:focus`/`:hover` aplicada — `outline="none"` no input quebra default do navegador). Counter botões idem. **Sem `readonly`**, **sem `loading`** (exceto FileUpload). |
| 1.4 | Escala de tamanhos coerente | ⚠️ | Map sm/md/lg em `getFieldSizeStyles` (`32/40/48px`) duplica o `field` recipe — drift de 2 fontes. Counter tem map paralelo (`24/32/40px`) — terceira escala. |
| 1.5 | Contraste WCAG AA em light/dark | ⚠️ | Counter usa `'white'` (literal) — quebra dark mode. FileUpload usa `theme.colors.background.subtle` mas mistura com `feedback.critical.subtle` em fundo de erro — não validado para contraste com texto. |
| 1.6 | Microinterações usam `transition()` | ⚠️ | TextInput/TextArea ✅. Counter `'background-color 0.2s'` literal. FileUpload `'all 0.2s'` literal (`all` é anti-pattern de performance). |
| 1.7 | `usePrefersReducedMotion` | ⚠️ | Nenhum componente da família consulta. Transitions sempre rodam. |
| 1.8 | Ícones usam `<Icon>` do DS | ⚠️ | TextInput ✅ (Icon `X` em clearable). SearchInput ✅ corrigido em 2026-04-24 (era `'Q'` literal, agora `Icon name="Search"`). Counter usa `'−'`/`'+'` strings. FileUpload usa emojis (📤, ⏳). |

**Observações livres:**
- `outline="none"` em TextInput input element — mesma quebra de focus visible do FAB (HR4-13). Sem feedback de teclado.
- Recipe `input` em `base-theme.ts` declara `padding/border/background/borderRadius` por tamanho — **mas TextInput não usa essa recipe.** Em vez disso, `getFieldFrameStyle` é uma função imperativa em `shared.tsx` que duplica a lógica. Recipe morta.
- `effectiveError = fieldCtx?.isInvalid ? (error ?? ' ') : error` — string em branco como sentinel para acionar visual de erro sem mensagem. Hack.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado | ⚠️ | TextInput delega ao `<input>` (ok). Counter: setas ↑/↓ não incrementam; só os botões. SearchInput: Enter dispara onSearch ✅. FileUpload: clique abre picker; **Enter/Space não** (área é Flex, não button). |
| 2.2 | Focus management | ❌ | `outline="none"` em TextInput remove ring. Counter botões não têm focus visible explícito. FileUpload zona de drop não recebe foco. |
| 2.3 | `role` correto + `aria-*` completos | ⚠️ | TextInput sincroniza `aria-describedby/required/invalid/errormessage` com FieldContext ✅. Counter: sem `role="spinbutton"`, sem `aria-valuenow/valuemin/valuemax`. FileUpload: zona de drop sem `role="button"`/`aria-label`. |
| 2.4 | Anúncios a leitor de tela em estados dinâmicos | ❌ | FileUpload `loading` é só visual (emoji + texto); sem `aria-live`. Erros internos do `validateFiles` somem. |
| 2.5 | Touch target ≥ 44×44 | ❌ | TextInput sm `minHeight: 32px` (< 44). Counter `sm` botão `24px` (< 44). FileUpload Remove button `padding 0.5rem 1rem` ≈ 32px altura. |
| 2.6 | Controlado × não-controlado | ⚠️ | TextInput aceita `value` + `onChange`/`onValueChange`. Sem `defaultValue` documentado (vem do passthrough HTML). Counter é **só controlado** (`value` obrigatório, sem `defaultValue`). FileUpload: parcialmente controlado por `previewUrl`, parcialmente por estado interno (`isDragging`). |
| 2.7 | Evento cancelável | N/A | — |
| 2.8 | Comportamento em RTL | ⚠️ | `paddingInline` ajuda; `leftIcon`/`rightIcon` não invertem em RTL — naming visual ao invés de lógico (`startIcon`/`endIcon`). |

**Observações livres:**
- **TextInput vs. FieldContext duplicação.** TextInput lê `fieldCtx` e seta `aria-describedby`/`aria-required`/`aria-invalid`/`aria-errormessage` direto. **Field.Control** também injeta os mesmos via `cloneElement`. Resultado em runtime: `cloneElement` ganha porque é spread depois. Funciona, mas **dois caminhos** = duas fontes de bug.
- TextInput `effectiveDisabled = disabled ?? fieldCtx?.isDisabled ?? false` — local prop ganha sobre context (ok). Field.Control ainda injeta `disabled` via cloneElement por cima — dupla escrita.
- Counter `disabled` aplica `opacity: 0.5; pointerEvents: 'none'` no wrapper Flex E também `disabled` nos `<Clickable as="button">` filhos. Redundante; remover um (preferir só nos botões para preservar a11y de focus).

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API mínima; sem props redundantes | ⚠️ | TextInput tem `label`, `error`, `helperText` E integra Field — **dupla camada de label/erro**. Quando dentro de Field, `label`/`error`/`helperText` são ignorados (FieldShell não renderiza). Mas tipo aceita; consumidor não percebe que vai ser ignorado. |
| 3.2 | Nomes seguem convenção do DS | ❌ | Mistura `disabled`/`error` (HTML-style) com `isInvalid`/`isDisabled` (Field). `leftIcon`/`rightIcon` (visual) vs. `startIcon`/`endIcon` (lógico, RTL-aware). Counter `showInput` (boolean) vs `clearable` (TextInput). Inconsistente. |
| 3.3 | Defaults "least surprise" | ✅ | `size='md'`, `variant='default'`. Counter `min=0, max=999, step=1`. |
| 3.4 | Combinações inválidas bloqueadas | ❌ | `TextInput` aceita `value` sem `onChange` (warning silencioso de React, mas tipo permite). `SearchInputProps extends Omit<TextInputProps, 'type'>` — bom, mas SelectProps idem em select dead. Counter aceita `value` sem `onChange`. |
| 3.5 | Polimorfismo via `as` | N/A | Inputs são forçadamente `<input>`/`<textarea>`. |
| 3.6 | `forwardRef` + `displayName` | ⚠️ | TextInput, TextArea, SearchInput, Select têm forwardRef + displayName ✅. **Counter e FileUpload são `React.FC` sem forwardRef** — DX quebrada para refs (focus management programático). |
| 3.7 | Compound: contratos de slot explícitos | N/A | Não compound (Field é o compound; estes são átomos). |
| 3.8 | Tipos públicos exportados | ✅ | Todos exportados em `interfaces/index.ts`. |

**Surface area atual (TextInput):**

```ts
interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, FieldBaseProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  clearable?: boolean;
  onValueChange?: (value: string) => void;
}
// FieldBaseProps:
// label?, error?, size?, variant?, helperText?, disabled?
```

**Observações livres:**
- `extends Omit<InputHTMLAttributes, 'size'>` herda **todos** os atributos HTML (autocomplete, autoFocus, capture, formAction, list, maxLength, ...). Sem curadoria — surface area pública gigante implícita. Isso ajuda DX (passthrough natural) mas dificulta versionamento (mudar default de qualquer attr é breaking).
- `Counter`, `FileUpload`, `SearchInput`, `TextArea` **não estão integrados ao FieldContext**. Quando colocados dentro de `<Field>`, não reagem a `isInvalid`/`isRequired`/`isDisabled` do contexto. Apenas TextInput é Field-aware.
- `TextAreaProps.showCharCount` exige `maxLength` — combinação não validada por tipo.
- `select.tsx` em `input/core/` é **dead code** (existe `src/components/select/` separado, exportado). Bagagem morta na árvore.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ⚠️ | Inputs precisam ser `<input>`/`<textarea>` — usado via `Box as="input"` ✅. Mas `select.tsx` (dead code) tem `<div>`, `<button>`, `<span>` crus. |
| 4.2 | Sem `style={{...}}` onde há prop equivalente | ❌ | TextInput: `border: 'none'`, `backgroundColor: 'transparent'`, `fontFamily: 'inherit'`, `fontSize: ...` em `style` quando há props declarativas. TextArea idem. Counter: tudo via `style`. FileUpload: padding/transition via `style`. |
| 4.3 | Estrutura de pasta | ⚠️ | `core/` ✅, `interfaces/` ✅. **Não tem** `styles/`, `accessibility/`, `utils/` — `shared.tsx` mistura tudo. |
| 4.4 | `defineRecipe`/`defineSlotRecipe` para variantes | ❌ | Recipe `input` declarada em `base-theme.ts` (linha 183) **não é consumida**. `getFieldFrameStyle` é função imperativa duplicada em `shared.tsx`. |
| 4.5 | Sem `any`, `console.*` | ⚠️ | TextInput: `value as unknown as string` (cast leve). FileUpload: lança strings de erro em array interno e nunca expõe (`{ valid, errors }` retornado mas só `valid` é usado). |
| 4.6 | Testes cobrem estados, variantes, a11y, interações | ❌ | TextInput: 24 testes ✅ (cobre size, variant, clearable, ícones, ref, FieldContext). **TextArea: 0 testes. SearchInput: 0 testes. Counter: 0 testes. FileUpload: 0 testes.** |
| 4.7 | Story cobre default, variantes, estados, playground, exemplo composto | ❌ | TextInput: 6 stories diretas + 2 delegadas. Sem story para clearable, leftIcon/rightIcon, integração com Field, Counter, FileUpload. |
| 4.8 | `.native.tsx` ou platform-split documentado | ✅ | Documentado como web-only em `shared.ts` (`@platform web-only`). |
| 4.9 | Imports respeitam camadas | ✅ | foundations → ecosystem → components. |

**Métricas rápidas:**

- LOC: textinput 124 · textarea 79 · search-input 24 · counter 159 · fileupload 202 · select 191 · shared 104 → **883 LOC totais** (456 não considerando select dead).
- Nº de testes: 24 (todos para TextInput).
- Nº de stories: 8 (foco quase total em TextInput).
- Dependências externas: 0 (runtime).

**Observações livres:**
- **`getFieldFrameStyle` retorna `CSSProperties` — é repassado via `style={...frameStyle}`**. Toda a configuração visual fica em um blob inline, fora do styled-system. Isso fura o ponto da arquitetura de tokens: o engine não sabe que estes valores existem; theming dinâmico não funciona; recipes ficam mortas.
- **`select.tsx` é manchete arquitetural ruim**: 191 LOC de `<div style>` cru, `<button>` cru, `boxShadow` hardcoded, `fontSize: '14px'` literal — exatamente o anti-pattern documentado em CLAUDE.md. **Não exportado**, mas existe e pode confundir contribuidores.
- **FileUpload em inglês**: strings hardcoded `"Drag and drop or click to upload"`, `"File uploaded"`, `"Uploading..."`, `"Maximum {x}"`, `"Remove"`, `"is too large"`, `"Maximum N files allowed"`. Resto do projeto é pt-BR (inclusive `"Limpar"` em TextInput). Drift de i18n.
- **Counter**: `'white'` hardcoded em 2 lugares — quebra dark mode.
- Sem `aria-label` em FileUpload remove button quando o ícone for trocado por Icon — preparar.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público correto e estável | ⚠️ | Index exporta `Counter, TextInput, TextArea, SearchInput, FileUpload`. Não exporta `Select` (dead code, ok). Re-exporta tudo via `interfaces/index.ts`. |
| 5.2 | Tipos públicos exportados | ✅ | `TextInputProps`, `TextAreaProps`, `CounterProps`, `FileUploadProps`, `SearchInputProps`, `FieldBaseProps`, `FieldSize`, `FieldVariant`. |
| 5.3 | Mudança proposta tem changeset entry | N/A | Fixes triviais aplicados são patch. |
| 5.4 | Breaking change tem RFC | N/A | — |
| 5.5 | Migration guide se há consumidores | N/A | — |

**Observações livres:**
- `Counter.default` exportado redundantemente via `index.ts:1` (`export { Counter, default } from './counter'`) — único componente da família com default export. Inconsistência. Default exports são desencorajados em libs (atrapalha tree-shaking nominal).

---

## 6. Resumo executivo

**Score por eixo:** Visual `2/8` ❌ · Comportamental `2/8` ❌ · Funcional `4/8` ⚠️ · Código `3/9` ❌ · Governança `4/5` ⚠️

**Top 3 achados (por impacto):**

1. **Cobertura de testes catastrófica em 4 dos 5 componentes.** TextArea, SearchInput, Counter, FileUpload têm **0 testes**. Counter e FileUpload são UI complexa sem proteção de regressão. **Crítico.**
2. **Recipe `input` morta** — declarada em `base-theme.ts` mas substituída por `getFieldFrameStyle` imperativo. Theming dinâmico, dark mode e overrides via `createTheme` não funcionam para a família. Padrão a propagar urgentemente. **Crítico.**
3. **`select.tsx` dead code** com 191 LOC de anti-pattern (HTML cru + style cru) deve ser removido — confunde contribuidores e contradiz CLAUDE.md.

**Outros achados altos:**

4. **`Counter` e `FileUpload` sem `forwardRef`** — gap consistente com TD-007.
5. **`outline="none"` em TextInput** quebra focus visible (mesmo padrão do FAB HR4-13).
6. **FileUpload em inglês** — i18n quebrada.
7. **TextInput vs. Field.Control duplicam injeção de aria-*** — definir contrato.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [ ] ⚠️ Aprovado com fixes menores
- [x] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review) — aplicado em 2026-04-24

- [x] `input.stories.tsx` Sizes: `<div style={...}>` → `<Flex flexDirection="column" gap="12px">`.
- [x] `SearchInput`: `<Box as="span">Q</Box>` → `<Icon name="Search" size="sm" decorative />`.
- [x] `TextInput`: `Box.innerRef={ref}` → `Box.ref={ref}` (RFC-0001).
- [x] `TextArea`: `Box.innerRef={ref}` → `Box.ref={ref}` (RFC-0001).

### Issue (mudança localizada, sem breaking change)

- [ ] **I-1** TextArea, SearchInput, Counter, FileUpload: criar arquivos de teste (cobertura mínima 10 cases cada).
- [ ] **I-2** TextArea, Counter, FileUpload: criar stories dedicadas (não delegar tudo a TextInput).
- [ ] **I-3** TextInput: remover `outline="none"`; usar `:focus-visible` para focus ring (token de cor `focus.ring`).
- [ ] **I-4** Counter: substituir `'−'`/`'+'` por `<Icon name="Minus" />`/`<Icon name="Plus" />`.
- [ ] **I-5** Counter: substituir `'white'` por `theme.colors.surface.default`; substituir `'background-color 0.2s'` por `transition('background-color', 'fast')`.
- [ ] **I-6** Counter: adicionar `forwardRef` + `role="spinbutton"` + `aria-valuenow/valuemin/valuemax` no input central + suporte a setas teclado.
- [ ] **I-7** FileUpload: traduzir strings para pt-BR.
- [ ] **I-8** FileUpload: substituir emojis (📤, ⏳) por `<Icon name="Upload" />` + `<Spinner />`.
- [ ] **I-9** FileUpload: adicionar `forwardRef` + `role="button"` + `tabIndex={0}` + handler Enter/Space na zona de drop.
- [ ] **I-10** FileUpload: expor erros de validação via callback (`onValidationError?: (errors: string[]) => void`); hoje somem.
- [ ] **I-11** FileUpload: substituir `transition: 'all 0.2s'` por `transition()` específico (anti-pattern de performance).
- [ ] **I-12** TextInput/TextArea: promover `style.border/backgroundColor/fontFamily` para props declarativas.
- [ ] **I-13** TextInput: remover ambiguidade `effectiveError = fieldCtx?.isInvalid ? (error ?? ' ') : error` (sentinel `' '`).
- [ ] **I-14** Field-awareness em TextArea, SearchInput, Counter, FileUpload (ler `useFieldContext` igual ao TextInput).
- [ ] **I-15** Touch target ≥ 44×44: revisar `size="sm"` em TextInput/Counter — ou aumentar minHeight, ou documentar como uso restrito.
- [ ] **I-16** Counter: remover redundância `pointerEvents: 'none'` no wrapper quando botões já têm `disabled`.
- [ ] **I-17** Counter remover default export do `index.ts` (`export { Counter, default }` → `export { Counter }`).
- [ ] **I-18** Stories: adicionar exemplos para `clearable`, `leftIcon`, `rightIcon`, integração TextInput+Field, Counter standalone, FileUpload com preview.

### RFC (sistêmico ou breaking change)

- [ ] **RFC candidata: Recipe `input` consumida pelo TextInput/TextArea** — mover `getFieldFrameStyle` imperativo para variants da slot recipe. Habilita theming dinâmico, dark mode, overrides via `createTheme`. Breaking apenas se prop `variant`/`size` mudar de comportamento.
- [ ] **RFC candidata: Remover `src/components/input/core/select.tsx`** (dead code) — verificar zero consumidores externos via grep e deletar arquivo + interface.
- [ ] **RFC candidata: Convenção `is*` × `disabled`/`error`/`required`** — Field usa `isDisabled/isInvalid/isRequired`; Input usa `disabled/error`. Decidir e propagar (compartilha origem com F-3 do Field).
- [ ] **RFC candidata: `leftIcon`/`rightIcon` → `startIcon`/`endIcon`** — RTL-aware. Breaking pequeno; aliasing temporário possível.
- [ ] **RFC candidata: Contrato canônico Field.Control × inputs Field-aware** (compartilhada com Field F-2 / F-3).
- [ ] **RFC candidata: Surface area de TextInput** — restringir `extends InputHTMLAttributes` para subset curado (ex: `Pick<>` explícito) e expor escape `nativeProps` para attrs raros. Reduz blast radius de versionamento.

---

## 8. Notas de arquiteto

- **Padrão "imperative styling on top of styled-system" é cancroide.** `getFieldFrameStyle` retorna um blob `CSSProperties` que é spread em `style={...}`. Isso:
  1. Esconde dependência de tokens do engine (não há tracking de uso).
  2. Quebra theming dinâmico (mudança de tema em runtime não re-renderiza).
  3. Torna recipes mortas (declaradas mas inúteis).
  4. Multiplica o trabalho ao adicionar tokens (precisa lembrar de tocar 2 lugares).

  Esse padrão **não é local do Input** — provavelmente se repete em Counter, FileUpload, e candidatos a aparecer em R6 (Checkbox/Radio/Switch/Select). RFC sistêmica vale mais que fix por componente.

- **"Field-aware components" é contrato emergente não documentado.** TextInput é o único cidadão; quando Checkbox/Radio/Switch/Select chegarem em R6, vão precisar do mesmo padrão. Documentar agora em CONTRIBUTING evita drift posterior.

- **`Counter` e `FileUpload` parecem ter sido escritos antes do hardening do DS.** Hardcodes de cor/font/transition, ausência de Icon, sem testes, sem forwardRef, default export — todos os antipadrões já mapeados em outras reviews aparecem. Provavelmente ficaram fora dos sweeps anteriores. Considerar revisita coordenada em R7 (junto com outros candidatos a "feedback indicators").

- **`select.tsx` em `input/core/` é evidência de migração interrompida**. Houve substituição por `src/components/select/` (compound moderno) mas o arquivo antigo sobreviveu. Sweep de remoção é trivial (não exportado, não referenciado em testes/stories). Vale fechar antes que alguém o "ressuscite".

- **Hierarquia `FieldShell` × `Field` (compound) duplica responsabilidade.** `FieldShell` desenha `<label>` + `<input>` + `<helper>` standalone — útil quando consumidor não usa Field. Mas o desenho do label difere (cor, tamanho), criando 2 estilos de label no DS. Ou:
  - (a) `FieldShell` consome `Field` internamente (auto-Field invisível) — uniformiza.
  - (b) `FieldShell` é deletado; consumidor obrigado a usar `Field` quando quiser label/helper.
  - (c) Mantém ambos, mas força mesma recipe (label sempre `field.label` do recipe).

  Preferência arquitetural: **(a)** ou **(c)**. Tema para RFC.

- **`extends Omit<InputHTMLAttributes, 'size'>` é a porta DX-friendly mas custosa para versionamento.** Consumidores ganham passthrough natural (`autocomplete`, `pattern`, `name`); o DS perde controle sobre quais atributos são parte do contrato. RFC futura pode trocar por `nativeProps` curado (padrão Radix UI: `nativeProps?: ComponentProps<'input'>`).
