# Review — `Grid`

**Fase:** R2 · **Camada:** `core` · **Status:** `concluído`
**Revisor:** arquiteto · **Data:** 2026-04-22 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/core/grid/core/grid.tsx`, `src/components/core/grid/core/grid.native.tsx`
- **Story:** `src/components/core/grid/core/grid.stories.tsx`
- **Testes:** **ausentes**.
- **Implementação nativa:** ✅ presente (`.native.tsx`) — **fallback para `flex-wrap row`** (CSS Grid não existe em React Native).
- **Classificação cross-platform:** `platform-split`.
- **Dependências internas:** `ArborTransform`.
- **Consumidores conhecidos:** nenhum componente interno usa Grid. **Uso exclusivo externo** (playground, consumidores da lib).

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | N/A | Sem variantes. |
| 1.2 | Tokens usados são semânticos (sem valores crus) | ❌ | Stories passam `columnGap={16}` e `rowGap={16}` como números absolutos (não tokens), e os `<Cell>` internos usam `style={{ padding: 16, background: '#4a90e2', ... }}`. |
| 1.3–1.8 | — | N/A | — |

**Observações livres:** `<Cell>` demo usa `<div style={{...}}>` — reforça anti-pattern no próprio DS.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1–2.8 | — | N/A | Estrutural. |

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API pública mínima; sem props redundantes | ⚠️ | Grid re-expõe 11 props do sistema (`templateColumns`, `columnGap`, `rowGap`, `row`, `column`, `area`, `autoFlow`, `autoRows`, `autoColumns`, `templateRows`, `templateAreas`) apenas para mapeá-las para nomes CSS completos (`grid-template-columns`, `grid-column-gap`, ...). **Duplicação** — o `ArborTransform` já aceita essas props diretamente (elas estão em `grid.ts`), então o Grid só as renomeia para as CSS originais. |
| 3.2 | Nomes seguem convenção | ⚠️ | `autoFlow`/`gridAutoFlow` — mesmo problema estrutural do `flexDir`/`flexDirection`. |
| 3.3 | Defaults | N/A | Sem defaults. |
| 3.4 | Combinações inválidas bloqueadas | N/A | — |
| 3.5 | Polimorfismo via `as` | ✅ | Passthrough. |
| 3.6 | `forwardRef` + `displayName` | ❌ | Ausente. |
| 3.7 | Compound | N/A | — |
| 3.8 | Tipos exportados | ❌ | **`GridProps` não existe** — o componente usa `ArborTransformProps<T>` direto. Grid **não tem pasta `interfaces/`**. |

**Surface area atual:**

```ts
export function Grid<T extends object>(props: ArborTransformProps<T>)
```

**Observações livres:**

- A tradução manual das props (`gridTemplateColumns={props.templateColumns}` etc.) só tem valor se existe uma razão semântica para renomeá-las. Como `ArborTransformProps` já aceita tanto `templateColumns` quanto `gridTemplateColumns`, o Grid é essencialmente um **no-op de remapping** — custo cognitivo sem ganho.
- `.native.tsx` renderiza `flex-wrap row` — razoável, mas **silenciosamente ignora todas as props de grid** (`templateColumns`, `area`, etc.). Em RN, passar `templateColumns="repeat(3,1fr)"` é um contrato falso: o componente aceita no tipo e descarta na execução. Precisa de doc clara ou de **prop de fallback explícita** (ex: `columns?: number` que funciona cross-platform).
- **Sem `React.memo`** como Box/Flex — inconsistente.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ⚠️ | Source OK; stories usam `<div>` interno. |
| 4.2 | Sem `style={{...}}` onde há prop declarativa | ❌ | Stories usam `style={{ width: '100%' }}`, `style={{ padding, background, ... }}`. |
| 4.3 | Estrutura de pasta aplicada | ⚠️ | **Sem `interfaces/`** — Grid é o único primitive de R2 sem arquivo de props dedicado. |
| 4.4 | Recipes | N/A | — |
| 4.5 | Sem `any`, cast injustificado | ✅ | Limpo. |
| 4.6 | Testes | ❌ | Zero. |
| 4.7 | Stories | ⚠️ | 2 stories (3 colunas, 2 colunas). **Faltam:** auto-flow, template areas, grid column/row span, fallback native (mesma story rodando em RN dá resultado diferente — precisa doc). |
| 4.8 | `.native.tsx` presente (se universal) ou platform-split justificado | ⚠️ | Presente, mas **a divergência de capacidades não está documentada**. Doc inline só diz "equivalente funcional sem CSS grid" — simplifica demais. |
| 4.9 | Imports respeitam camadas | ✅ | — |

**Métricas rápidas:**

- LOC (web): **26** · (native): **5**
- Nº de testes: **0**
- Nº de stories: **2**
- Dependências externas de runtime: **0**

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público em `src/components/index.ts` | ✅ | |
| 5.2 | Tipos públicos exportados | ❌ | `GridProps` inexistente. |
| 5.3 | Changeset entry | N/A | |
| 5.4 | RFC para breaking change | N/A | |
| 5.5 | Guia de migração | N/A | |

---

## 6. Resumo executivo

**Score por eixo:** Visual `0/8` · Comportamental `—` · Funcional `3/8` · Código `2/9` · Governança `1/5`

**Top 3 achados (por impacto):**

1. **Contrato falso no native.** Grid aceita props de CSS Grid que não têm efeito em RN. Consumidor escreve `templateColumns="repeat(3,1fr)"`, vê 3 colunas na web, e em RN vê flex-wrap genérico. Precisa ou de **API equivalente cross-platform** (ex: `columns: number` tratado nos dois renderers) ou de **restrição de tipo por plataforma**.
2. **Sem tipo `GridProps` exportado.** Consumidor que queira estender Grid precisa importar `ArborTransformProps` da camada ecosystem — fere encapsulamento.
3. **Renaming de 11 props** sem valor semântico adicional. Ou consolidar na engine (aceitar ambos os nomes no props system), ou justificar a renomeação.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores (listados abaixo)
- [ ] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] Criar `src/components/core/grid/interfaces/GridProps.ts` + export em `index.ts`.
- [ ] Reescrever `grid.stories.tsx` usando `<Box>` em vez de `<div>` e props declarativas em vez de `style`.

### Issue

- [ ] Adicionar testes básicos (web e native — dois ambientes).
- [ ] Documentar no JSDoc de `Grid` a lista de props ignoradas em native e sugerir alternativa.
- [ ] Avaliar adicionar prop cross-platform `columns?: number` que funciona tanto como `grid-template-columns: repeat(n, 1fr)` na web quanto como *flex-basis* derivado em RN.
- [ ] Adicionar `displayName`.

### RFC

- [ ] **RFC — Grid cross-platform.** Definir surface area mínima de Grid que seja coerente nos dois renderers. Opção A: Grid é apenas web, RN usa Flex explicitamente. Opção B: Grid expõe API semântica limitada (`columns: number | string`, `gap`) que ambos suportam, e props avançadas de CSS Grid são web-only via union discriminada.

---

## 8. Notas de arquiteto

- Grid é um dos componentes em que a promessa "universal" é mais **frágil**. CSS Grid em RN não existe, e colar `flex-wrap` como fallback é coerente só para casos triviais. Ou o DS **assume limites** (Grid é web-first; em RN é um alias restrito) ou **modela explicitamente** a API semântica mínima.
- O padrão atual — tipar como se funcionasse em ambos e divergir em runtime — é a pior combinação: DX parece boa, produto quebra silencioso.
- Como **nenhum componente interno consome Grid**, há janela de refactor barata: breaking change impacta apenas consumidores externos da lib e playground.
