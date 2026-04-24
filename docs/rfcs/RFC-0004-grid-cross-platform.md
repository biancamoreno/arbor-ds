# RFC-0004 — Grid cross-platform (resolver contrato falso em React Native)

**Status**: Draft
**Autores**: Arquiteto Arbor-DS
**Data**: 2026-04-24
**Origem**: R2 · achado M-R2-6
**PR**: —

---

## Motivação

CSS Grid **não existe em React Native**. O `Grid` web aceita `templateColumns`, `templateAreas`, `autoFlow`, `autoRows`, `autoColumns`, `templateRows`, `gridArea`, `gridColumn`, `gridRow` — mas o `grid.native.tsx` **silenciosamente ignora todas** e renderiza apenas `flexDirection: row, flexWrap: wrap`.

Isso é **a pior combinação possível**:

- DX parece boa (TypeScript não acusa nada).
- Produto quebra silencioso (consumidor escreve `templateColumns="repeat(3, 1fr)"`, vê 3 colunas em web, vê layout aleatório em RN).
- Feedback loop é lento (descoberto só quando alguém abre o app).

`Grid` também é o único primitive de R2 **sem consumidor interno** — nenhum componente do DS o usa hoje. A janela de breaking change é a mais larga possível.

## Proposta

**Opção B (recomendada): definir surface area mínima coerente cross-platform e marcar o resto como web-only via discriminated union.**

```tsx
type GridProps = GridUniversalProps | GridWebOnlyProps;

interface GridUniversalProps {
  /** Número de colunas. Funciona em ambas as plataformas. */
  columns?: number;
  /** Espaço entre células. Aceita token ou valor bruto. */
  gap?: SpacingToken | number;
  /** Espaço horizontal específico. Sobrepõe gap se ambos passados. */
  columnGap?: SpacingToken | number;
  /** Espaço vertical específico. */
  rowGap?: SpacingToken | number;
  children?: ReactNode;
}

interface GridWebOnlyProps extends GridUniversalProps {
  /** @platform web-only — ignorado em React Native */
  templateColumns?: string;
  templateRows?: string;
  templateAreas?: string;
  autoFlow?: 'row' | 'column' | 'dense';
  autoRows?: string;
  autoColumns?: string;
}
```

**Render web:**
- Se `columns` for passado, gera `gridTemplateColumns: repeat(${columns}, 1fr)`.
- Se `templateColumns` for passado, sobrescreve.
- Demais props avançadas funcionam normalmente.

**Render native:**
- `columns` calcula `flexBasis: ${100/columns}%` em cada filho via `React.Children.map` ou contexto.
- `gap`/`columnGap`/`rowGap` mapeiam para `gap` (RN ≥0.71) ou simulam via `marginRight`/`marginBottom` em filhos.
- Props web-only **emitem `console.warn` em dev** quando passadas em `.native.tsx`.

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **Opção A: Grid é apenas web; em RN consumidor usa Flex** | Quebra o princípio "mesma API cross-platform" do DS. |
| Manter contrato falso atual | Perpetua bugs silenciosos em produção. |
| Mover tudo para `Flex` no native sem warn | Não resolve o problema, apenas o esconde. |
| Implementar CSS Grid completo via biblioteca em RN | Custo de bundle e manutenção desproporcional ao uso real. |

## Impactos e trade-offs

- **Breaking change?** Sim — props avançadas viram web-only no tipo. Como nenhum componente interno usa Grid, impacto é apenas em consumidores externos.
- **Impacto em bundle size**: marginal (lógica de cálculo de `flexBasis` para native).
- **Impacto em performance**: leve custo de `React.Children.map` em native — aceitável.
- **Impacto em DX**: melhora drástica — TypeScript acusa diferenças de plataforma; warn dev evita uso errado.
- **Impacto em acessibilidade**: nenhum.
- **Codemod necessário?** Não — props existentes continuam aceitas em web; novo `columns` é aditivo.

## Critérios de aceite

- [ ] `GridProps` definido como discriminated union (universal vs. web-only)
- [ ] `Grid` web suporta `columns` como atalho
- [ ] `Grid` native implementa `columns` + `gap` corretamente
- [ ] `Grid` native emite warn dev quando recebe prop web-only
- [ ] Stories cobrem caso `columns` rodando idêntico em web e native
- [ ] Testes garantem que `flexBasis` é calculado corretamente em native
- [ ] Doc explica claramente quais props funcionam em cada plataforma

## Notas de implementação

- Resolve parcialmente **RFC-0003** (consolidação de aliases) — props `template*` viram web-only e a duplicação `template*` × `gridTemplate*` se restringe a um único caminho.
- Considerar extrair a lógica de cálculo de `flexBasis` para um util (`src/ecosystem/utils/grid-layout.ts`) — pode ser reutilizado por `ButtonGroup` e outros que precisem de equal-width children em native.
- Avaliar conjuntamente com `Container` (que tem lógica responsiva similar baseada em breakpoints) para extrair pattern comum.
