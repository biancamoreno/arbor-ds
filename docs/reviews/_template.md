# Review — `<ComponentName>`

> Instruções: duplique este arquivo como `docs/reviews/<componente>.md` e preencha cada eixo.
> Use `✅ OK` / `⚠️ Melhoria` / `❌ Quebra` por item. Toda `⚠️` ou `❌` vira issue, PR ou RFC (ver seção 7).

**Fase:** R_ · **Camada:** `core | form | feedback | content | data | overlay | navigation` · **Status:** `draft | em-revisão | concluído`
**Revisor:** `<nome>` · **Data:** `YYYY-MM-DD` · **Versão atual:** `package.json#version`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/<nome>/...`
- **Story:** `src/components/<nome>/*.stories.tsx`
- **Testes:** `src/components/<nome>/**/*.test.tsx`
- **Implementação nativa:** `.native.tsx` presente? `sim | não | não aplicável`
- **Classificação cross-platform:** `web-first | rn-first | universal | platform-split`
- **Dependências internas:** componentes do DS consumidos (ex: `Box`, `Clickable`, `Icon`).
- **Consumidores conhecidos:** lista de componentes do DS que dependem deste.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | | |
| 1.2 | Tokens usados são semânticos (sem valores crus) em cor, spacing, radius, tipografia, elevation, motion | | |
| 1.3 | Estados visuais presentes: default, hover, active, focus, focus-visible, disabled, loading, error, readonly, selected (quando aplicável) | | |
| 1.4 | Escala de tamanhos/densidades é proporcional e coerente com o restante do DS | | |
| 1.5 | Contraste ≥ WCAG AA em `themeLight` e `themeDark` | | |
| 1.6 | Microinterações usam `transition()` (tokens de duração/curva) | | |
| 1.7 | Animações respeitam `usePrefersReducedMotion` | | |
| 1.8 | Ícones usam `<Icon>` do DS (sem SVG cru inline) | | |

**Observações livres:**

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado: Tab, Shift+Tab, Enter, Space, Esc, setas (quando aplicável) | | |
| 2.2 | Focus management: entrada no overlay, retorno ao trigger, focus trap quando necessário | | |
| 2.3 | `role` correto + `aria-*` completos (`expanded`, `controls`, `labelledby`, `describedby`, `selected`, `checked`) | | |
| 2.4 | Anúncios a leitor de tela em estados dinâmicos (loading, erro, sucesso, toast) | | |
| 2.5 | Touch target ≥ 44×44 em alvos interativos | | |
| 2.6 | Comportamento controlado × não-controlado coerente (`value`/`defaultValue`, `open`/`defaultOpen`) | | |
| 2.7 | Evento cancelável quando aplicável (ex: `onOpenChange` permite bloquear fechamento) | | |
| 2.8 | Comportamento em RTL (ou decisão explícita de não suportar) | | |

**Observações livres:**

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API pública mínima; sem props redundantes ou sobrepostas | | |
| 3.2 | Nomes de props seguem convenção do DS (ex: `variant`, `size`, `tone`, `isDisabled` × `disabled` — decidir e aplicar) | | |
| 3.3 | Defaults são "least surprise" (ex: `variant="primary"`, `size="medium"`) | | |
| 3.4 | Combinações inválidas bloqueadas via discriminated unions / tipo | | |
| 3.5 | Polimorfismo via `as` suportado quando cabe | | |
| 3.6 | `forwardRef` presente; `displayName` definido | | |
| 3.7 | Compound components têm contratos de slot explícitos e documentados | | |
| 3.8 | Tipos públicos exportados junto do componente | | |

**Surface area atual (listar props públicas):**

```ts
// ex: ButtonProps
```

**Observações livres:**

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras; usa `Box/Flex/Text/Clickable` com `as` | | |
| 4.2 | Sem `style={{...}}` onde há prop declarativa equivalente | | |
| 4.3 | Estrutura de pasta aplicada: `core/`, `interfaces/`, `styles/`, `accessibility/`, `utils/` | | |
| 4.4 | Estilo via `defineRecipe`/`defineSlotRecipe` para variantes (ou justificativa explícita) | | |
| 4.5 | Sem `any`, sem cast não justificado, sem `console.*` residual | | |
| 4.6 | Testes cobrem: estados, variantes, a11y (roles/labels), interações (keyboard + mouse), controlado/não-controlado | | |
| 4.7 | Story cobre: default, todas variantes, todos estados, playground controlado, exemplo composto real | | |
| 4.8 | `.native.tsx` presente (se universal) ou decisão registrada de platform-split | | |
| 4.9 | Imports internos respeitam camadas (`foundations → ecosystem → components`) | | |

**Métricas rápidas:**

- LOC do componente: `__`
- Nº de testes: `__`
- Nº de stories: `__`
- Dependências externas: `__` (deve ser 0 em runtime)

**Observações livres:**

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público em `src/components/index.ts` correto e estável | | |
| 5.2 | Tipos públicos exportados (não só o componente) | | |
| 5.3 | Mudança proposta tem changeset entry | | |
| 5.4 | Breaking change proposta tem RFC em `docs/rfcs/` | | |
| 5.5 | Guia de migração em `docs/migration/` se há consumidores afetados | | |

**Observações livres:**

---

## 6. Resumo executivo

**Score por eixo:** Visual `_/8` · Comportamental `_/8` · Funcional `_/8` · Código `_/9` · Governança `_/5`

**Top 3 achados (por impacto):**

1.
2.
3.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [ ] ⚠️ Aprovado com fixes menores (listados abaixo)
- [ ] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

Cada achado vai para **uma** trilha. Não misturar trilhas em um único PR.

### Fix imediato (mesmo PR da review)

- [ ]

### Issue (mudança localizada, sem breaking change)

- [ ]

### RFC (sistêmico ou breaking change)

- [ ]

---

## 8. Notas de arquiteto

Observações não-óbvias, padrões emergentes, decisões a propagar para outros componentes.
