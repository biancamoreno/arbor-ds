# Fase 17 — Playground Mobile como Showcase Navegável

**Status:** Planejada
**Estimativa:** 1–2 dias-pessoa
**Risco:** Baixo (sem alterações em código-lib; apenas consumidor)
**Pré-requisito:** Fases 13, 14, 15 e 16 concluídas

---

## Contexto

O playground mobile hoje (`playground/App.tsx`) é minimal: uma tela estática com Badge e Button. Ele não exercita:

- NavBar, FAB, ButtonGroup (Fase 15)
- Animações e estados polidos (Fase 16)
- Tokens de fonte customizados (Fase 13)
- Biblioteca de ícones (Fase 14)

Esta fase transforma o playground em uma **showcase navegável** que funciona como:

1. **Validação cross-platform** — todo componente é exercitado em Expo (iOS simulator, Android emulator, Expo Go).
2. **Demonstração para adopters** — desenvolvedores avaliando o Arbor-DS abrem o playground e vêem tudo funcionando.
3. **Teste manual de regressão** — antes de cada release, a equipe percorre as telas do playground.

---

## Objetivos

1. Estruturar o playground em **screens navegáveis** por NavBar.
2. Exercitar **NavBar + FAB** no layout raiz.
3. Criar **uma tela por categoria de componente**, demonstrando estados, variantes e animações.
4. Validar carregamento de fontes customizadas no Expo.
5. Documentar no README do playground como rodar em iOS/Android/web.

---

## Diagnóstico do Playground Atual

**Estrutura atual:**
```
playground/
  App.tsx             # hello world com Badge + Button
  app.json            # config Expo
  main.tsx            # entry web (Vite)
  src/
    playground.tsx    # showcase web
    index.ts
```

**Lacunas:**
- `App.tsx` (entry mobile) não reflete o estado do DS.
- Sem estrutura de screens — tudo inline.
- Fontes customizadas não carregadas (Figtree). Expo precisa de `expo-font` ou equivalente.
- Sem navegação entre categorias.

---

## Escopo

### 1. Nova estrutura

```
playground/
  App.tsx                           # entry mobile (Expo)
  main.tsx                          # entry web (Vite, mantido)
  src/
    playground.tsx                  # showcase web (mantido)
    mobile/
      App.tsx                       # raiz mobile (renomear de playground/App.tsx)
      screens/
        HomeScreen.tsx
        ButtonsScreen.tsx           # Button, IconButton, ButtonGroup, FAB
        FormsScreen.tsx             # Input, Checkbox, Radio, Switch, Select
        FeedbackScreen.tsx          # Toast, Alert, Badge, Chip, Spinner, Skeleton
        OverlayScreen.tsx           # Modal, Drawer, Tooltip, Popover, Menu
        DataScreen.tsx              # Card, Avatar, Table (se aplicável), Accordion, Tabs
      components/
        ScreenWrapper.tsx           # container com header + scroll
        SectionTitle.tsx
        DemoBlock.tsx               # wrapper com label para cada demo
      hooks/
        useScreen.ts                # state machine trivial de navegação
      fonts.ts                      # carregamento de Figtree via expo-font
```

### 2. App.tsx renovado

```tsx
import { useFonts } from 'expo-font';
import { ArborProvider } from 'arbor-ds/ecosystem';
import { themeLight, themeDark } from 'arbor-ds/foundations';
import { NavBar, FloatingActionButton } from 'arbor-ds';
import { useState } from 'react';
import {
  HomeScreen,
  ButtonsScreen,
  FormsScreen,
  FeedbackScreen,
  OverlayScreen,
  DataScreen,
} from './src/mobile/screens';

const SCREENS = {
  home:     HomeScreen,
  buttons:  ButtonsScreen,
  forms:    FormsScreen,
  feedback: FeedbackScreen,
  overlay:  OverlayScreen,
  data:     DataScreen,
} as const;

type ScreenKey = keyof typeof SCREENS;

export default function App() {
  const [fontsLoaded] = useFonts({
    Figtree: require('./assets/fonts/Figtree-Regular.ttf'),
    'Figtree-Medium': require('./assets/fonts/Figtree-Medium.ttf'),
    'Figtree-Bold': require('./assets/fonts/Figtree-Bold.ttf'),
  });
  const [screen, setScreen] = useState<ScreenKey>('home');
  const Screen = SCREENS[screen];

  if (!fontsLoaded) return null;

  return (
    <ArborProvider theme={themeLight}>
      <Screen />
      <NavBar value={screen} onChange={(v) => setScreen(v as ScreenKey)}>
        <NavBar.Item value="home"     icon="home"                label="Home" />
        <NavBar.Item value="buttons"  icon="mouse-pointer-click" label="Botões" />
        <NavBar.Item value="forms"    icon="file-text"           label="Forms" />
        <NavBar.Item value="feedback" icon="bell"                label="Feedback" />
        <NavBar.Item value="overlay"  icon="layers"              label="Overlays" />
      </NavBar>
      {screen === 'buttons' && (
        <FloatingActionButton
          icon="plus"
          label="Criar"
          onPress={() => console.log('FAB pressed')}
        />
      )}
    </ArborProvider>
  );
}
```

