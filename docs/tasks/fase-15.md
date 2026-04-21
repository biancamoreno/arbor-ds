# Fase 15 — Novos Componentes: ButtonGroup, FloatingActionButton, NavBar

**Status:** Planejada
**Estimativa:** 2–3 dias-pessoa
**Risco:** Médio (NavBar tem especificidades de plataforma; FAB envolve posicionamento fixed/absolute)
**Pré-requisito:** Fases 13 e 14 concluídas

---

## Contexto

Três componentes adicionam ao catálogo padrões de interação amplamente usados em produtos mobile e web modernos:

- **ButtonGroup** — agrupamento visual/semântico de ações relacionadas (toolbars, pagination, split-buttons).
- **FloatingActionButton (FAB)** — ação primária flutuante, típica de apps mobile (Material Design).
- **NavBar** — navegação inferior mobile (iOS Tab Bar / Android Bottom Navigation).

Nenhum dos três existe hoje. Todos consomem `Icon` (Fase 14) e `transition()` (Fase 13). São o bloco que **entrega valor de produto visível** no ecossistema, justificando as duas fases anteriores de fundação.

---

## Escopo da Fase

Três entregas independentes entre si, implementáveis em paralelo após Fase 14 estar pronta:

1. `ButtonGroup` — cross-platform (web + native)
2. `FloatingActionButton` — cross-platform
3. `NavBar` — **mobile-only** (RN + RN Web), com opção de uso responsivo na web

---

## 1. ButtonGroup

### Propósito
Agrupar dois ou mais botões adjacentes, com opção de **borda colapsada** (modo `attached`) formando um conjunto visual coeso, ou **espaçados** (modo padrão com `gap`).

### Localização
`src/components/button-group/`

### API

```tsx
<ButtonGroup>
  <Button>Cancelar</Button>
  <Button variant="primary">Confirmar</Button>
</ButtonGroup>

<ButtonGroup attached>
  <Button variant="surface">Esquerda</Button>
  <Button variant="surface">Centro</Button>
  <Button variant="surface">Direita</Button>
</ButtonGroup>

<ButtonGroup orientation="vertical" attached>
  <IconButton icon="bold" />
  <IconButton icon="italic" />
  <IconButton icon="underline" />
</ButtonGroup>
```

### Props

```ts
export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';   // default: 'horizontal'
  attached?: boolean;                         // default: false
  spacing?: SpacingToken;                     // default: 'small' quando !attached
  isDisabled?: boolean;                       // propaga para filhos via context
  'aria-label'?: string;
  'aria-labelledby'?: string;
}
```

### Implementação

- **Context:** `ButtonGroupContext` expõe `{ attached, orientation, isDisabled, totalItems, indexHint? }`.
- **Filhos:** `Button` e variantes consomem o contexto. Se `attached`:
  - Primeiro item (index 0): zera `borderEndStartRadius` / `borderEndEndRadius` (horizontal) ou equivalente vertical.
  - Itens do meio: zera radii das bordas adjacentes.
  - Último item: simétrico ao primeiro.
  - Bordas adjacentes colapsam via `marginInlineStart: -1px` (horizontal) para evitar borda dupla.
- **Sem wrapper extra:** usa `Flex` internamente com `role="group"`.

**ADR-15-01:** `attached` não modifica `Button` diretamente — o contexto fornece flags e o `Button` já existente decide, no seu recipe, quando zerar radii. Isso mantém `Button` autônomo (consumível fora de grupo) e evita engenharia de "detecção de pais".

### Acessibilidade

- `role="group"` no container.
- `aria-label` ou `aria-labelledby` **obrigatório** (warning dev-only se ausente).
- Quando `isDisabled=true`, cada filho recebe `aria-disabled` e `tabIndex={-1}`.

---

## 2. FloatingActionButton (FAB)

### Propósito
Botão de ação primária flutuante, fixado na tela. Suporta:
- **FAB mini/default/large** (tamanhos)
- **FAB estendido** (com label textual)
- **Posicionamento** em cantos ou centralizado bottom
- **Variantes** primary/secondary/surface

### Localização
`src/components/fab/`

### API

```tsx
<FloatingActionButton icon="plus" onPress={handleCreate} />

<FloatingActionButton
  icon="plus"
  label="Nova venda"
  onPress={handleCreate}
/>

<FloatingActionButton
  icon="pencil"
  size="sm"
  position="bottom-right"
  offset={{ bottom: 80, right: 16 }}
/>
```

### Props

```ts
export interface FloatingActionButtonProps {
  icon: IconName;
  label?: string;                                       // quando presente, FAB é estendido
  size?: 'sm' | 'md' | 'lg';                            // default: 'md'
  variant?: 'primary' | 'secondary' | 'surface';        // default: 'primary'
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'none';  // default: 'bottom-right'
  offset?: { bottom?: number; right?: number; left?: number };
  disabled?: boolean;
  onPress: () => void;
  'aria-label'?: string;                                // obrigatório quando !label
}
```

