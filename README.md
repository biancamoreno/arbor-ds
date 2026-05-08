# Arbor-DS

**Design system cross-platform, tipado e themable, para times que precisam manter múltiplos produtos sobre uma base sólida — Web, iOS e Android — sem abrir mão de consistência, acessibilidade ou velocidade de entrega.**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61dafb)](https://react.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.74%2B-61dafb)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)](https://www.typescriptlang.org)

---

## Por que Arbor-DS

Construir um produto consistente é difícil. Manter dois, três ou cinco produtos com identidades distintas, sobre Web e Mobile, sem fragmentar a experiência, é onde a maioria dos design systems quebra. O Arbor-DS foi desenhado exatamente para esse cenário.

- **Cross-platform de verdade.** Cada componente tem implementação Web (React/React Native Web) **e** native (`*.native.tsx`), com paridade de API e de testes. Não existe componente "só-web" no catálogo. O contrato é o mesmo em todas as plataformas.
- **Multi-produto por design.** Tematização não é decoração — é a forma como cada produto expressa sua identidade. Cor, tipografia, espaçamento, raios, sombras, motion, foco e densidade são pontos de extensão estáveis via `createTheme()`. O DS não precisa ser editado para um produto nascer.
- **Acessibilidade como default.** Foco visível (WCAG 2.4.7) e touch target (WCAG 2.5.5) são contrato, não opcional. Componentes interativos respeitam navegação por teclado, leitores de tela e estados anunciáveis sem configuração extra.
- **Engine de estilos própria, sem CSS-in-JS de runtime.** `ArborTransform` resolve props declarativas em estilos com tokens semânticos resolvidos em runtime, mantendo zero dependência de runtime fora de React e ícones. Trocar de tema é instantâneo, sem recompilação.
- **TypeScript estrito.** Props, tokens, variants e slots são totalmente tipados. Combinações inválidas falham na compilação. Autocomplete previsível em qualquer editor.
- **Governança ativa.** RFCs versionadas, registro formal de débito técnico (`docs/TECH_DEBT.md`), changesets, commitlint, size-limit e dependency-cruiser garantem que o sistema evolua sem virar caos.

---

## O que está pronto

**~35 famílias de componentes** organizadas em layout, formulário, overlay, conteúdo e navegação — cada uma com paridade Web/Native, testes unitários, documentação Storybook e foundation completa de tokens.

| Categoria | Componentes |
|---|---|
| **Layout** | `Box`, `Flex`, `Grid`, `Container`, `Center`, `Square`, `Circle`, `Spacer` |
| **Tipografia & visual** | `Text`, `Icon`, `Image` |
| **Interativos** | `Clickable`, `Button`, `ButtonGroup`, `IconButton`, `FAB` |
| **Formulário** | `Field`, `Input` (TextInput/TextArea/Counter), `Checkbox`, `Radio`, `Switch`, `Select` |
| **Overlay** | `Dialog`, `Drawer`, `Popover`, `Tooltip`, `Menu`, `Toast` |
| **Conteúdo** | `Card`, `Avatar`, `Badge`, `Chip`, `Tag`, `Alert`, `Accordion`, `Table` |
| **Feedback** | `Spinner`, `Skeleton`, `ProgressBar`, `ProgressCircle` |
| **Navegação** | `NavBar`, `TabBar`, `Tabs`, `Breadcrumb`, `Pagination` |

Centenas de testes verdes em multi-project Jest (web + native), 100% de cobertura Storybook nos componentes públicos, validação automática de tokens e contrato cross-platform.

---

## Instalação

```bash
pnpm add arbor-ds
# ou
npm install arbor-ds
```

**Peer dependencies:**

```bash
# Web
npm install react react-dom

# React Native (mobile)
npm install react-native react-native-web react-native-svg
```

### Matriz de suporte

| Versão | React | React Native | iOS | Android | Node |
|---|---|---|---|---|---|
| 1.x | 18+ / 19 | 0.74+ | 15+ | API 24+ | 18+ |

---

## Início rápido

### 1. Envelope sua app no `ArborProvider`

```tsx
import { ArborProvider } from 'arbor-ds/ecosystem';
import { themeLight } from 'arbor-ds/foundations';

export function App() {
  return (
    <ArborProvider theme={themeLight}>
      {/* sua aplicação */}
    </ArborProvider>
  );
}
```

### 2. Use os componentes

```tsx
import { Box, Button, Text } from 'arbor-ds';

export function Hero() {
  return (
    <Box padding="large" borderRadius="large" backgroundColor="surface.raised">
      <Text variant="title1">Olá, Arbor</Text>
      <Text variant="body" color="text.secondary">
        Tokens semânticos e componentes acessíveis numa única camada.
      </Text>
      <Button variant="solid" tone="brand">Começar</Button>
    </Box>
  );
}
```

### 3. Crie a identidade do seu produto

```tsx
import { createTheme, themeLight } from 'arbor-ds/foundations';

export const acmeTheme = createTheme(themeLight, {
  colors: {
    brand: {
      primary: '#2F775F',
      secondary: '#1F5543',
    },
  },
  textStyles: {
    title1: { fontFamily: 'Inter', fontWeight: 700 },
  },
  radii: { medium: 12, large: 20 },
});
```

`createTheme()` aceita override em qualquer ponto do contrato themable: cores, tipografia, espaçamento, raios, sombras, motion (duração/easing), foco e densidade. Recipes consomem aliases por string (`'brand.primary'`, `'medium'`) — o override propaga em runtime, sem rebuild.

---

## Arquitetura em três camadas

```
foundations/   → tokens (primitives, semantics, components) + temas
ecosystem/     → ArborProvider, ArborTransform, hooks, recipes
components/    → primitives de layout + UI components
```

### Foundations
Escala primitiva → aliases semânticos → temas por produto. Tipografia, cor, espaçamento, raios, sombras, motion e z-index são todos themable.

### Ecosystem
- **`ArborProvider`** — contexto de tema, breakpoints e densidade.
- **`ArborTransform`** — engine de props tipadas que resolve tokens em runtime. Suporta breakpoints responsivos, pseudo-states (`_hover`, `_active`, `_focusVisibleWithin`), composição cross-platform.
- **Recipes** — `defineRecipe` e `defineSlotRecipe` para variants e slots tipados.
- **Hooks** — `useToken`, `useBreakpoint`, `useArborTheme`, `usePrefersReducedMotion`.

### Components
Cada família segue uma estrutura previsível (`core/`, `interfaces/`, `styles/`, `index.ts`) com implementação web e `*.native.tsx` quando há especialização real de plataforma. APIs públicas são tratadas como contrato de longo prazo.

---

## Cross-platform por contrato

O Arbor-DS não é "Web com Native como afterthought". O sistema é planejado para os dois mundos desde a base:

- **Mesma API pública** — `<Button onPress />`, `<Field label />`, `<Select onValueChange />` se comportam de forma idêntica em React e React Native.
- **Implementações dedicadas** — diferenças reais de plataforma (touch, sheet bottom-up no Select, scroll horizontal em Table, foco visível via `:has` no web vs `accessibilityState` no native) são resolvidas internamente.
- **Validação automática** — `pnpm test:platform-contract --strict` falha o CI se uma família ficar web-only sem RFC.

---

## Acessibilidade

Acessibilidade não é checklist no fim — é critério de merge.

- Foco visível conforme **WCAG 2.4.7** em todos os interativos.
- Touch target mínimo de **44×44 (WCAG 2.5.5)** em todos os controles de formulário e ações.
- Suporte a leitor de tela com `role`, `aria-*` e `accessibilityRole`/`accessibilityState` no native.
- Navegação por teclado completa em overlays (Dialog, Drawer, Popover, Menu, Select).
- `usePrefersReducedMotion()` e tokens de motion respeitam preferências do sistema.

---

## Performance e bundle

- **Zero CSS-in-JS de runtime.** A engine resolve props para estilos sem injeção de classes, sem hashing por render.
- **Tree-shaking real.** Entrypoints separados (`arbor-ds`, `arbor-ds/ecosystem`, `arbor-ds/foundations`, `arbor-ds/native`) permitem importar apenas o necessário.
- **`size-limit` no CI.** Cada release tem orçamento de bundle monitorado.
- **Render previsível.** Sem context global por componente; hooks são opt-in e medidos.

---

## API de entrypoints

| Entrypoint | Conteúdo |
|---|---|
| `arbor-ds` | Componentes UI (default) |
| `arbor-ds/foundations` | Tokens, temas, `createTheme` |
| `arbor-ds/ecosystem` | `ArborProvider`, `ArborTransform`, hooks, recipes |
| `arbor-ds/native` | Bundle React Native |

---

## Documentação e playground

- **Storybook** com showcase completo de tokens, variants, estados e composição: `pnpm storybook`.
- **Playground Web + Mobile** (Vite + Expo) para desenvolvimento local: `pnpm dev`.

---

## Qualidade e governança

| Área | Mecanismo |
|---|---|
| Testes | Jest multi-project (web + native), centenas de testes unitários e behavioral |
| Tipos | TypeScript estrito, declarations geradas no build |
| Lint & estilo | ESLint 9, depcruise para topologia de imports |
| Bundle | size-limit por entrypoint |
| Commits | commitlint + husky |
| Releases | Changesets, changelog automático |
| Decisões | RFCs versionadas em `docs/rfcs/`, débito formal em `docs/TECH_DEBT.md` |

---

## Estrutura do repositório

```
arbor-ds/
├── src/                # Código publicado
│   ├── foundations/    # Tokens e temas
│   ├── ecosystem/      # Engine, provider, hooks, recipes
│   └── components/     # Componentes UI
├── playground/         # Demo interativa (Web + Expo)
├── docs/               # RFCs, plano de fases, TECH_DEBT
├── scripts/            # Validações automatizadas
└── .storybook/         # Configuração Storybook
```

---

## Comandos

```bash
pnpm dev                        # Playground Vite
pnpm storybook                  # Storybook local
pnpm build:lib                  # Build da biblioteca
pnpm test                       # Suíte completa
pnpm test:platform-contract     # Verifica paridade web/native
pnpm typecheck                  # tsc estrito
pnpm lint                       # ESLint
pnpm size                       # Orçamento de bundle
```

---

## Contribuindo

Leia [CONTRIBUTING.md](./CONTRIBUTING.md) para setup, convenções de commit, fluxo de RFC, política de breaking changes e Definition of Done.

---

## Licença

[MIT](./LICENSE)
