# Fase 14 — Biblioteca de Ícones (Lucide)

**Status:** Concluída
**Estimativa:** 1–2 dias-pessoa
**Risco:** Baixo (componente isolado em `core/icon`, sem breaking change)
**Pré-requisito:** Fase 13 concluída

---

## Contexto

O Arbor-DS não possui hoje biblioteca de ícones oficial. Componentes que precisam de glifos (Button loading state, futuros ButtonGroup/FAB/NavBar da Fase 15, estados `success`/`error` de Input e Select) recorrem a placeholders (`...`) ou dependem do consumidor trazer ícones por conta própria. Isso quebra consistência visual e penaliza DX.

Esta fase adota **Lucide** como fonte única de ícones e entrega um componente `Icon` cross-platform com API uniforme. É pré-requisito obrigatório para Fase 15 (os três novos componentes dependem de `IconName`) e desejável para Fase 16 (Button loading, Input success/error).

---

## Diagnóstico

| Necessidade | Situação |
|-------------|----------|
| Spinner de Button | Placeholder `...` evidente |
| Ícones semânticos (success, error, warning, info) | Ausentes |
| Ícones de navegação (back, close, chevron) | Ausentes |
| Ícones de ação (plus, trash, edit) | Ausentes |
| API cross-platform uniforme | Ausente |
| Tipo seguro de nomes de ícone | Ausente |

---

## Decisão: Lucide

**Justificativa:**

| Critério | Lucide | Phosphor | react-icons | Heroicons |
|----------|--------|----------|-------------|-----------|
| Licença | MIT | MIT | MIT | MIT |
| Qtd. de ícones | 1500+ | 1200 | 50k (multi-família) | 300 |
| Consistência visual | Alta (grid 24px, stroke único) | Alta | Baixa (mistura famílias) | Alta |
| Suporte RN oficial | Sim (`lucide-react-native`) | Sim | Não | Não |
| Tree-shaking | Sim | Sim | Parcial | Sim |
| TypeScript-first | Sim | Sim | Parcial | Sim |
| Bundle por ícone | ~0.3KB | ~0.5KB | Variável | ~0.3KB |

**ADR-14-01:** Lucide é a escolha. Alternativas rejeitadas:
- `react-icons`: incoerência visual entre famílias.
- `phosphor-icons`: mais pesada e sem vantagem clara sobre Lucide.
- `heroicons`: variedade insuficiente para navegação/ações em apps de produto.

---

## Objetivos

1. Instalar `lucide-react` + `lucide-react-native` + peer `react-native-svg`.
2. Entregar componente `Icon` com implementações web e native sob mesma API.
3. Exportar tipo `IconName` para uso em componentes da Fase 15.
4. Storybook showcase com grid, busca, controles e copy-to-clipboard.

---

## Escopo

### 1. Instalação

```bash
pnpm add lucide-react lucide-react-native
pnpm add react-native-svg
```

Verificar `peerDependencies` do `lucide-react-native` e alinhar com a versão já usada pelo Expo no playground mobile.

### 2. Estrutura

```
src/components/core/icon/
  core/
    icon.tsx              # web (lucide-react)
    icon.native.tsx       # native (lucide-react-native)
    icon.test.tsx
    icon.stories.tsx
    icon-showcase.tsx     # story helper (grid + busca)
  interfaces/
    IconProps.ts
    IconName.ts
  index.ts
```

### 3. API pública

**`IconProps.ts`:**

```ts
import type { IconName } from './IconName';

export interface IconProps {
  name: IconName;
  size?: number | string;          // default 20
  color?: string;                  // default 'currentColor'
  strokeWidth?: number;            // default 1.75
  'aria-label'?: string;           // obrigatório quando decorativo=false
  decorative?: boolean;            // default true → aria-hidden
}
```

**`IconName.ts`:**

```ts
import { icons } from 'lucide-react';
export type IconName = keyof typeof icons;
```

O mesmo tipo é reutilizado no build native — Lucide mantém paridade de nomes entre os dois pacotes.

### 4. Implementação web — `icon.tsx`

```tsx
import { icons } from 'lucide-react';
import type { IconProps } from '../interfaces/IconProps';

export function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  decorative = true,
  ...rest
}: IconProps) {
  const LucideIcon = icons[name];
  if (!LucideIcon) return null;
  return (
    <LucideIcon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      aria-hidden={decorative || undefined}
      {...rest}
    />
  );
}
```

### 5. Implementação native — `icon.native.tsx`

```tsx
import { icons } from 'lucide-react-native';
import type { IconProps } from '../interfaces/IconProps';

export function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  decorative = true,
  'aria-label': ariaLabel,
}: IconProps) {
  const LucideIcon = (icons as Record<string, React.ComponentType<any>>)[name];
  if (!LucideIcon) return null;
  return (
    <LucideIcon
      size={typeof size === 'number' ? size : 20}
      color={color}
      strokeWidth={strokeWidth}
      accessibilityElementsHidden={decorative}
      accessibilityLabel={decorative ? undefined : ariaLabel}
    />
  );
}
```

### 6. Storybook showcase

**Arquivo:** `src/components/core/icon/core/icon.stories.tsx`

