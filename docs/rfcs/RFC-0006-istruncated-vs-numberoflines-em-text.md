# RFC-0006 — Consolidar `isTruncated` e `numberOfLines` em `Text`

**Status**: Draft
**Autores**: Arquiteto Arbor-DS
**Data**: 2026-04-24
**Origem**: R3 · achado em `text.md`
**PR**: —

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
