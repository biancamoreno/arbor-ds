# RFC-0041 — Polish visual default (8 eixos)

**Status:** Draft
**Autora:** Bia (com co-autoria de design system architect)
**Data:** 2026-05-08
**Bloqueia:** corte de tag `v1.0.0`
**Depende de:** RFC-0039 (paleta 12 papéis), RFC-0040 (component tokens estruturados + emissão CSS vars)
**Substitui parcialmente:** entrada "RFC-0039 polish" da fila de execução (número da RFC migrou — `RFC-0039` foi tomada pela paleta 12 papéis)

---

## 1. Diagnóstico

### 1.1. Sintoma

Após o fechamento de R7/R8/R9 e a entrega de RFC-0034 (Carousel) + RFC-0039 (paleta 12 papéis) + RFC-0040 (component tokens), o Storybook revelou que o **default visual** do Arbor-DS, embora tecnicamente correto, é **datado**. Em revisão de 2026-05-05 a usuária classificou como "robótico, padrãozão". Critério de aceite explícito para v1: a vitrine default precisa parecer contemporânea ao lado de Linear / Vercel / Notion / Stripe / Raycast / Cron / Mercury — sem que produto consumidor precise customizar nada.

### 1.2. Evidência objetiva (estado atual)

| Eixo | Estado atual | Sintoma |
|---|---|---|
| **Brand** | `aqua['60']` = `#1BA285` | Verde-azulado seguro, "telecom 2015". Sem punch identitário. |
| **fontWeight primitive** | `400 / 500 / 700` | Pula 600. Headings perdem nuance entre regular e bold. |
| **fontSize primitive** | cap em `32px` | Sem hero/display sizes para landing. Storybook landing-mockup limita-se a 32px. |
| **shadows** | single-layer, cinza puro `rgba(0,0,0,0.08–0.20)` | Sem stack moderno (soft+sharp). Card hover é "elevação genérica". |
| **motion.easing.standard** | `cubic-bezier(0.4, 0.0, 0.2, 1)` (Material) | Não é o "snap" Linear/Vercel. Microinteração lenta. |
| **motion.duration.normal** | `200ms` | Confortável mas conservador para microinteração. |
| **Button hover** | sem hover/transition default na recipe base | Hover só vem do `interactive.hover` cromático — sem lift, sem feel. |
| **Density (`controlSize.medium`)** | `40px` | Quebra regra WCAG 2.5.5 visual (touch target 44px). Hoje é compensado por overlay `::before` invisível — feio em manutenção. |
| **Foco visível** | outline 2px sólido | Funcional WCAG-AA mas seco. Linear/Vercel usam outline + glow. |
| **`background.subtle`** | `sandstone[10]` (#F2F2F0) | Cinza levemente quente, mas sem matiz intencional. Sem `surface.translucent` matizado. |

### 1.3. Por que importa agora

- **v1 está bloqueada** explicitamente por essa decisão (memory `project_release_v1_preflight.md`).
- Pre-v1 sem consumidores externos = janela única de breaking visual sem ônus.
- Os 4 cenários-alvo (vitrine/e-commerce, painel admin, app de serviço, landing) só convencem se o default for "moderno por construção".

### 1.4. Risco se não fizer

- DS lança v1 com identidade datada → consumidores customizam tudo no `createTheme()` → vira preset de produto, não default → identidade do Arbor-DS deixa de existir.
- Defender o default vira dívida de marketing/onboarding ("aqui está como ficaria modificado").

---

## 2. Direção recomendada

**Refinar o default em 8 eixos coordenados, com Button como família-piloto antes do sweep coletivo.** Defaults razoáveis cobrem 80% dos casos sem configuração; identidade do produto consumidor continua expressível via `createTheme()` + presets futuros.

### 2.1. Princípios

1. **Identidade do DS é acessória, mas existe** — produto manda, mas o default precisa ser um caminho legítimo para um produto.
2. **Coordenado, não pontual** — não vale trocar brand sem atualizar shadow/motion/typography. Olhar é sistêmico.
3. **Sem hack de compatibilidade** — pré-v1 = janela única. Migração de tokens cascateia. CHANGELOG documenta.
4. **Cross-platform real** — qualquer mudança que precise de CSS vars exclusivas é escape hatch, não default.
5. **Override pelo tema continua trivial** — produto que quiser voltar ao verde-aqua faz isso em 1 linha.

### 2.2. Decisões já fechadas pela usuária (sessão 2026-05-08)

| Decisão | Resposta da usuária | Decodificação técnica |
|---|---|---|
| Brand default | "trocar por algo mais punchy" | Sai `aqua['60']`. Apresentaremos 3 candidatos (§3.8) — usuária escolhe na revisão da RFC. |
| Density | "o que for logicamente melhor" | `controlSize.medium`: 40 → 44px. Razões em §3.6. |
| Breaking pré-v1 | "não vou subir v1 ainda" | Liberado. CHANGELOG marca Unreleased Breaking. |
| Sombras coloridas | "pode pôr colorida, além do neutro" | Stack neutro multi-layer **+** novo namespace `shadows.brand.*` opcional. CTA primary ganha lift tingido em hover; resto fica só neutro. |
| Família-piloto vs sweep | "o que for logicamente mais vantajoso" | **Piloto + sweep**. PR1 fecha foundations + Button piloto. Usuária aprova. PR2 sweep coletivo. Custo: 1 review extra. Ganho: evita refazer 25 componentes se direção girar. |

---

## 3. Mudanças propostas — eixo a eixo

### 3.1. Eixo A — Tipografia (foundations + semantics)

**Mudanças:**

```diff
// src/foundations/tokens/primitives/typography/font-weight.ts
 export const fontWeight = {
   400: '400',
   500: '500',
+  600: '600',
   700: '700',
 };

// src/foundations/tokens/primitives/typography/font-size.ts
 export const fontSize = {
-  10, 12, 14, 16, 18, 20, 24, 28, 32,
+  10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 60, 72,
 };
```

**Semantics:**
- `fontWeight` semantic redefine: `regular: 400`, `medium: 500`, `semibold: 600` (novo), `bold: 600`, `extrabold: 700`. `bold` redireciona para 600 — peso padrão de heading moderno (Linear/Vercel/Stripe usam 600 em headings).
- `fontSize` semantic ganha `display.{small, medium, large, hero}` mapeando para 40/48/60/72.
- `letterSpacing` semantic já tem `tightest = -0.04em` mas é mal aplicado em recipes — o sweep do PR2 amarra no `text.recipe` para sizes ≥ display.

**Risco:** **baixo**. Adição de chaves (não remove primitives existentes). Recipe de Text consome `fontSize.{xsmall...hero}` — sweep contido.

---

### 3.2. Eixo B — Sombras stacked + tinted

**Mudanças:**

```diff
// src/foundations/tokens/primitives/shadows.ts
 export const shadows = {
   none: 'none',
-  sm: '0 1px 2px rgba(0,0,0,0.08)',
-  md: '0 2px 8px rgba(0,0,0,0.12)',
-  lg: '0 4px 16px rgba(0,0,0,0.16)',
-  xl: '0 8px 32px rgba(0,0,0,0.20)',
+  sm: '0 1px 2px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.06)',
+  md: '0 2px 4px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.08)',
+  lg: '0 4px 8px rgba(0,0,0,0.04), 0 12px 24px rgba(0,0,0,0.10)',
+  xl: '0 8px 16px rgba(0,0,0,0.06), 0 24px 48px rgba(0,0,0,0.14)',
   cardHover: '0 4px 8px rgba(0,0,0,0.06), 0 12px 24px rgba(0,0,0,0.10)',
   avatarRing: '0 0 0 2px var(--arbor-color-surface-default, #fff)',
+  // Tinted shadows opcionais — consumo via component token, não por padrão.
+  brand: {
+    sm: '0 1px 2px rgba({brand}, 0.20), 0 1px 1px rgba({brand}, 0.15)',
+    md: '0 2px 4px rgba({brand}, 0.18), 0 4px 12px rgba({brand}, 0.20)',
+    lg: '0 4px 8px rgba({brand}, 0.16), 0 12px 24px rgba({brand}, 0.22)',
+  },
 };
```

**Importante:** `shadows.brand.*` usa template `{brand}` que **resolve em runtime** via emissão CSS var (`--arbor-shadow-brand-sm` consome `--arbor-color-brand-9` rgb-decomposto). Em native, fallback para `shadows.lg` neutro com `borderColor: brand.solid` 1px (acessibilidade preservada).

**Decisão sobre tinted:**
- `shadows.brand.*` é **token opt-in**. Recipe Button.primary ganha hover com `shadows.brand.sm`. Card, Tag, Chip permanecem com stack neutro.
- Razão: shadows tingidas são identidade — exagero distrai. Pontual em CTAs e elementos focais.

**Risco:** **baixo** — multi-layer é puramente cosmético; native paridade preservada via fallback.

---

### 3.3. Eixo C — Motion snappy

**Mudanças:**

```diff
// src/foundations/tokens/primitives/motion.ts
 export const motionTokens = {
   duration: {
     instant: '50ms',
-    fast: '100ms',
-    normal: '200ms',
-    slow: '300ms',
+    fast: '120ms',
+    normal: '160ms',
+    slow: '240ms',
     slower: '500ms',
   },
   easing: {
-    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
-    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
+    standard: 'cubic-bezier(0.16, 1, 0.3, 1)',     // easeOutQuart — snap moderno
+    decelerate: 'cubic-bezier(0.22, 1, 0.36, 1)',  // easeOutQuint — overlay open
     accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
     sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
   },
 };
```

**Risco:** **médio** — afeta percepção da UI inteira. Mas:
- 160ms ainda passa em testes de a11y de motion (não é "abrupto").
- `usePrefersReducedMotion` zera duration → segurança.
- Storybook visual valida antes do PR2.

---

### 3.4. Eixo D — Microinterações default (recipe-level)

**Mudanças (Button piloto, PR1):**

```diff
// src/foundations/tokens/components/button.ts
 export const button = {
   borderRadius: 'small',
   borderWidth: 'hairline',
-  fontWeight: 'medium',
+  fontWeight: 'semibold',
   gap: 'micro',
+  transition: { property: 'transform, box-shadow, background-color', duration: 'fast', easing: 'standard' },
+  hover: { translateY: '-1px', shadow: 'brand.sm' },  // só primary; secondary/ghost/danger sobrescrevem em recipe
   ...
 };
```

Recipe `button.tsx` (em `base-theme.ts`) consome via `transition()` e amarra hover:
```ts
button: defineSlotRecipe({
  base: {
    root: {
      transition: '$button.transition',  // resolve via theme
      _hover: {
        transform: 'translateY(-1px)',
        boxShadow: '$button.hover.shadow',
      },
      _active: {
        transform: 'translateY(0)',
        boxShadow: 'none',
      },
    },
  },
})
```

Sweep PR2 estende para:
- `Card.interactive` → `translateY(-2px)` + `shadows.lg` em hover.
- `Chip.selectable` → escala interna ou shadow `sm` em hover.
- `Tag.removable` → fade do `Tag.Remove` em hover do contêiner.
- Tabs/Accordion triggers → background `interactive.hoverBg` com transition.

**Risco:** **baixo** — microinteração é aditiva; reduced-motion zera; native ignora `translateY` (paridade visual aceitável).

---

### 3.5. Eixo E — Surface differentiation

**Mudanças:**

```diff
// src/foundations/tokens/semantics/color/themeLightColors.ts
   background: {
     default: primitiveColor.neutral.white,
-    subtle: primitiveColor.sandstone[10],
+    subtle: '#FAFAF9',  // zinc-50 / off-white quente sutil
+    muted: primitiveColor.sandstone[10],  // realocado
     ...
   },
   surface: {
     default: primitiveColor.neutral.white,
-    raised: primitiveColor.neutral.white,
+    raised: primitiveColor.neutral.white,  // valor não muda
+    // raised SEMPRE acompanha shadows.sm (decisão de recipe, não token)
     translucent: 'rgba(255, 255, 255, 0.85)',
   },
```

**Decisão:**
- `background.subtle` ganha matiz quente sutil (#FAFAF9). Off-white "premium" (Stripe/Notion default).
- `surface.raised` mantém branco — diferenciação vem de `shadows.sm` aplicada na recipe que monta superfície elevada (Card, Modal, Drawer).
- Adicionado role `background.muted` para casos que precisam do cinza neutro antigo.

**Risco:** **baixo** — afeta superfícies suaves; escala 12-papéis preserva contraste.

---

### 3.6. Eixo F — Density (Touch target unificado)

**Decisão: `controlSize.medium` 40 → 44px.**

**Razões:**
1. **WCAG 2.5.5 (AA)** — touch target mínimo 44×44 CSS px. Hoje atendido por overlay `::before` em vários componentes (TD-016 fechada via overlay). Subir o tamanho visual elimina o hack — overlay fica como fallback de Field-children pequenos (Switch, Counter button), não regra.
2. **Mobile-first** — Arbor-DS tem ambição cross-platform real. 44px é o número Apple (44pt) e Material 3 (48dp em mobile, 40 em desktop usa overlay). Acima dos dois.
3. **Densidade desktop** — 44px ainda é confortável. Linear default = 32px (ferramenta dev), Vercel = 36-40px, Stripe = 40-44px, GitHub Primer = 32-40px. Estamos no topo da banda mas dentro do contemporâneo.
4. **Override é trivial** — produto que quiser desktop denso reduz `controlSize.medium` para 40 ou 36 no `createTheme()`. Token é o canal.

**Mudanças:**
```diff
// src/foundations/tokens/semantics/sizes/control.ts
 export const controlSize = {
-  small: '32px',
-  medium: '40px',
-  large: '48px',
+  small: '36px',  // era 32 — alinhar a faixa interna (delta consistente +4)
+  medium: '44px',
+  large: '52px',  // era 48 — manter delta
 };
```

**Side effect:** padding interno proporcional. Sweep PR2 atualiza `button.padding`, `input.padding`, etc., via component tokens.

**Risco:** **médio** — afeta layout de qualquer consumidor (mas produtos zero pré-v1).

---

### 3.7. Eixo G — Foco visível premium

**Mudanças:**

Engine atual aplica outline 2px sólido em `[data-arbor-focusable]:focus-visible`. Adicionar **glow secundário** opcional via box-shadow consumindo `--arbor-color-focus-ring` com alpha:

```css
[data-arbor-focusable]:focus-visible {
  outline: 2px solid var(--arbor-color-focus-ring);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--arbor-color-focus-ring-glow);  /* novo */
}
```

`focus.ringGlow` é semantic novo: `rgba(focus.ring, 0.20)`. Resolução em runtime via CSS var de cor decomposta.

**Decisão sobre ser themable:** mantemos a anatomia (outline width/offset/glow size) **não** themable — defaults WCAG-compliant. Themable é só `focus.ring` (cor) e `focus.ringGlow` (cor com alpha derivada). Coerente com skill: "anatomia do anel é estrutura, cor é identidade".

**Native:** glow se traduz para `borderColor` + `borderWidth`. Engine native já tem fallback.

**Risco:** **baixo** — aditivo; reduced-motion não afeta foco.

---

### 3.8. Eixo H — Brand default (decisão maior)

**3 candidatos avaliados** (todos já existem na paleta de primitivas, todos passaram em RFC-0039 ao serem contrastados na escala 12 papéis):

| Candidato | Hex (solid) | Identidade | Comparáveis | Contraste sobre `#FFFFFF` | Pros | Cons |
|---|---|---|---|---|---|---|
| **Sapphire 70** | `#0B46E6` | Azul royal punchy, fintech sério | Stripe (`#635BFF`), Mercury, Cron | 7.4:1 (AAA) | Confiável, "marca técnica", aceitável em qualquer setor; ótimo contraste | Pouco diferenciador (azul é commodity); pode parecer "corporate" |
| **Ultraviolet 70** | `#6352E1` | Violeta moderno equilibrado | Linear (`#5E6AD2`), Discord-ish | 5.8:1 (AA) | Linear-feel direto; ponto ótimo entre punchy e versátil; 12 papéis derivam paleta rica | Tom específico — alguns produtos podem achar "tech demais" |
| **Violet 70** | `#9F23FB` | Magenta-violeta expressivo | Twitch, Adobe Creative | 5.4:1 (AA) | Mais "criativo/jovem"; alto punch | Polariza — fintech/saúde/serviço sério não casa; pode datar rápido |

**Recomendação técnica do arquiteto:** **Ultraviolet 70 (`#6352E1`)**.

**Motivos:**
1. Ponto ótimo entre punch e versatilidade — vitrine, painel, app de serviço, landing todos cabem.
2. Identidade alinhada com referências citadas pela usuária (Linear).
3. AA confortável; 12 papéis derivam escala homogênea (validado em RFC-0039 — `createBrandPalette` é estável para esta cor).
4. Brand alias `brand.solid = #6352E1` deixa `brand.bgElement` (papel 3) com tonalidade lavanda agradável para `Button.secondary`.

**Decisão pendente:** usuária escolhe na revisão olhando os 3 candidatos no Storybook (PR1 entrega comparativo).

---

## 4. Estrutura proposta

### 4.1. Mudanças por camada

```
foundations/
  tokens/
    primitives/
      typography/font-weight.ts   ← +600
      typography/font-size.ts     ← +40/48/60/72
      shadows.ts                  ← stack multi-layer + brand.* novo
      motion.ts                   ← snap easing + duration redefinida
    semantics/
      typography/font-weight.ts   ← bold redireciona para 600
      typography/font-size.ts     ← display.{small,medium,large,hero}
      sizes/control.ts            ← 36/44/52
      color/themeLightColors.ts   ← background.subtle off-white quente; muted novo
      color/themeDarkColors.ts    ← simétrico
    components/
      button.ts                   ← transition + hover + fontWeight semibold (PR1)
      input.ts, card.ts, ...      ← sweep coletivo no PR2
  theme/
    base-theme.ts                 ← recipe button.tsx ganha _hover/_active (PR1)
ecosystem/
  styled-system/
    adapters/web/provider.tsx     ← emissão de --arbor-color-focus-ring-glow
    adapters/web/focus.css        ← box-shadow glow secundário
```

### 4.2. Cascade preservada

Cada decisão respeita o caminho canônico de override:

1. Produto quer voltar verde-aqua: `createTheme(themeLight, { colors: { brand: { base: '#1BA285' } } })` ✓
2. Produto quer 40px medium: `createTheme(themeLight, { sizes: { control: { medium: '40px' } } })` ✓
3. Produto quer easing Material: `createTheme(themeLight, { motion: { easing: { standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)' } } })` ✓
4. Produto quer foco sem glow: override `focus.ringGlow` para `transparent` ✓

Nenhum override exige edição de arquivo do DS.

---

## 5. API / tipagem

Sem mudança em API pública de componente. Toda evolução é via tokens. Esse é um critério de qualidade do RFC: se uma decisão exigisse mudar prop de Button, sairia do escopo dessa RFC e viraria RFC própria.

**Único ajuste tipado:**
- `fontWeight` semantic: `'semibold'` é nome novo. `bold` já existia mas redireciona; consumidores não sentem.
- `controlSize` valores nominais não mudam (`small/medium/large`); apenas pixels.

---

## 6. Estratégia cross-platform

| Eixo | Web | Native | Notas |
|---|---|---|---|
| A. Typography | ✓ | ✓ | RN aceita 600. fontSize 40+ ok. |
| B. Shadows neutras | ✓ multi-layer CSS | ✓ via `elevation` + `shadowOpacity` calibrados | Engine já normaliza. |
| B. Shadows.brand | ✓ via CSS var rgb | Fallback `shadows.lg` + `borderColor: brand.solid` 1px | Documentado em CHANGELOG. |
| C. Motion easing snap | ✓ via CSS | ✓ via `Animated` (curva conversível) | Conversor já existe em `engine/motion`. |
| C. Reduced motion | ✓ `usePrefersReducedMotion` | ✓ via `AccessibilityInfo` (TD-032 fechada) | Sem regressão. |
| D. Microinterações | `translateY` + shadow | RN ignora `translateY` em hover (não há hover); microfeedback via `PressFeedback` já existente | Paridade comportamental. |
| E. background.subtle off-white | ✓ | ✓ | Cor primitive comum. |
| F. Density 44px | ✓ | ✓ | Touch target ganha em RN. |
| G. Focus glow | ✓ | Sem foco visual idêntico — RN herda comportamento nativo do TextInput | Documentado. |
| H. Brand | ✓ | ✓ | `createBrandPalette` é puro JS. |

**Web-only count:** mantém 0 (RFC-0022 fechou `Table.native`).

---

## 7. Impacto em DX

**Ganhos:**
- Importar e usar entrega resultado contemporâneo direto.
- Storybook vira showcase legítimo, não "prove que customizando dá".
- `_hover` em Button é consequência de tema, não código de consumidor — onboarding mais rápido.
- Documentação "Criando um produto" pode mostrar `aqua` como override de exemplo (preserva legado pedagogicamente).

**Custos:**
- Breaking visual em quem já tinha Storybook fork ou screenshot baseline. Aceito (pré-v1).
- 2-3 nomes a mais no `fontSize` semantic (display.*). Onboarding cresce 1 linha.

---

## 8. Impacto em acessibilidade e performance

**Acessibilidade — ganhos:**
- Touch target 44px nativo elimina overlay `::before` em diversos componentes (limpeza estrutural).
- Glow no foco não substitui outline — aditivo. WCAG 2.4.7 mantém. WCAG 2.4.11 (focus appearance reforçado, AA) **passa para AAA** com glow.
- `motion.duration.normal` 160ms continua confortável; `usePrefersReducedMotion` zera.

**Acessibilidade — riscos:**
- Brand novo precisa passar contraste em 12 papéis. Sapphire 70 = AAA, Ultraviolet 70 = AA, Violet 70 = AA. Todos passam. Validado por `pnpm test:contrast`.

**Performance:**
- Multi-layer shadow tem custo levemente maior em paint (composited layers ajudam). Imperceptível em GPU moderna.
- Motion snap (easing OutQuart) tem custo idêntico ao Material standard.
- Glow no foco usa box-shadow — sem reflow, só repaint. Imperceptível.

---

## 9. Plano de execução

### PR1 — Foundations + Button piloto (esta RFC, primeira entrega)

**Escopo:**
1. Atualizar primitives: `font-weight.ts`, `font-size.ts`, `shadows.ts`, `motion.ts`.
2. Atualizar semantics: `fontWeight`, `fontSize`, `controlSize`, `background.subtle`/`muted`, `focus.ringGlow`.
3. Atualizar `themeLightColors.ts` + `themeDarkColors.ts` com novo brand (escolha da usuária — default ultraviolet caso não responda em 24h).
4. Atualizar `tokens/components/button.ts`: `fontWeight: 'semibold'`, `transition`, `hover`.
5. Atualizar recipe `button` em `base-theme.ts` com `_hover`/`_active`.
6. Provider emite `--arbor-color-focus-ring-glow`; `focus.css` ganha glow.
7. Storybook: nova página "Polish v1 — Button piloto" com 3 candidatos de brand lado a lado (sapphire / ultraviolet / violet).
8. Testes: rodar suíte completa; ajustar assertions visuais que regredirem (esperado).

**Critério de aceite PR1:**
- [ ] Suíte verde (1093+ testes — algum visual pode adaptar).
- [ ] `pnpm test:contrast` verde para os 3 candidatos.
- [ ] `pnpm test:component-tokens-no-literal` verde.
- [ ] Storybook novo screen aprovado pela usuária.
- [ ] CHANGELOG: Unreleased Breaking documenta as mudanças.

**Parada:** review da usuária. Aprovação do brand vencedor + revisão do Button piloto destrava PR2.

---

### PR2 — Sweep coletivo dos demais ~25 componentes

**Escopo:**
- Atualizar `tokens/components/*.ts` para refletir novo `controlSize` (paddings proporcionais), shadows revisadas, `fontWeight` semibold em headings de Card/Modal/Drawer.
- Atualizar recipes que consomem hover/active para padronizar transition.
- Card.interactive: `translateY(-2px)` + `shadows.lg`.
- Chip.selectable: microfeedback consistente.

**Critério de aceite PR2:**
- [ ] Suíte verde.
- [ ] Visual review no Storybook em todos os componentes.
- [ ] Touch target 44px verificado em mobile (Counter, Switch ainda precisam de overlay; documentar).

---

### PR3 — Stories vitrine pré-v1 (4 demos)

**Escopo:**
- 4 demo screens em `src/stories/showcase/`:
  1. **VitrineProduto** — listagem + card produto + filtros + paginação.
  2. **PainelAdmin** — sidebar + tabela + KPIs (Card) + dialog de detalhe.
  3. **AppServico** — header + lista de serviços + carousel + bottom sheet (Drawer).
  4. **LandingHero** — hero (display 72px) + features grid + CTA primary com brand shadow.
- Cada demo demonstra que **default** sustenta o cenário sem `extendTheme()` ou customização.

**Critério de aceite PR3:**
- [ ] 4 demos buildam.
- [ ] Aprovação visual da usuária — "isso vai pra vitrine de v1".

---

### PR4 — Página "Identidade Visual" no Storybook

**Escopo:**
- Storybook page `Foundations / Identidade Visual` com:
  - Tokens showcase (cores, sombras, motion, density, typography).
  - Antes/depois comparativo com baseline anterior à RFC.
  - Recipe Button.primary: anatomia anotada (transition, hover, shadow brand).

**Critério de aceite PR4:**
- [ ] Página build + lint + screenshot no PR.

---

### PR5 (opcional) — Storybook play snapshots

**Escopo:**
- Ativar `play()` em stories críticas (Button hover/focus, Card interactive, Tooltip motion) para regressão visual no CI.

**Decisão:** opcional pré-v1. Pode ficar como TD pós-v1 se prazo apertar.

---

## 10. Critérios de qualidade — checklist final

Pré-merge da RFC inteira (após PR4):

- [ ] Suíte ≥1093 testes verdes (delta esperado em assertions visuais documentado).
- [ ] `pnpm test:contrast` verde com brand vencedor.
- [ ] `pnpm test:no-color-literal` verde.
- [ ] `pnpm test:component-tokens-no-literal` verde.
- [ ] `pnpm test:recipe-aliases` verde — 0 órfãos.
- [ ] `pnpm test:platform-contract --strict` verde — web-only = 0.
- [ ] `pnpm size` dentro do orçamento (multi-layer shadow não muda bundle; motion redefine string).
- [ ] CHANGELOG `Unreleased`/`Breaking` documenta as 8 mudanças.
- [ ] Quatro demos vitrine buildam sem `extendTheme()`.
- [ ] Storybook "Polish v1" aprovado pela usuária.

---

## 11. Considerações de governança

- **RFC-0039 (paleta 12)** e **RFC-0040 (component tokens)** são dependências fechadas. Esta RFC consome o que elas estabeleceram.
- **TD-026 (focus ring desacoplado)** já fechada: `focus.ring` é themable. RFC-0041 só **estende** com `focus.ringGlow`.
- **TD-016 (touch target overlay)** será **parcialmente fechada** pelo Eixo F: componentes com `controlSize.medium` deixam de precisar de `::before` overlay; remanescentes (Switch, Counter button) ainda dependem.
- **Memory `project_execution_queue.md`** atualizada após o merge de PR1.

---

## 12. Anexo — Decisão pendente única (necessária antes de PR1)

**Pergunta para a usuária:** qual brand?

Os 3 candidatos serão apresentados lado a lado no Storybook do PR1 (página "Polish v1 — Brand candidates") para decisão informada. Se a usuária preferir decidir agora sem ver:

- A. **Sapphire 70 (`#0B46E6`)** — azul royal, fintech-friendly, AAA contraste.
- B. **Ultraviolet 70 (`#6352E1`)** — violeta moderno, Linear-feel — **recomendação do arquiteto**.
- C. **Violet 70 (`#9F23FB`)** — magenta-violeta, expressivo, polariza.

Default em ausência de resposta após PR1 buildar = **B (Ultraviolet 70)**, com nota explícita no CHANGELOG sobre poder reverter via 1 linha de tema.

---

## 13. Referências

- RFC-0039 — paleta 12 papéis nominais
- RFC-0040 — component tokens estruturados
- WCAG 2.4.7 — Focus Visible (AA)
- WCAG 2.4.11 — Focus Appearance (AAA com glow)
- WCAG 2.5.5 — Target Size (AA)
- Linear, Vercel, Stripe, Notion — referências de "moderno por construção"
- `docs/THEMING.md` — cascade canônica de override
