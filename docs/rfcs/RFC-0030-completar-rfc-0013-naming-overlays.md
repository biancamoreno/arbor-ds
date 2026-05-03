# RFC-0030 — Completar RFC-0013: naming canônico em overlays e contextos remanescentes

**Status**: **Accepted (2026-05-02)** — em implementação
**Autores**: arbor-ds-architect
**Data**: 2026-05-02
**Origem**: revisão de naming sob `arbor-ds-arch` (2026-05-02); dívida residual da RFC-0013 + TD-012.

---

## Motivação

A **RFC-0013** (Accepted · 2026-04-24) fixou que toda prop booleana pública usa naming sem prefixo (`open`, `disabled`, `checked`, `required`, `invalid`), alinhada a HTML/ARIA e ao ecossistema (Radix, Headless UI, Mantine, shadcn). A varredura de **TD-012** (2026-04-24) eliminou aliases legados sem janela de transição.

A varredura, porém, ficou incompleta. Inventário em 2026-05-02:

| Superfície | Estado |
|---|---|
| `Drawer.Root` (API) | `isOpen` ❌, `onClose` ❌ |
| `Tooltip.Root` (API) | `isOpen` ❌ |
| `Popover.Root` (API) | `isOpen` ❌, `onClose` ❌ |
| `Menu.Root` (API) | `isOpen` ❌, `onClose` ❌ |
| `DrawerContext` / `TooltipContext` / `PopoverContext` / `MenuContext` | `isOpen` ❌ |
| `SelectContext` | `isOpen`, `isDisabled`, `isInvalid` ❌ |
| `CheckboxContext` | `isChecked`, `isIndeterminate`, `isDisabled`, `isInvalid` ❌ |
| `RadioContext` | `isChecked`, `isDisabled`, `isInvalid` ❌ |
| `ButtonGroupContext` | `isDisabled` ❌ |
| `PaginationItemProps.isActive` (API) | `isActive` ❌ |
| `useDisclosure()` retorna `isOpen` | exceção justificada (variável local) |

O inventário da RFC-0013 listava Drawer e Tooltip como já alinhados — a leitura era de `defaultOpen` (que é canônico) e a prop `isOpen` passou despercebida. Esta RFC fecha o débito.

---

## Proposta

### 1. Overlays (API pública)

| Componente | Antes | Depois |
|---|---|---|
| `DrawerRootProps` | `isOpen?`, `onClose?` | `open?`, `onOpenChange?: (open: boolean) => void` |
| `TooltipRootProps` | `isOpen?`, `onOpenChange?` | `open?`, `onOpenChange?` |
| `PopoverRootProps` | `isOpen?`, `onClose?` | `open?`, `onOpenChange?` |
| `MenuRootProps` | `isOpen?`, `onClose?` | `open?`, `onOpenChange?` |

`onClose: () => void` é descartada nas 4 superfícies. Razão: `onOpenChange(open: boolean)` é estritamente mais informativa (cobre os dois sentidos da transição) e já é o padrão de `Dialog`. Mantê-la duplicada multiplica caminhos de notificação sem ganho.

`Toast` mantém `onClose` por se tratar de **ciclo de vida finito não-controlável** (auto-dismiss), não de estado de abertura.

### 2. Contextos internos sem prefixo `is*`

Convenção 2 da RFC-0013 ("contextos internos seguem a API pública"). Migrar:

- `DrawerContextValue.isOpen` → `open`
- `TooltipContextValue.isOpen` → `open`
- `PopoverContextValue.isOpen` → `open`
- `MenuContextValue.isOpen` → `open`
- `SelectContextValue.{isOpen, isDisabled, isInvalid}` → `{open, disabled, invalid}`
- `CheckboxContextValue.{isChecked, isIndeterminate, isDisabled, isInvalid}` → `{checked, indeterminate, disabled, invalid}`
- `RadioContextValue.{isChecked, isDisabled, isInvalid}` → `{checked, disabled, invalid}`
- `ButtonGroupContextValue.isDisabled` → `disabled`

### 3. Pagination — API pública

`PaginationItemProps.isActive` → `current`. Razão:
- elimina o último `is*` na API pública;
- alinha com o atributo de a11y correto para item ativo de paginação (`aria-current="page"`);
- `current` é mais preciso que `active` (botão de outra página é "ativo" no sentido de habilitado, mas não é o atual).

### 4. `useDisclosure` — exceção documentada

`useDisclosure()` retorna `{ isOpen, open, close, toggle }`. Manter como está. Razão:
- o retorno do hook é variável local na call site (`const { isOpen } = useDisclosure()`), não prop pública;
- renomear para `open` colide com a ação `open()`, exigindo aliasing forçado (`{ open: opened }` ou `{ open: isOpen }`);
- a Convenção 2 da RFC-0013 explicitamente permite `is*` em variáveis locais derivadas para legibilidade.

