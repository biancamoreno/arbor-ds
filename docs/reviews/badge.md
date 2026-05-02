# Review — `Badge`

**Fase:** R7 · **Camada:** `feedback` · **Status:** `concluído`
**Revisor:** arbor-ds-architect · **Data:** 2026-05-02 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:**
  - `src/components/badge/core/badge.tsx` (105 LOC)
  - `src/components/badge/interfaces/BadgeProps.ts` (22 LOC)
- **Story:** `badge.stories.tsx` (5 stories: `Default`, `AllTones`, `Subtle`, `Sizes`, `WithAnchor`).
- **Testes:** `badge.test.tsx` (13 cases) + `badge.native.test.tsx` (3 cases).
- **Implementação nativa:** `não` — Badge é `@platform shared`. JSDoc `@platform shared` em `BadgeProps.ts:4`. Mesmo arquivo `.tsx` serve web e native via `Box`/`Flex`.
- **Classificação cross-platform:** `shared` (universal via composição de primitivos).
- **Dependências internas:** `Box`, `Flex`, `useTheme`.
- **Consumidores conhecidos:** `Badge` (interno: `Badge.Root` + `Badge.Anchor`). Sem consumidores DS além disso.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ⚠️ | Stories cobrem 6 tones × 2 variants × 2 sizes ✅. Não há story `Theming` (matriz produto B). |
| 1.2 | Tokens semânticos | ⚠️ | Cores via `theme.colors.*` ✅ (brand, feedback, status, text, background, border). **Mas:** `padding: '2px 6px' \| '3px 8px'` literal, `gap='4px'` literal, `lineHeight: 1.4` literal, `borderWidth={1}` literal, `'transparent'` literal em `info subtle`. |
| 1.3 | Estados visuais | ✅ N/A | Visual estático (sem hover/focus/disabled — Badge não é interativo). |
| 1.4 | Escala de tamanhos coerente com DS | ❌ | `'sm' \| 'md'` (sem `lg`). Mesmo namespace que Spinner/Button — inconsistente com `'small' \| 'medium' \| 'large'` adotado por Icon (RFC-0028). **Confirma SP-1 sistêmico.** |
| 1.5 | Contraste ≥ WCAG AA | ⚠️ | Tokens `text.inverse` em fundo solid devem cumprir AA em `themeLight`/`themeDark`; sem teste. |
| 1.6 | `transition()` em microinterações | ✅ N/A | Sem transição (componente estático). |
| 1.7 | `usePrefersReducedMotion` | ✅ N/A | Sem animação. |
| 1.8 | Ícones do DS | ✅ N/A | Badge não tem ícone próprio (consumidor injeta via `children`). |

**Observações livres:**
- `theme.colors.status.info` (`themeLightColors.ts:75`) é único uso da chave `status.*` no Badge — todos os outros tones usam `feedback.*`. **Inconsistência semântica:** `info` deveria viver em `feedback.info.{base,subtle,strong}` para casar o padrão dos outros 3 (`success`/`warning`/`critical`). Aqui `info` cai em fallback `'transparent'` no variant subtle (linha 37) — não tem token `subtle` correspondente, então literal entra como tampão.
- **Recipe `badge` existe em `base-theme.ts:499`** mas o componente **não consome** (mesmo padrão de TD-008 resolvido para Input). Lookup table imperativo de 38 LOC em `getBadgeColors()` mapeia tones × variants em pixels/cores — exatamente o que `defineSlotRecipe` ou `defineRecipe.compoundVariants` resolveria. **Recipe morta + lógica imperativa duplicada.**

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado | ✅ N/A | Não-focável. |
| 2.2 | Focus management | ✅ N/A | — |
| 2.3 | `role` correto + `aria-*` | ❌ | Badge não tem role/aria. Em uso comum (`<Badge.Anchor badge={<Badge>3</Badge>}>` sobre `<Button>Notificações</Button>`), **leitor anuncia "3"** sozinho — sem contexto. **Sem prop `aria-label`** nem `aria-live` no Anchor. Consumidor precisa lembrar de envolver em algo semântico (e.g., `<span aria-label="3 notificações novas">`). API atual induz a11y ruim. |
| 2.4 | Anúncios a leitor de tela | ❌ | Mesmo de 2.3. Badge dinâmico (e.g., contador de notificações) deveria sugerir `aria-live="polite"` ou prop `liveRegion`. |
| 2.5 | Touch target | ✅ N/A | Não-interativo. |
| 2.6 | Controlado | ✅ N/A | — |
| 2.7 | Cancelável | ✅ N/A | — |
| 2.8 | RTL | ❌ | `Badge.Anchor` placement com `transform: 'translate(50%, -50%)'` — em RTL `'top-right'` deveria virar `'top-left'`. **Sem inversão automática nem inline-end.** |

