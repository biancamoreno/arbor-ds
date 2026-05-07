# RFC-0039 — Paleta com 12 papéis nominais

**Status**: Draft
**Autores**: @bia, @arbor-ds-arch
**Data**: 2026-05-06
**PR**: (a definir)

---

## Motivação

A camada semantic atual entrega 4 papéis themable por família (`subtle`, `soft`, `base`, `strong`). Isso é insuficiente para combinações reais — chip com fundo brand-3, borda brand-7 e texto brand-11 hoje obriga consumir primitive direto (`color.aqua['10']`), o que **viola o contrato themable** do `docs/ARCHITECTURE_DIRECTION.md` §2.2: o valor congela no module-load e o override do tema não propaga.

Esse gap também bloqueia o roadmap arquitetural:

- **RFC-0040 (component tokens)** precisa de aliases ricos (`brand.solid`, `brand.border`, `brand.bgElement`) para que bindings tenham vocabulário suficiente. Com só 4 papéis, component tokens caem em casos limítrofes (ex: `button.primary.bg.hover` precisa de uma cor entre `base` e `strong` — hoje, ninguém).
- **RFC-0045 (presets de personalidade)** reescreve tokens em bloco. Sem 12 papéis, presets ficam pobres.
- **RFC-0027 `createBrandPalette`** gera escalas de produto e hoje só preenche 4 papéis.

A referência de mercado é clara: **Radix Colors**, **Material 3**, **GitHub Primer Prism**, **Atlassian Tokens** e **Tailwind v4** convergem para 11–12 papéis com semântica documentada por step. É o estado da arte de DS maduro.

### O problema concretamente

Casos reais que **não** se resolvem hoje sem inline:

1. **Tag tone `info` selecionada com fundo intenso e borda mais forte que o sólido**: cobre `bg/solid/solidHover`, mas falta o papel intermediário entre solid e solidHover (onde Material e Radix marcam pressed).
2. **Card com fundo `surface.subtle` e borda derivada da própria escala neutra**: surface tem `default/raised/elevated/translucent/overlay` mas não tem o papel "border subtle" derivado do neutral.
3. **Texto link sobre fundo brand-subtle**: `text.link` é cor avulsa (não derivada de brand), o que quebra contraste em produtos que mudam só `brand.base`.

Esses três casos hoje viram inline literal ou recipe fora do contrato.

---

## Proposta

### 1. Escala canônica de 12 papéis

Cada **família themable** ganha uma escala de 12 steps na camada semantic, com papel canônico documentado por step:

| Step | Papel canônico | Uso típico |
|---|---|---|
| **1** | `bg` | Fundo de página / app |
| **2** | `bgSubtle` | Fundo de seção sutil, banner discreto |
| **3** | `bgElement` | Fundo de componente UI em repouso (chip subtle, badge, alert subtle) |
| **4** | `bgElementHover` | Hover do componente UI |
| **5** | `bgElementActive` | Pressed / selected do componente UI |
| **6** | `borderSubtle` | Separador, borda decorativa |
| **7** | `border` | Borda canônica de UI (input border, focus ring color) |
| **8** | `borderHover` | Borda hover de UI |
| **9** | `solid` | Fundo sólido (Button primary bg, FAB, switch ON, brand fill) |
| **10** | `solidHover` | Hover do sólido |
| **11** | `text` | Texto de baixo contraste sobre fundo neutro (links, ícones em-família) |
| **12** | `textContrast` | Texto de alto contraste sobre fundo neutro (heading na cor da família) |

A semântica segue Radix Colors com naming adaptado ao vocabulário do Arbor (em prosa, sem siglas).

### 2. Acesso por número e por alias nominal

A escala é exposta de **dois jeitos** ao consumidor, com paridade total — ambos resolvem para o mesmo valor:

```ts
// Acesso numérico (canônico, scale completo)
colors.brand[1]   // bg
colors.brand[3]   // bgElement
colors.brand[9]   // solid
colors.brand[12]  // textContrast

// Acesso nominal (ergonômico)
colors.brand.bg
colors.brand.bgElement
colors.brand.solid
colors.brand.textContrast
```

Aliases nominais são **sugar**: cada nome resolve para o número correspondente. Tooling de validação de contraste, geração de paletas e diff usa preferencialmente o número; código de aplicação usa preferencialmente o nome.

### 3. Famílias themable cobertas

