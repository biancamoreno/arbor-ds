# Arbor-DS — Direcional Arquitetural

**Status**: Vigente
**Vigente desde**: 2026-05-06
**Última revisão**: 2026-05-06

Este documento registra o posicionamento estratégico do Arbor-DS, a arquitetura de tematização que dele decorre e os critérios para evoluir a plataforma. Toda RFC, revisão e decisão de implementação devem ser consistentes com o que está aqui. Quando algum ponto do código ou de uma RFC for ambíguo em relação a este documento, este documento prevalece — divergências exigem RFC formal de revisão.

---

## 1. Posicionamento

### 1.1 Postura: Themable Kit

O Arbor-DS é um **Themable Kit**: motor enxuto, primitivos auto-suficientes, tema rico. O consumidor monta tela como lego — importa componentes, compõe layout, aplica tema, entrega valor. A identidade do produto vem do tema, não de override no componente.

### 1.2 Posição relativa ao mercado

| Postura | Exemplos | Diferença para o Arbor-DS |
|---|---|---|
| **Headless puro** | Radix UI, Headless UI, Ariakit | Entregam comportamento + a11y sem opinião visual; consumidor estiliza tudo do zero. O Arbor-DS traz defaults razoáveis e tema rico. |
| **Themable Kit** | Radix Themes, Mantine core | **Posição do Arbor-DS.** |
| **Kit completo opinionado** | Material UI, Ant Design, Mantine full | Embarcam packs verticais e componentes de domínio. O Arbor-DS mantém-se fora desse escopo. |

### 1.3 O que o Arbor-DS entrega

- **Componentes de layout** — `Box`, `Flex`, `Grid`, `Container`, `Stack`, `Spacer`, `Center`, `Square`, `Circle`. Aceleram a montagem dentro do padrão do ecossistema. Estilizados via props CSS-in-JS.
- **Componentes primitivos funcionais** — `Button`, `Input`, `Card`, `Field`, `Tabs`, `Dialog`, `Toast`, `Tag`, `Chip`, `Avatar`, `Accordion`, `Carousel`, `Menu`, `Popover`, `Tooltip`, `Drawer`, `Select`, `Switch`, `Checkbox`, `Radio`, `Counter`, `Spinner`, `Skeleton`, `Alert`, `Badge`, `ProgressBar`, `ProgressCircle`, `Pagination`, `Breadcrumb`, `Table`, `Image`, `Icon`, `Clickable`, `Text`. Auto-suficientes, com acessibilidade embutida e variants estruturais quando o componente precisa.
- **Sistema de tema completo** — cores, tipografia, raios, espaçamentos, sombras, motion, foco e densidade são pontos de extensão estáveis. `createTheme()` é o canal preferencial de identidade.
- **Cross-platform real** — paridade web ↔ native em API, comportamento e a11y. Web-only canon = 0 (nenhum componente do DS é exclusivo de uma plataforma).

### 1.4 O que o Arbor-DS não entrega (por escolha)

- **Componentes de domínio** — `ProductCard`, `Hero`, `PricingTable`, `CheckoutStepper`, `OrderTracker`, `ChatBubble`, `Receipt`, `MarkerCard`, `TimeSlotPicker`, `KPICard` e similares **não entram no DS**. Pertencem ao produto consumidor, que os monta a partir dos primitivos.
  - Esses componentes podem ser reavaliados como **pack vertical com slots** no futuro, **somente** quando todos os gatilhos abaixo estiverem satisfeitos:
    1. primitivos do DS estão consolidados;
    2. sistema de tema está maduro (paleta 12 papéis + presets + component tokens entregues);
    3. três ou mais produtos consumidores demonstrarem demanda recorrente para o mesmo padrão.
  - A entrada de qualquer pack vertical exige RFC formal e fica como módulo opcional, fora do bundle base.
- **Estilos prontos de marca** — o DS entrega o motor; a marca vem do consumidor via tema.
- **Lógica de negócio** — qualquer regra de domínio (carrinho, autenticação, validação de cupom, formulário-controller, máscara de CPF/CEP) fica fora.
- **Ilustrações, lottie, assets visuais com personalidade** — o DS expõe slots/escape hatches; o consumidor traz seus assets.

### 1.5 Princípios de adoção

