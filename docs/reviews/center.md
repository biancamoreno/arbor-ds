# Review — `Center`

**Fase:** R2 · **Camada:** `core` · **Status:** `concluído`
**Revisor:** arquiteto · **Data:** 2026-04-22 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/core/center/core/center.tsx`, `src/components/core/center/interfaces/CenterProps.ts`
- **Story:** **ausente**.
- **Testes:** **ausentes**.
- **Implementação nativa:** não necessária — delegação ao `ArborTransform`.
- **Classificação cross-platform:** `universal`.
- **Dependências internas:** `ArborTransform`.
- **Consumidores conhecidos:** nenhum componente interno. Uso externo (playground, consumidores da lib).

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
| 3.1 | API pública mínima; sem props redundantes | ✅ | `Center = Flex com alignItems+justifyContent center`. Contrato simples e claro. |
| 3.2 | Nomes seguem convenção | ✅ | |
| 3.3 | Defaults "least surprise" | ✅ | Sempre centraliza. |
| 3.4 | Combinações inválidas bloqueadas | ⚠️ | Tipo **omite** `display`, `alignItems`, `justifyContent` do usuário — bom. Mas **`flexDirection` continua exposto** — consumidor pode passar `flexDirection="column"` e Center continua alinhando nas duas eixos (que é semanticamente ok). Aceitável. |
| 3.5 | Polimorfismo via `as` | ✅ | |
| 3.6 | `forwardRef` + `displayName` | ❌ | Ausentes. |
| 3.7 | Compound | N/A | |
| 3.8 | Tipos exportados | ✅ | `CenterProps`. |

**Surface area atual:**

```ts
export type CenterProps<T extends object> = Omit<
  ArborTransformProps<T>,
  'display' | 'alignItems' | 'justifyContent'
>;
```

**Observações livres:**

- **Ordem de spread segura:** `{...(props as ArborTransformProps<T>)}` é espalhado **antes** de `alignItems` e `justifyContent`, garantindo que o consumidor não sobrescreva o contrato por acidente. ✅ **Padrão correto que Flex e Grid deveriam seguir.**
- Cast `as ArborTransformProps<T>` é ok (apenas um alargamento tipado após Omit).

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | |
| 4.2 | Sem `style={{...}}` | ✅ | |
| 4.3 | Estrutura de pasta | ✅ | `core/` + `interfaces/`. |
| 4.4 | Recipes | N/A | |
| 4.5 | Sem `any`, cast injustificado | ✅ | |
| 4.6 | Testes | ❌ | Zero. |
| 4.7 | Stories | ❌ | Zero. |
| 4.8 | `.native.tsx` ou platform-split justificado | ✅ | Delegado. |
| 4.9 | Imports respeitam camadas | ✅ | |

**Métricas rápidas:**

- LOC: **13**
- Nº de testes: **0**
- Nº de stories: **0**
- Dependências externas de runtime: **0**

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público em `src/components/index.ts` | ✅ | |
| 5.2 | Tipos públicos exportados | ✅ | |
| 5.3 | Changeset entry | N/A | |
| 5.4 | RFC para breaking change | N/A | |
| 5.5 | Guia de migração | N/A | |

---

## 6. Resumo executivo

**Score por eixo:** Visual `—` · Comportamental `—` · Funcional `6/8` · Código `7/9` · Governança `2/5`

**Top 3 achados (por impacto):**

1. **Ausência total de story e teste.** Primitive público sem vitrine nem regressão.
2. **Falta `forwardRef` + `displayName`** — mesma dívida recorrente dos outros primitives.
3. **Genérico `<T extends object>`** duplica o padrão problemático de Box. Ver RFC referenciado em `box.md`.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores (listados abaixo)
- [ ] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] Criar `center.stories.tsx` (default, com diferentes conteúdos, combinado com `size` / `flexDirection`).
- [ ] Criar `center.test.tsx` (render, estrutura delegada, override de props permitidas, proibição de `display` via tipagem).
- [ ] Adicionar `displayName = 'Center'`.

### Issue

- [ ] Consolidar padrão de spread protetor (Center está correto, replicar em Flex/Grid — ver flex.md).

### RFC

- [ ] Compartilhada com Box/Flex: genéricos e `forwardRef`.

---

## 8. Notas de arquiteto

- Center é o **padrão-ouro de micro-primitive** no R2: API pequena, `Omit` correto das props que deve controlar, spread na ordem certa. Deveria ser usado como **referência** para normalizar Flex, Grid e Square.
- Vale a pena documentar o padrão `Omit<ArborTransformProps<T>, 'propsControladas'>` + spread antes das props controladas como convenção oficial no CONTRIBUTING.
