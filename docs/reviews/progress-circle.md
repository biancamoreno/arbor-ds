# Review — `ProgressCircle`

**Fase:** R7 · **Camada:** `feedback` · **Status:** `concluído`
**Revisor:** arbor-ds-arch · **Data:** 2026-05-02 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:**
  - `src/components/progress-circle/core/progress-circle.tsx` (71 LOC)
  - `src/components/progress-circle/core/progress-circle.native.tsx` (111 LOC)
  - `src/components/progress-circle/interfaces/ProgressCircleProps.ts` (33 LOC)
- **Story:** `progress-circle.stories.tsx` (3 stories: `Default`, `AllTones`, `Sizes`).
- **Testes:** `progress-circle.test.tsx` (13 cases) + `progress-circle.native.test.tsx` (11 cases).
- **Implementação nativa:** `sim` — `Animated.loop` rotacionando container + `react-native-svg`.
- **Classificação cross-platform:** `platform-split` (apesar do JSDoc da interface declarar `@platform shared`, ver PC-8).
- **Dependências internas:** `useTheme`, `transition`. **Externa:** `react-native-svg` (peerDep formalizada na RFC-0023).
- **Consumidores conhecidos:** nenhum interno.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ⚠️ | Stories cobrem default, 4 tones, 4 tamanhos. **Sem `Indeterminate` story** apesar do variant existir. **Sem `Theming` story.** |
| 1.2 | Tokens semânticos | ✅ | Cores via `theme.colors.brand.base`/`feedback.*.base`/`background.subtle` ✅. |
| 1.3 | Estados visuais | ✅ N/A | determinate (0–100) e indeterminate ✅. |
| 1.4 | Escala coerente com DS | ✅ | `size: number` (default 48) — **não usa `sm/md/lg`**. Coerente com a natureza do componente (px-driven, layout-dependent — igual Skeleton). **Refuta a hipótese SP-1 universal.** |
| 1.5 | Contraste ≥ WCAG AA | ⚠️ | Trace ativo sobre fundo deve cumprir; sem teste explícito. |
| 1.6 | `transition()` em microinterações | ⚠️ | **Determinate ✅** consome `transition(['stroke-dashoffset'], 'slow', 'standard')`. **Indeterminate ❌** usa `'arbor-spin 1.2s linear infinite'` (web) e `duration: 1200, Easing.linear` (native) literais. Mesma família PB-4/SP-2. |
| 1.7 | `usePrefersReducedMotion` | ⚠️ | Web ✅ via `REDUCED_MOTION_CSS` global. **Native ❌** — `Animated.loop` continua quando reduced motion ativo (família SP-3/SK-3, depende de R1-C4). |
| 1.8 | Ícones do DS | ✅ N/A | SVG primitivo (escape hatch legítimo per skill). |

**Observações livres:**
- **`fillColor` lookup table duplicado** entre `.tsx` e `.native.tsx` (linhas 22–27 web, 38–43 native). **Mesmo objeto, sem fonte compartilhada.** Quebra DRY; vira fonte de bugs futuros (mudança de paleta exige editar 2 arquivos).
- Reutiliza `@keyframes arbor-spin` injetado pelo `ArborProvider` ✅. Centralizado.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado | ✅ N/A | Não-focável. |
| 2.2 | Focus management | ✅ N/A | — |
| 2.3 | `role` correto + `aria-*` | ✅ | Web: `role="progressbar"` + `aria-valuenow/min/max` + `aria-busy={indeterminate}`. Native: `accessibilityRole="progressbar"` + `accessibilityValue={{min, max, now}}` + `accessibilityState={{busy}}`. **Mais completo que ProgressBar e Spinner.** |
| 2.4 | Anúncios a leitor de tela | ⚠️ | `label` opcional sem default (mesmo PB-15). |
| 2.5 | Touch target | ✅ N/A | — |
| 2.6 | Controlado | ✅ N/A | — |
| 2.7 | Cancelável | ✅ N/A | — |
| 2.8 | RTL | ⚠️ | Rotação `-90deg` para alinhar arco no topo é simétrica — RTL não distorce visualmente. Sem teste, mas geometria circular é tolerante. |

**Observações livres:**
- API a11y é a melhor de R7. Native expõe `accessibilityValue` corretamente (que é mais idiomático em RN do que ariar via `accessibilityLabel`).

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API mínima | ✅ | `progress`, `indeterminate?`, `size?`, `strokeWidth?`, `tone?`, `label?`, `style?`, `children?`, `testID?`. **Surface enxuta.** |
| 3.2 | Naming | ✅ | Sem `sm/md/lg`. `size: number` ✅. |
| 3.3 | Defaults | ⚠️ | `indeterminate=false`, `size=48`, `strokeWidth=4`, `tone='brand'`. ✅. **`label` sem default** (mesmo PB-15). |
| 3.4 | Combinações inválidas via tipo | ⚠️ | Mesma situação PB: `progress` ignorado quando `indeterminate=true`. Discriminated union resolveria (família PB-clamp-typesafe). |
| 3.5 | Polimorfismo via `as` | ✅ N/A | SVG nativo; polimorfismo aqui não cabe. |
| 3.6 | `forwardRef` + `displayName` | ⚠️ | `displayName` ✅ (linha 70/110). **`forwardRef` ausente** — único do R7 a ter displayName antes do sweep. |
| 3.7 | Compound | ✅ N/A | — |
| 3.8 | Tipos públicos exportados | ✅ | `ProgressCircleProps`. |

