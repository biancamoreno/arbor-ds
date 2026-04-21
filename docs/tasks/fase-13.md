# Fase 13 — Fundações Visuais: Font Tokens, Motion e Identidade Storybook

**Status:** Planejada
**Estimativa:** 1–2 dias-pessoa
**Risco:** Baixo (sem breaking change visual; novos tokens retro-compatíveis)
**Pré-requisito:** Fase 12 concluída (release 1.0.0)

---

## Contexto

Esta fase estabelece as **fundações visuais** sobre as quais as fases 14–17 serão construídas. O escopo é deliberadamente pequeno: tokens, utilitários e identidade. Nenhum componente novo é criado aqui, e nenhum componente existente é refinado ainda — isso acontece nas fases posteriores.

Justificativa do isolamento: as três entregas desta fase (font tokens, motion utility, Storybook brand) são **infraestrutura compartilhada**. Colocá-las em fase própria garante que as fases subsequentes consumam uma base estável, em vez de evoluir fundação e consumidores em paralelo.

---

## Diagnóstico

| Área | Estado atual | Lacuna |
|------|--------------|--------|
| `fontFamily` primitivo | Apenas `figtree` | Sem `system`, `mono`, `serif` — não extensível por tema |
| `fontFamily` semântico | Apenas `figtree` (alias direto) | Sem `sans` como alias abstrato — impossibilita troca de fonte default via `createTheme` |
| `Text` default | Não declara `fontFamily` | Consumidor precisa declarar sempre, ou herda do ambiente |
| Motion tokens | Existem em `primitives/motion.ts` | Sem utilitário para compor `transition` CSS — componentes hardcodam strings |
| Reduced motion | Sem tratamento | Animações disparam mesmo com `prefers-reduced-motion: reduce` |
| Storybook brand | Sem título | Header mostra "Storybook" genérico |

---

## Objetivos

1. **Font family extensível** — quatro famílias (`sans`, `mono`, `serif`, `system`), com `sans` apontando para Figtree por default e substituível via `createTheme`.
2. **`Text` default implícito** — todo texto do sistema usa `sans` sem que o consumidor precise declarar.
3. **Motion utility** — função pura `transition()` que compõe `transition` CSS a partir de motion tokens, type-safe nos nomes de duration e easing.
4. **Reduced motion** — transições geradas pelo utilitário zeram sob `prefers-reduced-motion: reduce`.
5. **Storybook brand** — header exibe `🌳 Arbor DS`.

---

## Escopo

### 1. Font Family Tokens

#### 1.1 Primitivos

**Arquivo:** `src/foundations/tokens/primitives/typography/font-family.ts`

```ts
export const fontFamily = {
  figtree: "'Figtree', sans-serif",
  system:  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  mono:    "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, 'Courier New', monospace",
  serif:   "Georgia, 'Times New Roman', Times, serif",
} as const;
```

#### 1.2 Semânticos

**Arquivo:** `src/foundations/tokens/semantics/typography/font-family.ts`

```ts
import { fontFamily as primitive } from '../../primitives';

export const fontFamily = {
  sans:   primitive.figtree,
  mono:   primitive.mono,
  serif:  primitive.serif,
  system: primitive.system,
} as const;
```

**Decisão arquitetural (ADR-13-01):** `sans` é um alias semântico, não um ponteiro direto para `figtree`. Consumidores trocam a fonte do sistema inteiro via `createTheme(themeLight, { fonts: { sans: "'Inter', sans-serif" } })` sem tocar em tokens primitivos.

#### 1.3 Text recipe — default implícito

**Arquivo:** `src/components/core/text/core/text.tsx` (ou recipe associada)

Aplicar `fontFamily: 'sans'` como default no recipe. Consumidores que declaram `fontFamily` explícito mantêm o comportamento atual (override).

**Impacto:** sem breaking change visual — Figtree já é a fonte renderizada; a mudança é apenas estrutural (alias semântico agora existe).

---

### 2. Motion Utility

#### 2.1 Função `transition()`

**Arquivo:** `src/ecosystem/utils/functions/transition.ts`

```ts
import { motionTokens } from '../../../foundations/tokens/primitives/motion';

type Duration = keyof typeof motionTokens.duration;
type Easing   = keyof typeof motionTokens.easing;

export function transition(
  props: string | string[],
  duration: Duration = 'normal',
  easing: Easing = 'standard',
): string {
  const d = motionTokens.duration[duration];
  const e = motionTokens.easing[easing];
  const list = Array.isArray(props) ? props : [props];
  return list.map((p) => `${p} ${d} ${e}`).join(', ');
}
```

Exportar de `src/ecosystem/utils/functions/index.ts` e re-exportar no barrel do ecossistema.

**Decisão arquitetural (ADR-13-02):** função pura, não hook. Motivo: pode ser invocada em objetos de estilo estáticos (módulo top-level), em recipes, em props inline e em tests. Hook seria necessário apenas se o valor dependesse de contexto runtime — não é o caso.

#### 2.2 Reduced motion