A exceção é registrada em CONTRIBUTING.md.

---

## Plano de execução

### PR 1 — overlays (Drawer/Tooltip/Popover/Menu)

- `interfaces/*Props.ts`: `isOpen` → `open`; `onClose` → `onOpenChange?: (open: boolean) => void` (Tooltip já tinha).
- `core/*.tsx`: renomear desestruturação `isOpen: isOpenProp` → `open: openProp`; `useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange })`.
- `context/*-context.ts`: `isOpen` → `open`.
- `slots/*.tsx`: renomear leituras (`useDrawerContext`, `useTooltipContext`, `usePopoverContext`, `useMenuContext`).
- `*.test.tsx`: `Drawer.Root isOpen` → `Drawer.Root open`; `Popover.Root isOpen onClose=` → `Popover.Root open onOpenChange=`.
- JSDoc dos compounds: substituir referências a `isOpen`/`onClose`.

### PR 2 — Select context

- `context/select-context.ts`: renomear três campos.
- `core/select.tsx` / `select.native.tsx`: renomear leituras (~12 hits).
- Não há API pública afetada.

### PR 3 — Checkbox/Radio/ButtonGroup contexts

- 3 arquivos de contexto + leituras nos slots/cores correspondentes.
- Checkbox/Radio: API pública intocada (já era canônica desde R6).
- **ButtonGroup**: a auditoria revelou que `ButtonGroupProps.isDisabled` também é API pública (não apenas o contexto). Migrado para `disabled` no mesmo PR — consumidores externos (`Button`/`button.native` ao ler `groupCtx?.isDisabled`) e tests/stories ajustados.

### PR 4 — Pagination

- `interfaces/PaginationProps.ts`: `isActive?` → `current?`.
- `core/pagination.tsx` / `pagination.native.tsx`: renomear leituras + ajustar `aria-current="page"` quando `current` for true.
- Testes de Pagination: substituir `isActive` por `current`.
- Storybook stories de Pagination: substituir.

### PR 6 — documentação

- `CONTRIBUTING.md` — seção "Naming de props": consolidar 4 convenções da RFC-0013, listar exceção `useDisclosure`.
- `docs/TECH_DEBT.md` — abrir e fechar TD-029 no mesmo ciclo (alinha com TD-012).
- `docs/rfcs/README.md` — adicionar RFC-0030 à tabela de implementadas; nota em RFC-0013 ("complementada por RFC-0030").

---

## Critérios de aceite

- [ ] `grep -rE "\bisOpen\b" src/components` retorna apenas `useDisclosure` e variáveis locais derivadas.
- [ ] `grep -rE "isDisabled|isChecked|isInvalid|isIndeterminate|isActive|isRequired" src/components` retorna 0 hits.
- [ ] Todas as Roots de overlay aceitam `open` + `defaultOpen` + `onOpenChange`; nenhuma aceita `isOpen` ou `onClose` (exceto Toast).
- [ ] `pnpm test` verde (831/831 esperado).
- [ ] `pnpm lint` verde.
- [ ] `pnpm tsc -b` verde.
- [ ] CONTRIBUTING.md documenta as 4 convenções com exemplos.

---

## Impactos

| Eixo | Avaliação |
|---|---|
| Breaking change | **Sim** — Drawer, Tooltip, Popover, Menu, Pagination tocam API pública. Sem aliases (precedente TD-012). |
| Bundle | ~0 (renomeações). |
| Performance | 0. |
| DX | Positivo — overlays passam a ter padrão único; Pagination passa a usar termo a11y-correto (`aria-current`). |
| A11y | Positivo (Pagination). |
| Codemod | Não publicado — varredura interna sem consumidores externos. Próximas releases incluem nota no CHANGELOG. |

---

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **Manter aliases legacy com warning** | TD-012 já fixou o padrão "remoção sem janela" em 2026-04-24; manter aliases agora seria regressão de governança. |
| **Adiar PR 4 (Pagination) para v2** | Custo cumulativo: 1 prop a mais no inventário público, e o componente já tem outra dívida de naming (`first`/`last`/`hideOnSinglePage`). Fechar tudo na mesma janela é mais barato. |
| **Manter `onClose` em paralelo a `onOpenChange`** | Surface area dobrada sem ganho; consumidor não sabe qual usar; `onOpenChange` cobre estritamente o caso de `onClose`. |
| **Renomear `isOpen` em `useDisclosure`** | Custo > benefício: gera aliasing forçado, quebra hook utilizado em ~5 chamadas internas, sem ganho de DX. |