**Surface area atual:**

```ts
export interface ProgressCircleProps {
  progress: number;
  indeterminate?: boolean;
  size?: number;
  strokeWidth?: number;
  tone?: 'brand' | 'success' | 'warning' | 'critical';
  label?: string;
  style?: CSSProperties;
  children?: ReactNode;
  testID?: string;
}
```

**Observações livres:**
- **Esta interface é o exemplo correto para o sweep PC-3:** **NÃO** estende `HTMLAttributes`. JSDoc explicita o porquê: "Não estende `SVGAttributes<SVGSVGElement>` para preservar paridade cross-platform". **Padrão a propagar para Spinner/Skeleton/Badge/ProgressBar.**
- **`children?: ReactNode` declarado mas não-renderizado** (JSDoc: "slot opcional reservado para futura label central — hoje não-renderizado"). **Dead code de API.** Promete algo que não cumpre. Remover até implementar (YAGNI), ou implementar agora.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | `<svg>`/`<circle>` (escape legítimo). |
| 4.2 | Sem `style={{...}}` desnecessário | ⚠️ | Web: `style={{ transform, animation, ...style }}` — `transform` e `animation` são escape hatch (não há prop equivalente em SVG attrs). OK. Inner circle: `style={{ transition: ... }}` — `transition()` resolve para string CSS, OK escape hatch. |
| 4.3 | Estrutura de pasta | ✅ | — |
| 4.4 | Estilo via `defineRecipe` | ❌ | Sem recipe. `fillColor` lookup table inline. Pequeno (4 entradas), mas duplicado entre web/native. Cabe em sweep coletivo (B-3 / R8). |
| 4.5 | Sem `any`, sem cast | ⚠️ | Native: `[{ width: size, height: size, transform }, style as object]` — cast para `object`. Aceitável para `style: CSSProperties` em RN, mas merece nota. |
| 4.6 | Cobertura de testes | ✅ | 13 cases web + 11 cases native. **Native é mais completo** (clamp, busy, accessibilityValue, todos os tones via `it.each`, testID). Web igualmente sólido. **Sem teste de tema.** |
| 4.7 | Stories | ⚠️ | 3 stories. AllTones/Sizes violam TD-024. Sem `Indeterminate`. Sem `Theming`. |
| 4.8 | `.native.tsx` presente | ✅ | Sim, com paridade real. |
| 4.9 | Imports respeitam camadas | ✅ | — |

**Métricas rápidas:**
- LOC: 71 (web) + 111 (native) + 33 (props) = **215 LOC**.
- Nº de testes: **24** (13 web + 11 native).
- Nº de stories: **3**.
- Dependências externas: **1** runtime (`react-native-svg`, formalizada como peerDep — RFC-0023).

**Observações livres:**
- `fillColor` duplicado entre `.tsx` e `.native.tsx` é fonte de drift. Extrair para `internal/colors.ts`:
  ```ts
  export function getToneColor(tone: ProgressCircleTone, theme: ArborTheme): string { ... }
  ```
- **Único componente de R7 com:** displayName ✅, surface clean (sem extends HTMLAttributes) ✅, paridade native real ✅, testes profundos em ambas as plataformas ✅. **Referência para os outros.**

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público | ✅ | — |
| 5.2 | Tipos exportados | ✅ | — |
| 5.3 | Changeset | ✅ N/A | — |
| 5.4 | Breaking change tem RFC | ✅ | RFC-0023 (`react-native-svg` peerDep) já registrada. |
| 5.5 | Migration guide | ✅ N/A | — |

---

## 6. Resumo executivo

**Score por eixo:** Visual `2/8` (3 N/A) · Comportamental `1/8` (5 N/A) · Funcional `5/8` · Código `5/9` · Governança `5/5`

**Top 3 achados:**

1. **PC-1 refuta SP-1 universal** — ProgressCircle usa `size: number`, não `'sm' \| 'md' \| 'lg'`. **Refina o pattern:** SP-1 atinge somente **componentes de control** (Spinner, Button, Badge, ProgressBar). Componentes geometria-driven (Skeleton, ProgressCircle, Image) usam `number`/`string` por design. **A RFC fica focada nos 4 confirmados.**
2. **PC-3 é o padrão a propagar** — interface não estende `HTMLAttributes`; JSDoc explicita o porquê. **Modelo para Spinner/Skeleton/Badge/ProgressBar** quando o sweep PC-3 acontecer.
3. **PC-10 — `fillColor` duplicado** entre `.tsx` e `.native.tsx`. Drift latente. Extrair `getToneColor()` para `internal/`.