**ADR-17-01:** Navegação feita com state local (sem `react-navigation`) — o objetivo é demonstrar componentes do DS, não padrões de routing. Mantém playground leve e sem deps de routing lib.

### 3. Screens

#### HomeScreen
Cartão com logo (`🌳 Arbor DS`), versão da lib, links para docs/Storybook/GitHub. Demonstra `Card`, `Text`, `Clickable`.

#### ButtonsScreen
- Grid com todas as variantes de Button (primary/secondary/surface/ghost/danger) × (sm/md/lg)
- ButtonGroup horizontal e vertical, attached e não-attached
- IconButton examples
- Estados: loading, disabled
- FAB demonstrado in-page (position='none') além do FAB global

#### FormsScreen
- Input (default, error, success, loading, floatingLabel, com/sem prefix/suffix)
- Select com opções
- Checkbox grupo
- Radio / RadioCard grupo
- Switch
- Field compound com label + error + helper

#### FeedbackScreen
- Badge (variants e com contador animado ao clicar "+")
- Chip com `removable`
- Alert (info/success/warning/error) com ícones Lucide
- Toast triggers (top/bottom/left/right)
- Spinner (sizes)
- Skeleton shimmer

#### OverlayScreen
- Modal abrir/fechar (animação entrada/saída)
- Drawer (left/right/bottom)
- Tooltip (em botão)
- Popover (menu de ações)
- Menu contextual

#### DataScreen
- Card (default, hoverable, clickable)
- Avatar (com/sem imagem, fallback)
- Accordion (múltiplos itens)
- Tabs (indicator animado)

### 4. Fontes

Adicionar arquivos `.ttf` da Figtree em `playground/assets/fonts/` e carregar via `expo-font`. Sem fontes carregadas, o default Figtree cai no system stack — validar que `tokens.fontFamily.sans` resolve corretamente nesse fallback.

**ADR-17-02:** Fontes bundled no app Expo (não baixadas em runtime). `useFonts` bloqueia render até carregamento completo. Splash screen já trata o vazio inicial.

### 5. Theming no playground

Opcional, baixa prioridade: toggle light/dark no HomeScreen via `useState<'light' | 'dark'>` + `ArborProvider theme={mode === 'light' ? themeLight : themeDark}`.

---

## Estratégia Cross-Platform

Esta fase é **playground-specific** — nenhum código-lib é tocado. O objetivo é demonstrar o DS em RN (Expo) e, como efeito colateral, em web via RN Web.

| Target | Entry | Comando |
|--------|-------|---------|
| Expo iOS/Android | `App.tsx` | `pnpm --filter playground start` |
| Web (Vite, RN Web) | `main.tsx` | `pnpm dev` |

Validar em **três ambientes**:
1. iOS simulator (Expo)
2. Android emulator (Expo)
3. Web (já coberto por `pnpm dev`)

---

## Impacto em DX

- Playground vira o **cartão de visita** do Arbor-DS para novos consumidores.
- Fluxo de teste manual antes de release fica estruturado (roteiro: navegar as 6 telas).
- QA visual mais rápido — uma screen por categoria facilita testing targeted.

---

## Impacto em Acessibilidade e Performance

- **A11y:** playground expõe componentes reais — bugs de a11y aparecem naturalmente no uso (ex: foco perdido ao trocar de screen).
- **Performance:** lista de screens com `React.memo` por screen; única screen ativa renderiza por vez.
- **Bundle Expo:** fontes Figtree agregam ~200KB. Aceitável para playground; documentar.

---

## Plano de Execução

