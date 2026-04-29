# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) para trabalhar neste repositório.

## Skill de Arquiteto

Ao trabalhar em arquitetura, styled-system, contratos cross-platform, temas, tokens, recipes, slots, acessibilidade ou estrutura do design system, carregue a skill de arquiteto:

```
.claude/commands/arbor-ds-arch.md
```

Essa skill define os princípios de operação, escopo, contrato de saída e barra de qualidade para todas as decisões arquiteturais do projeto.

---

## Início Rápido

### Comandos Comuns

```bash
pnpm dev               # Inicia o servidor Vite + playground (http://localhost:5173)
pnpm build             # Build do playground (Vite)
pnpm build:lib         # Build da biblioteca (TypeScript + Vite lib bundle → dist/)
pnpm lint              # Verificação ESLint
pnpm test              # Executa todos os testes (jest)
pnpm test -- <padrão>  # Executa um arquivo de teste (ex: pnpm test -- box.test)
pnpm preview           # Preview do build do playground localmente
pnpm tokens:validate   # Valida as definições de tokens
pnpm depcheck          # Análise de dependências com dependency cruiser
```

---

## Arquitetura: Design System em Três Camadas

O Arbor DS é um **design system modular e sem dependências externas** estruturado em três camadas:

### 1. Foundations (`src/foundations/`)

Primitivos que definem a linguagem visual:

- **Tokens** (`src/foundations/tokens/`): organizados em três níveis
  - `tokens/primitives/` — valores brutos de escala (cores, espaçamentos, radii, tipografia, etc.)
  - `tokens/semantics/` — aliases semânticos com significado de uso (ex: `brand.primary`, `feedback.error`)
  - `tokens/components/` — overrides de token por componente
- **Theme** (`src/foundations/theme/`): `themeLight`, `themeDark` e `createTheme()` para extensões de produto
  - Temas mapeiam nomes de tokens para valores concretos
  - `createTheme(baseTheme, overrides)` permite que consumidores customizem tokens
- **Breakpoints** (`src/foundations/breakpoints/`): definições de breakpoints responsivos

### 2. Ecosystem (`src/ecosystem/`)

Camada de renderização e utilitários que conectam componentes a tokens:

- **Styled System** (`src/ecosystem/styled-system/`): engine de props com tipagem
  - `ArborProvider`: envolve a aplicação, fornece contexto de tema (light/dark)
  - `ArborTransform`: componente de baixo nível que aplica props de estilo (display, padding, color, etc.)
  - Props são tipadas e validadas em tempo de compilação; combinações inválidas falham cedo
  - Lida com breakpoints responsivos, pseudo-states (`:hover`, `:active`) e troca de tema
  - **Recipes** (`styled-system/recipes/`): `defineRecipe`, `defineSlotRecipe`, `useRecipe` para composição de variantes e slots
- **Utils** (`src/ecosystem/utils/`): helpers internos para renderização, checagem de tipos e clonagem de elementos

### 3. Components (`src/components/`)

Blocos de UI reutilizáveis de alto nível:

- **Primitivos de layout** (`src/components/core/`):
  `Box`, `Flex`, `Grid`, `Container`, `Text`, `Circle`, `Center`, `Square`, `Clickable`, `Image`, `Icon`, `Spacer`, `Empty`
- **Componentes de formulário**: `Button`, `Checkbox`, `Input`, `Radio`, `Switch`
- **Componentes de overlay**: `Modal`, `Drawer`, `Tooltip`
- **Componentes de conteúdo**: `Card`, `Avatar`, `Chip`, `Tag`, `Carousel`, `ProgressBar`, `Tabs`

**Estrutura de pasta de componente** — todo componente segue este layout:

```
src/components/<nome>/
  core/              # Implementação (ex: button.tsx, button.native.tsx)
  interfaces/        # Tipos TypeScript (ex: ButtonProps.ts)
  styles/            # (opcional) utilitários de estilo ou recipes
  utils/             # (opcional) funções auxiliares
  accessibility/     # (opcional) helpers de acessibilidade
  index.ts           # exports públicos
```

Exporte tipos e componentes do `index.ts` do componente e re-exporte de `src/components/index.ts`.

---

## Internals do Styled System

O styled-system é um **transformador de props tipado** que conecta componentes a tokens:

1. **Definição de Props** (`src/ecosystem/styled-system/system/props/`):
   - Propriedades CSS-like agrupadas por categoria: layout, spacing, color, typography, flexbox, grid, position, transition, etc.
   - Cada categoria define como os valores mapeiam para tokens (ex: `padding: 'large'` → `spacing.large`)

2. **Engine de Transformação** (`src/ecosystem/styled-system/core/transform/`):
   - Recebe props tipadas e um tema, produz estilos CSS inline
   - Lida com breakpoints responsivos (mobile-first media queries)
   - Resolve nomes de tokens semânticos para valores concretos

