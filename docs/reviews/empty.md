# Review — `Empty`

**Fase:** R2 · **Camada:** `core` · **Status:** `concluído`
**Revisor:** arquiteto · **Data:** 2026-04-22 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/core/empty/core/empty.tsx`
- **Story:** **ausente**.
- **Testes:** **ausentes**.
- **Implementação nativa:** não aplicável — `Empty` retorna `null`.
- **Classificação cross-platform:** `universal` (null é universal).
- **Dependências internas:** nenhuma.
- **Consumidores conhecidos:** nenhum.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1–1.8 | — | N/A | Renderiza null. |

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1–2.8 | — | N/A | Não renderiza nada. |

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API pública mínima; sem props redundantes | ⚠️ | Sem props nenhuma. Ambíguo: é um slot placeholder? Um sentinela para `children` condicional? A implementação atual não tem propósito claro além de "retornar null". |
| 3.2 | Nomes seguem convenção | ✅ | |
| 3.3 | Defaults "least surprise" | N/A | |
| 3.4 | Combinações inválidas | N/A | |
| 3.5 | Polimorfismo via `as` | N/A | |
| 3.6 | `forwardRef` + `displayName` | N/A | Não faz sentido em um componente que renderiza null. |
| 3.7 | Compound | N/A | |
| 3.8 | Tipos exportados | N/A | Sem props. |

**Surface area atual:**

```ts
export function Empty() {
  return null;
}
```

**Observações livres:**

- **Propósito indefinido.** A JSDoc diz "Renderiza null — sem dependências de plataforma" — não explica *quando* usar. Há três cenários plausíveis:
  1. **Empty state UI** (tela vazia com ilustração + texto) — neste caso o componente atual está errado e deveria ter conteúdo.
  2. **Sentinela para composição condicional** (ex: usar em `children ?? <Empty />`) — neste caso é apenas açúcar semântico para `null`, sem valor real.
  3. **Slot explícito para frameworks que esperam um ReactElement** (ex: alguns contextos de React.Children) — caso legítimo, mas muito de nicho.
- Nenhum consumidor interno usa, o que sugere que o componente foi criado em antecipação a um caso (1) que não se materializou.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | |
| 4.2 | Sem `style={{...}}` | ✅ | |
| 4.3 | Estrutura de pasta | ⚠️ | `core/` só; sem `interfaces/`. OK para 2 LOC, mas inconsistente com os outros primitives. |
| 4.4 | Recipes | N/A | |
| 4.5 | Sem `any`, cast injustificado | ✅ | |
| 4.6 | Testes | ❌ | Zero. (trivial, mas ausente.) |
| 4.7 | Stories | ❌ | Zero. |
| 4.8 | `.native.tsx` | ✅ | Não necessário. |
| 4.9 | Imports respeitam camadas | ✅ | |

**Métricas rápidas:**

- LOC: **2** (função)
- Nº de testes: **0**
- Nº de stories: **0**
- Dependências externas de runtime: **0**

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público em `src/components/index.ts` | ✅ | Exportado. |
| 5.2 | Tipos públicos exportados | N/A | |
| 5.3 | Changeset entry | N/A | |
| 5.4 | RFC para breaking change | N/A | |
| 5.5 | Guia de migração | N/A | |

---

## 6. Resumo executivo

**Score por eixo:** Visual `—` · Comportamental `—` · Funcional `1/8` · Código `5/9` · Governança `1/5`

**Top 3 achados (por impacto):**

1. **Propósito não-declarado.** Componente exportado publicamente sem doc de uso, sem caso real, sem consumidor. Três cenários plausíveis, nenhum confirmado.
2. **Nome colide com padrão de UI comum ("empty state")** — consumidor externo pode presumir que `Empty` é um empty-state widget e cair em surpresa.
3. **Se o plano é suportar empty state real** (ilustração + título + CTA), `Empty` deveria ser um compound (Empty.Illustration, Empty.Title, Empty.Body, Empty.Action). Hoje é só `null`.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [ ] ⚠️ Aprovado com fixes menores
- [x] ❌ Requer mudanças antes da próxima release (decidir o destino do componente)

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] Nenhum — a decisão precisa ser de arquitetura.

### Issue

- [ ] **Decidir destino do Empty:** (a) remover; (b) renomear para `Nothing`/`Void` se a intenção for sentinela; (c) reimplementar como compound de empty-state UI.

### RFC

- [ ] **RFC — `Empty`/`EmptyState`.** Se houver demanda real de produto para empty-state UI (listagens vazias, buscas sem resultado), criar um componente de empty-state com slots (`icon`, `title`, `description`, `action`) e **remover o `Empty` atual**. Alinha com padrões do Chakra UI (`EmptyState`) e outros sistemas maduros.

---

## 8. Notas de arquiteto

- `Empty` é o caso mais claro da fase R2 de **componente fantasma**: API pública sem propósito, sem consumidor. Custa zero em runtime, mas polui a superfície do DS.
- Deletar é barato. Reutilizar o nome para um EmptyState real é estratégico. Deixar como está é pior dos mundos: nome ocupado, doc omissa.
- Mesmo um "mais sinalizador que componente" (ex: para usar em `children || <Empty />`) seria melhor implementado como **constante exportada** (`export const EMPTY = null;`) — não precisa do overhead de um componente.