**Observações livres:**
- A11y do Badge anchor é responsabilidade fronteira: o componente não pode adivinhar o significado do número. **Mas pode oferecer a infraestrutura** — prop `srLabel?: string` no Anchor (composta com children textuais) ou prop `aria-label` direto. Padrão Material/Chakra: `<Badge content="3" max={9} screenReaderLabel="3 notificações novas">`.

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API mínima | ⚠️ | `tone`, `variant`, `size`, `children` ✅. **Mas extends `HTMLAttributes<HTMLSpanElement>`** vaza ~50 props HTML para a API pública (mesmo SP-4/SK-4). **`BadgeAnchorProps` também estende** — duplica o leak. |
| 3.2 | Naming segue convenção | ❌ | `size: 'sm' \| 'md'` — divergente de `'small' \| 'medium' \| 'large'` (Icon RFC-0028). |
| 3.3 | Defaults "least surprise" | ⚠️ | `tone='neutral'`, `variant='subtle'`, `size='md'`, `placement='top-right'` ✅. `Default` story usa `tone='brand'` + `variant='solid'` (não bate com defaults de produção; nada errado, mas pode confundir). |
| 3.4 | Combinações inválidas via tipo | ⚠️ | `info` + `subtle` cai em `'transparent'` literal (lookup table). Não é "inválido", mas é caminho mal-formado por falta de token (`feedback.info.subtle` ausente). |
| 3.5 | Polimorfismo via `as` | ❌ | Não suportado (sem `as`). Badge sempre `<Flex as="span">`. Decisão razoável (componente é puramente decorativo). |
| 3.6 | `forwardRef` + `displayName` | ❌ | Sem ambos. Mesmo SP-6/SK-6. |
| 3.7 | Compound — slots explícitos | ✅ | `Badge.Root` + `Badge.Anchor` via `Object.assign`. Padrão estabelecido. |
| 3.8 | Tipos públicos exportados | ✅ | `BadgeProps`, `BadgeAnchorProps`. |

**Surface area atual:**

```ts
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'critical' | 'info';
  variant?: 'solid' | 'subtle';
  size?: 'sm' | 'md';
}

export interface BadgeAnchorProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  badge: ReactNode;
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}
```

**Observações livres:**
- API enxuta no que importa, mas o `extends HTMLAttributes` em `@platform shared` é especialmente nocivo — vaza `onClick`/`tabIndex`/`onMouseEnter` para o native, que ignora silenciosamente.
- **Falta `count`/`max`** (e.g., `<Badge count={150} max={99}>` exibe `99+`). Padrão comum em DSes maduros para badges numéricos. Sem isso, consumidor faz `String(count > 99 ? '99+' : count)` na chamada — repetição em N produtos.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | `Box`/`Flex` ✅. Stories violam (`<div style>` em 4 stories). Teste web `it('Badge.Anchor posiciona...')` usa `<span>` puro. |
| 4.2 | Sem `style={{...}}` desnecessário | ❌ | Web: `style={{ padding, fontSize, lineHeight, whiteSpace, backgroundColor, color, borderColor, ...style }}`. **`backgroundColor`/`color`/`borderColor` têm prop declarativa.** `lineHeight: 1.4` literal. `whiteSpace` é escape hatch legítimo. `padding: '2px 6px'` literal. |
| 4.3 | Estrutura de pasta | ✅ | `core/`, `interfaces/`, `index.ts`. |
| 4.4 | Estilo via `defineRecipe` | ❌ | Recipe `badge` existe em `base-theme.ts:499` mas componente **não consome**. Lookup table imperativo de 38 LOC em `getBadgeColors()` substitui. **Recipe morta** (mesmo padrão de TD-008 fechada para Input). |
| 4.5 | Sem `any`, sem cast | ✅ | Limpo. |
| 4.6 | Cobertura de testes | ⚠️ | 13 cases web — bom em tones/variants/size + Anchor. 3 native superficiais. **Sem teste de tema** (override de `feedback.success.base` muda cor). **Sem teste de a11y** (Badge.Anchor com aria-label). |
| 4.7 | Stories | ⚠️ | 5 stories. **4 violam TD-024** (`<div style>` em AllTones/Subtle/Sizes/WithAnchor). **`WithAnchor` tem `background: '#eee'` cor literal** — escapou do `no-color-literal` por estar em `*.stories.tsx` (script ignora). Sem `Theming` story. |
| 4.8 | `.native.tsx` presente | ✅ N/A | `@platform shared` — não precisa. |
| 4.9 | Imports respeitam camadas | ✅ | — |

