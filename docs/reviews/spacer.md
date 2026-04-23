# Review — `Spacer`

**Fase:** R2 · **Camada:** `core` · **Status:** `concluído`
**Revisor:** arquiteto · **Data:** 2026-04-22 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/core/spacer/core/spacer.tsx`, `src/components/core/spacer/interfaces/SpacerProps.ts`
- **Story:** **ausente**.
- **Testes:** **ausentes**.
- **Implementação nativa:** não necessária — delegação ao `ArborTransform`.
- **Classificação cross-platform:** `universal`.
- **Dependências internas:** `ArborTransform`.
- **Consumidores conhecidos:** nenhum componente interno do DS. Uso externo.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1–1.8 | — | N/A / ❌ story ausente | — |

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1–2.8 | — | N/A | Estrutural. |

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API pública mínima; sem props redundantes | ⚠️ | `SpacerProps = ArborTransformProps` — API aberta demais para um primitive cuja única função é ocupar espaço flexível. Sem nenhuma constraint específica de Spacer. |
| 3.2 | Nomes seguem convenção | ✅ | |
| 3.3 | Defaults "least surprise" | ⚠️ | `flex=1`, `justifySelf="stretch"`, `alignSelf="stretch"` sensatos. Mas Spacer é **dependente de contexto**: só funciona dentro de `Flex`/`Grid`. Doc atual não avisa. |
| 3.4 | Combinações inválidas bloqueadas | ❌ | Consumidor pode sobrescrever `flex`, `justifySelf`, `alignSelf` — neutraliza o Spacer. |
| 3.5 | Polimorfismo via `as` | ✅ | Via passthrough. |
| 3.6 | `forwardRef` + `displayName` | ❌ | Ausentes. |
| 3.7 | Compound | N/A | |
| 3.8 | Tipos exportados | ❌ | **`SpacerProps` existe em `interfaces/SpacerProps.ts`, mas `spacer/index.ts` NÃO exporta `./interfaces`.** Portanto o tipo não chega ao consumidor via `import { SpacerProps } from 'arbor-ds'`. |

**Surface area atual:**

```ts
export type SpacerProps = ArborTransformProps; // mas não exportado pelo barrel!
```

**Observações livres:**

- `...(props as Record<string, unknown>)` — cast **desnecessariamente amplo**. `SpacerProps` já estende `ArborTransformProps`; o spread poderia ser `{...props}` sem cast, ou tipado. Este cast cheira a correção para escapar de algum erro TS — indica bug de tipagem não resolvido. Precisa ser investigado em vez de mascarado.
- Spacer faz sentido só em **Flex/Grid**. Seria razoável **nomear o contrato pela convenção** (ex: doc explícita "use apenas dentro de `<Flex>` ou `<Grid>`"). Alternativa: integrar com um `direction` implícito do container pai (complicado, probavelmente não vale).

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | |
| 4.2 | Sem `style={{...}}` | ✅ | |
| 4.3 | Estrutura de pasta | ⚠️ | `core/` + `interfaces/` existem, mas `index.ts` só exporta `./core` — **exports incompletos**. |
| 4.4 | Recipes | N/A | |
| 4.5 | Sem `any`, cast injustificado | ❌ | Cast `as Record<string, unknown>` não tem justificativa aparente. |
| 4.6 | Testes | ❌ | Zero. |
| 4.7 | Stories | ❌ | Zero. |
| 4.8 | `.native.tsx` ou platform-split | ✅ | Delegado. |
| 4.9 | Imports respeitam camadas | ✅ | |

**Métricas rápidas:**

- LOC: **6**
- Nº de testes: **0**
- Nº de stories: **0**
- Dependências externas de runtime: **0**

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público em `src/components/index.ts` | ✅ | `core/index.ts` exporta. |
| 5.2 | Tipos públicos exportados | ❌ | `SpacerProps` fora do barrel. |
| 5.3 | Changeset entry | N/A | |
| 5.4 | RFC para breaking change | N/A | |
| 5.5 | Guia de migração | N/A | |

---

## 6. Resumo executivo

**Score por eixo:** Visual `—` · Comportamental `—` · Funcional `3/8` · Código `4/9` · Governança `1/5`

**Top 3 achados (por impacto):**

1. **`SpacerProps` não é exportado** — barrel quebrado. É o único primitive R2 com essa omissão.
2. **Cast `as Record<string, unknown>`** mascara problema de tipagem. Remover e corrigir a causa raiz.
3. **Defaults do Spacer sobrescritíveis** — consumidor que passe `flex=0` quebra o componente silenciosamente. Invariantes do Spacer deveriam vir **depois** do spread.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores (listados abaixo)
- [ ] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] Adicionar `export * from './interfaces';` em `src/components/core/spacer/index.ts`.
- [ ] Remover o cast `as Record<string, unknown>` e ajustar o spread tipado. Se houver erro TS, investigar e abrir issue específica.
- [ ] Inverter spread: `<ArborTransform {...props} flex={1} justifySelf="stretch" alignSelf="stretch" />` para que o contrato do Spacer não possa ser neutralizado por spread inocente. Avaliar: se o consumidor quiser controlar `flex`, talvez seja o caso de usar Box/Flex diretamente e não Spacer.
- [ ] Adicionar `displayName = 'Spacer'`.

### Issue

- [ ] Criar `spacer.stories.tsx` (em Flex row, em Flex column, entre dois itens).
- [ ] Criar `spacer.test.tsx` (renderização, comportamento em diferentes direções).
- [ ] Doc no JSDoc: "Use apenas dentro de Flex/Grid".

### RFC

- [ ] Nenhum isolado.

---

## 8. Notas de arquiteto

- Spacer é o menor e **mais negligenciado** primitive de R2 — 6 LOC, zero teste, zero story, barrel quebrado. Sinaliza ausência de DoD aplicado na época da criação.
- `flex={1}` com `alignSelf="stretch"` é padrão correto; o problema é **não ser um contrato imutável**. Com apenas 6 LOC, gastar 2 minutos para inverter a ordem paga rendimento futuro.
- Dívida de tipos (`as Record<string, unknown>`) em 6 LOC é desproporcional. Uma linha de código com bug/hack resolvido mal é pior sinal que 100 linhas corretas.
