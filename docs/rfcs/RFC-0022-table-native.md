# RFC-0022 — Table cross-platform

**Status**: Accepted — 2026-04-28 (implementada)
**Autores**: @bia
**Data**: 2026-04-28

**Origem**: TD-017 (1 web-only restante: `Table`) + fechamento do ciclo iniciado pela RFC-0018 (paridade native completa). Última família restante após Button (RFC-0021).

---

## Motivação

`Table` é o último componente em `@platform web-only`. Enquanto isso for verdade:

- TD-017 não fecha — a diretriz "DS é cross-platform por definição" tem uma exceção viva.
- `scripts/check-platform-contract.js --strict` continua dependendo de allowlist para 1 caso.
- App mobile que precisa exibir dados tabulares (dashboards internos, tablet, relatórios densos) cai fora do DS — repete a história pré-RFC-0018: `View`/`Text` cru com layout reinventado inline.

A dificuldade real é que Table HTML não tem equivalente direto em React Native. `<table>/<thead>/<tbody>/<tr>/<td>/<th>` não existem. `borderCollapse`, `verticalAlign`, `whiteSpace: nowrap`, `overflow-x: auto`, `scope="col"`, `colSpan`/`rowSpan` — nada disso atravessa a ponte sem tradução. E `accessibilityRole` em RN **não suporta** `'table'`/`'row'`/`'cell'`/`'columnheader'` no conjunto core; forçar isso gera warning.

Este RFC define a estratégia para fechar TD-017 sem inflar surface area nem prometer semântica que a plataforma não entrega.

## Decisão

**Caminho B (paridade enxuta, sem reflow):** componente `.native.tsx` que reusa `Box`/`Flex` (e `ScrollView` via adapter interno se necessário) com **API compound idêntica** à versão web. Mesmo padrão consagrado pela RFC-0021 (Button): tipo único, sub-componentes especializados por plataforma, props DOM-only ignoradas silenciosamente em native.

### Por que não as alternativas

| Alternativa | Por que descartar |
|---|---|
| **A) Manter `web-only` oficial** | Contradiz a diretriz arquitetural já estabelecida. Mantém TD-017 vivo. Recusa de problema, não solução. |
| **C) Substituir Table por `DataList` cross-platform e remover Table** | Quebra API pública adotada (suíte de testes consome `Table.Head/Body/Row/Cell/HeaderCell`). Valor incremental zero — `DataList` ainda precisaria do mesmo pensamento. |
| **D) Reflow automático para lista de cards em mobile** | Escopo enorme, decisões de produto (qual coluna vira título? qual vira metadata?). Vira `Table` virando ORM. Escopo separado. |
| **E) Native vira `ScrollView` + `FlatList`** | Quebra paridade visual em tablet (onde a tabela cabe). Mistura "como exibir" com "qual o componente". |

### Não-escopo desta RFC

- Reflow automático tabela → cards em telas estreitas (RFC futura: `Table.layout='stack' | 'table'`).
- Virtualization via `FlatList` (RFC futura: `Table.virtualized`).
- Sorting embutido.
- Pagination embutida.
- Selectable rows / `Table.Row.selected`.
- Sticky header.
- `colSpan`/`rowSpan` em native.
- A11y de tabela completa em native (limite real da plataforma — documentado, não escondido).
- Refatorar `TableProps` para tirar `extends TableHTMLAttributes` — mesmo padrão da Tag (onda 5) e do Button (RFC-0021): `.native.tsx` faz `{...(props as object)}` para silenciar tipos DOM-only. Mudança maior fica para uma RFC dedicada de tipagem cross-platform.

## API

`TableProps` permanece **único e intacto**:

```ts
/**
 * @platform native-ready
 * Tabela semântica minimal. Sem sorting/paginação embutidos.
 * Em native: layout columnar com Flex; sem reflow para cards (use composição manual).
 */
export interface TableRootProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  /** Adiciona scroll horizontal quando o conteúdo excede o container */
  scrollable?: boolean;
}

export interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> { children: ReactNode; }
export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> { children: ReactNode; }
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> { children: ReactNode; }
export interface TableCellProps extends TdHTMLAttributes<HTMLTableDataCellElement> { children?: ReactNode; }
export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableHeaderCellElement> { children?: ReactNode; }
```