**Métricas rápidas:**
- LOC: 105 (componente) + 22 (props) = **127 LOC**.
- Nº de testes: **16** (13 web + 3 native).
- Nº de stories: **5**.
- Dependências externas: **0** runtime.

**Observações livres:**
- **`Object.assign(BadgeRoot, { Root: BadgeRoot, Anchor: BadgeAnchor })`** — pattern OK para compound. **Mas perde-se `displayName`** automaticamente (espelha `BadgeRoot.name = 'BadgeRoot'`). React DevTools vai mostrar `BadgeRoot` em vez de `Badge`. Atribuir explicitamente.
- **`getBadgeColors` é função "pure" inline em cada render** — recriação a cada mount. Não é problema de performance real (Badge é raramente re-renderizado em loops massivos), mas é antipattern resolvível por recipe.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público | ✅ | `Badge` + tipos. |
| 5.2 | Tipos exportados | ✅ | `BadgeProps`, `BadgeAnchorProps`. |
| 5.3 | Changeset | ⚠️ | N/A — sem mudança. |
| 5.4 | Breaking change tem RFC | ⚠️ | Migrar para recipe é **backward-compatible** se preservar a surface API. Renomear `sm/md → small/medium` é breaking — exige RFC sistêmica (mesmo SP-1). |
| 5.5 | Migration guide | ✅ N/A | — |

---

## 6. Resumo executivo

**Score por eixo:** Visual `2/8` (3 N/A) · Comportamental `0/8` (5 N/A — restantes ❌) · Funcional `3/8` · Código `4/9` · Governança `3/5`

**Top 3 achados:**

1. **B-3 (recipe morta)** — Recipe `badge` existe em `base-theme.ts:499` mas componente implementa lookup table imperativo de 38 LOC. **Mesmo padrão de TD-008 fechada para Input.** Refactor para `defineSlotRecipe` (slots: `root`) com variants `tone × variant × size` e `compoundVariants`. Backward-compatible.
2. **B-12 / B-anchor-a11y** — Badge.Anchor sem suporte a `aria-label` ou conteúdo screen-reader-only. Uso comum (notificações) anuncia "3" sem contexto. **Adicionar prop `srLabel?: string`** no Anchor (ou `aria-label` no Badge). Não-breaking.
3. **B-2 / B-18 (typing leak duplo)** — `BadgeProps` e `BadgeAnchorProps` ambos `extends HTMLAttributes<HTMLSpanElement>` em componente `@platform shared`. Native ignora silenciosamente. Mesma família de SP-4/SK-4.

**Outros achados:**
- **B-1** — `'sm' \| 'md'` (sem `lg`) — confirma padrão sistêmico SP-1 (sweep R7+R8).
- **B-4** — `'transparent'` literal em `info subtle` — sintoma de `feedback.info.subtle` ausente. Adicionar token completa o leque.
- **B-5** — `theme.colors.status.info` solo no namespace `status.*`; demais tones usam `feedback.*`. Padronizar (mover `info` para `feedback.info` ou justificar a separação).
- **B-6** — pixels literais (`padding`, `gap`, `lineHeight`, `borderWidth`). Migrar para tokens (`spacing`, `lineHeights`).
- **B-9** — RTL não tratado em `Badge.Anchor.placement` (transform usa esquerda/direita, não inline-start/end).
- **B-11** — sem `forwardRef` + `displayName` (família SP-6/SK-6).
- **B-13** — `style={{ backgroundColor, color, borderColor }}` em vez de prop declarativa.
- **B-15** — 4 stories violam TD-024 + cor literal `#eee` em WithAnchor (escapa do script no-color-literal por estar em `*.stories.tsx`).
- **B-count** — falta prop `count`/`max` para badges numéricos com truncamento (`99+`).

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores (B-2/B-11/B-13/B-15 cabem em PR de polimento; B-3 é refactor de média complexidade)
- [ ] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review) — **aplicados em 2026-05-02**

