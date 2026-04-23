# Review — `Square`

**Fase:** R2 · **Camada:** `core` · **Status:** `concluído`
**Revisor:** arquiteto · **Data:** 2026-04-22 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/core/square/core/square.tsx`, `src/components/core/square/interfaces/SquareProps.ts`
- **Story:** **ausente**.
- **Testes:** **ausentes**.
- **Implementação nativa:** não necessária — delegação ao `ArborTransform`.
- **Classificação cross-platform:** `universal`.
- **Dependências internas:** `ArborTransform`.
- **Consumidores conhecidos:** `Circle` (composição direta).

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
| 3.1 | API pública mínima; sem props redundantes | ⚠️ | Adiciona `size`, `centerContent` sobre o passthrough. Escolha OK, mas `size?: ArborTransformProps['width']` é **tipo importado indiretamente** — deveria ser um alias próprio (`SquareSize`) para ergonomia. |
| 3.2 | Nomes seguem convenção | ⚠️ | `centerContent` duplica exatamente o que `Center` já faz. Se `centerContent=true` por default, `Square` é **Center + dimensão fixa**. Nome da prop sugere acoplamento sem que a doc explique a sobreposição com Center. |
| 3.3 | Defaults "least surprise" | ⚠️ | `centerContent = true` como default é **assunção forte**. Mais intuitivo seria Square neutro (sem alinhar) e o consumidor decidir. Caso contrário, a documentação deve deixar claro. |
| 3.4 | Combinações inválidas bloqueadas | ✅ | `Omit<ArborTransformProps, 'width' | 'height' | 'w' | 'h'>` protege o contrato. |
| 3.5 | Polimorfismo via `as` | ✅ | |
| 3.6 | `forwardRef` + `displayName` | ❌ | Ausentes. |
| 3.7 | Compound | N/A | |
| 3.8 | Tipos exportados | ✅ | `SquareProps`, `SquareOmitted`. |

**Surface area atual:**

```ts
export type SquareOmitted = 'width' | 'height' | 'w' | 'h';

export type SquareProps<T extends object> = Omit<ArborTransformProps<T>, SquareOmitted> & {
  centerContent?: boolean;
  size?: ArborTransformProps['width'];
};
```

**Observações livres:**

- **Ordem de spread INVERTIDA:** `{...squareProps}` vem **antes** de `{...(props as ArborTransformProps<T>)}` — ou seja, o consumidor **pode sobrescrever** o `alignItems/justifyContent` default. Isso quebra a intenção do `centerContent = true`. Se `centerContent` é `true`, o contrato deveria ser imutável; se `false`, o esquema atual é ok. Essa lógica precisa ser explícita.
- `width={props.size}` e `height={props.size}` vem **depois** do spread do usuário, garantindo o quadrado. ✅ Essa parte está certa.
- `flexGrow={0}` e `flexShrink={0}` fixos são decisão não-documentada — consumidor que queira Square crescer em Flex não consegue.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | |
| 4.2 | Sem `style={{...}}` | ✅ | |
| 4.3 | Estrutura de pasta | ✅ | `core/` + `interfaces/`. |
| 4.4 | Recipes | N/A | |
| 4.5 | Sem `any`, cast injustificado | ⚠️ | Cast `as ArborTransformProps<T>` nas props do consumidor. Aceitável, mas revela atrito com a tipagem genérica. |
| 4.6 | Testes | ❌ | Zero. |
| 4.7 | Stories | ❌ | Zero. |
| 4.8 | `.native.tsx` ou platform-split | ✅ | Delegado. |
| 4.9 | Imports respeitam camadas | ✅ | |

**Métricas rápidas:**

- LOC: **23**
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

**Score por eixo:** Visual `—` · Comportamental `—` · Funcional `4/8` · Código `6/9` · Governança `2/5`

**Top 3 achados (por impacto):**

1. **Ordem de spread permite override do `centerContent`.** Se a intenção é que `centerContent=true` sempre centralize, o código precisa espalhar primeiro props do usuário e depois `squareProps`, não o contrário.
2. **`flexGrow={0}`, `flexShrink={0}` fixos** sem doc — bloqueia uso de Square como item flexível dentro de listas.
3. **Sem story/teste** em primitive que é base do Circle.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores (listados abaixo)
- [ ] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] Inverter ordem dos spreads: colocar `{...props}` primeiro, depois `squareProps`, `width`, `height` para que os defaults de Square ganhem precedência.
- [ ] Decidir e documentar: `flexGrow/flexShrink = 0` é contrato fixo ou overridável.
- [ ] Adicionar `displayName = 'Square'`.

### Issue

- [ ] Criar `square.stories.tsx` (sizes 32/64/120, com/sem centerContent, dentro de Flex).
- [ ] Criar `square.test.tsx` (width=height sempre, override de size, Circle herda, comportamento com centerContent=false).
- [ ] Avaliar adicionar `aspectRatio: 1` redundante ao `width=height` como fallback para engines que lidam com `width="auto"`.

### RFC

- [ ] Se houver outros shape helpers (Rectangle, Oval?), criar RFC para família `Shape` unificada em vez de pares Square/Circle soltos.

---

## 8. Notas de arquiteto

- Square + Circle são um **arquétipo de composição estreita** (Circle = Square + borderRadius full). Valioso como demonstração de reuso, mas impõe que Square seja **estável** — qualquer mudança nele propaga silenciosamente.
- A escolha `centerContent = true` por default revela ambiguidade do propósito: Square é "caixa de dimensão fixa" ou "caixa centralizada de dimensão fixa"? A segunda é o que o código faz; o nome não comunica isso. Renomear para `centeringSquare` é exagero, mas a semântica merece nota explícita na JSDoc.
