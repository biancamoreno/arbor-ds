# RFC-0014 — Contrato canônico `Field.Control` × Field-aware components

**Status**: **Accepted · Implemented (2026-04-24)**
**Autores**: arbor-ds-architect
**Data**: 2026-04-24
**PR**: (pendente)

## Resumo da implementação (2026-04-24)

- `FieldContextValue` ganhou `descriptionRegistered: boolean`, `errorRegistered: boolean`, `registerDescription/unregisterDescription`, `registerError/unregisterError`. `Field.Root` (web e native) controla os contadores via `useState` + `useCallback` e expõe pelo Provider.
- `Field.Description` e `Field.Error` registram-se com `useEffect(register, unregister)` — só anunciam presença quando montados. `Field.Error` permanece com guard de renderização (`ctx.invalid`).
- `Field.Control` detecta o marker `isFieldAware` via `isFieldAwareComponent(type)` (suporta `forwardRef`/`memo`). Se for Field-aware, passa o child sem injetar; caso contrário, injeta `id` e condicionais: `aria-describedby` só se `descriptionRegistered`, `aria-required` se `required`, `aria-invalid`/`aria-errormessage` conforme `invalid` + `errorRegistered`, `disabled` se aplicável.
- Helper `markFieldAware(component)` e `isFieldAwareComponent(type)` exportados de `arbor-ds/components/field`. Marker aplicado em: `TextInput`, `TextArea`, `SearchInput`, `Counter`, `FileUpload`, `Checkbox.Root`, `Checkbox.Indicator`, `Radio.Root`, `Switch.Root` (web + native), `Select.Root`, `Select.Trigger`.
- Todos os Field-aware inputs agora condicionam `aria-describedby`/`aria-errormessage` ao registry (`descriptionRegistered`/`errorRegistered`) — mesmo contrato em modo sem `Field.Control`.
- `Field.native` recebeu o mesmo refactor (registry + nomes canônicos), reduzindo parte da divergência de TD-009 (a paridade completa com primitives permanece pendente, RFC dedicada).
- Testes cobrem: Field.Control com child Field-aware não injeta; sem `Field.Description` → `aria-describedby` ausente em ambos os modos; com `Field.Description` → presente; idem para `aria-errormessage` × `Field.Error`; uso direto `<Field><TextInput/></Field>` sem `Field.Control` mantém o wiring.
- **TD-011 fechado.** 555/555 testes verdes · ESLint verde · TypeScript `tsc -b` verde.

**Origem:** R5 review (CR5-2 + HR5-4 + HR5-14 + TD-011) · gate de R6.
**Depende de:** RFC-0013 (naming) — definir antes de implementar.

---

## Motivação

A R5 revelou **três bugs sintomáticos do mesmo problema arquitetural**:

1. **CR5-2** — `Field.Control` injeta `aria-describedby="${fieldId}-description"` sempre, mesmo sem `Field.Description` no DOM. Aponta para id inexistente — quebra `axe rule aria-valid-attr-value`.
2. **HR5-4** — `TextInput` lê `useFieldContext()` direto e seta os mesmos `aria-*` que `Field.Control` injeta via `cloneElement`. **Dois caminhos para o mesmo wiring.** `cloneElement` ganha em runtime; o trabalho do TextInput é silenciosamente sobrescrito.
3. **HR5-14** — TextArea, SearchInput, Counter, FileUpload **não consomem** `useFieldContext`. Quando colocados dentro de `<Field>`, ignoram completamente as flags de contexto.

A causa raiz é a **ausência de um contrato definido**: quem é a fonte da verdade do wiring entre Field (compound) e seus controles (átomos)?

### Estado atual (3 modos coexistem)

```tsx
// Modo A: Field.Control + componente Field-aware (TextInput)
// → wiring DUPLICADO: TextInput lê context E Field.Control injeta via cloneElement
<Field id="email" invalid>
  <Field.Control>
    <TextInput />  {/* recebe aria-* duas vezes; cloneElement ganha */}
  </Field.Control>
</Field>

// Modo B: Field.Control + elemento HTML cru
// → wiring SÓ via cloneElement (Field.Control faz tudo)
<Field id="email" invalid>
  <Field.Control>
    <input />  {/* funciona, mas aria-describedby aponta para id inexistente */}
  </Field.Control>
</Field>

// Modo C: Componente Field-aware SEM Field.Control
// → wiring SÓ via context (componente faz tudo)
<Field id="email" invalid>
  <TextInput />  {/* lê context, seta aria-* — funciona! */}
</Field>

// Modo D: Componente NÃO Field-aware SEM Field.Control
// → wiring NÃO acontece — flags do Field são ignoradas
<Field id="email" invalid>
  <Counter value={1} />  {/* Counter ignora context */}
</Field>
```