- [x] **B-2 / B-18** — `BadgeProps` e `BadgeAnchorProps` enxutos (sem `extends HTMLAttributes`); `style?: CSSProperties` + `className?: string` explícitos. ✅
- [x] **B-11** — `BadgeRoot.displayName = 'Badge'` + `BadgeAnchor.displayName = 'Badge.Anchor'`. ✅
- [x] **B-13** — `backgroundColor`/`color`/`borderColor` promovidos para props declarativas em `<Flex>`. `style` mantém `padding`/`fontSize`/`lineHeight`/`whiteSpace` (literais e escape hatch). ✅
- [x] **B-15** — `AllTones`/`Subtle`/`Sizes` migradas para `<Flex>` com tokens (`gap="small"`, `flexWrap="wrap"`). `WithAnchor` substituiu `<div style="background:#eee">` por `<Flex backgroundColor="background.subtle" borderRadius="medium" width={40} height={40}>` — sino agora em `<Box as="span">`. Cor literal `#eee` removida. ✅

### Issue (mudança localizada, sem breaking change)

- [ ] **B-3 (refactor)** — migrar Badge para `defineSlotRecipe` consumido via `useSlotRecipe`. Expandir recipe `badge` em `base-theme.ts:499` para incluir `tone × variant` + `compoundVariants`. Backward-compatible com a API. **Pré-condição:** B-4 e B-5 resolvidas (tokens completos).
- [ ] **B-4** — adicionar `theme.colors.feedback.info.{base,subtle,strong}` em `themeLightColors`/`themeDarkColors`; manter `colors.status.info` como alias deprecated **ou** renomear direto se ninguém consome (sweep `theme.colors.status.info`).
- [ ] **B-5** — decisão: padronizar `info` em `feedback.*` ou justificar `status.*` em comentário no token.
- [ ] **B-6** — migrar `padding`/`gap`/`lineHeight`/`borderWidth` para tokens (após B-3 — recipe nova consumirá tokens).
- [ ] **B-9** — definir comportamento RTL do `Badge.Anchor`: ou usar `insetInlineStart`/`insetInlineEnd` ou registrar decisão "placement segue LTR sempre". Sem teste RTL.
- [ ] **B-12** — adicionar prop `srLabel?: string` em `BadgeAnchorProps`. Render: `{children}<span aria-label={srLabel}>{badge}</span>` (ou `aria-hidden` no badge visual + `<span className="sr-only">srLabel</span>`).
- [ ] **B-count** — adicionar props `count?: number`/`max?: number` (default `99`) ao Badge numérico — ou novo `Badge.Counter` no namespace.

### RFC (sistêmico ou breaking change)

- [ ] **B-1** — entra na mesma RFC de naming canônico de `size` (SP-1). Badge é o terceiro consumidor confirmado do namespace `sm/md/lg` (Spinner, Button, Badge). Aguardar ProgressBar/ProgressCircle antes de redigir.

---

## 8. Notas de arquiteto

- **B-1 confirmado em terceiro componente:** Spinner, Button, Badge usam `sm/md/lg`. **Ainda observar ProgressBar/ProgressCircle.** Se ambos confirmarem, RFC é deliverable forte de R7. Se algum diferir, ficou claro que cada componente decidiu individualmente — vira sweep de governança em R13.
- **Recipe morta é padrão emergente:** TD-008 fechada para Input (frame/control via slot recipe). Badge agora aparece com `defineRecipe` declarado mas não consumido. **Provável que Toast/Alert/Chip/Card sofram do mesmo.** Vale auditar isso transversalmente — pode virar TD coletiva em R8.
- **`@platform shared` + `extends HTMLAttributes` é combinação especialmente perigosa:** o leak vai direto para o native sem o desenvolvedor perceber (não há `.native.tsx` para "compilar errado"). Vale registrar regra explícita em CONTRIBUTING: "componentes `@platform shared` NÃO podem estender `HTMLAttributes`".
- **A11y de Badge é decisão arquitetural não tomada:** o componente é semanticamente ambíguo — pode ser texto decorativo (status `Beta`) ou contador dinâmico (notificações). Sem prop diferenciadora, qualquer regra força um caminho. Boa hora de definir: prop `srLabel?` no Anchor + decisão default "Badge sem srLabel é decorativo (`aria-hidden` opcional sugerido pelo consumidor)".
- **`feedback.info` ausente vira `'transparent'`** — evidência arquitetural de que o contrato themable de cores tem **buracos**. Vale auditar todos os feedbacks (success/warning/critical/info) e garantir que cada um tem `{base, subtle, strong, soft}` completos. Pré-requisito para refactor de Badge/Alert/Toast.
- **Compound via `Object.assign`** funciona mas mata `displayName`. Padrão preferido seria `Badge.Anchor = BadgeAnchor` mais `Badge.displayName = 'Badge'` explícito. Vale documentar em CONTRIBUTING §"Compound components".