| Família | Razão |
|---|---|
| `brand` | Identidade primária do produto |
| `gray` (mapeada a `neutral`) | Toda a estrutura visual (texto, borda, surface) deriva |
| `feedback.info` | Estado informativo |
| `feedback.success` | Estado de sucesso |
| `feedback.warning` | Estado de alerta |
| `feedback.critical` | Estado crítico |

Outras famílias primitivas (lavender, lime, ocean, sapphire, etc.) **permanecem como primitives**. Produtos que precisarem usá-las acessam via `extendTheme()`:

```ts
extendTheme(themeLight, {
  colors: {
    accent: createScaleFromFamily(color.lavender),
  },
});
```

### 4. Mapeamento das famílias atuais para os 12 steps

A escala numérica primitive existente (`10..120`) é **preservada** como camada bruta. O mapping para os 12 papéis acontece na **camada semantic**:

#### Famílias com 12 steps primitives (aqua, ocean, sapphire, sky, neutral)

Mapping direto — cada step primitive vira um step semantic:

```
primitive aqua.10  → semantic brand[1]   (bg)
primitive aqua.20  → semantic brand[2]   (bgSubtle)
primitive aqua.30  → semantic brand[3]   (bgElement)
primitive aqua.40  → semantic brand[4]   (bgElementHover)
primitive aqua.50  → semantic brand[5]   (bgElementActive)
primitive aqua.60  → semantic brand[6]   (borderSubtle)
primitive aqua.70  → semantic brand[7]   (border)
primitive aqua.80  → semantic brand[8]   (borderHover)
primitive aqua.90  → semantic brand[9]   (solid)
primitive aqua.100 → semantic brand[10]  (solidHover)
primitive aqua.110 → semantic brand[11]  (text)
primitive aqua.120 → semantic brand[12]  (textContrast)
```

O papel canônico **solid** (Button primary bg, etc.) passa a ser `brand[9] = aqua.90` — calibração visual deliberada: `aqua.90` tem contraste WCAG AAA com texto branco, enquanto a antiga base (`aqua.60`) tinha AA limítrofe.

#### Famílias com 10 steps primitives (emerald, red, orange, etc.)

Hoje cobrem `10..100`. Para virarem famílias themable de 12 papéis, precisam de **2 steps adicionais** (110 e 120) representando os tons mais escuros para `text` e `textContrast`.

Esses dois steps são **derivados algorítmicamente** via OKLCH (espaço perceptual uniforme):

```
step.110 = oklch(L: step.100.L * 0.85, C: step.100.C * 0.95, H: step.100.H)
step.120 = oklch(L: step.100.L * 0.70, C: step.100.C * 0.90, H: step.100.H)
```

Um script `scripts/extend-palette.ts` gera os steps faltantes para todas as famílias 10-step e adiciona ao arquivo de primitives. Validação: contraste mínimo `step.11 ≥ 4.5:1` sobre `step.1` (WCAG AA texto), `step.12 ≥ 7:1` sobre `step.1` (WCAG AAA).

### 5. Light/dark mode

Cada papel tem mapping distinto entre light e dark mode. Convenção: em **dark mode** o papel `solid` desce uma "intensidade" para preservar legibilidade sobre fundo escuro.

#### Mapping resumido (brand sobre família aqua)

| Papel | Light → primitive | Dark → primitive |
|---|---|---|
| `bg` | aqua.10 | aqua.120 |
| `bgSubtle` | aqua.20 | aqua.110 |
| `bgElement` | aqua.30 | aqua.100 |
| `bgElementHover` | aqua.40 | aqua.90 |
| `bgElementActive` | aqua.50 | aqua.80 |
| `borderSubtle` | aqua.60 | aqua.70 |
| `border` | aqua.70 | aqua.60 |
| `borderHover` | aqua.80 | aqua.50 |
| `solid` | aqua.90 | aqua.50 |
| `solidHover` | aqua.100 | aqua.40 |
| `text` | aqua.110 | aqua.30 |
| `textContrast` | aqua.120 | aqua.20 |

Em dark mode, `solid` cai para `aqua.50` (mais claro que light) — preserva legibilidade de texto inverse sobre o sólido em fundo dark.

### 6. Vocabulário antigo é descontinuado

Os 4 papéis atuais (`subtle`, `soft`, `base`, `strong`) são **removidos**. Sem aliases de transição, sem deprecation window — o codemod interno troca todos os consumidores pelos nomes canônicos:

