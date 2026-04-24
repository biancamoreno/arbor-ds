# RFC-0013 — Convenção de naming de props booleanas (`is*` × `disabled`/`checked`/`open`)

**Status**: **Accepted · Implemented (2026-04-24)**
**Autores**: arbor-ds-architect
**Data**: 2026-04-24
**PR**: (pendente)

## Resumo da implementação (2026-04-24)

- `FieldRootProps` aceita `disabled`/`required`/`invalid` como API canônica e mantém `isDisabled`/`isRequired`/`isInvalid` como aliases legados com `console.warn` em dev (um warning por prop por instância).
- `FieldContextValue` expõe apenas os nomes canônicos (`disabled`/`required`/`invalid`); slots (Label, Description, Error, Control) consomem a forma canônica.
- `DialogRootProps` aceita `open`/`defaultOpen`/`onOpenChange` (canônicos) e mantém `isOpen` como alias legado com warning em dev. Slots internos (`DialogContent`/`DialogOverlay`/`DialogTrigger`/`DialogClose`) foram migrados para `open`/`setOpen(next)` no contexto.
- `AccordionItemContextValue` renomeado internamente `isOpen` → `open` (não é API pública; migração interna de uniformização).
- Todos os consumidores internos do DS (Checkbox/Radio/Switch/Select/TextInput/TextArea/SearchInput/Counter/FileUpload) migrados para ler `fieldCtx.disabled`/`fieldCtx.required`/`fieldCtx.invalid`.
- Testes atualizados para API canônica; novos cases cobrem a via legada com assertiva de warning.
- 555/555 testes verdes · ESLint verde · TypeScript `tsc -b` verde.

**Origem:** R5 review (HR5-11) · gate de R6 (Checkbox/Radio/Switch/Select).

---

## Motivação

A R5 review revelou inconsistência sistêmica de naming de props booleanas na API pública do Arbor-DS. Com R6 prestes a ampliar a superfície (Checkbox/Radio/RadioCard/Switch/Select têm naturalmente várias flags: `disabled`, `checked`, `required`, `invalid`, `readOnly`, `selected`...), a decisão precisa ser tomada **antes** de começar — caso contrário, a inconsistência será multiplicada.

### Inventário atual (2026-04-24)

| Componente | API pública | Contexto interno |
|---|---|---|
| **Field** | `isDisabled`, `isInvalid`, `isRequired` | `isDisabled`, `isInvalid`, `isRequired` |
| **Button** | `disabled`, `loading` | — |
| **Accordion** | `disabled` (item) | `isOpen`, `disabled` |
| **Checkbox** | `disabled`, `checked`, `indeterminate` | `isChecked`, `isDisabled`, `isIndeterminate` |
| **Switch** | `disabled`, `checked` | (similar a checkbox) |
| **Chip** | `disabled`, `selected` | — |
| **Dialog** | `isOpen`, `defaultOpen` | `isOpen` |
| **Drawer** | `open`, `onOpenChange` | (a confirmar) |
| **Tooltip** | `open` | — |
| **TextInput / TextArea / Counter / FileUpload** | `disabled`, `error`, `required` (HTML passthrough) | — |

**3 padrões coexistem:**

1. **`disabled`/`checked`/`open`** (sem prefixo) — alinhado com HTML; usado por Button, Accordion, Checkbox, Switch, Chip, Drawer, Tooltip, inputs HTML.
2. **`isDisabled`/`isInvalid`/`isRequired`** — usado **apenas em Field** (e propagado em FieldContext).
3. **`isOpen`** — usado em Dialog (mas Drawer/Tooltip já usam `open`).

### Por que isso importa

