# RFC-0006 — Consolidar `isTruncated` e `numberOfLines` em `Text`

**Status**: Accepted · Implementada em 2026-04-24
**Autores**: Arquiteto Arbor-DS
**Data**: 2026-04-24
**Origem**: R3 · achado em `text.md`
**PR**: —

---

## Decisão (2026-04-24)

Aceita com **escopo expandido** — a varredura encontrou tentáculos órfãos do mesmo gap em `TypographyProps` (engine), removidos no mesmo commit para evitar drift entre Text e o styled-system base.

**Mudanças aplicadas:**

- ✅ `isTruncated` removida de `TextProps` (`src/components/core/text/interfaces/TextProps.ts`).
- ✅ Destructuring `isTruncated: _isTruncated` removido de `text.tsx`.
- ✅ JSDoc adicionado em `numberOfLines` cobrindo cenário de single-line truncate e paridade React Native.
- ✅ **Engine cleanup:** `isTruncated` e `noOfLines` (também órfão) removidas de `TypographyProps` em `src/ecosystem/styled-system/system/props/typography.ts` — nenhum consumidor real, nenhum lugar do engine consumia essas props.
- ✅ Sem alias legacy, sem janela de transição (alinha com TD-012). Zero consumidores reais — verificado por grep em `src/`, `playground/`, `stories/`.
- ✅ **Codemod não publicado** — sem consumidores externos.

**Critérios de aceite:**

- [x] `isTruncated` removido de `TextProps` e `TypographyProps`
- [x] `noOfLines` órfão removido de `TypographyProps`
- [x] JSDoc em `numberOfLines` com paridade RN documentada
- [x] `pnpm test` verde (536/536) · `pnpm typecheck` limpo
- [ ] _Diferido:_ Story dedicada para `numberOfLines={1}` e `numberOfLines={3}` (R3 follow-up — entra no batch de stories ausentes)
- [ ] _Diferido:_ Teste cobrindo truncamento (R3 follow-up — entra no batch de testes ausentes em Text)

---

## Motivação

`TextProps` declara `isTruncated?: boolean` na interface, mas a implementação **descarta a prop** (`text.tsx:7` extrai como `_isTruncated`). Apenas `numberOfLines?: number` é honrado.

Resultado: contrato público inflado e enganoso.

- Consumidor lê `isTruncated` no autocomplete e assume comportamento.
- Em runtime, nada acontece.
- Quem precisar truncar em 1 linha hoje precisa passar `numberOfLines={1}` — **menos legível** que `isTruncated`, **mais propenso a magic number**.

Padrões da comunidade (React Native, Chakra UI) usam **um dos dois** modelos, raramente ambos:

- React Native: só `numberOfLines` (boolean implícito quando `1`).
- Chakra UI: `isTruncated` (boolean) + `noOfLines` (number).

Coexistência sem definição é o pior dos mundos: dois contratos sobrepostos sem clareza de precedência.

## Proposta

**Eleger `numberOfLines` como API canônica única.** Remover `isTruncated` como prop.

```tsx
// Antes
<Text isTruncated>One liner</Text>          // ❌ não funciona
<Text numberOfLines={1}>One liner</Text>    // ✅ funciona

// Depois
<Text numberOfLines={1}>One liner</Text>    // ✅ canônico
```

Justificativa:

- Alinha com React Native (paridade cross-platform — RN não tem `isTruncated`).
- Um número único cobre os dois casos (1 linha = `numberOfLines={1}`, N linhas = `numberOfLines={N}`).
- Elimina a ambiguidade "o que ganha se passar ambos?".

**Não-objetivos:** não introduzir novos modos de truncamento (por largura, por sufixo customizado, etc.). Esses ficam para RFC futura se houver demanda.

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| Implementar `isTruncated` e manter ambos | Duplica API, exige resolver precedência, perpetua confusão. |
| Manter `isTruncated` e remover `numberOfLines` | Quebra paridade com React Native, perde flexibilidade multilinhas. |
| Adicionar prop `truncate?: 'single' \| 'multi'` | Mais um conceito sem ganho real sobre `numberOfLines`. |

## Impactos e trade-offs

- **Breaking change?** Sim, no tipo (remove `isTruncated`). Em runtime, **nenhum comportamento muda** — a prop nunca funcionou.
- **Impacto em bundle size**: zero.
- **Impacto em performance**: zero.
- **Impacto em DX**: melhora — uma única forma de truncar.
- **Impacto em acessibilidade**: nenhum (truncamento visual já era ARIA-neutro).
- **Codemod necessário?** Sim — converte `isTruncated` em `numberOfLines={1}`.

## Critérios de aceite

- [ ] `isTruncated` removido de `TextProps`
- [ ] Documentação no JSDoc de `numberOfLines` cobrindo cenário 1-linha
- [ ] Story para `numberOfLines={1}` e `numberOfLines={3}` com conteúdo longo
- [ ] Teste cobrindo truncamento com diferentes valores
- [ ] Codemod publicado
- [ ] Migration guide com exemplo direto

## Notas de implementação

- A implementação atual (`truncatedProps` em `text.tsx:24`) usa `WebKit*` props via escape hatch `style={{}}` — manter como está (é o único caminho cross-browser para line-clamp). Adicionar comentário curto explicando.
- Em `text.native.tsx`, `numberOfLines` mapeia direto para a prop nativa de mesmo nome — paridade trivial.
- Avaliar futuro `RFC` para `tail?: string` (sufixo customizado em vez de `…`) se houver demanda.