Duas camadas de proteção:

**Camada 1 — CSS global** (injetada pelo `ArborProvider` ou via `preview.tsx` do Storybook):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Camada 2 — hook opcional** `src/ecosystem/styled-system/hooks/use-prefers-reduced-motion.ts`:

```ts
export function usePrefersReducedMotion(): boolean {
  // useSyncExternalStore com media query matcher
}
```

Para componentes que precisam decidir em JS (ex: iniciar/pular animação via Animated API no RN).

**Decisão arquitetural (ADR-13-03):** CSS é a primeira linha de defesa — cobre 100% das transições web sem exigir código do componente. O hook cobre casos RN e decisões condicionais.

---

### 3. Storybook Brand

**Arquivo:** `.storybook/manager.ts` (criar)

```ts
import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: '🌳 Arbor DS',
    brandTarget: '_self',
  }),
});
```

**Nota:** `manager.ts` é carregado pelo Storybook no bundle de manager (UI fora do iframe das stories). Não impacta as stories.

---

## Estratégia Cross-Platform

| Entrega | Web | React Native |
|---------|-----|--------------|
| Font tokens | Consumidos via `fontFamily` CSS | Consumidos via `fontFamily` style prop no RN (aceita mesma string) |
| `transition()` | String CSS aplicada em `style.transition` | **Ignorado** — RN usa `Animated` API; tokens de duration são consumidos diretamente como `number` (ms) pelos componentes |
| Reduced motion CSS | Aplicado no provider e no Storybook | N/A — RN usa `AccessibilityInfo.isReduceMotionEnabled()` em fase futura |
| Storybook brand | Aplicado | N/A (Storybook só web) |

**Observação:** nesta fase, o utilitário `transition()` é web-only. Um helper análogo para RN (`motionDuration(token) → number`) pode ser adicionado na Fase 16 quando a necessidade se materializar.

---

## Impacto em DX

- Consumidores podem trocar a fonte default do sistema com uma linha no `createTheme`.
- `<Text>` sem prop `fontFamily` agora é previsível (sempre `sans`), eliminando casos de herança surpresa.
- Autocomplete de `transition('background-color', 'fast', 'decelerate')` substitui strings mágicas espalhadas.
- `🌳 Arbor DS` no Storybook reforça identidade de marca para adopters internos.

---

## Impacto em Acessibilidade e Performance

- **A11y:** reduced motion passa a ser respeitado globalmente — ganho direto sem custo de adoção.
- **Performance:** zero custo de runtime. Tokens e função `transition()` são resolvidos em tempo de render com complexidade O(1).
- **Bundle:** três strings a mais no bundle de tokens. Irrelevante.

---

## Plano de Execução

1. Atualizar `primitives/typography/font-family.ts`
2. Atualizar `semantics/typography/font-family.ts`
3. Aplicar default `sans` no `Text` (verificar que testes existentes continuam verdes)
4. Criar `src/ecosystem/utils/functions/transition.ts` + test + export
5. Injetar CSS de reduced motion no `ArborProvider` e `.storybook/preview.tsx`
6. Criar `.storybook/manager.ts` com brand title
7. Rodar suite completa e validar snapshot do Text

---

## Critérios de Qualidade

### Tokens
- [ ] `fontFamily.figtree/system/mono/serif` existem nos primitivos
- [ ] `fontFamily.sans/mono/serif/system` existem nos semânticos
- [ ] `sans` aponta para `figtree` no tema default
- [ ] `createTheme(themeLight, { fonts: { sans: "'Inter', sans-serif" } })` efetivamente troca a fonte renderizada (teste de integração)
- [ ] `Text` sem prop `fontFamily` renderiza com `sans`

### Motion
- [ ] `transition()` retorna string CSS válida
- [ ] Tipos `Duration` e `Easing` são auto-derivados de `motionTokens`
- [ ] `prefers-reduced-motion: reduce` zera transições (validado via devtools emulation)

### Storybook
- [ ] Header exibe `🌳 Arbor DS`
- [ ] Nenhuma story quebrou

### Regressão
- [ ] Suite de testes verde (base: 437 testes)
- [ ] `pnpm build:lib` sem erros
- [ ] `pnpm lint` limpo

---

## Decisões Arquiteturais (ADRs desta fase)

- **ADR-13-01:** `fontFamily.sans` como alias semântico (não ponteiro direto para `figtree`) — habilita troca via tema sem tocar em primitivos.
- **ADR-13-02:** `transition()` como função pura, não hook — usável em contextos estáticos.
- **ADR-13-03:** Reduced motion via CSS global no provider — cobre 100% das transições web sem acoplar componentes.

---

## Próximas Fases

- **Fase 14** consome `IconName` e o componente `Icon` (biblioteca Lucide).
- **Fase 15** consome `transition()` nos novos componentes (ButtonGroup, FAB, NavBar).
- **Fase 16** refatora componentes existentes para consumir `transition()` e substituir strings hardcoded.
- **Fase 17** valida tudo no playground mobile (Expo).