Esse caos:
- **Quebra axe-core** (Modo B).
- **Duplica trabalho** sem ganho (Modo A).
- **Tem dead path** (Modo D — silencioso).
- **Sem teste de paridade** entre os modos.

---

## Proposta

### Princípio: **Componentes Field-aware são a fonte da verdade. `Field.Control` é opcional e idempotente.**

Três regras:

#### Regra 1: Componentes "Field-aware" assumem todo o wiring

Um componente é **Field-aware** quando lê `useFieldContext()` e aplica os atributos derivados. Toda família Input deve ser Field-aware (TextInput já é; TextArea/SearchInput/Counter/FileUpload precisam migrar). Mesmo Checkbox/Radio/Switch/Select de R6.

```tsx
// Padrão Field-aware canônico
function TextInput(props) {
  const fieldCtx = useFieldContext();
  const inputId = fieldCtx?.fieldId ?? props.id ?? autoId;
  const effectiveDisabled = props.disabled ?? fieldCtx?.disabled ?? false;
  const effectiveRequired = props.required ?? fieldCtx?.required ?? false;
  const effectiveInvalid  = props.invalid  ?? fieldCtx?.invalid  ?? false;

  return (
    <input
      id={inputId}
      disabled={effectiveDisabled}
      aria-required={effectiveRequired || undefined}
      aria-invalid={effectiveInvalid || undefined}
      aria-describedby={fieldCtx?.descriptionRegistered ? fieldCtx.descriptionId : undefined}
      aria-errormessage={effectiveInvalid && fieldCtx?.errorRegistered ? fieldCtx.errorId : undefined}
      {...props}
    />
  );
}
```

#### Regra 2: `Field.Control` torna-se opcional + idempotente

`Field.Control` continua existindo para 2 casos:

1. **Compatibilidade com elementos HTML crus** (`<input>` direto sem ser Arbor).
2. **Wrapping de componentes terceiros** (DatePicker do design partner, etc.).

Mas:
- **Não duplica** o trabalho que componentes Field-aware já fazem.
- **Detecta** se o filho é Field-aware (via prop bag check ou marker) e, se for, **não injeta nada**.
- **Se o filho NÃO é Field-aware**, injeta os atributos — mas com a mesma lógica condicional (registry-aware).

```tsx
// FieldControl proposto
export function FieldControl({ children }: FieldControlProps) {
  const ctx = useFieldContext();
  if (!ctx || !React.isValidElement(children)) return <>{children}</>;

  // Detectar se já é Field-aware
  const isFieldAware = isFieldAwareComponent(children.type);
  if (isFieldAware) return <>{children}</>; // sem injeção; o componente faz

  // Não Field-aware: injetar com registry-aware checks
  const injectedProps: Record<string, unknown> = { id: ctx.fieldId };
  if (ctx.descriptionRegistered) injectedProps['aria-describedby'] = ctx.descriptionId;
  if (ctx.required) injectedProps['aria-required'] = true;
  if (ctx.invalid) {
    injectedProps['aria-invalid'] = true;
    if (ctx.errorRegistered) injectedProps['aria-errormessage'] = ctx.errorId;
  }
  if (ctx.disabled) injectedProps['disabled'] = true;

  return React.cloneElement(children, injectedProps);
}
```

#### Regra 3: `FieldContext` ganha registry de slots

Adicionar `descriptionRegistered`/`errorRegistered` como flags reativas — atualizadas via `useEffect` em `Field.Description` / `Field.Error`. Resolve TD-011.

```tsx
// FieldContextValue (atualizado, alinhado com RFC-0013)
type FieldContextValue = {
  fieldId: string;
  descriptionId: string;
  errorId: string;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  // Novos:
  descriptionRegistered: boolean;
  errorRegistered: boolean;
  registerDescription: () => void;
  unregisterDescription: () => void;
  registerError: () => void;
  unregisterError: () => void;
};
```