- **Importar e usar**: defaults razoáveis cobrem 80% dos casos sem configuração.
- **Customizar via tema, não via override**: identidade vem do `createTheme()`, não de inline styles ou edição de recipes.
- **Cross-platform real**: o que existe na web existe em native, com paridade de API e a11y.
- **Bundle disciplinado**: cada componente paga o próprio peso; tree-shaking por construção; peers externalizadas (Lucide, react-native-svg).
- **Longo prazo vence oportunismo**: estabilidade de contratos públicos sobrepõe ganho imediato.

---

## 2. Arquitetura de tematização

### 2.1 Visão geral: cascade de cinco camadas

A configuração do tema acontece em camadas, do mais amplo ao mais específico. **Override mais específico sempre vence** override mais amplo:

```
1. baseTheme defaults                     ← o que o DS provê pronto
2. presets de personalidade               ← macro: shape/density/motion/weight/surface
3. tokens semantic (overrides)            ← role tokens: brand, interactive, surface, text, border, focus, feedback
4. tokens component (overrides)           ← bindings: button.*, input.*, card.*, ...
5. CSS vars (somente web, runtime)        ← override por subtree, sem rebuild
```

`extendTheme()` é uma extensão **paralela** que adiciona tokens **novos** (não cobertos pelo DS), próprios do produto consumidor. Não substitui camadas — agrega.

### 2.2 Tokens em camadas

```
primitive tokens   →  brutos       (color.aqua.60, spacing.16)
       ↓
semantic tokens    →  papéis       (border.default, brand.base, text.primary, interactive.primary)
       ↓
component tokens   →  bindings     (button.primary.bg, input.borderRadius, card.padding.medium)
       ↓
component CSS
```

#### Primitive

Valores brutos, sem semântica. Escala completa por família (após RFC-0039: `aqua.1` a `aqua.12`, `ocean.1` a `ocean.12`, etc.). **Nunca** consumidos diretamente por componentes ou recipes — apenas referenciados via aliases semantic.

#### Semantic

Papéis de uso. Camada **rica** que cobre, no mínimo:

- **Brand**: `brand.1...brand.12` (escala completa Radix-style); `brand.base`, `brand.subtle`, `brand.contrast` para conveniência.
- **Interactive**: `interactive.primary`, `interactive.primary.hover`, `interactive.primary.active`; `interactive.secondary.*`; `interactive.disabled`.
- **Surface**: `surface.app`, `surface.subtle`, `surface.default`, `surface.raised`, `surface.elevated`, `surface.translucent`, `surface.overlay`.
- **Text**: `text.primary`, `text.secondary`, `text.tertiary`, `text.link`, `text.contrast`, `text.onBrand`, `text.disabled`, `text.inverse`.
- **Border**: `border.subtle`, `border.default`, `border.strong`, `border.interactive`, `border.error`.
- **Focus**: `focus.ring` (cor); a anatomia do anel — largura, offset, estilo — fica como decisão estrutural do DS, com defaults WCAG 2.4.7/2.4.11 AA, e só vira themable se um produto demonstrar caso real.
- **Feedback**: `feedback.{info,success,warning,critical}.{subtle,base,strong,onColor}`.
- **Shadow**: `shadow.color`, `shadow.glow.brand`, `shadow.glow.success`, etc.

Esta é a camada onde a maior parte das **mudanças de marca** acontecem. Override aqui cascateia para todos os componentes que usam o token.

#### Component

Bindings por componente. Estruturados conforme a recipe consumir:

- **Globais do componente** (sem variant/state):
  ```ts
  input.borderRadius     = 'small'
  card.padding.medium    = 'large'
  button.height.medium   = 40
  ```
- **Estruturados por variant/state** (quando a recipe varia):
  ```ts
  input.border.default   = 'border.default'
  input.border.error     = 'feedback.critical.base'
  input.border.focus     = 'brand.base'

  button.primary.bg      = 'interactive.primary'
  button.primary.bg.hover = 'interactive.primary.hover'

  tabs.borderRadius.pill = 'full'
  tabs.borderRadius.underline = 0
  ```

Cada component token defaulta para um alias semantic. Override no component token é o **único caminho** quando o consumidor quer mudar **um componente específico** sem afetar os demais.

### 2.3 Recipes apenas para variants reais