- **DX inconsistente.** Consumidor que aprende Field espera `isOpen` em Dialog... e encontra. Espera `isChecked` em Checkbox... e encontra `checked`. Confusão garantida.
- **Autocomplete ruim.** Mistura `is*` + sem prefixo polui IDE.
- **Migração compulsiva.** R6 vai herdar a confusão. Checkbox/Radio/Switch/Select precisam decidir antes de existir como API.
- **Alinhamento com ecossistema.** Atributos HTML são `disabled`/`checked`/`required`/`open` — não `isDisabled`. Radix UI, Headless UI, Mantine, shadcn/ui usam todos sem prefixo. Apenas Chakra UI (até v2) usava `is*`.

---

## Proposta

### Convenção 1: API pública usa **sem prefixo**

Toda prop booleana exposta publicamente segue HTML/ARIA naming:

```tsx
// ✅ API pública canônica
type FieldRootProps = {
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
};

type DialogRootProps = {
  open?: boolean;          // não isOpen
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type CheckboxProps = {
  checked?: boolean;       // já está
  disabled?: boolean;      // já está
  indeterminate?: boolean; // já está
  required?: boolean;
  invalid?: boolean;       // novo (alinhado a Field)
};
```

### Convenção 2: Contextos internos podem usar `is*` para variáveis locais

`FieldContextValue` segue a API pública (sem prefixo). Variáveis derivadas locais podem usar `is*` para legibilidade:

```tsx
// ✅ Contexto público segue API
type FieldContextValue = {
  fieldId: string;
  descriptionId: string;
  errorId: string;
  disabled: boolean;       // não isDisabled
  required: boolean;
  invalid: boolean;
};

// ✅ Variáveis locais podem usar `is*`
function Checkbox() {
  const fieldCtx = useFieldContext();
  const isChecked = ctx.checked && !ctx.indeterminate;  // local; tudo bem
  const isInteractive = !fieldCtx?.disabled && !readOnly;
}
```

### Convenção 3: Eventos seguem `on{Verbo}Change` ou `on{Verbo}`

```tsx
// ✅ Padrões aceitos
onChange?: (e: ChangeEvent) => void;        // HTML-like (preserva Event)
onCheckedChange?: (checked: boolean) => void; // value-only (Radix-like, novo)
onValueChange?: (value: string) => void;
onOpenChange?: (open: boolean) => void;
```

### Convenção 4: `aria-*` mantém prefixo (HTML standard)

```tsx
// ✅ Sempre
aria-required={required}
aria-invalid={invalid}
aria-disabled={disabled}
```

---

## Componentes afetados

### Breaking changes (API pública)

| Componente | Hoje | Proposto | Notas |
|---|---|---|---|
| **Field.Root** | `isDisabled`, `isRequired`, `isInvalid` | `disabled`, `required`, `invalid` | Compound principal. |
| **FieldContextValue** | `isDisabled`, `isRequired`, `isInvalid` | `disabled`, `required`, `invalid` | Quebra consumidores externos de `useFieldContext()`. |
| **Dialog.Root** | `isOpen`, `defaultOpen` | `open`, `defaultOpen` | Alinha com Drawer/Tooltip. |
| **Accordion (interno)** | `isOpen` no contexto | `open` no contexto | Não é API pública mas vale uniformizar. |

### Não-breaking (já estão alinhados)

- Button, Checkbox, Switch, Chip, Drawer, Tooltip, TextInput, TextArea, Counter, FileUpload, SearchInput.

---

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **A. Padronizar em `is*` (Chakra v2 style)** | Quebra ~10 componentes (todos exceto Field e Dialog). Diverge do HTML/ARIA, Radix, Mantine, shadcn. DX pior para quem vem de outras libs. Custo de migração 5× maior. |
| **B. Manter ambos como aliases** | `disabled` e `isDisabled` aceitos em paralelo. Surface area dobrada; consumidor não sabe qual usar; tipo permite inconsistência intra-projeto. |
| **C. Não decidir; cada componente escolhe** | Status quo. Custo cumulativo crescente; DX ruim; impede CI/codemod. |
| **D. `isXxx` apenas em flags compostas (`isInvalidWithReason`)** | Convenção complexa demais; não resolve o caso simples. |

---

## Impactos e trade-offs