```
brand.subtle  → brand.bgElement       (brand[3])
brand.soft    → brand.bgElementActive (brand[5])
brand.base    → brand.solid           (brand[9])
brand.strong  → brand.solidHover      (brand[10])
```

Mesmo tratamento para `gray.*` e `feedback.{info,success,warning,critical}.*`. Alinha com o precedente da TD-012 (sweep de depreciados) registrado em `project_deprecated_sweep.md`.

### 7. API resultante

```ts
// Tipo do tema
type ColorScale = {
  // Numeric canonical
  1: string;  2: string;  3: string;  4: string;
  5: string;  6: string;  7: string;  8: string;
  9: string; 10: string; 11: string; 12: string;

  // Nominal aliases
  bg: string;
  bgSubtle: string;
  bgElement: string;
  bgElementHover: string;
  bgElementActive: string;
  borderSubtle: string;
  border: string;
  borderHover: string;
  solid: string;
  solidHover: string;
  text: string;
  textContrast: string;
};

type ThemeColors = {
  brand: ColorScale;
  gray: ColorScale;
  feedback: {
    info: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    critical: ColorScale;
  };
  // ...demais semantics existentes
};
```

### 8. Validação de contraste

Cada par canônico tem contraste validado em CI:

| Combinação | Contraste mínimo | WCAG |
|---|---|---|
| `text` sobre `bg` | 4.5:1 | AA |
| `textContrast` sobre `bg` | 7:1 | AAA |
| `solid` com texto inverse (white/black) | 4.5:1 | AA |
| `border` sobre `bg` | 3:1 | AA non-text |
| `bgElement` distinguível de `bg` | ≥1.2 ratio | UI consistency |

Script `scripts/validate-contrast.ts` roda em CI; quebra build se algum par cair abaixo do mínimo.

### 9. Geração para produtos custom

`createBrandPalette` (RFC-0027) é evoluído para gerar 12 papéis em vez de 4:

```ts
// Antes
createBrandPalette('#FF3366')
// → { subtle, soft, base, strong }

// Depois
createBrandPalette('#FF3366')
// → ColorScale completa (12 + nominais)
```

Algoritmo: gera 12 steps em OKLCH a partir da cor de entrada (mesma técnica de Radix Custom Colors / Tailwind v4), valida contrastes, retorna escala light + dark pareadas.

---

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **A. Manter 4 papéis (`subtle/soft/base/strong`)** | Insuficiente para component tokens estruturados (RFC-0040) e presets (RFC-0045). Combinações ricas viram inline. |
| **B. Importar Radix Colors literal** | Atrelaria o DS a uma paleta externa, perdendo controle sobre tons e licença. Não combina com `createBrandPalette` para produtos custom. |
| **C. Apenas escala numérica (`brand[1..12]`), sem aliases nominais** | Industria-padrão e tooling-friendly, mas viola a convenção do Arbor de naming em prosa. |
| **D. Apenas aliases nominais (`brand.bg`, `brand.solid`...)** | Ergonômico, mas perde tooling-friendly: scripts de palette/contrast fazem `for i in 1..12` muito mais limpos. |
| **E. Escala numérica + nominal (escolhida)** | Combina o melhor: tooling pega numérico, código consome nominal. Custo: dobra superfície da API, mitigado por geração automática. |
| **F. Manter `subtle/soft/base/strong` como aliases** | Gera dívida desde o nascimento e fragmenta vocabulário. Sem consumidores externos, não há motivo para preservar. |
| **G. Estender escala primitive (renomear `aqua.10` → `aqua.1`)** | Quebra hard de toda referência a primitives. Custo desproporcional ao ganho. Resolvido mantendo numbering primitive (10..120) e introduzindo papéis na semantic. |

---

## Impactos e trade-offs

- **Breaking change?** Sem consumidores externos — irrelevante. Internamente, sweep total (precedente TD-012).
- **Impacto em bundle size**: ~+2 KB (paleta expandida). Negligível.
- **Impacto em performance**: zero. Resolução é por lookup em objeto.
- **Impacto em DX**:
  - **Positivo**: vocabulário rico, contraste validado, combinações expressivas, alinhamento com indústria.
  - **Negativo**: novo vocabulário a aprender. Mitigado por docs.