Recipes são **estruturais**, não de identidade. A recipe declara qual token consumir para cada variant/state, **por referência via string** (não import direto de primitive, não valor literal).

Recipe é instrumento certo quando há **escolha de estilo discreta** que muda anatomia, decoração, layout ou semântica. Recipe **não** é ferramenta de tweak de valor.

| Caso | Recipe? | Por quê |
|---|---|---|
| `Card.variant: outlined \| elevated \| flat` | ✅ | Anatomia muda (borda × sombra × nada) |
| `Tabs.variant: underline \| pill` | ✅ | Decoração estrutural diferente |
| `Button.variant: primary \| secondary \| ghost \| danger` | ✅ | Combinações cromáticas + bordas discretas |
| `Chip.selectable: true \| false` (discriminated) | ✅ | Semântica e a11y mudam |
| `Dialog.size: small \| medium \| large` | ✅ | maxWidth + padding cruzando |
| `Input.state: idle \| error \| focus \| disabled` | ✅ | Recipe mapeia state → component token apropriado |
| "Borda do input mais arredondada" | ❌ | Token (`input.borderRadius`) |
| "Cor de borda padrão diferente em todos os inputs" | ❌ | Token (`input.border.default`) |
| "Hover do botão primary com cor diferente" | ❌ | Token (`button.primary.bg.hover`) |
| Mudar default size | ❌ | `defaultVariants` na recipe ou token global |

**Regra prática**: se a diferença entre dois valores é apenas trocar token, isso é **token**. Recipe entra quando há mudança de anatomia, decoração, layout ou semântica.

#### Como recipe e component token conversam

A recipe nunca tem valor hardcoded — só referências por string a tokens. Os tokens são **resolvidos em runtime** a partir do tema ativo. Override propaga sem editar recipe.

```ts
// Component tokens estruturados por variant/state
input: {
  border: {
    default:  'border.default',          // alias semantic
    error:    'feedback.critical.base',
    focus:    'brand.base',
    disabled: 'border.subtle',
  },
  borderRadius: 'small',
  padding: { small: 'tiny', medium: 'small', large: 'medium' },
}

// Recipe — referencia tokens, não valores
input: defineSlotRecipe({
  slots: ['frame', 'control'] as const,
  base: {
    frame: { borderRadius: '$input.borderRadius' },
  },
  variants: {
    state: {
      idle:     { frame: { borderColor: '$input.border.default'  } },
      error:    { frame: { borderColor: '$input.border.error'    } },
      focus:    { frame: { borderColor: '$input.border.focus'    } },
      disabled: { frame: { borderColor: '$input.border.disabled' } },
    },
  },
})
```

Override do consumidor:

| Consumidor faz | Resultado |
|---|---|
| `tokens.input.borderRadius = 'medium'` | Todas as variants ficam com radius `medium` |
| `tokens.input.border.error = '#ff00aa'` | Só variant `error` muda |
| `colors.feedback.critical.base = '#ff00aa'` | Variant `error` muda + qualquer outro componente que use feedback critical (Tag, Alert, Toast critical, etc.) |
| `colors.brand.base = '#xxx'` | Tudo que referencia brand muda — Button primary, FAB, banner, hero, brand chips |

### 2.4 Presets de personalidade

Presets são **macros de override** em `createTheme()`. Permitem ao consumidor mudar a "cara" do produto com 1 linha por dial, sem entrar em token-a-token. Cada preset reescreve em bloco um conjunto coordenado de tokens semantic.

#### Dials disponíveis

| Dial | Valores | O que reescreve |
|---|---|---|
| `shape` | `'sharp' \| 'subtle' \| 'rounded' \| 'pill'` | `radii.*`, defaults de `borderRadius` nos component tokens |
| `density` | `'compact' \| 'comfortable' \| 'spacious'` | `spacing.*`, `controlSize.*`, `dialogSize.*`, `padding` defaults |
| `motion` | `'minimal' \| 'normal' \| 'expressive'` | `motion.duration.*`, `motion.easing.*`, springs |
| `weight` | `'crisp' \| 'soft' \| 'bold'` | `borderWidth.*`, `fontWeight` defaults, intensidade de shadows |
| `surface` | `'flat' \| 'subtle' \| 'elevated' \| 'glass'` | `shadows.*`, `surface.translucent`, `backdropFilter` tokens |