```tsx
// Field.Description registra-se automaticamente
export function FieldDescription({ children }: FieldDescriptionProps) {
  const ctx = useFieldContext();

  useEffect(() => {
    if (!ctx) return;
    ctx.registerDescription();
    return ctx.unregisterDescription;
  }, [ctx]);

  return (
    <ArborTransform as="p" id={ctx?.descriptionId} color="text.secondary">
      {children}
    </ArborTransform>
  );
}
```

### Como detectar "Field-aware"

Duas opções; escolher uma:

#### Opção A: Marker estático no componente (preferida)

```tsx
TextInput.isFieldAware = true;
TextArea.isFieldAware = true;

function isFieldAwareComponent(type: any): boolean {
  return typeof type === 'function' && (type as any).isFieldAware === true;
}
```

✅ Simples, rápido, funciona com tree-shaking.
✅ Test-friendly.
❌ Componentes terceiros precisam opt-in explicitamente.

#### Opção B: Context publication

`Field-aware components` chamam `useFieldContext({ claimed: true })` que marca o context. `Field.Control` lê `claimed` e pula injeção.

❌ Mais complexo; mutável dentro do render.
❌ Pode causar re-render extra.

**Decisão recomendada: Opção A.**

---

## Componentes afetados

### Migração obrigatória para Field-aware

| Componente | Status atual | Ação |
|---|---|---|
| **TextInput** | Já Field-aware (lê context) | Adicionar `TextInput.isFieldAware = true`; usar registry flags. |
| **TextArea** | Não Field-aware | Migrar (igual TextInput); marker. |
| **SearchInput** | Não Field-aware | Migrar (delega a TextInput; ganha de graça). |
| **Counter** | Não Field-aware | Migrar; marker. |
| **FileUpload** | Não Field-aware | Migrar; marker. |
| **Checkbox** (R6) | Já lê fieldCtx parcialmente | Marker + registry; nasce já no padrão. |
| **Radio / Switch / Select** (R6) | A nascer | Mesmo padrão. |

### Field core

| Arquivo | Ação |
|---|---|
| `field-context.ts` | Adicionar registry flags + setters; alinhar nomes (RFC-0013). |
| `field.tsx` (Root) | Adicionar `useState` para `descriptionRegistered`/`errorRegistered`; expor via Provider. |
| `field.native.tsx` | Mesmo refactor (TD-009 alinhado). |
| `slots/control.tsx` | Detectar Field-aware via marker; condicional de injeção; registry-aware. |
| `slots/description.tsx` | `useEffect` register/unregister. |
| `slots/error.tsx` | `useEffect` register/unregister. |
| `slots/label.tsx` | Sem mudança (não toca em aria-*). |

---

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **A. Field.Control sempre injeta; remover Field-awareness dos átomos** | Quebra Modo C (uso sem Field.Control). Hoje é prático: `<Field><TextInput /></Field>` funciona. Forçar wrapper degrada DX. |
| **B. Átomos sempre fazem; Field.Control deletado** | Quebra Modo B (input HTML cru). Perde a ergonomia de "envolva qualquer coisa em Field.Control". |
| **C. Modo híbrido com prop opt-out (`Field.Control noInject`)** | Boilerplate ruim; consumidor precisa lembrar. Não resolve detecção automática. |
| **D. Field não tem context; tudo via props explícitas** | Abandona compound API; consumidor precisa passar `fieldId` manualmente em todos os átomos. DX terrível. |
| **E. Detectar Field-aware via Context publication** | Vide Opção B acima — mais complexo, sem ganho. |

---

## Impactos e trade-offs

- **Breaking change?** **Sim, mas localizado** — `FieldContextValue` muda de forma; consumidores externos de `useFieldContext()` precisam adaptar (provavelmente raros). API pública de `<Field>` não muda (após RFC-0013).
- **Impacto em bundle size**: ~+50 LOC (registry) — desprezível.
- **Impacto em performance**: Registry usa `useState` no Root; 2 re-renders extras quando Description/Error montam/desmontam. Aceitável.
- **Impacto em DX**:
  - **Positivo:** comportamento previsível em todos os 4 modos. Novos componentes têm template claro.
  - **Negativo:** marker `isFieldAware` precisa ser lembrado.