- **Breaking change?** **Sim** — Field e Dialog (props públicas + contextos).
- **Impacto em bundle size**: ~0 (renomeações sem novos imports).
- **Impacto em performance**: 0.
- **Impacto em DX**: **Positivo significativo** — alinha com HTML, IDEs, ecossistema.
- **Impacto em acessibilidade**: 0 (não toca em `aria-*`).
- **Codemod necessário?** **Sim**, simples (rename de propriedade).

### Migração

1. **Versão N** (esta RFC implementada):
   - Field aceita ambos `isDisabled` E `disabled` com warning de depreciação para `is*`.
   - Dialog aceita ambos `isOpen` E `open` com warning.
   - FieldContextValue expõe ambos os nomes.
2. **Versão N+1** (next major):
   - `is*` removidos.
   - Codemod publicado em `tools/codemods/`.
3. **Versão N+2**:
   - Engine remove suporte ao alias.

### Impacto em testes

- Testes existentes do Field (24 cases) usam `isDisabled`/`isInvalid`/`isRequired`. Reescrever ou adicionar warning suppression durante a fase de transição.

---

## Critérios de aceite

- [ ] Convenção documentada em CONTRIBUTING.md (seção "Naming de props").
- [ ] Field migrado: API aceita `disabled`/`required`/`invalid`; aliases `is*` mantidos com warning dev.
- [ ] FieldContextValue expõe ambos os nomes (alias).
- [ ] Dialog migrado: `open` aceito; `isOpen` mantido com warning.
- [ ] Todos os consumidores internos do DS migrados (TextInput, slots de Field, etc.).
- [ ] Testes adaptados.
- [ ] Codemod básico em `tools/codemods/rfc-0013/` (opcional para v1, obrigatório para v2).
- [ ] R6 começa com Checkbox/Radio/Switch/Select já no padrão `disabled`/`checked`/`required`/`invalid` (sem `is*` na API pública).
- [ ] `pnpm test` verde.
- [ ] CHANGELOG / changeset entry.

---

## Notas de implementação

### Estratégia de alias durante a transição

```tsx
// field.tsx
function FieldRoot({
  // canônicos
  disabled,
  required,
  invalid,
  // legacy aliases (deprecated)
  isDisabled,
  isRequired,
  isInvalid,
  ...rest
}: FieldRootProps) {
  if (process.env.NODE_ENV !== 'production') {
    if (isDisabled !== undefined) {
      console.warn('[Field] `isDisabled` is deprecated. Use `disabled` (RFC-0013).');
    }
    // ... idem para os outros
  }

  const effectiveDisabled = disabled ?? isDisabled ?? false;
  const effectiveRequired = required ?? isRequired ?? false;
  const effectiveInvalid  = invalid  ?? isInvalid  ?? false;
  // ...
}
```

### Tipo público durante transição

```ts
type FieldRootProps =
  | (FieldRootCanonicalProps & { isDisabled?: never; isInvalid?: never; isRequired?: never })
  | (FieldRootLegacyProps & { disabled?: never; invalid?: never; required?: never });
```

(Ou union mais simples se aceitar ambos conviverem por tempo curto.)

### Riscos

- **Field é amplamente usado em produto** — coordenar a migração com consumidores externos via changelog claro.
- **`isOpen` em Dialog é menos crítico** (consumidor menor); mais fácil migrar.
- **Codemod precisa cobrir casts e desestruturação**, não só `<Field isDisabled>`.

### Dependências entre RFCs

- **RFC-0014 (Contrato Field-aware)** — pode ser escrita em paralelo, mas implementação precisa decidir naming antes. Esta RFC é pré-requisito.

---

## Recomendação

**Aceitar e implementar antes do início de R6.** A janela de oportunidade é curta — depois de R6, custo de migração quintuplica (Checkbox/Radio/Switch/Select/RadioCard adicionam ~15 props booleanas se mantiverem o padrão sem prefixo, ou ~15 props com `is*` se herdarem de Field). Decidir agora evita 80% do trabalho futuro.