Features:
- Grid responsivo de todos os ícones da Lucide
- Input de busca (filtra por nome, case-insensitive)
- Agrupamento por categoria (usar a taxonomia oficial da Lucide quando disponível; fallback: alfabético)
- Controles globais: `size` (16/20/24/32), `color` (token picker), `strokeWidth` (1/1.5/1.75/2)
- Click em um ícone copia `<Icon name="..." />` para clipboard
- Título da story: `🌳 Arbor DS/Foundations/Icons` (hierarquia consistente com Fase 13)

```tsx
export default {
  title: '🌳 Arbor DS/Foundations/Icons',
  component: Icon,
};

export const Library = {
  render: () => <IconShowcase />,
  parameters: { layout: 'fullscreen' },
};

export const Single = {
  args: { name: 'check', size: 24, color: 'currentColor', strokeWidth: 1.75 },
};
```

---

## Estratégia Cross-Platform

| Aspecto | Web | Native |
|---------|-----|--------|
| Engine | `lucide-react` (SVG inline) | `lucide-react-native` (via `react-native-svg`) |
| `color='currentColor'` | Funciona nativamente (CSS) | Lucide RN resolve `currentColor` ou default |
| `aria-hidden` / `accessibilityElementsHidden` | Web usa ARIA | RN usa prop nativa |
| Bundle | Tree-shakable automático | Tree-shakable automático |

**ADR-14-02:** API única, implementação por plataforma via sufixo `.native.tsx`. Nenhum componente fora de `icon/` precisa saber qual plataforma está renderizando.

---

## Impacto em DX

- Autocomplete mostra **todos** os 1500+ ícones ao digitar `<Icon name="` — type-safe.
- Storybook vira referência viva: designers e devs buscam o ícone certo sem sair do ambiente.
- Click-to-copy acelera uso em protótipos e revisão de PRs.

---

## Impacto em Acessibilidade e Performance

- **A11y:** `decorative` default elimina ruído de screen reader para ícones usados em botões (texto já cobre a semântica). `aria-label` obrigatório quando `decorative=false`.
- **Performance:** tree-shaking natural da Lucide — bundle cresce apenas com ícones efetivamente usados. Cada ícone ~0.3KB min+gz.
- **SSR:** `lucide-react` é SSR-safe (renderiza SVG sem side effects).

---

## Plano de Execução

1. Instalar dependências e validar `pnpm build:lib` / `pnpm test`
2. Criar estrutura de pastas em `src/components/core/icon/`
3. Implementar `icon.tsx` + `icon.native.tsx` + `IconProps` + `IconName`
4. Exportar de `src/components/core/index.ts` e `src/components/index.ts`
5. Escrever testes: render com name válido, render null com name inválido, size/color/strokeWidth aplicados, `aria-hidden` quando decorativo
6. Construir `icon-showcase.tsx` com busca e click-to-copy
7. Escrever `icon.stories.tsx` (Library + Single)
8. Validar no playground web (Vite) e documentar uso no README do componente

---

## Critérios de Qualidade

### Funcional
- [ ] `Icon` renderiza no Storybook (web) com ícone correto
- [ ] `Icon` renderiza no playground Expo (native)
- [ ] `name` inválido retorna `null` (não crasha)
- [ ] `size`, `color`, `strokeWidth` propagam corretamente
- [ ] `decorative=true` aplica `aria-hidden`
- [ ] `decorative=false` sem `aria-label` emite warning (dev-only)

### Tipagem
- [ ] `IconName` é tipo literal derivado da Lucide (autocomplete completo)
- [ ] Web e native compartilham o tipo `IconProps`

### Storybook
- [ ] Story `Library` mostra grid completo
- [ ] Busca filtra por nome
- [ ] Controles globais funcionam
- [ ] Click em ícone copia snippet `<Icon name="..." />` para clipboard
- [ ] Título da story segue hierarquia `🌳 Arbor DS/Foundations/Icons`

### Bundle e perf
- [ ] Bundle só inclui ícones importados (validar via `size-limit`)
- [ ] `pnpm depcheck` sem ciclos novos

### Regressão
- [ ] Suite verde
- [ ] `pnpm build:lib` sem erros

---

## Decisões Arquiteturais (ADRs desta fase)

- **ADR-14-01:** Lucide como única lib de ícones do sistema.
- **ADR-14-02:** `Icon` vive em `components/core/` (primitive) — mesmo nível de `Box`, `Text`. Motivo: é usado por recipes e componentes de todas as camadas.
- **ADR-14-03:** `decorative=true` como default — a maioria dos ícones acompanha texto e deve ser invisível para screen readers.
- **ADR-14-04:** `name` inválido retorna `null` em vez de crashar — defensive para consumo dinâmico (ex: ícones vindos de CMS/API).

---

## Próximas Fases

- **Fase 15** consome `IconName` em `ButtonGroupProps`, `FloatingActionButtonProps` e `NavBarItemProps`.
- **Fase 16** substitui spinner `...` do Button por `<Icon name="loader-circle" />` com animação spin; adiciona check/x em Input, Switch, Checkbox.
- **Fase 17** exibe `<Icon>` no playground mobile via NavBar.Item.