**Outros achados:**
- **PC-6** — indeterminate animation literal em ambas plataformas (família PB-4/SP-2). Migrar para `theme.motion`.
- **PC-8** — JSDoc da interface diz `@platform shared`, mas implementação é split. **Tag errada** — corrigir para `@platform native-ready` ou `platform-split` (consistente com Spinner/Skeleton).
- **PC-11** — `children?: ReactNode` declarado mas não-renderizado. Dead code de API. Remover ou implementar.
- **PC-12** — stories AllTones/Sizes violam TD-024; sem `Indeterminate`/`Theming`.
- **PC-14** — Animated.loop não respeita reduced motion (família SP-3, depende de R1-C4).
- **PC-15** — discriminated union `{indeterminate}|{progress}` (família PB-clamp-typesafe).
- **PC-tone** — `tone` 4 opções (sem `neutral`/`info`); inconsistente com Badge (6). Família PB-13.
- **PC-label-default** — `label?` sem default (família PB-15/SP-7).

**Classificação geral:**
- [x] ✅ Aprovado sem mudanças (no sentido "não bloqueia release")
- [ ] ⚠️ Aprovado com fixes menores (PC-8/PC-10/PC-11 cabem em sweep)
- [ ] ❌ Requer mudanças antes da próxima release

**Este é o componente mais maduro de R7.** PC-8 (tag errada) e PC-11 (children dead code) são polimentos de 5 linhas; PC-10 é DRY de 10 LOC. Resto são família de patterns sistêmicos compartilhados com os outros 4.

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review) — **aplicados em 2026-05-02**

- [x] **PC-8** — JSDoc da interface corrigido: `@platform shared` → `@platform native-ready`. Alinha com `progress-circle.native.tsx:11`. ✅
- [x] **PC-11** — `children?: ReactNode` removido da interface (YAGNI). `import type { ReactNode }` removido. ✅
- [x] **PC-10** — `fillColor` lookup extraído para `src/components/progress-circle/internal/colors.ts` (`getToneColor(tone, theme)`). Importado em `.tsx` e `.native.tsx`. Drift entre web e native eliminado. ✅

### Issue (mudança localizada, sem breaking change)

- [ ] **PC-12** — adicionar story `Indeterminate`. Migrar `AllTones`/`Sizes` para `<Flex>` com tokens.
- [ ] **PC-13 (PC-tone)** — alinhar tones com Badge (família R8 sweep) ou registrar decisão.
- [ ] **PC-15 (clamp typesafe)** — discriminated union para `progress`/`indeterminate` (família PB-clamp-typesafe).
- [ ] **PC-label-default** — sweep cross-componente (família).
- [ ] **PC-14** — depende de **R1-C4**.

### RFC (sistêmico ou breaking change)

- [ ] **PC-6** — entra na mesma RFC/issue de motion-themable de SP-2 / PB-4. Indeterminate consome `theme.motion.duration.slow` + `theme.motion.easing.linear`.

---

## 8. Notas de arquiteto

- **PC-1 FECHA o pattern SP-1 com 4 consumidores definitivos:**
  - **Atingidos:** Spinner, Button, Badge, ProgressBar — todos com `'sm' | 'md'` ou `'sm' | 'md' | 'lg'`.
  - **Não-atingidos:** Skeleton (size é width/height runtime-dynamic), ProgressCircle (size em px), Image (size width/height por API).
  - **Insight:** o pattern é **"componentes de control com tamanhos pré-definidos"**, não "todos os componentes do DS". Vai virar RFC dedicada (cabe em ~30 linhas de spec + codemod trivial). Escopo fica muito mais cirúrgico do que parecia inicialmente.
- **PC-3 é a referência arquitetural de R7:** `ProgressCircleProps` é o único do eixo a:
  - **NÃO** estender `HTMLAttributes` (com JSDoc explicando)
  - Ter `displayName` desde o início
  - Ter paridade native real (não placeholder)
  - Ter cobertura de testes profunda em ambas plataformas
  - Documentar peerDep explicitamente (RFC-0023)

  **Vale catalogar como exemplo em CONTRIBUTING §"Componentes cross-platform — checklist"** ou como template implícito quando outros forem refatorados no sweep.
- **PC-10 (drift latente em `fillColor`)** — sintoma do pattern emergente "feedback tones duplicados em arquivos plataforma": Badge mantém em um lugar (shared), ProgressCircle duplica entre web/native. Vale uma utility cross-componente: `src/foundations/theme/feedback-tones.ts` exportando `getToneColor(tone, theme)`. Pode ser deliverable do R8 (Alert/Toast também vão precisar).
- **PC-7 / arbor-spin reuse** — bonito caso de reuso: ProgressCircle (indeterminate) reutiliza o mesmo keyframe que Spinner usa para a sua animação base. **Confirma que centralizar keyframes no Provider é o caminho certo** (também ratifica SK-12).
- **API a11y de ProgressCircle merece estudo separado:** é a única do R7 a expor `accessibilityValue` em RN com `{min, max, now}` corretamente. Vale extrair pattern e propagar para ProgressBar (que hoje só tem `aria-valuenow` no web — em RN não existe equivalente direto via `@platform shared`, mais um motivo para split).