Comportamento por plataforma:

| Slot | Web | Native |
|---|---|---|
| `Table` (root) | `<Box as="table">` + opcional wrapper `<Box>` com `overflowX:auto` quando `scrollable` | `<Flex direction="column">`; se `scrollable`, envolto em adapter `ScrollView horizontal` |
| `Table.Head` | `<Box as="thead">` + `borderBottom: 2px` | `<Flex direction="column">` + `borderBottomWidth: 2` no Row interno |
| `Table.Body` | `<Box as="tbody">` | `<Flex direction="column">` |
| `Table.Row` | `<Box as="tr">` + `borderBottom: 1px subtle` | `<Flex direction="row">` + `borderBottomWidth: 1` |
| `Table.Cell` | `<Box as="td">` + padding + `verticalAlign: middle` | `<Flex flex={1} alignItems="center">` + padding |
| `Table.HeaderCell` | `<Box as="th" scope="col">` + bold + `whiteSpace: nowrap` | `<Flex flex={1} alignItems="center">` + bold + `accessibilityRole="header"` |

Props DOM-only que ficam **no-op silencioso** em native:

| Prop | Web | Native |
|---|---|---|
| `colSpan` / `rowSpan` | aplicado | no-op (Flex não tem grid span) |
| `scope="col\|row"` | aplicado no `<th>` | no-op |
| `summary` | aceito | no-op |
| `aria-*` | aplicado | filtrado pelo engine native (TD-019) |

## Bordas em native — evitar duplicação

Native não tem `border-collapse`. Padrão idêntico ao já tolerado em `ButtonGroup attached` (RFC-0021):

- `Row.Body`: `borderBottomWidth: 1` em `border.subtle`.
- Último `Row` do `Head`: `borderBottomWidth: 2` em `border.default`.
- `Cell`/`HeaderCell`: sem borda lateral por default — fica visualmente equivalente ao `border-collapse` web.

Se algum consumidor precisar de grade vertical, prop `divided?: 'rows' | 'all' | 'none'` (default `'rows'`) — **fora do escopo** desta RFC se não houver caso real. Mantém escopo enxuto.

## Scroll horizontal em native — bridge para `ScrollView`

`ScrollView` é primitiva RN; o CLAUDE.md proíbe uso direto em components. Caminho preferido (a validar no spike):

- `<Box as={ScrollView} horizontal>` — segue o mesmo idioma do `Box as="img"` em web.
- Fallback: criar primitivo interno `ScrollContainer` em `ecosystem/styled-system/core/styled/` (não-exportado), padrão idêntico ao `PressFeedback` da onda 1.

Validação ocorre no passo 1 do plano de execução (spike).

## Acessibilidade

**Web:** sem regressão. Semântica `<table>/<thead>/<tbody>/<tr>/<td>/<th scope="col">` mantida; roles `role='table'/'rowgroup'/'row'/'columnheader'` herdados pelos elementos. `whiteSpace: nowrap` no HeaderCell preservado.

**Native:** limitação real da plataforma documentada explicitamente:

- Root: sem `accessibilityRole` (não existe `'table'`). `accessibilityLabel` opcional do consumidor.
- HeaderCell: `accessibilityRole='header'` (suportado em RN). Bold visual.
- Row/Cell: sem role (RN core não tem `'row'`/`'cell'`).
- Leitor de tela em RN não anuncia "linha 2 de 5, coluna Nome". Documentar em stories e JSDoc.

**Touch target:** cells por default não são interativas — TD-016 não se aplica. Se o consumidor compõe `Clickable` dentro de `Table.Cell`, herda os 44×44 do `Clickable`.

## Performance

