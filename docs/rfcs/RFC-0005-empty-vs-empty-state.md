# RFC-0005 — Destino do componente `Empty`

**Status**: Accepted (parcial — remoção do `Empty`) · Implementada em 2026-04-24
**Autores**: Arquiteto Arbor-DS
**Data**: 2026-04-24
**Origem**: R2 · achado M-R2-5
**PR**: —

---

## Decisão (2026-04-24)

Aceita com **escopo enxuto**:

- ✅ **Remover `Empty`** — componente atual deletado (`src/components/core/empty/`), exports retirados de `src/components/core/index.ts` e `src/native.ts`. Zero consumidores confirmados (grep em `src/`, `playground/`, `docs/`, `stories/` retornou só a própria definição). Sem janela de transição (alinha com TD-012).
- 🔜 **`EmptyState` compound** — segregado em **RFC futura** (não bloqueante). Implementação real é trabalho de fase de UX components, não de cleanup paralelo. A proposta de slots (`Illustration`/`Title`/`Description`/`Actions`), recipe e variantes (`align`/`size`) descrita abaixo permanece como referência para essa RFC futura.

**Critérios de aceite atualizados:**

- [x] `src/components/core/empty/` removido
- [x] Export de `Empty` removido de `src/components/core/index.ts` e `src/native.ts`
- [x] `pnpm test` verde (536/536) · `pnpm typecheck` limpo
- [ ] _Diferido para RFC futura:_ `EmptyState` compound (recipe, slots, stories, testes)
- [ ] _Não aplicável:_ migration guide (zero consumidores)

---

## Motivação

`Empty` é exportado publicamente, ocupa espaço na surface area do DS, mas:

- **Renderiza `null`.** Nenhum estado, nenhuma prop, nenhum slot.
- **Nenhum consumidor interno usa.**
- **Sem JSDoc explicando quando usar.**
- **Nome colide com o padrão de mercado "EmptyState"** (Chakra UI, Radix, Mantine), o que cria expectativa de UI de lista vazia que o componente atual não cumpre.

Três cenários plausíveis para o componente atual:

1. **Sentinela para composição condicional** (`children ?? <Empty />`) — açúcar para `null`, sem valor real.
2. **Slot para frameworks que esperam ReactElement** — caso de nicho.
3. **Empty state UI** (caso real e comum) — o componente atual está errado e deveria ter conteúdo.

A única certeza: o nome está ocupado e o conteúdo não cumpre nenhuma das três promessas.

## Proposta

**Opção C (recomendada): remover `Empty` e introduzir `EmptyState` como compound.**

1. **Remover** `src/components/core/empty/` na próxima major. Sem deprecation gradual — não há consumidor.

2. **Introduzir `EmptyState` em `src/components/empty-state/`** (fora de `core/` — é componente de UI, não primitivo).

```tsx
<EmptyState>
  <EmptyState.Illustration>
    <Icon name="inbox" size="xl" />
  </EmptyState.Illustration>
  <EmptyState.Title>Sem mensagens</EmptyState.Title>
  <EmptyState.Description>
    Você não tem mensagens não lidas no momento.
  </EmptyState.Description>
  <EmptyState.Actions>
    <Button variant="primary" onClick={refresh}>Atualizar</Button>
  </EmptyState.Actions>
</EmptyState>
```

Sub-slots: `Illustration`, `Title`, `Description`, `Actions` — todos opcionais.

Variantes: `align?: 'center' | 'start'` (default `center`), `size?: 'sm' | 'md' | 'lg'`.

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **Opção A: Renomear `Empty` para `Nothing`/`Void`** | Nome menos colidente, mas componente continua sem propósito real. |
| **Opção B: Manter `Empty` como `null` e documentar** | Não resolve a colisão de nome com expectativa de "EmptyState". |
| Substituir por constante (`export const EMPTY = null`) | Pior DX que `null` direto, sem ganho. |
| Atrasar decisão | Mantém superfície poluída sem benefício. |

## Impactos e trade-offs

- **Breaking change?** Sim — remoção do `Empty` atual. Mitigação: nenhum consumidor confirmado, então impacto provavelmente zero em produção. Quem precisar continuar com `null`, usa `null` direto.
- **Impacto em bundle size**: redução (remove `Empty`); aumento controlado com `EmptyState` (~1-2 kB).
- **Impacto em performance**: nenhum.
- **Impacto em DX**: melhora — `EmptyState` cumpre expectativa do nome; `Empty` deixa de poluir autocomplete.
- **Impacto em acessibilidade**: melhora — `EmptyState` pode incluir `role="status"` ou `aria-live` para anunciar transição "carregando" → "vazio".
- **Codemod necessário?** Não. (Se aparecer consumidor de `Empty`, codemod trivial: substitui por `null`.)

## Critérios de aceite

- [ ] `src/components/core/empty/` removido
- [ ] Export de `Empty` removido de `src/components/core/index.ts` e `src/components/index.ts`
- [ ] `EmptyState` implementado como compound em `src/components/empty-state/`
- [ ] Recipe `emptyState` adicionada ao `base-theme.ts` com variantes `align` e `size`
- [ ] Stories cobrem: default, com ilustração, sem ação, alinhamento à esquerda, todos os tamanhos
- [ ] Testes cobrem: renderização de slots, ausência de slots opcionais, a11y de `role="status"`
- [ ] Migration guide curtíssimo em `docs/migration/`

## Notas de implementação

- `EmptyState` é UI de produto, não primitivo — fica fora de `src/components/core/`.
- Considerar adicionar prop `loading?: boolean` que troca o conteúdo por `<Spinner>` automaticamente — mas avaliar se isso é responsabilidade do componente ou do consumidor.
- Padrão de slots como `EmptyState.Title` precisa estabelecer convenção em CONTRIBUTING (já parcialmente seguido por `Card`, `Dialog`, `Drawer`, `Field`).
- Avaliar reuso de `Icon` para `Illustration` ou se `Illustration` deve aceitar `ReactNode` arbitrário (ex: SVG customizado de produto). Recomendação: aceitar `ReactNode`.