Defaults: `shape: 'subtle'`, `density: 'comfortable'`, `motion: 'normal'`, `weight: 'soft'`, `surface: 'subtle'`.

#### Composição

```ts
// Produto vitrine + marca jovem
createTheme(themeLight, {
  colors: { brand: { base: '#FF3366' } },
  presets: { shape: 'rounded', density: 'spacious', motion: 'expressive' },
});

// Produto fintech sério
createTheme(themeLight, {
  colors: { brand: { base: '#0B46E6' } },
  presets: { shape: 'sharp', density: 'compact', motion: 'minimal', weight: 'crisp' },
});

// Produto hospitalidade (glassmorphism)
createTheme(themeLight, {
  colors: { brand: { base: '#7967FD' } },
  presets: { shape: 'rounded', motion: 'expressive', surface: 'glass', weight: 'soft' },
});
```

Mesmo motor, três caras completamente distintas. **Sem editar componente, sem editar recipe.**

#### Posição no cascade

Presets aplicam-se **antes** de qualquer override explícito. Override explícito sempre ganha:

```ts
createTheme(themeLight, {
  presets: { shape: 'rounded' },                 // radii.* todos generosos
  tokens: { input: { borderRadius: 'small' } },  // exceto input — overrida o preset
});
```

```ts
createTheme(themeLight, {
  presets: { density: 'compact' },
  colors:  { brand: { base: '#FF3366' } },       // não conflita; coexistem
});
```

#### Cross-platform

Presets resolvem em **build-time** dentro de `createTheme()`. O resultado é um tema JS estático consumido idêntica e simultaneamente por web e native. **CSS vars não entram na resolução de presets** — são caminhos paralelos.

#### Extensibilidade

Um produto pode adicionar valores próprios para um dial via `extendTheme()`:

```ts
extendTheme({
  presets: {
    shape: {
      'organic': { /* radii customizados, ex: pares ímpares para dar imperfeição */ },
    },
  },
});
```

Esse novo valor fica disponível em `createTheme()` como `presets: { shape: 'organic' }`.

### 2.5 CSS variables (web only)

`<ArborProvider>` emite custom properties no escopo da árvore web:

```
--arbor-brand-9
--arbor-brand-10
--arbor-button-primary-bg
--arbor-input-border-radius
--arbor-spacing-medium
...
```

Permite override **em runtime, sem rebuild**:

- por subtree CSS-only:
  ```html
  <div style="--arbor-brand-9: #ff0066;">
    <Button>Outra cor sem trocar tema</Button>
  </div>
  ```
- por integração com framework externo (Tailwind config consumindo as CSS vars do Arbor; CSS Modules sobrescrevendo no escopo do módulo);
- por alternância de tema sem re-render do provider (toggle via classe no `<html>`).

**Limite**: CSS vars **não funcionam em React Native**. RN não tem CSS nem DOM. Por isso, CSS vars são **escape hatch só de web**, não fazem parte do contrato cross-platform.

| Plataforma | Override via tema (`createTheme`) | Override via CSS var |
|---|---|---|
| Web | ✅ | ✅ |
| Native | ✅ | ❌ |

Times que precisam de paridade rigorosa entre web e native devem usar **apenas** `createTheme()` como caminho de override. CSS vars são bônus de produtividade no web.

### 2.6 `extendTheme()` para tokens de produto

Quando um produto consumidor precisa de **tokens fora do contrato do DS** — semântica de domínio que não cabe nos role tokens existentes — usa `extendTheme()` em vez de inflar o DS:

```ts
import { extendTheme, themeLight } from 'arbor-ds/foundations';

const cryptoFinanceTheme = extendTheme(themeLight, {
  tokens: {
    crypto: {
      bg:        '#FF9500',
      onBg:      '#FFFFFF',
      borderHot: '#FF3B30',
    },
    fiat: {
      bg:        '#0066CC',
      onBg:      '#FFFFFF',
    },
  },
});
```

Esses tokens passam a estar disponíveis no tema do produto **sem virar API pública do Arbor-DS**. Consumidores externos do DS não veem esses tokens. Componentes do produto referenciam normalmente:

```tsx
<Box backgroundColor="crypto.bg" color="crypto.onBg" />
```