### Implementação

- **Web:** `position: fixed`, z-index elevado (token `zIndex.fab`, a adicionar).
- **Native:** `position: 'absolute'` dentro do container raiz da tela; `SafeAreaView` awareness via `useSafeAreaInsets` quando disponível (peer opcional).
- **Tamanhos:** `sm=40px`, `md=56px` (Material default), `lg=72px`.
- **Shadow:** consome token `shadows.xl`.
- **Animação de entrada:** `scale(0) → scale(1)` com `transition(['transform'], 'normal', 'decelerate')`. Opcional via prop `animateOnMount` (default `true`).
- **Expansão do label:** quando `label` está presente, botão renderiza `Icon + Text`; transição de `width: auto` é suavizada por `transition(['width', 'padding'], 'fast')`.

**ADR-15-02:** `position='none'` permite ao consumidor encapsular o FAB em seu próprio container posicionado (útil em layouts custom). Default `'bottom-right'` cobre 90% dos casos.

### Acessibilidade

- `accessibilityRole="button"` (RN) / `role="button"` (web, via Clickable).
- `aria-label`:
  - Se `label` existe → usa `label`.
  - Se apenas `icon` → `aria-label` **obrigatório** (runtime warning).
- Foco visível: ring via `_focus-visible` consistente com Button da Fase 16.
- `tabIndex` correto — não quebra ordem natural de foco da página.

---

## 3. NavBar (mobile-only)

### Propósito
Barra de navegação inferior para aplicativos mobile. Análogo ao iOS Tab Bar e Android Bottom Navigation.

### Localização
`src/components/nav-bar/`

### Escopo de plataforma

- **Mobile (RN, Expo):** uso principal.
- **Web:** funciona, mas `NavBar` não se autoculta — o consumidor decide via prop responsiva (`display={{ base: 'flex', md: 'none' }}`) se quer ocultar em desktop. Default: sempre renderiza.

**ADR-15-03:** NavBar é construído para mobile e não assume decisões de layout do consumidor. A convenção documentada é "use em mobile-first layouts; oculte em breakpoints desktop se aplicável".

### API

```tsx
<NavBar value={activeTab} onChange={setActiveTab}>
  <NavBar.Item value="home"     icon="home"            label="Início" />
  <NavBar.Item value="search"   icon="search"          label="Buscar" />
  <NavBar.Item value="cart"     icon="shopping-cart"   label="Carrinho" badge={3} />
  <NavBar.Item value="profile"  icon="user"            label="Perfil" />
</NavBar>
```

### Props

```ts
export interface NavBarProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  safeAreaBottom?: boolean;   // default: true — padding inferior em iOS
  blurred?: boolean;          // default: false — backdrop-filter (web) / BlurView (RN opcional)
  'aria-label'?: string;      // default: "Bottom navigation"
}

export interface NavBarItemProps {
  value: string;
  icon: IconName;
  label: string;
  badge?: number | boolean;   // boolean → dot; number → contador (>99 vira "99+")
  disabled?: boolean;
}
```

### Implementação

- **Compound component:** `NavBar` + `NavBar.Item`.
- **Context:** `NavBarContext` expõe `{ value, onChange }` para itens.
- **Active indicator:**
  - Ícone ativo escala de `1 → 1.12` com `transition(['transform', 'color'], 'fast')`.
  - Cor muda para `interactive.default` (token semântico).
  - Label ativo opcionalmente ganha `fontWeight: medium`.
- **Badge:**
  - `badge={true}` → dot de 8px no canto superior direito do ícone.
  - `badge={n}` → pill com número; se `n > 99`, mostra `"99+"`.
- **SafeArea:**
  - Native: `useSafeAreaInsets().bottom` como padding inferior quando `safeAreaBottom=true`.
  - Web: `env(safe-area-inset-bottom)` via CSS.
- **Posicionamento:**
  - Native: consumidor decide (coloca no final do container root).
  - Web: `position: fixed; bottom: 0; left: 0; right: 0` **quando** usado em contexto mobile; caso contrário, inline.
- **Blurred:**
  - Web: `backdrop-filter: blur(20px)` + cor com alpha.
  - Native: `BlurView` do `expo-blur` se disponível; fallback para cor sólida.

**ADR-15-04:** `blurred` é opcional e gracioso — se a lib de blur não está instalada (ex: app RN puro sem Expo), fallback automático para cor sólida. O Arbor-DS não adiciona dependência pesada obrigatória.

### Acessibilidade