- **Web:** zero mudança.
- **Native:** `Flex column` aninhando `Flex row` é O(n) sobre `rows × cells`. Para tabelas grandes (>50 rows × 5 cols), virar `FlatList` é desejável — RFC futura `Table.virtualized`.
- **Bundle:** +1 arquivo `.native.tsx` (~80 linhas), neutro (tree-shaken em web).

## Estrutura

```
src/components/table/core/
  table.tsx                # web — sem mudança funcional
  table.native.tsx         # NOVO
  table.test.tsx
  table.native.test.tsx    # NOVO
src/components/table/interfaces/
  TableProps.ts            # JSDoc: web-only → native-ready
src/native.ts              # adiciona Table + tipos
```

## Estratégia cross-platform

| Camada | Compartilhado | Específico |
|---|---|---|
| API pública (`TableProps`) | 100% | — |
| Tokens (`border.default`, `border.subtle`, `text.primary/secondary`) | 100% | — |
| Padding/spacing | 100% (mesmas chaves) | — |
| Lógica de scroll | 0% | tudo |
| Bordas | spec idêntica, render diferente | ver §Bordas |
| `colSpan`/`scope` | aceitos em ambos | só web aplica |

## Riscos e mitigação

| Risco | Mitigação |
|---|---|
| `Box as={ScrollView}` não funciona no engine native | Spike no passo 1. Fallback: `ScrollContainer` interno. |
| Tabelas largas em mobile pequeno cortam conteúdo | Documentar em stories; recomendar `scrollable` por default em native. |
| Consumidor depende de `colSpan`/`scope` em native | RFC declara no-op explícito. Se aparecer caso real, vira RFC própria. |
| Drift visual entre web (`borderCollapse`) e native (sem) | Aceito. Sub-pixel; mesmo padrão do ButtonGroup attached. |
| Testes `.native` quebram ao usar `getByRole('table')` | Suíte native usa `getByText`/`testID`, não roles de tabela. |
| `verticalAlign`/`whiteSpace` no engine native | Filtrados pelo `systemBlockedPropsByPlatform` (TD-019). Native usa `alignItems="center"` + `numberOfLines={1}` se necessário. |

## Plano de execução

1. **Spike (15 min):** validar `<Box as={ScrollView} horizontal>` no native. Se OK, segue. Se não, criar `ScrollContainer` interno em `ecosystem/styled-system/core/styled/`.
2. Trocar `@platform web-only` → `@platform native-ready` em `interfaces/TableProps.ts`.
3. Criar `table.native.tsx` (Caminho B — sem reflow, sem `divided`).
4. Criar `table.native.test.tsx` — paridade com a suíte web no que é aplicável (render de Head/Body/Row/Cell/HeaderCell, `scrollable=true`, className extra). Ignorar casos que dependem de `role='table'`/`role='columnheader'`/`scope="col"` (limitação documentada).
5. Adicionar `Table` + tipos públicos a `src/native.ts`.
6. `pnpm test` (web + native multi-project).
7. `node scripts/check-platform-contract.js --strict` — deve sair limpo, **com `web-only` global em 0**. Remover allowlist de Table se existir.
8. Atualizar `Table.stories.tsx` com seção "Limitações em native".
9. Fechar TD-017 → `Resolved (data)`. Atualizar visão geral em `docs/TECH_DEBT.md`.
10. Atualizar memória do projeto (`project_rfc_0022.md` + linha em `MEMORY.md`).

## Critérios de aceite

- [ ] `table.native.tsx` existe e renderiza em RN sem warnings.
- [ ] `table.native.test.tsx` com 6+ casos verdes (render de cada slot, `scrollable`, HeaderCell com `accessibilityRole='header'`).
- [ ] Suíte web continua verde (zero regressão funcional).
- [ ] `check-platform-contract --strict` verde, com `web-only` global em **0**.
- [ ] `Table` exportado em `src/native.ts`.
- [ ] TD-017 marcado `Resolved`.
- [ ] JSDoc de `TableProps` em `native-ready` com seção "Limitações em native".
- [ ] Stories atualizadas com nota cross-platform.
