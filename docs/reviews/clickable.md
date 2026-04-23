# Review — `Clickable`

> Use `✅ OK` / `⚠️ Melhoria` / `❌ Quebra` por item. Toda `⚠️` ou `❌` vira issue, PR ou RFC (ver seção 7).

**Fase:** R3 · **Camada:** `core` · **Status:** `concluído`
**Revisor:** Arquiteto Arbor-DS · **Data:** 2026-04-23 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/core/clickable/core/clickable.tsx`
- **Story:** ausente
- **Testes:** ausentes
- **Implementação nativa:** não presente — documentado como `@platform web-only` na interface
- **Classificação cross-platform:** `web-first` (JSDoc declara explicitamente a limitação de plataforma)
- **Dependências internas:** `Flex`, `TapState` (ecosystem)
- **Consumidores conhecidos:** `Button`, `Chip`, `Accordion` (trigger), `Tabs` (tab), `Breadcrumb`, `Select`, `Carousel` (controls), `Dialog` (close), `Tooltip` (trigger), `NavBar` (back), `TabBar` (item).

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ❌ | Sem story alguma. |
| 1.2 | Tokens usados | ✅ | Não tem recipe própria; delega estilo ao consumidor via props declarativas. |
| 1.3 | Estados visuais: default, hover, active, focus, disabled | ⚠️ | `TapState` (opcional via `tapState` prop) provê feedback visual de pressed; hover/focus não são estilizados por padrão — consumidor é responsável. |
| 1.4 | Escala coerente | ✅ | Primitivo sem tamanho próprio; herda layout do consumidor. |
| 1.5 | Contraste ≥ WCAG AA | ✅ | Não aplicável — Clickable não renderiza conteúdo visual por conta própria. |
| 1.6 | Microinterações usam `transition()` | ⚠️ | `TapState` tem animação própria; foco/hover não têm animação padrão. |
| 1.7 | Animações respeitam `usePrefersReducedMotion` | ⚠️ | Depende do `TapState` — não verificado se respeita reduced motion. |
| 1.8 | Ícones usam `<Icon>` | ✅ | Não aplicável. |

**Observações livres:**

`Clickable` é um primitive neutro de interação — correto não ter aparência visual própria. O risco é que a ausência de estado de foco padrão (`focus-visible: outline`) coloca a responsabilidade de acessibilidade visual inteiramente no consumidor. Componentes downstream (`Button`, `Chip`, etc.) precisam garantir `focus-visible` individualmente.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado: Tab, Enter, Space | ⚠️ | `as="button"` (default) provê Enter/Space nativamente. Mas se consumidor usar `as="div"`, perde comportamento de teclado sem aviso. |
| 2.2 | Focus management | ✅ | `forwardRef` presente — ref pode ser usado para gerenciar foco externamente. |
| 2.3 | `role` e `aria-*` | ⚠️ | Sem validação: `as="div"` sem `role="button"` é invisível a leitores de tela. Não há aviso de dev para essa combinação perigosa. |
| 2.4 | Anúncios a leitor de tela | ⚠️ | Delegado ao consumidor e ao elemento via `as`. |
| 2.5 | Touch target ≥ 44×44 | ⚠️ | Não garantido pelo primitivo. Documentar como responsabilidade do consumidor. |
| 2.6 | Controlado × não-controlado | ✅ | Não aplicável. |
| 2.7 | Evento cancelável | ✅ | `onClick?: MouseEventHandler` — padrão DOM; cancelável via `e.preventDefault()`. |
| 2.8 | RTL | ✅ | Não aplicável para primitivo de interação sem layout direcional próprio. |

**Observações livres:**

O maior risco comportamental é o uso de `as="div"` sem `role="button"`. `<div>` não é focusável nem ativável por teclado nativamente. Um aviso em `process.env.NODE_ENV !== 'production'` detectando `as !== 'button'` sem `role` seria uma proteção barata e valiosa.

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API mínima, sem props redundantes | ✅ | `tapState`, `onClick`, + spread de `ArborTransformProps`. Enxuta. |
| 3.2 | Naming segue convenção | ✅ | `onClick` (DOM), `tapState` (DS). |
| 3.3 | Defaults são "least surprise" | ✅ | `as="button"` — correto semanticamente. |
| 3.4 | Combinações inválidas bloqueadas | ⚠️ | `as="div"` sem `role` passa sem erro de tipo. |
| 3.5 | Polimorfismo via `as` | ✅ | Herda via `ArborTransformProps`. |
| 3.6 | `forwardRef` presente; `displayName` definido | ⚠️ | `forwardRef` ✅ presente. `displayName` ❌ ausente — devtools mostra `ForwardRef`. |
| 3.7 | Compound components / slots | ✅ | Não aplicável. |
| 3.8 | Tipos públicos exportados | ✅ | `ClickableProps` exportado via `index.ts`. |

**Surface area atual:**

```ts
type ClickableProps = ArborTransformProps & {
  tapState?: TapStateProps;           // feedback visual animado (opcional)
  onClick?: MouseEventHandler<HTMLElement>; // handler de clique DOM
  // herda: as, children, display, padding, etc. via ArborTransformProps
}
```

**Observações livres:**

A ausência de `displayName` faz com que o React DevTools mostre o componente como `ForwardRef` genérico, dificultando debug em árvores de componentes com múltiplos `Clickable` aninhados (ex: `Button > Clickable`, `Chip > Clickable`).

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | Usa `Flex` com `as` — correto. |
| 4.2 | Sem `style={{...}}` | ✅ | Sem uso de `style`. |
| 4.3 | Estrutura de pasta | ✅ | `core/`, `interfaces/` presentes. |
| 4.4 | Estilo via recipe | ✅ | Primitivo sem recipe própria; correto. |
| 4.5 | Sem `any`, sem cast não justificado | ⚠️ | Tipagem de `forwardRef` usa `React.RefAttributes<unknown>` — `unknown` é mais seguro que `any`, mas poderia ser `HTMLElement`. |
| 4.6 | Testes cobrem estados, a11y, interações | ❌ | Nenhum teste. |
| 4.7 | Story cobre default, variantes, estados, playground | ❌ | Nenhuma story. |
| 4.8 | `.native.tsx` ausente | ⚠️ | Documentado como web-only — decisão registrada na interface via JSDoc. Adequado. |
| 4.9 | Imports respeitam camadas | ✅ | `../../../../ecosystem` e `../../flex` — correto. |

**Métricas rápidas:**

- LOC do componente: ~40
- Nº de testes: **0**
- Nº de stories: **0**
- Dependências externas: 0 em runtime

**Observações críticas — ordem de spread (invariantes vazáveis):**

```tsx
// ❌ Implementação atual — invariantes ANTES do spread
<Flex
  as={as}
  innerRef={setRef}
  display={'flex'}      // ← invariante
  cursor={'pointer'}    // ← invariante
  border={'none'}       // ← invariante
  onClick={onClick}
  {...props}            // ← consumidor pode sobrescrever cursor/border/display