- Container: `role="tablist"` + `aria-label` (default "Bottom navigation").
- Item: `role="tab"` + `aria-selected` + `aria-controls` (quando houver panel associado — opcional).
- `aria-disabled` em itens desabilitados.
- Ordem de foco: tab natural entre itens.
- Badge: `aria-label` auxiliar ("3 novos itens") — o label do item continua o nome do tab.

---

## Estratégia Cross-Platform

| Componente | Web | Native | Notas |
|------------|-----|--------|-------|
| ButtonGroup | Flex + bordas colapsadas via margin negativa | Flex + bordas colapsadas via `marginStart: -1` | Mesmo código; recipe do Button resolve radii por plataforma |
| FAB | `position: fixed` | `position: 'absolute'` com SafeArea | Implementações via `.tsx` / `.native.tsx` |
| NavBar | `position: fixed` (bottom) | Inline no container, SafeArea inset | `.native.tsx` para blur + safe area |

---

## Impacto em DX

- Toolbar de ações agora é 3 linhas: `<ButtonGroup attached>...`.
- FAB de "adicionar" é 1 linha: `<FloatingActionButton icon="plus" onPress={...} />`.
- Navegação mobile é compound claro: `NavBar` + `NavBar.Item` com `value/onChange` controlado.

---

## Impacto em Acessibilidade e Performance

- **A11y:** os três componentes são acessíveis por default — ARIA roles, foco visível, labels obrigatórios quando necessário.
- **Performance:** nenhum componente usa animação custosa. Transições consomem `transition()` da Fase 13. Re-renders são localizados (context com `value/onChange` não re-renderiza itens cujo `value` não mudou, se implementado com `React.memo` + comparação por `value`).
- **Bundle:** três componentes novos, sem dependências externas além de `lucide-*`.

---

## Plano de Execução

**Sprint curto paralelo** (após Fase 14 mergeada):

| Tarefa | Responsável | Dependência |
|--------|-------------|-------------|
| ButtonGroup — context + Flex + recipe de radii no Button | — | Icon (para IconButton opcional) |
| FAB — web (`.tsx`) | — | Icon |
| FAB — native (`.native.tsx`) + SafeArea | — | FAB web |
| NavBar — compound + context | — | Icon |
| NavBar — native SafeArea + blur opcional | — | NavBar base |
| Stories dos três no Storybook | — | Componentes |
| Testes unitários (≥15 testes novos) | — | Componentes |

---

## Critérios de Qualidade

### ButtonGroup
- [ ] Render com 2+ Buttons funciona em web e native
- [ ] `attached=true` colapsa radii nas bordas internas corretamente
- [ ] `orientation="vertical"` inverte eixo e radii
- [ ] `isDisabled` propaga para todos os filhos
- [ ] `aria-label` obrigatório (warning dev-only se ausente)
- [ ] Teclado: tab navega entre botões na ordem

### FloatingActionButton
- [ ] Web: `position: fixed` funciona
- [ ] Native: `position: 'absolute'` + SafeArea respeitada no iOS
- [ ] `size` sm/md/lg renderizam com dimensões corretas
- [ ] `label` expande largura com animação
- [ ] `disabled` bloqueia `onPress`
- [ ] `aria-label` obrigatório quando só ícone

### NavBar
- [ ] `NavBar.Item` seleciona via `onChange`
- [ ] Indicator anima entre itens com `duration: fast`
- [ ] `badge={3}` renderiza "3"; `badge={150}` renderiza "99+"
- [ ] `badge={true}` renderiza dot
- [ ] `safeAreaBottom` aplica padding no iOS
- [ ] `role="tablist"` + `role="tab"` corretos
- [ ] `blurred` funciona com fallback gracioso

### Geral
- [ ] Três stories no Storybook (`🌳 Arbor DS/Components/...`)
- [ ] Testes unitários: ≥5 por componente
- [ ] `pnpm test` verde com no mínimo 452 testes (437 + 15)
- [ ] `pnpm build:lib` sem erros
- [ ] Suite visual (Storybook) sem regressão

---

## Decisões Arquiteturais (ADRs desta fase)

- **ADR-15-01:** ButtonGroup propaga via context, não reescreve `Button`. Button continua autônomo.
- **ADR-15-02:** FAB com `position='none'` permite composição custom pelo consumidor.
- **ADR-15-03:** NavBar é mobile-first mas não se autoculta em web — decisão do consumidor via prop responsiva.
- **ADR-15-04:** NavBar `blurred` é gracioso: fallback para cor sólida se lib de blur ausente.

---

## Próximas Fases

- **Fase 16** refina Button, Input, Modal etc. consumindo `transition()` e `Icon`. Button refinado volta a ser consumido por `ButtonGroup` sem mudanças de API.
- **Fase 17** usa os três componentes novos no playground mobile: NavBar na base, FAB flutuante, ButtonGroup em telas de ação.
