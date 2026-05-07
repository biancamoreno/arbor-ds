# Theming — Arbor-DS

Guia operacional do sistema de tematização. Para o posicionamento estratégico e a arquitetura completa de cinco camadas, ver [`docs/ARCHITECTURE_DIRECTION.md`](./ARCHITECTURE_DIRECTION.md).

---

## ColorScale — 12 papéis canônicos (RFC-0039)

Cada **família themable** (`brand`, `gray`, `feedback.info`, `feedback.success`, `feedback.warning`, `feedback.critical`) expõe uma `ColorScale` com 12 steps. Acesso numérico e nominal resolvem para o mesmo valor:

```ts
theme.colors.brand[9]      // === theme.colors.brand.solid
theme.colors.brand[1]      // === theme.colors.brand.bg
theme.colors.brand[12]     // === theme.colors.brand.textContrast
```

| Step | Papel | Uso típico |
|---|---|---|
| 1 | `bg` | Fundo de página / app |
| 2 | `bgSubtle` | Fundo de seção sutil, banner discreto |
| 3 | `bgElement` | Fundo de UI em repouso (chip subtle, badge, alert subtle) |
| 4 | `bgElementHover` | Hover do componente UI |
| 5 | `bgElementActive` | Pressed / selected do componente UI |
| 6 | `borderSubtle` | Separador, borda decorativa |
| 7 | `border` | Borda canônica de UI (input border, focus ring color) |
| 8 | `borderHover` | Borda hover de UI |
| 9 | `solid` | Fundo sólido (Button primary, FAB, switch ON, brand fill) |
| 10 | `solidHover` | Hover do sólido |
| 11 | `text` | Texto de baixo contraste sobre fundo neutro (links, ícones em-família) |
| 12 | `textContrast` | Texto de alto contraste sobre fundo neutro (heading na cor da família) |

### Convenção dark mode

Em dark mode, `solid` desce uma intensidade para preservar legibilidade sobre fundo escuro. `borderHover` e `solid` coincidem em valor (`primitive[50]`) — calibração canônica Radix-style, não bug.

### Famílias themable

| Família | Primitive | Uso |
|---|---|---|
| `brand` | `aqua` | Identidade primária do produto |
| `gray` | `neutral` | Canal estrutural (texto, borda, surface) |
| `feedback.info` | `ocean` | Estado informativo |
| `feedback.success` | `emerald` | Estado de sucesso |
| `feedback.warning` | `orange` | Estado de alerta |
| `feedback.critical` | `red` | Estado crítico |

Outras primitives (`lavender`, `sapphire`, `sky`, `tangerine`, etc.) ficam disponíveis para produtos consumirem via `extendTheme()` quando precisarem de famílias adicionais com role mapping próprio.

---

## Quando usar qual papel

A heurística canônica para escolher o papel ao consumir um token de família:

| Caso de uso | Papel |
|---|---|
| Fundo de página inteira (rara em DS) | `bg` |
| Fundo de seção destacada | `bgSubtle` |
| Fundo de chip/badge subtle, alert subtle | `bgElement` |
| Hover desse mesmo elemento | `bgElementHover` |
| Pressed/selected (estado ativo) | `bgElementActive` |
| Separador horizontal/vertical | `borderSubtle` |
| Borda canônica de input, foco | `border` |
| Hover da borda | `borderHover` |
| Fundo sólido de Button primary, FAB, brand fill | `solid` |
| Hover do sólido | `solidHover` |
| Cor de texto/ícone em-família sobre fundo neutro | `text` |
| Cor de texto enfático (heading) em-família | `textContrast` |

Quando o componente precisa do par "bg + texto", use `bgElement` (fundo) + `text` (texto). Para conteúdo crítico (heading), use `bg` + `textContrast`. Texto branco sobre `solid` é o padrão para Button primary, FAB e similares — exceto `feedback.warning`, que tradicionalmente leva texto escuro (`text.primary`) sobre solid amarelo/laranja.

---

## Customização por produto

### Override completo de marca via `createBrandPalette`

```ts
import { createBrandPalette } from 'arbor-ds';

const violet = createBrandPalette('#7C3AED');

createTheme(themeLight, {
  colors: {
    brand: violet.light,
    interactive: {
      default: violet.light.solid,
      hover: violet.light.solidHover,
      active: violet.light.textContrast,
    },
    border: { interactive: violet.light.solid },
    icon: { interactive: violet.light.solid },
    focus: { ring: violet.light.solid },
  },
});

createTheme(themeDark, {
  colors: {
    brand: violet.dark,
    // ... mesma estrutura para dark
  },
});
```