`extendTheme()` aceita também presets, tokens de componente e overrides. É a forma canônica do produto **estender** o motor sem editá-lo.

---

## 3. Heurística de decisão

Em qualquer ajuste de tema, percorra a cascata em ordem (do mais amplo ao mais específico). Use a primeira camada que resolve a necessidade:

1. **Quero mudar a "cara" do produto inteiro?** → presets (`shape`, `density`, `motion`, `weight`, `surface`).
2. **É decisão de marca / cor / role?** → token semantic (`brand.*`, `interactive.*`, `text.*`, `surface.*`, `border.*`, `feedback.*`).
3. **É binding de um componente específico?** → component token (`button.*`, `input.*`, `card.*`).
4. **É override pontual em escopo limitado (web)?** → CSS var no subtree.
5. **É algo que o DS não cobre, mas o produto precisa?** → `extendTheme()`.
6. **É escolha estrutural discreta entre estilos?** → recipe variant (e isso normalmente é evolução do DS, não config do produto).

Se nenhuma das opções couber, é sinal de que a API do componente está incompleta — abrir RFC, **não** inline style.

### Exemplos por caso de uso

| Necessidade | Caminho |
|---|---|
| "Quero um produto com cara amigável e generosa" | Presets: `shape: 'rounded', density: 'spacious', motion: 'expressive'` |
| "Marca primária do meu produto é magenta" | `colors.brand.base = '#FF3366'` (semantic) |
| "Botão primário é azul, não a cor da marca" | `tokens.button.primary.bg = '#0066CC'` (component) |
| "Input está alto demais para o meu form denso" | Presets: `density: 'compact'` (preferencial) ou `tokens.input.height.medium` (cirúrgico) |
| "Quero tokens próprios para crypto vs fiat" | `extendTheme({ tokens: { crypto: {...}, fiat: {...} } })` |
| "Quero alternar tema sem re-render no web" | CSS var: troca `--arbor-brand-9` no escopo |
| "Quero adicionar variant 'glass' ao Card" | RFC: estrutural, não config |

---

## 4. Cross-platform

### 4.1 Contrato canônico

O **objeto de tema JS** é o contrato cross-platform. Web e native consomem o mesmo `createTheme()`; o resultado é idêntico nas duas plataformas.

### 4.2 Especializações por plataforma

| Recurso | Web | Native | Observação |
|---|---|---|---|
| `createTheme()` | ✅ | ✅ | Contrato canônico |
| Presets | ✅ | ✅ | Resolvem em build-time |
| Component tokens | ✅ | ✅ | Lidos do tema JS |
| CSS variables | ✅ | ❌ | Escape hatch web-only |
| `backdropFilter` (preset `surface: 'glass'`) | ✅ direto | ⚠ via blur view nativo | Adapter por plataforma |
| Springs (preset `motion: 'expressive'`) | ✅ via Framer Motion ou CSS | ✅ via Reanimated | Tokens de spring são por valor (mass/tension/friction); cada plataforma renderiza com sua API |
| Recipe consumer | `useSlotRecipe` | `useSlotRecipe` (mesma) | Engine resolve idêntica |

### 4.3 Regra de ouro

API pública dos componentes é **única** entre plataformas. Diferenças ficam em adapters/internals. Quando um recurso só existe em uma plataforma, é escape hatch documentado, não default.

---

## 5. Implicações para evolução

### 5.1 Cobertura de componentes

A roadmap de novos componentes considera **somente primitivos genéricos**. Faltam, em ordem aproximada de prioridade:

- **Combobox / Autocomplete** — busca instantânea, mentions
- **Slider / Range** — filtros, settings, áudio/vídeo
- **Calendar / DatePicker / DateRangePicker** — agendamento, agenda
- **TimePicker** — horário
- **CommandPalette** — `Cmd+K`, navegação
- **Stepper / Wizard** — onboarding, checkout, wizard genérico
- **EmptyState** — voltou a ser necessário (foi removido na RFC-0005)
- **Form** wrapper — orquestração de validação, errors, submit state
- **Rating / Stars** — avaliação genérica
- **BottomSheet com snap points** — mobile-first, distinto de Drawer

Componentes verticais (`ProductCard`, `Hero`, `PricingTable`, `OrderTracker`, `ChatBubble`, `KPICard`, etc.) **não estão nesta lista** e não entrarão até os gatilhos da seção 1.4 estarem satisfeitos.