1. Reestruturar `playground/` com a nova hierarquia de pastas
2. Criar `ScreenWrapper`, `SectionTitle`, `DemoBlock` (helpers internos)
3. Portar conteúdo atual para `HomeScreen`
4. Construir cada screen progressivamente (ordem: Buttons → Forms → Feedback → Overlay → Data)
5. Adicionar fontes Figtree + `expo-font` + teste de carregamento
6. Integrar NavBar + FAB no `App.tsx` raiz
7. Rodar em iOS simulator e validar cada screen
8. Rodar em Android emulator e validar regressões de plataforma
9. Rodar em web (Vite) e validar que RN Web não quebrou
10. Atualizar `playground/README.md` com scripts e instruções

---

## Critérios de Qualidade

### Funcional
- [ ] Playground mobile inicia no Expo sem erros
- [ ] NavBar aparece fixado na base com SafeArea respeitada (iOS)
- [ ] FAB aparece posicionado na ButtonsScreen
- [ ] Navegação entre 6 screens funciona
- [ ] Figtree carrega corretamente (validar via `Text` render)
- [ ] Mudança de screen não causa flash de unstyled content

### Cobertura
- [ ] Cada screen exercita ≥ 5 componentes do DS
- [ ] Todas as variantes principais de Button estão visíveis
- [ ] Todos os estados de Input são demonstráveis
- [ ] Modal/Drawer/Tooltip abrem e fecham com animação

### Cross-platform
- [ ] iOS simulator: todas as screens funcionam
- [ ] Android emulator: todas as screens funcionam
- [ ] Web (Vite): `pnpm dev` continua funcionando sem regressão
- [ ] SafeArea correta em device com notch (iPhone 14+)

### Documentação
- [ ] `playground/README.md` documenta como rodar web/iOS/Android
- [ ] Troubleshooting comum listado (font loading, metro cache)

### Regressão
- [ ] `pnpm test` verde (playground não roda jest, mas a lib precisa continuar passando)
- [ ] `pnpm build:lib` sem erros
- [ ] Nenhuma alteração em `src/` (playground-only)

---

## Decisões Arquiteturais (ADRs desta fase)

- **ADR-17-01:** Navegação no playground usa state local, não `react-navigation` — mantém foco em demonstrar componentes do DS, evita dependência de routing lib.
- **ADR-17-02:** Fontes bundled via `expo-font` no app, não baixadas em runtime — onboarding offline-friendly.
- **ADR-17-03:** Nenhum código da lib (`src/`) é alterado nesta fase — falhas descobertas aqui viram tickets para Fases 13–16.

---

## Roteiro de Teste Manual (Regression Pack)

Ao final, executar este roteiro em iOS + Android + Web:

1. Abrir app
2. Ver HomeScreen → validar fonte Figtree, cards renderizam
3. Tocar NavBar → navegar para Buttons
4. Scroll completo na ButtonsScreen → validar ButtonGroup attached
5. Tocar FAB → console log aparece
6. Navegar para Forms → digitar em Input, validar focus ring animado
7. Forçar Input em error → validar shake
8. Navegar para Feedback → abrir Toast → validar slide + countdown
9. Abrir Alert dismissible → dismiss → animação de saída
10. Navegar para Overlay → abrir Modal → validar fade + scale
11. Abrir Drawer (right) → validar slide
12. Hover no Tooltip (web) / press-and-hold (mobile) → validar delay
13. Navegar para Data → abrir Accordion → validar altura animada
14. Trocar Tab → validar indicator slide

Todos os 14 passos devem funcionar sem jank, crash, ou regressão visual.

---

## Encerramento da Iniciativa (Fases 13–17)

Após Fase 17, a iniciativa iniciada na Fase 13 estará completa:

| Fase | Entrega |
|------|---------|
| 13 | Fundações: font tokens, motion utility, Storybook brand |
| 14 | Biblioteca de ícones (Lucide) |
| 15 | Novos componentes: ButtonGroup, FAB, NavBar |
| 16 | Polish visual e animações de todos os existentes |
| 17 | Playground mobile como showcase navegável |

**Release proposto:** `1.1.0` (minor) — aditivo, sem breaking changes de API pública.

**Comunicação sugerida:**
- CHANGELOG destacando novos componentes e animações
- Post de release mostrando GIF do playground mobile
- Migration guide curto (só cobre o default do `Text` ganhando `fontFamily: sans` — sem impacto visual real)