A interpolação sRGB cobre 80% dos casos. Se algum step específico precisar de calibração manual, use o segundo argumento:

```ts
const violet = createBrandPalette('#7C3AED', {
  light: { 1: '#FBF9FF', 12: '#1A0B3D' },  // override pontual em light
  dark:  { 12: '#FFFFFF' },                 // override pontual em dark
});
```

### Override de step individual sem palette completa

```ts
createTheme(themeLight, {
  colors: {
    brand: {
      ...themeLight.colors.brand,
      solid: '#0066CC',
      solidHover: '#0052A3',
    },
  },
});
```

### Override de feedback (afeta Alert, Toast, Badge, ProgressBar, Tag, Chip simultaneamente)

```ts
createTheme(themeLight, {
  colors: {
    feedback: {
      ...themeLight.colors.feedback,
      critical: {
        ...themeLight.colors.feedback.critical,
        solid: '#FF3366',
        bgElement: '#FFE5EC',
      },
    },
  },
});
```

---

## Validação de contraste em CI

`pnpm test:contrast` valida pares canônicos WCAG na escala (light + dark) por família themable:

| Par | Mínimo | Justificativa |
|---|---|---|
| `text` sobre `bg` | 4.5:1 | WCAG AA texto |
| `textContrast` sobre `bg` | 7:1 | WCAG AAA |
| `border` sobre `bg` | 3:1 | WCAG AA non-text |
| `text.inverse` sobre `solid` | 4.5:1 | WCAG AA texto sobre fundo sólido |

Quebra build em violação, exceto para `gray` (canal neutro estrutural — derivações vivem fora da escala em `theme.colors.text.*`) e `feedback.warning` (convenção visual: texto escuro sobre solid amarelo/laranja, não branco). Esses dois saem como warnings.

Quando alterar a calibração de uma primitive, rode o script localmente para confirmar que a paleta resultante ainda passa.

---

## Casos comuns

### "Quero meu produto com marca diferente"

```ts
const myBrand = createBrandPalette('#FF3366');
createTheme(themeLight, { colors: { brand: myBrand.light, ... } });
```

### "Quero borda do input mais arredondada"

```ts
createTheme(themeLight, { radii: { small: 8 } });
```

### "Quero um produto mais denso"

Use override de `sizes.control` (RFC-0027 PR3) — futuramente coberto por preset de densidade (RFC-0045):

```ts
createTheme(themeLight, {
  sizes: { control: { small: '28px', medium: '36px', large: '44px' } },
});
```

### "Quero tokens próprios para crypto vs fiat"

Use `extendTheme()` (futuro RFC-0046) — não infle o DS com tokens de domínio.

---

## Anti-padrões

- **Importar primitive direto em componente**: `import { color } from 'arbor-ds/foundations'; color.aqua[60]` — congela o valor no module-load, override do tema não propaga. Sempre consuma via `theme.colors.X.role` ou alias por string (`'brand.solid'`).
- **Hex literal em recipe**: violado pelo lint `pnpm test:no-color-literal`.
- **Editar `themeLightColors`/`themeDarkColors` para customizar produto**: use `createTheme()`. Editar arquivo do DS quebra capacidade de evolução em paralelo.
- **Esperar que vocabulário antigo (`subtle/soft/base/strong`) ainda funcione**: foi removido. Use o canônico (`bgElement/solid/text/...`).

---

## Referências

- [`docs/ARCHITECTURE_DIRECTION.md`](./ARCHITECTURE_DIRECTION.md) — posicionamento estratégico e cascade de 5 níveis
- [`docs/rfcs/RFC-0039-paleta-12-papeis-nominais.md`](./rfcs/RFC-0039-paleta-12-papeis-nominais.md) — proposta original
- [`docs/rfcs/RFC-0027-multi-product-themable-contract.md`](./rfcs/RFC-0027-multi-product-themable-contract.md) — `createTheme()` + matriz produto + density tokens
- [Radix Colors — Understanding the Scale](https://www.radix-ui.com/colors/docs/palette-composition/scales)