- **Impacto em acessibilidade**: **forte positivo**. Validação de contraste automatizada elimina pares ruins por construção.
- **Impacto em theming multi-produto**: `createBrandPalette` gera escala completa — produtos novos chegam a 12 papéis sem trabalho extra.

---

## Critérios de aceite

- [ ] 12 papéis (numérico + nominal) implementados em `src/foundations/tokens/semantics/color/scale.ts`.
- [ ] Famílias `brand`, `gray`, `feedback.{info,success,warning,critical}` migradas para escala completa em `themeLightColors` e `themeDarkColors`.
- [ ] Vocabulário antigo (`subtle/soft/base/strong`) **removido** de tipos, themes e consumidores internos. Sem aliases.
- [ ] Script `scripts/extend-palette.ts` gera steps `110/120` para famílias 10-step via OKLCH.
- [ ] Script `scripts/validate-contrast.ts` em CI, valida pares WCAG canônicos, quebra build em violação.
- [ ] `createBrandPalette` (RFC-0027) atualizado para gerar 12 papéis (numérico + nominal).
- [ ] Tipos TypeScript exportam `ColorScale` para consumidores customizarem famílias próprias.
- [ ] Storybook tokens showcase atualizado mostrando os 12 papéis lado a lado, com contraste calculado.
- [ ] Mapping documentado: tabela primitive → semantic step para cada família themable, light + dark.
- [ ] Testes verdes (suite atual + novos testes de contraste e mapping).
- [ ] `docs/ARCHITECTURE_DIRECTION.md` referenciado na motivação.
- [ ] CHANGELOG entry em `Unreleased`.

---

## Notas de implementação

### Execução em PR único

Sem consumidores externos, a RFC entrega em **1 PR completo**:

1. Adiciona `ColorScale` (12 papéis numérico + nominal) em `src/foundations/tokens/semantics/color/scale.ts`.
2. Implementa `extend-palette.ts` (gera steps 110/120 para famílias 10-step) e `validate-contrast.ts` (CI gate).
3. Atualiza tipos em `src/foundations/theme/types.ts` para expor `ColorScale`.
4. `themeLightColors`/`themeDarkColors` migrados para escala completa de 12 papéis.
5. Sweep de consumidores internos do vocabulário antigo (`subtle/soft/base/strong`) — codemod automatizado:
   ```
   brand.subtle  → brand.bgElement
   brand.soft    → brand.bgElementActive
   brand.base    → brand.solid
   brand.strong  → brand.solidHover
   ```
   Mesmo tratamento para `gray.*` e `feedback.*.*`.
6. `createBrandPalette` reescrito para gerar 12 papéis em OKLCH.
7. Storybook tokens page com gerador interativo: usuário cola hex, vê 12 papéis + contraste por par.
8. `docs/THEMING.md` (criar se não existir) documenta os papéis canônicos.

Storybook + screenshot diff servem como verificação visual; sem alias legado, qualquer regressão aparece imediatamente em vez de mascarada por redirecionamento.

### Riscos identificados

1. **Famílias 10-step extendidas algorítmicamente**: os steps 110/120 gerados por OKLCH podem não casar 100% com o que um designer escolheria manualmente. Mitigação: revisão visual no Storybook; possibilidade de override manual da escala extendida em arquivo de calibração separado se necessário.
2. **API duplicada (numérica + nominal)**: surface area dobra. Mitigação: ambos são gerados a partir de uma única definição; tipos exportados garantem consistência.

### Dependências

- **Nenhum** bloqueio externo. RFC-0039 é a primeira do tier 1 do roadmap §5.4.
- Habilita: RFC-0040 (component tokens), RFC-0043 (shadows colored), RFC-0045 (presets), RFC-0046 (`extendTheme` com brand custom de 12 papéis).

### Referências externas

- [Radix Colors — Understanding the Scale](https://www.radix-ui.com/colors/docs/palette-composition/scales)
- [Material 3 Tonal Palettes](https://m3.material.io/styles/color/the-color-system/key-colors-tones)
- [Tailwind v4 Color Spec](https://tailwindcss.com/docs/colors)
- [GitHub Primer Prism](https://primer.style/prism)
- `docs/ARCHITECTURE_DIRECTION.md` §2.2 (camada semantic rica)
- `docs/rfcs/RFC-0027-multi-product-themable-contract.md` (`createBrandPalette` original)
