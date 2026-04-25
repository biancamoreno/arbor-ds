# RFCs — Arbor-DS

Registros formais de mudanças sistêmicas ou que envolvem breaking changes. Cada RFC tem o próprio arquivo (`RFC-XXXX-slug.md`) e segue o [`RFC-0000-template.md`](./RFC-0000-template.md).

Para issues localizadas (sem breaking), abrir GitHub Issue. Para fixes triviais, ir direto ao PR.

Ver [`docs/reviews/_followups.md`](../reviews/_followups.md) para o índice acionável de issues + RFCs pendentes.

---

## RFCs abertas (Draft)

| ID | Título | Origem | Status |
|---|---|---|---|
| [RFC-0003](./RFC-0003-consolidacao-aliases-de-props.md) | Consolidação de aliases de props | R1 + R2 | Draft |
| [RFC-0004](./RFC-0004-grid-cross-platform.md) | `Grid` cross-platform | R2 | Draft |
| [RFC-0005](./RFC-0005-empty-vs-empty-state.md) | Destino do componente `Empty` | R2 | Draft |
| [RFC-0006](./RFC-0006-istruncated-vs-numberoflines-em-text.md) | Consolidar `isTruncated` e `numberOfLines` em `Text` | R3 | Draft |
| [RFC-0007](./RFC-0007-tipagem-generica-de-userecipe.md) | Tipagem genérica do retorno de `useRecipe` | R3 | Draft |
| [RFC-0011](./RFC-0011-modo-de-renderizacao-explicito-em-image.md) | Modo de renderização explícito em `Image` | R3 | Draft |
| [RFC-0012](./RFC-0012-loading-e-error-states-em-image.md) | Estados de loading/error em `Image` | R3 | Draft |

---

## RFCs implementadas

| ID | Título | Origem | Aceita em | Implementada em | Notas |
|---|---|---|---|---|---|
| [RFC-0001](./RFC-0001-ref-canonico-em-primitives.md) | `ref` canônico em primitives | R2 | 2026-04-24 | 2026-04-24 | `forwardRef` em 11 primitives + Image (web/native). `innerRef` legado mantido com fallback. |
| [RFC-0002](./RFC-0002-genericos-em-primitives.md) | Genéricos `<T>` em primitives | R2 | 2026-04-24 | 2026-04-24 | Removido `<T extends object>` em Box/Flex/Grid/Center/Square/Circle. Casts `as typeof` removidos. |
| [RFC-0008](./RFC-0008-tapstate-prop-vs-slot-em-clickable.md) | `tapState` prop vs. slot em `Clickable` | R3 | 2026-04-24 | 2026-04-24 | `PressFeedback` em `core/press-feedback/`. `tapState` removido, dead code limpo. TapState antigo deletado. Dev warning a11y adicionado. |
| [RFC-0009](./RFC-0009-tamanhos-semanticos-em-icon.md) | Tamanhos semânticos para `Icon.size` | R3 | 2026-04-24 | 2026-04-24 | Token `iconSize` (xs/sm/md/lg/xl/hero). `IconSize = IconSizeToken \| number` (escape hatch mantido). 8 consumidores migrados. |
| [RFC-0010](./RFC-0010-discriminated-union-decorative-em-icon.md) | Discriminated union `decorative` em `Icon` | R3 | 2026-04-24 | 2026-04-24 | `IconProps` como union: `decorative` discrimina obrigatoriedade de `aria-label`. Warning runtime substituído por compile-time error. |
| [RFC-0013](./RFC-0013-convencao-naming-de-props-booleanas.md) | Convenção de naming de props booleanas | R5 — gate R6 | 2026-04-24 | 2026-04-24 | API canônica sem `is*` em `Field`/`Dialog`/contexto Accordion. Aliases legados (`isDisabled`/`isRequired`/`isInvalid`/`isOpen`) aceitos com `console.warn` em dev. Todos consumidores internos migrados. |
| [RFC-0014](./RFC-0014-contrato-canonico-field-aware-components.md) | Contrato canônico `Field.Control` × Field-aware components | R5 — gate R6 | 2026-04-24 | 2026-04-24 | Registry em `FieldContext` (`descriptionRegistered`/`errorRegistered`); slots registram em `useEffect`; `Field.Control` detecta marker `isFieldAware` via `markFieldAware()`; família Input + R6 (Checkbox/Radio/Switch/Select) todos Field-aware. Fecha TD-011. |
| [RFC-0015](./RFC-0015-convencao-naming-de-eventos.md) | Convenção de naming de eventos `on{Verbo}Change` (value-only) | R5 — gate R6 | 2026-04-24 | 2026-04-24 | `Checkbox`/`Switch` usam `onCheckedChange`; `Counter` usa `onValueChange`; `Radio`/`RadioCard` ajustaram assinatura para `(checked)` (sem `value`). Sem alias legacy (alinha com TD-012). 536/536 testes verdes. |

## RFCs rejeitadas

(nenhuma ainda)

---

## Como propor uma RFC

1. Copiar [`RFC-0000-template.md`](./RFC-0000-template.md) para `RFC-NNNN-slug.md` (próximo número disponível).
2. Preencher o template — Motivação, Proposta, Alternativas, Impactos, Critérios de aceite.
3. Abrir PR com o documento. Discussão acontece nos comentários do PR.
4. Após decisão (Accepted / Rejected), atualizar a tabela acima e o `Status` no documento.
5. Se Accepted, abrir PRs de implementação referenciando a RFC.