- **Impacto em acessibilidade**:
  - **Positivo significativo:** `aria-describedby` deixa de apontar para id inexistente. axe-core passa.
  - **Positivo:** `aria-errormessage` só aparece quando Error está realmente renderizado.
- **Codemod necessário?** Não para consumidores de Field; **sim** para `useFieldContext()` (renames de campos).

---

## Critérios de aceite

- [ ] `FieldContextValue` ganha `descriptionRegistered`/`errorRegistered` + setters.
- [ ] `Field.Description` e `Field.Error` chamam `register/unregister` em `useEffect`.
- [ ] `Field.Control` detecta Field-aware via marker (`TextInput.isFieldAware = true`).
- [ ] `Field.Control` condiciona `aria-describedby`/`aria-errormessage` ao registry.
- [ ] `TextInput` reescrito para condicionar leitura ao registry.
- [ ] `TextArea`, `SearchInput`, `Counter`, `FileUpload` migrados para Field-aware (com marker).
- [ ] `Field.native` recebe mesmo refactor (TD-009).
- [ ] Convenção documentada em CONTRIBUTING.md (seção "Field-aware components").
- [ ] Testes:
  - [ ] `Field.Control` com Field-aware child → não injeta.
  - [ ] `Field.Control` com HTML cru child → injeta.
  - [ ] Sem `Field.Description` → `aria-describedby` ausente em ambos os modos.
  - [ ] Com `Field.Description` → `aria-describedby` presente.
  - [ ] Idem para `aria-errormessage` × `Field.Error`.
  - [ ] Toggle dinâmico de Description/Error funciona.
- [ ] axe-core (manual) limpo nos cases de teste.
- [ ] TD-011 fechado.
- [ ] R6 (Checkbox/Radio/Switch/Select) já nasce no padrão Field-aware.

---

## Notas de implementação

### Ordem sugerida

1. **Implementar registry no FieldContext** (sozinho — testes verificam que registro funciona).
2. **Migrar Field.Description e Field.Error** para usar registry.
3. **Atualizar Field.Control** com detecção de Field-aware + condicional de injeção.
4. **Atualizar TextInput** para condicional + marker `isFieldAware`.
5. **Migrar TextArea/SearchInput/Counter/FileUpload** (em PRs separados, opcionalmente).
6. **Refatorar Field.native** (TD-009 alinhado).
7. **Atualizar CONTRIBUTING.md** com receita "Como criar Field-aware component".

### Riscos

- **Marker em componente terceiro:** se um consumidor cria `MyCustomInput` sem `MyCustomInput.isFieldAware = true`, Field.Control cai no caminho de injeção. Comportamento "funciona, mas duplica" — degradação aceitável.
- **Componente memoizado:** `React.memo(MyComponent)` retorna um objeto, não a função. Marker `MyComponent.isFieldAware` não vai aparecer no `wrapped`. Solução: verificar `type.type?.isFieldAware` recursivamente, ou documentar limitação.
- **Forwarded ref:** `forwardRef(MyComponent)` retorna `{ render, displayName }`. Mesmo problema. Verificar `type.render?.isFieldAware`.

### Helper para autodetecção

```tsx
function isFieldAwareComponent(type: any): boolean {
  if (typeof type !== 'function' && typeof type !== 'object') return false;
  if (type.isFieldAware === true) return true;
  if (type.render?.isFieldAware === true) return true; // forwardRef
  if (type.type?.isFieldAware === true) return true;   // memo
  return false;
}
```

### Dependências entre RFCs

- **RFC-0013 (naming)** — pré-requisito. Esta RFC assume `disabled`/`required`/`invalid` (não `is*`).
- **RFC-0007 (useRecipe genérico)** — independente, mas pode rodar em paralelo.
- **TD-011** — fechado por esta RFC.
- **TD-009 (Field.native)** — abordado tangencialmente; vale RFC dedicada para a reimplementação.

---

## Recomendação

**Aceitar e implementar antes do início de R6.** Junto com RFC-0013, define o "esqueleto" para Checkbox/Radio/Switch/Select. Sem essas duas RFCs, R6 vai amplificar bugs e divergência. Estimativa de implementação: 2-3 dias (ambas as RFCs combinadas) + 1 dia migrando R5 inputs.
