# Review — `Circle`

**Fase:** R2 · **Camada:** `core` · **Status:** `concluído`
**Revisor:** arquiteto · **Data:** 2026-04-22 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/core/circle/core/circle.tsx`, `src/components/core/circle/interfaces/CircleProps.ts`
- **Story:** **ausente**.
- **Testes:** **ausentes**.
- **Implementação nativa:** não necessária — composição de `Square` que delega ao `ArborTransform`.
- **Classificação cross-platform:** `universal`.
- **Dependências internas:** `Square`.
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
| 3.1 | API pública mínima; sem props redundantes | ✅ | `CircleProps = SquareProps` — zero sobreposição. Composição limpa. |
| 3.2 | Nomes seguem convenção | ✅ | |
| 3.3 | Defaults "least surprise" | ⚠️ | **Bug de precedência:** `<Square borderRadius="full" {...props} />` — spread do consumidor vem **depois**, então passar `borderRadius` (por exemplo para um `Circle borderRadius="medium"` intencional, que faria pouco sentido mas é teoricamente possível) desfaz o contrato. Pior: o consumidor pode involuntariamente **remover** o `borderRadius: full` se espalhar props vindas de um `...rest`. Circle deixa de ser círculo. |
| 3.4 | Combinações inválidas bloqueadas | ⚠️ | Poderia `Omit<'borderRadius'>` como fez com `width`/`height` em Square. |
| 3.5 | Polimorfismo via `as` | ✅ | Delegado. |
| 3.6 | `forwardRef` + `displayName` | ❌ | Ausentes. |
| 3.7 | Compound | N/A | |
| 3.8 | Tipos exportados | ✅ | `CircleProps`. |

**Surface area atual:**

```ts
export type CircleProps<T extends object> = SquareProps<T>;
```

**Observações livres:**

- Ordem do spread: `<Square borderRadius="full" {...props} />`. Se usuário passa `borderRadius="small"`, Circle vira quase-quadrado. **Para um componente com contrato semântico imutável ("é um círculo") o spread deveria ser `{...props} borderRadius="full"`.**
- `CircleProps<T> = SquareProps<T>` reusa o genérico e tudo mais. Legal, mas herda também o débito (`centerContent = true` default, `flexGrow=0`, etc.).

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
| 4.8 | `.native.tsx` ou platform-split | ✅ | N/A — composição. |
| 4.9 | Imports respeitam camadas | ✅ | Import relativo (`'../../square'`) é correto (mesma camada). |

**Métricas rápidas:**

- LOC: **6**
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

**Score por eixo:** Visual `—` · Comportamental `—` · Funcional `5/8` · Código `7/9` · Governança `2/5`

**Top 3 achados (por impacto):**

1. **Contrato do Circle é contornável.** `borderRadius="full"` vem antes do spread do usuário — o círculo pode virar quadrado se o consumidor passar `borderRadius` (intencional ou por spread inocente).
2. **Sem story/teste.**
3. **Falta `displayName`.**

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores (listados abaixo)
- [ ] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] Inverter ordem: `<Square {...props} borderRadius="full" />`.
- [ ] Considerar `Omit<SquareProps<T>, 'borderRadius'>` em `CircleProps` para garantir imutabilidade do contrato via tipagem.
- [ ] Adicionar `displayName = 'Circle'`.

### Issue

- [ ] Criar `circle.stories.tsx` (tamanhos variados, com conteúdo, como avatar placeholder).
- [ ] Criar `circle.test.tsx` (redondo em qualquer size, não aceita sobrescrever borderRadius se adotarmos Omit).

### RFC

- [ ] Nenhum isolado — eventual RFC "Shape family" (ver `square.md`).

---

## 8. Notas de arquiteto

- Circle é **6 linhas** que dependem de Square. A composição é ideal em tamanho, mas expõe o princípio geral: **primitivos compostos precisam blindar seus contratos semânticos** via ordem de spread ou via tipagem (`Omit`).
- O padrão correto genérico é: **"defaults primeiro; props do usuário no meio; invariantes por último"**. Vou pôr isso explícito nas notas sistêmicas da R2 e no CONTRIBUTING.