3. **Recipes** (`src/ecosystem/styled-system/recipes/`):
   - `defineRecipe` — composição de variantes de raiz única
   - `defineSlotRecipe` — composição de variantes com múltiplos slots
   - `useRecipe` — resolve a recipe em runtime com as variantes ativas

4. **Hooks**:
   - `useToken(tokenPath)`: lê um valor de token em runtime
   - `useBreakpoint(breakpoint)`: detecta o breakpoint atual

---

## Testes

Os testes usam **Jest** com **React Testing Library**. Os arquivos de teste ficam junto às suas fontes:

```
src/components/core/box/
  core/
    box.tsx
    box.test.tsx
```

Executar testes:

```bash
pnpm test                      # Todos os testes
pnpm test -- box.test          # Arquivo único
pnpm test -- --coverage        # Com relatório de cobertura
pnpm test -- --watch           # Modo watch
```

---

## Fluxo de Desenvolvimento

### Adicionando um Componente

1. Crie a pasta: `src/components/<nome>/`
2. Adicione os arquivos:
   - `core/<nome>.tsx` — implementação do componente (use `ArborTransform` ou componha layouts estilizados)
   - `core/<nome>.native.tsx` — implementação React Native (se necessário)
   - `interfaces/<nome>Props.ts` — tipos de props
   - `index.ts` — export de ambos
3. Re-exporte de `src/components/index.ts`
4. Adicione preview em `playground/src/` para testes manuais
5. Adicione testes unitários em `core/<nome>.test.tsx`

### Usando ArborTransform em Componentes Customizados

`ArborTransform` é a ponte entre props e tema:

```tsx
import { ArborTransform } from 'arbor-ds/ecosystem';

export function Badge({ label }: { label: string }) {
  return (
    <ArborTransform
      as="span"
      display="inline-flex"
      alignItems="center"
      padding="small"
      borderRadius="medium"
      backgroundColor="semantic.brand.subtle"
    >
      {label}
    </ArborTransform>
  );
}
```

Props seguem exatamente os nomes dos tokens (ex: `padding="small"` usa `tokens.spacing.small`).

### Troca de Tema

Envolva sua aplicação com `ArborProvider` e use `useArborTheme()`:

```tsx
import { ArborProvider } from 'arbor-ds/ecosystem';
import { createTheme, themeLight } from 'arbor-ds/foundations';

const myTheme = createTheme(themeLight, {
  colors: { brand: { base: '#2F775F' } },
});

export function App() {
  return (
    <ArborProvider theme={myTheme}>
      {/* conteúdo da aplicação */}
    </ArborProvider>
  );
}
```

---

## Arquivos-Chave

- `src/foundations/theme/` — definições e criação de temas
- `src/foundations/tokens/primitives/` — escalas brutas de tokens
- `src/foundations/tokens/semantics/` — aliases semânticos
- `src/foundations/tokens/components/` — overrides de token por componente
- `src/ecosystem/styled-system/adapters/` — contexto e hooks de tema e estilo
- `src/ecosystem/styled-system/system/props/index.ts` — definição das categorias de props
- `src/ecosystem/styled-system/core/transform/` — lógica central de transformação
- `src/ecosystem/styled-system/recipes/` — utilitários de recipe e slot recipe
- `src/components/core/box/` — implementação de referência de um componente core
- `playground/` — showcase de componentes e ambiente de desenvolvimento

---

## Docs e Planejamento Arquitetural

Registros de decisão arquitetural e planos de evolução ficam em `docs/`:

- `docs/ARCHITECTURE_RESTRUCTURING_BRIEF.md` — brief de reestruturação atual (referência principal)
- `docs/ARCHITECTURE_EVOLUTION_PLAN.md` — roadmap de evolução
- `docs/TESTING.md` — estratégia de testes
- `docs/tasks/` — tarefas detalhadas por fase (fase-00 a fase-12)

---

## Build e Distribuição

O build da biblioteca é **em dois passos**:

1. `tsc -b` — referências de projeto TypeScript, gera declarações `.d.ts`
2. `vite build --config vite.lib.config.ts` — bundle e minificação (executado via `pnpm build:lib`)

O build da biblioteca gera:
- Módulos ES em `dist/`
- Declarações de tipo (`.d.ts`) em cada diretório fonte

Mantenha os exports de tipos estáveis ao alterar APIs públicas (consumidores dependem dos tipos em seus próprios `tsconfig`).

---

## Notas

- **Sem framework de estilo**: estilos são aplicados inline via `ArborTransform`; sem CSS-in-JS ou estilização baseada em className.
- **Suporte a React Native**: componentes usam implementações por plataforma (`.native.tsx` para React Native, `.tsx` para web).
- **Zero dependências de runtime**: o sistema é puro React + TypeScript; novas dependências exigem discussão.
- **Nomenclatura semântica**: use nomes de token com significado (`brand.primary` e não `color1`); isso melhora manutenibilidade e troca de tema.
- **Cross-platform**: lógica compartilhada fica em `.tsx`, especializações por plataforma em `.native.tsx`.