>
```

```tsx
// ✅ Correto — invariantes DEPOIS do spread (padrão R2-CR2-1)
<Flex
  as={as}
  innerRef={setRef}
  onClick={onClick}
  {...props}
  display={'flex'}      // ← não pode ser sobrescrito
  cursor={'pointer'}    // ← não pode ser sobrescrito
  border={'none'}       // ← não pode ser sobrescrito
>
```

Essa inversão permite que consumidores passem `cursor="default"` e quebrem o contrato visual do componente. O padrão correto (consolidado em R2-CR2-1) é: invariantes vêm **depois** do spread.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público correto | ✅ | Exportado de `src/components/core/index.ts`. |
| 5.2 | Tipos públicos exportados | ✅ | `ClickableProps` exportado. |
| 5.3 | Changeset entry | ⚠️ | Fixes recomendados precisarão de changeset. |
| 5.4 | Breaking change tem RFC | ✅ | Nenhuma breaking change proposta. |
| 5.5 | Guia de migração | ✅ | Não necessário. |

---

## 6. Resumo executivo

**Score por eixo:** Visual `3/8` · Comportamental `4/8` · Funcional `6/8` · Código `4/9` · Governança `4/5`

**Top 3 achados (por impacto):**

1. **❌ Invariantes (`cursor`, `border`, `display`) vazáveis via spread** — padrão R2-CR2-1 aplicado em sentido errado. Consumidor pode sobrescrever propriedades críticas do componente.
2. **❌ Ausência total de testes e stories** — primitivo fundacional para todos os elementos interativos do DS, sem cobertura alguma.
3. **⚠️ `displayName` ausente** — em árvores com múltiplos `Clickable` aninhados (Button > Clickable, Chip > Clickable), o DevTools mostra `ForwardRef` para todos sem distinção.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [ ] ⚠️ Aprovado com fixes menores (listados abaixo)
- [x] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] Inverter ordem de spread: mover `display`, `cursor`, `border` para **depois** de `{...props}` (padrão R2-CR2-1)
- [ ] Adicionar `Clickable.displayName = 'Clickable'` após a declaração do componente
- [ ] Trocar `React.RefAttributes<unknown>` por `React.RefAttributes<HTMLElement>` na tipagem do `forwardRef`

### Issue (mudança localizada, sem breaking change)

- [ ] **[issue]** Criar suite de testes: renderização como `button`, click handler, `forwardRef`, propagação de `TapState`, comportamento com `as="a"`
- [ ] **[issue]** Criar stories: Default (como botão), com TapState, polimórfico (`as="a"`), disabled, em composição com Button
- [ ] **[issue]** Adicionar warning de dev para `as !== 'button'` sem `role` definido (proteção a11y)
- [ ] **[issue]** Documentar `TapState` no JSDoc de `ClickableProps.tapState` com exemplo de uso

### RFC (sistêmico ou breaking change)

- [ ] **RFC-R3-C:** Avaliar se `tapState` como prop de objeto é o contrato correto, ou se `TapState` deveria ser filho composto — `<Clickable><TapState /><children /></Clickable>`. A prop atual cria acoplamento implícito e dificulta customização.

---

## 8. Notas de arquiteto

**Padrão duplicado de ref:** `Clickable` mantém dois refs internos (`buttonRef`, `tapStateRef`) e uma função `setRef` que sincroniza o ref passado externamente com `buttonRef`. Isso é necessário porque `innerRef` do `ArborTransform`/`Flex` não é o mesmo mecanismo que `forwardRef`. Esse padrão vai aparecer em qualquer componente que precise de ref interno **e** externo simultaneamente. Merece ser extraído para um hook utilitário (`useComposedRef`) ou resolvido na fase de RFC-R2-A (`forwardRef` universal em primitives).

**Clickable é web-only por decisão explícita:** A interface documenta `@platform web-only` com justificativa (`cursor`, `border`, `MouseEventHandler` são APIs DOM). Em RN, componentes que precisam de interação devem usar `Pressable` ou `TouchableOpacity` diretamente — ou o DS deve expor um primitivo nativo dedicado. Essa é uma lacuna arquitetural real: não há equivalente nativo de `Clickable` no DS.