### 5.2 Flexibilização do motor

A flexibilidade de adoção depende de pontos estruturais:

- **`asChild` polimórfico** — composição com `Link` de framework externo (Next.js, React Router) sem fragilidade.
- **`className` passthrough** — coexistência com Tailwind/CSS Modules/Linaria sem disputa de estilo.
- **CSS vars completas no provider** (web) — override runtime sem recompilar.
- **Density modes globais** — `compact ↔ comfortable ↔ spacious` via preset.
- **Container queries** no engine — componentes responsivos ao container, não só à viewport.

### 5.3 Fundações reforçadas

A tematização token-first depende de fundações ricas:

- **Paleta com 12 papéis nominais** (escala Radix-style) — para que component tokens tenham vocabulário suficiente.
- **Tipografia ampliada** — display sizes (40/56/72/96), weights 300/600/800/900, lineHeight como ratio, variable font.
- **Spacing macro** — section sizes (48/64/96/128/160) para layout de página.
- **Shadows multi-layer** — penumbra + ambiente, colored shadows, focus ring shadow, glow.
- **Motion com springs** e easings expressivos — não só CSS easing.

### 5.4 Roadmap de RFCs fundacionais

| RFC | Conteúdo | Depende de |
|---|---|---|
| RFC-0039 | Paleta com 12 papéis nominais (Radix-style) | — |
| RFC-0040 | Component tokens estruturados (variant/state) + emissão de CSS vars | RFC-0039 |
| RFC-0041 | Tipografia ampliada (display sizes + weights + lineHeight ratio + variable font) | — |
| RFC-0042 | Macro spacing + section tokens | — |
| RFC-0043 | Shadows multi-layer + colored + ring + glow | RFC-0039 |
| RFC-0044 | Motion: springs + easings expressivos + stagger | — |
| RFC-0045 | Presets de personalidade (`shape`, `density`, `motion`, `weight`, `surface`) | RFC-0039 a 0044 |
| RFC-0046 | `extendTheme()` para tokens/presets de produto | RFC-0040, 0045 |
| RFC-0047 | `asChild` polimórfico para composição | — |

A ordem reflete dependências reais. Presets (0045) só fazem sentido depois das fundações que eles reescrevem; `extendTheme()` (0046) só depois de presets e component tokens.

---

## 6. Gatilhos para revisitar este direcional

Este posicionamento não é vitalício. **Deve ser revisitado** em RFC formal se algum dos gatilhos abaixo for atingido:

| Gatilho | Reavaliação implicada |
|---|---|
| 3+ produtos consumidores expressam demanda recorrente pelo mesmo componente vertical | Abertura de RFC para pack vertical opcional com slots, fora do bundle base |
| Bundle ou complexidade do motor crescer ao ponto de comprometer "leve e simples" | Refatoração ou separação em pacotes (`arbor-ds/core`, `arbor-ds/extra`) |
| Adoção interna ficar abaixo do esperado por atrito de customização | Revisitar postura entre Headless puro e Themable Kit |
| Demanda recorrente por tokens semantic não cobertos pelo DS | Avaliar se o token deve entrar no contrato canônico ou ficar em `extendTheme()` |
| Diferença entre web e native virar fonte recorrente de bugs ou divergência | Reavaliar contrato cross-platform (eventual lib companion) |
| Recipe deixar de ser exceção e voltar a ser maioria | Revisitar regra "recipe só para variants reais" — eventualmente ampliar abrangência |

Até que algum desses gatilhos seja atingido, este documento é a referência canônica.

---

## 7. Onde mais este direcional aparece

- `.claude/commands/arbor-ds-arch.md` — skill do agente arquiteto. Carrega seções resumidas com link para este documento como referência completa.
- `docs/rfcs/` — RFCs novas usam este documento como base de motivação e impacto.
- `docs/ARCHITECTURE_RESTRUCTURING_BRIEF.md` — brief de reestruturação histórico; este documento o complementa com posicionamento e arquitetura de tematização atualizados.

---

## Histórico

| Data | Mudança |
|---|---|
| 2026-05-06 | Criação. Captura postura Themable Kit, cascade de 5 níveis, presets de personalidade, `extendTheme()`, regras de cross-platform e gatilhos de revisão. |
