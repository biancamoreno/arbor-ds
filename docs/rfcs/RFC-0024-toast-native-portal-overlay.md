# RFC-0024 — Toast.native + Portal `mode="overlay"`

**Status**: Draft
**Autores**: @bia
**Data**: 2026-04-28
**PR**: —

**Origem**: Sub-onda 7.5 da [TD-018](../TECH_DEBT.md#td-018) (último feedback indicator web-only). Fecha TD-018 junto com a 7.4 ([RFC-0023](RFC-0023-progress-circle-native.md)). Estabelece também o **precedente de Portal não-modal** que [R6-G](../TECH_DEBT.md#backlog-de-rfcs-candidatas-r6) (overlays Dialog/Drawer/Tooltip/Popover/Menu) consumirá.

---

## 1. Diagnóstico

`Toast` hoje é declaradamente cross-platform (sem `@platform` na interface), mas a implementação real é **web-only de fato** em três frentes:

1. **Toaster** monta via `Portal` web (`ReactDOM.createPortal(children, document.body)`).
2. **Animação de entrada** usa `<style>` injetado via `document.createElement('style')` + `@keyframes arbor-toast-in`.
3. **Posicionamento** usa CSS positioning (`position: fixed`, `transform: translateX(-50%)`) que não existe em RN.

Tudo o que **não** depende de DOM já está pronto para reaproveitamento:

- `toastStore` (`src/components/toast/store/toast-store.ts`) é **vanilla JS puro**: `useSyncExternalStore` + um `Set<Listener>`. Funciona em qualquer runtime React 18+ — web, native, RNW.
- `useToast()` é uma fachada de 4 linhas sobre o store. Compartilhada sem alterações.
- `ToastItem`, `ToastInput`, `ToastTone`, `ToastPlacement` são tipos puros de dados.

A trava arquitetural é **dupla**:

- **Trava de host** — em RN não existe `document.body`. O `Portal.native` atual existe (`src/ecosystem/primitives/portal/portal.native.tsx`) e usa `<Modal transparent visible animationType="none" statusBarTranslucent>` como host. Modal é correto para Dialog/Drawer (semântica modal, captura de foco desejada), mas **bloqueia toques na UI subjacente** — o oposto do que Toast precisa.
- **Trava de motion** — animação CSS keyframe não roda em RN. Precisa de `Animated` (built-in) ou `Reanimated` (peer dep nova).

Sem resolver as duas, `Toast.native` ou (a) trava o app inteiro com Modal capturando toques, ou (b) renderiza estaticamente sem entrada/saída animada.

### Por que importa agora

- TD-018 exige fechamento dos 7 indicators paritários. 6 já entregues (7.1–7.4 + Spinner/Skeleton). Toast é o último.
- O precedente de Portal **não-modal** é pré-requisito para R6-G: Tooltip e Popover têm a mesma necessidade (overlay sobre conteúdo, não bloquear toques fora do âncora). Resolver em Toast destrava cinco overlays seguintes.
- `feedback_cross_platform_obrigatorio` (memória persistente): `@platform web-only` é bug. Toast viola a diretriz desde a fase 10.

---

## 2. Direção recomendada

**Caminho A — Portal extensível + Toast com `Animated` built-in + `PanResponder` para dismiss + a11y via `accessibilityLiveRegion` + `AccessibilityInfo.announceForAccessibility`.**

Três decisões centrais, cada uma justificada contra alternativas reais:

### 2.1. Host de portal: Modal de RN + `pointerEvents="box-none"` (extensão da Portal.native existente)

`Portal.native` ganha um prop opcional `mode?: 'modal' | 'overlay'` (default `'modal'`):

- `mode="modal"` — comportamento atual preservado byte-a-byte. Dialog/Drawer/Menu seguem usando, sem mudança.
- `mode="overlay"` — mesma `Modal` host (zero deps novas, evita branching arquitetural), mas o inner `View` recebe `pointerEvents="box-none"` para deixar toques passarem para o conteúdo subjacente quando não houver filho intercepto.

Toast e (no futuro) Tooltip/Popover consomem `<Portal mode="overlay">`. Dialog/Drawer continuam em `<Portal>` (default `'modal'`).

#### Alternativas descartadas

| Alternativa | Por que descartada |
|---|---|
| **`react-native-root-siblings`** (lib popular do nicho) | Peer dep nova só para Toast. Singleton de mount global é frágil em hot-reload e quebra com múltiplas árvores React (testes, Storybook RNW). Funcionalmente igual ao Modal-based + `box-none`. |
| **Outlet manual no `ArborProvider`** (registry interno tipo RootSiblings, sem lib externa) | Acopla `ArborProvider` (camada `ecosystem`) a `toastStore` (camada `components`). Inverte a direção da dependência arquitetural do DS. |
| **Mount inline absoluto** (`<Toaster />` em `position: absolute` na árvore do consumidor) | Fica preso ao `overflow` e ao `zIndex` do ancestral mais próximo. Funciona em apps simples e quebra em apps com `BottomSheet`/`Drawer`/`SafeAreaView` por cima. Modal sobe para o topo da janela nativa, sempre. |
| **`react-native-portalize` / `@gorhom/portal`** | Peer deps novas. Arquitetura interessante, mas ROI baixo: o caminho Modal + `box-none` resolve sem dep, e o ganho funcional só apareceria se múltiplos portals precisassem coordenar z-index — não é o caso hoje. |

**Conclusão:** Modal já é o host correto. `box-none` é o único delta. Custo: ~3 linhas em `portal.native.tsx`.

#### Riscos conhecidos do Modal como host

- **Stacking iOS**: nativamente, o iOS suporta múltiplos `UIViewController` modais empilhados. RN `Modal` traduz para isso corretamente quando `presentationStyle="overFullScreen"` (default). Nosso uso atual com `transparent` + `animationType="none"` evita o glitch de transição. Toast aparecendo sobre Dialog → o segundo Modal RN entra por cima sem fechar o primeiro. Validado pelas implementações que usam o mesmo padrão (NativeBase, antigo Tamagui v2).
- **`onRequestClose` Android**: `Modal` exige handler para back-button. Em `mode="overlay"` (Toast), back-button **não** deve fechar Toast (anti-padrão UX). Default no-op é seguro.
- **Status bar / safe area**: `statusBarTranslucent` já está ligado. Toast respeitar safe-area é responsabilidade do `placement` (insets default), não do Portal.

### 2.2. Motion: `Animated` built-in (sem peer dep de Reanimated)

`Animated` da própria React Native, alinhado com:

- [RFC-0023](RFC-0023-progress-circle-native.md) — ProgressCircle.native usa `Animated.loop` + `useNativeDriver: true`.
- TD-018 sub-ondas 7.2 (Spinner.native — `Animated.loop`) e 7.3 (Skeleton.native — `Animated.sequence`).

#### Alternativas descartadas

| Alternativa | Por que descartada |
|---|---|
| **`react-native-reanimated` peer dep** | Adiciona peer dep pesada (~150KB nativa, exige Babel plugin no consumidor) só para Toast. Reanimated é superior para gestos contínuos com 60fps garantido na UI thread, mas Toast tem entrada/saída discretas (300ms cada) — ganho marginal. Reverter depois é difícil (consumidores travam Babel config). |
| **`Animated` com `useNativeDriver: false`** | Funciona, mas anima na JS thread — pode dropar frames se UI thread estiver ocupada (lista pesada renderizando). `transform`/`opacity` funcionam com `useNativeDriver: true`. |
| **CSS keyframes via `react-native-web`** | Só funciona em RNW. Em RN cru não há keyframe runtime. Volta ao ponto inicial. |

#### Especificação da animação

```ts
// Entrada: slide vertical (sentido = placement) + fade
const enter = Animated.parallel([
  Animated.timing(translateY, { toValue: 0,  duration: 220, useNativeDriver: true }),
  Animated.timing(opacity,    { toValue: 1,  duration: 220, useNativeDriver: true }),
]);

// Saída: inversa
const exit = Animated.parallel([
  Animated.timing(translateY, { toValue: directionOffset, duration: 180, useNativeDriver: true }),
  Animated.timing(opacity,    { toValue: 0,                duration: 180, useNativeDriver: true }),
]);
```

`directionOffset`: `+24` para placements `bottom-*`, `-24` para `top-*`. Mesma convenção da animação web (`translateY: 8px → 0`), escalada para densidade mobile.

`usePrefersReducedMotion()` (já existente, fase 13) curto-circuita ambas: aparição/desaparição sem animação, só toggle de visibilidade.

### 2.3. Gesture-to-dismiss: `PanResponder` built-in

`PanResponder` é parte do core RN, zero deps novas.

```ts
const pan = useRef(new Animated.ValueXY()).current;
const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8,
    onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) => {
      if (Math.abs(g.dx) > 80) {
        // Swipe-out: fade + slide horizontal + remove
        toastStore.remove(item.id);
      } else {
        // Bounce back
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      }
    },
  }),
).current;
```

Direção: horizontal (sentido natural de "varrer para fechar" em Snackbar/Toast iOS+Android).

Vertical é reservado para a animação de entrada/saída — não conflita.

#### Alternativas descartadas

| Alternativa | Por que descartada |
|---|---|
| **`react-native-gesture-handler`** | Peer dep nova. Superior para gestos compostos, mas Toast tem 1 gesto único. Overkill. |
| **Sem gesture-to-dismiss** | UX inferior à web (que tem hover-pause + click-to-close); em mobile, swipe-to-dismiss é convenção forte. Quebra paridade de expectativa. |
| **Tap-to-close fora da área** | Toast é não-modal — tap fora deve cair na UI subjacente. Conflita com `pointerEvents="box-none"`. Mantemos só o botão `Close` + swipe + `duration` automática. |

`useNativeDriver: false` em `PanResponder.move` é uma limitação conhecida do `Animated.event` (não suporta nativeDriver para gestos). Aceitável: o movimento ativo de drag precisa de re-cálculo na JS thread. As animações de entrada/saída/spring-back continuam com nativeDriver.

### 2.4. A11y: `accessibilityLiveRegion` + `AccessibilityInfo.announceForAccessibility`

A web hoje aplica `aria-live="polite"` (ou `"assertive"` para `tone="critical"`) e `aria-atomic="true"`.

Mapeamento para RN:

- `accessibilityLiveRegion` (Android nativo, RN propaga) — valores: `"none" | "polite" | "assertive"`.
- iOS **não** tem live region nativo equivalente — acessibilidade dinâmica via `AccessibilityInfo.announceForAccessibility(message)` (TalkBack/VoiceOver lê o texto como notificação).

Implementação:

```ts
useEffect(() => {
  const message = [item.title, item.description].filter(Boolean).join('. ');
  if (message) AccessibilityInfo.announceForAccessibility(message);
}, [item.id]); // anuncia uma vez na montagem
```

`accessibilityRole="alert"` (paridade do `role="status"` web) + `accessibilityLiveRegion={tone === 'critical' ? 'assertive' : 'polite'}`.

**Pré-requisito atendido:** [TD-019](../TECH_DEBT.md#td-019) (Resolved 2026-04-28) — engine native plataforma-aware passou a aceitar props de a11y nativas. `accessibilityLiveRegion` flui pelo `Box`/`Flex` sem ser bloqueada.

---

## 3. Estrutura proposta

### 3.1. Layout de pastas

```
src/components/toast/
  core/
    toast.tsx                 # web (existente, ajuste mínimo — ver §3.4)
    toast.native.tsx          # NOVO
    toast.test.tsx            # web (existente)
    toast.native.test.tsx     # NOVO
    toast.stories.tsx
    use-toast.ts              # shared (sem mudança)
  store/
    toast-store.ts            # shared (sem mudança)
  interfaces/
    ToastProps.ts             # ajuste — ver §3.5
    index.ts
  index.ts                    # adiciona re-export padrão (já cobre via Jest project-resolver)

src/ecosystem/primitives/portal/
  portal.tsx                  # web — adiciona `mode` (no-op em web, mas mantém API simétrica)
  portal.native.tsx           # extensão — `mode` controla pointerEvents
  portal.native.test.tsx      # +1 case para mode="overlay"
  __tests__/portal.test.tsx   # +1 case para mode="overlay"

src/native.ts                 # adiciona Toast, Toaster, useToast e tipos
```

### 3.2. Portal — extensão de API

```ts
// src/ecosystem/primitives/portal/portal.tsx (web)
type PortalMode = 'modal' | 'overlay';

type PortalProps = {
  children: React.ReactNode;
  container?: Element;
  /** No-op em web — alinhamento de API cross-platform. */
  mode?: PortalMode;
};

export function Portal({ children, container }: PortalProps) {
  const target = container ?? (typeof document !== 'undefined' ? document.body : null);
  if (!target) return null;
  return ReactDOM.createPortal(children, target) as React.ReactElement;
}
```

```tsx
// src/ecosystem/primitives/portal/portal.native.tsx
import React from 'react';
import { Modal, View } from 'react-native';

type PortalMode = 'modal' | 'overlay';
type PortalProps = { children: React.ReactNode; mode?: PortalMode };

export function Portal({ children, mode = 'modal' }: PortalProps) {
  return (
    <Modal transparent visible animationType="none" statusBarTranslucent onRequestClose={() => {}}>
      <View
        style={{ flex: 1 }}
        pointerEvents={mode === 'overlay' ? 'box-none' : 'auto'}
      >
        {children}
      </View>
    </Modal>
  );
}
```

A mudança é compatível com todos os consumidores existentes (Dialog/Drawer/Menu): default `'modal'` preserva comportamento. O delta é **3 linhas**.

### 3.3. Toast.native — implementação

```tsx
// src/components/toast/core/toast.native.tsx
import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import {
  AccessibilityInfo,
  Animated,
  PanResponder,
  StyleSheet,
} from 'react-native';

import { Box, Flex, Text, Clickable, Icon } from '../../core';
import { Portal } from '../../../ecosystem/primitives';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { usePrefersReducedMotion } from '../../../foundations/motion';
import { toastStore } from '../store/toast-store';
import type {
  ToastRootProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastCloseProps,
  ToasterProps,
  ToastTone,
  ToastPlacement,
  ToastItem,
} from '../interfaces';

const TONE_BORDER: Record<ToastTone, string> = {
  neutral: 'border.default',
  info: 'status.info',
  success: 'feedback.success.base',
  warning: 'feedback.warning.base',
  critical: 'feedback.critical.base',
};

function ToastRoot({ children, tone = 'neutral', ...props }: ToastRootProps) {
  return (
    <Flex
      accessibilityRole="alert"
      accessibilityLiveRegion={tone === 'critical' ? 'assertive' : 'polite'}
      {...(props as object)}
      alignItems="flex-start"
      gap="small"
      padding="small"
      paddingX="medium"
      borderRadius="small"
      backgroundColor="surface.raised"
      borderLeftWidth={4}
      borderLeftStyle="solid"
      borderLeftColor={TONE_BORDER[tone] as never}
    >
      {children}
    </Flex>
  );
}

function ToastTitle({ children, ...props }: ToastTitleProps) {
  return (
    <Text {...(props as object)} fontWeight="medium" fontSize="small" color="text.primary">
      {children}
    </Text>
  );
}

function ToastDescription({ children, ...props }: ToastDescriptionProps) {
  return (
    <Text {...(props as object)} fontSize="sm" color="text.secondary">
      {children}
    </Text>
  );
}

function ToastClose({ label = 'Fechar', onClose, ...props }: ToastCloseProps) {
  return (
    <Clickable
      accessibilityRole="button"
      accessibilityLabel={label}
      onClick={onClose}
      {...(props as object)}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      width={32}
      height={32}
      flexShrink={0}
      borderRadius="nano"
    >
      <Icon name="X" size="sm" />
    </Clickable>
  );
}

const PLACEMENT_INSETS: Record<ToastPlacement, ReturnType<typeof StyleSheet.create>['x']> =
  StyleSheet.create({
    'top-left':       { position: 'absolute', top: 16, left: 16,    maxWidth: 420 },
    'top-center':     { position: 'absolute', top: 16, alignSelf: 'center', maxWidth: 420 },
    'top-right':      { position: 'absolute', top: 16, right: 16,   maxWidth: 420 },
    'bottom-left':    { position: 'absolute', bottom: 16, left: 16,  maxWidth: 420 },
    'bottom-center':  { position: 'absolute', bottom: 16, alignSelf: 'center', maxWidth: 420 },
    'bottom-right':   { position: 'absolute', bottom: 16, right: 16, maxWidth: 420 },
  }) as never;

function ToastItemRenderer({ item, placement }: { item: ToastItem; placement: ToastPlacement }) {
  const reducedMotion = usePrefersReducedMotion();
  const isTop = placement.startsWith('top');
  const enterFrom = isTop ? -24 : 24;

  const translateY = useRef(new Animated.Value(reducedMotion ? 0 : enterFrom)).current;
  const opacity = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const dragX = useRef(new Animated.Value(0)).current;

  // Entrada
  useEffect(() => {
    if (reducedMotion) return;
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(opacity,    { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [reducedMotion, translateY, opacity]);

  // Auto-dismiss
  useEffect(() => {
    if (!item.duration) return;
    const t = setTimeout(() => toastStore.remove(item.id), item.duration);
    return () => clearTimeout(t);
  }, [item.id, item.duration]);

  // Anúncio para leitor de tela (iOS + Android complementar)
  useEffect(() => {
    const msg = [item.title, item.description].filter(Boolean).join('. ');
    if (msg) AccessibilityInfo.announceForAccessibility(String(msg));
  }, [item.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8,
      onPanResponderMove: Animated.event([null, { dx: dragX }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > 80) {
          Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(() =>
            toastStore.remove(item.id),
          );
        } else {
          Animated.spring(dragX, { toValue: 0, useNativeDriver: false }).start();
        }
      },
    }),
  ).current;

  return (
    <Animated.View
      style={{ opacity, transform: [{ translateY }, { translateX: dragX }] }}
      {...panResponder.panHandlers}
    >
      <ToastRoot tone={item.tone}>
        <Flex flex={1} flexDirection="column" gap="micro">
          {item.title && <ToastTitle>{item.title}</ToastTitle>}
          {item.description && <ToastDescription>{item.description}</ToastDescription>}
        </Flex>
        <ToastClose onClose={() => toastStore.remove(item.id)} />
      </ToastRoot>
    </Animated.View>
  );
}

function Toaster({ placement = 'bottom-right' }: ToasterProps) {
  const items = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getSnapshot,
  );

  if (items.length === 0) return null;

  return (
    <Portal mode="overlay">
      <Box
        accessibilityLabel="Notificações"
        style={[PLACEMENT_INSETS[placement], { gap: 8 }]}
      >
        {items.map((it) => (
          <ToastItemRenderer key={it.id} item={it} placement={placement} />
        ))}
      </Box>
    </Portal>
  );
}

export const Toast = Object.assign(ToastRoot, {
  Root: ToastRoot,
  Title: ToastTitle,
  Description: ToastDescription,
  Close: ToastClose,
});

export { Toaster };

Toast.displayName = 'Toast';
Toaster.displayName = 'Toaster';
```

### 3.4. Toast.tsx (web) — ajuste mínimo

Apenas adicionar `@platform shared` na interface (vide §3.5). **Sem mudança funcional**. O componente web continua usando keyframes injetadas — o RFC não rebaseia o web.

Justificativa: a especificação web está estável, tem suíte de 9 cases verde, e mexer agora arrisca regressão. Unificar motion engine cross-platform é escopo de uma RFC futura (alinhada com a nota de RFC-0023 sobre estratégia de motion compartilhado).

### 3.5. Interfaces

```ts
// src/components/toast/interfaces/ToastProps.ts
import type { HTMLAttributes, ReactNode } from 'react';

export type ToastTone = 'neutral' | 'success' | 'warning' | 'critical' | 'info';
export type ToastPlacement =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

/** @platform shared */
export interface ToastItem {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Duração em ms. 0 = persistente. @default 5000 */
  duration?: number;
}

/** @platform shared — root é renderizado por plataforma; HTMLAttributes vira no-op em native via cast */
export interface ToastRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  tone?: ToastTone;
}

export interface ToastTitleProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface ToastDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface ToastCloseProps extends HTMLAttributes<HTMLButtonElement> {
  /** @default "Fechar" */
  label?: string;
  onClose?: () => void;
}

/** @platform shared */
export interface ToasterProps {
  placement?: ToastPlacement;
}

export type ToastInput = Omit<ToastItem, 'id'>;
```

A herança de `HTMLAttributes` é mantida — segue o **mesmo padrão de RFC-0021 (Button)**: `.native.tsx` faz `{...(props as object)}` para silenciar tipos DOM-only. Mudança de tipagem cross-platform é escopo de RFC dedicada (mesma decisão de Button/Tag).

---

## 4. Estratégia cross-platform

| Camada | Web | Native | Compartilhado |
|---|---|---|---|
| `toastStore` (vanilla JS) | ✓ | ✓ | **Sim, byte-a-byte** |
| `useToast()` | ✓ | ✓ | **Sim, byte-a-byte** |
| Tipos (`ToastItem`, `ToastInput`, `ToastTone`, `ToastPlacement`) | ✓ | ✓ | **Sim, byte-a-byte** |
| `Toast.Root` / `Title` / `Description` / `Close` | DOM (`role="status"`, `aria-live`, keyframes) | RN (`accessibilityRole`, `accessibilityLiveRegion`, sem keyframes) | API pública idêntica |
| `Toaster` | `Portal` web → `document.body` | `Portal mode="overlay"` → `Modal` + `box-none` | API idêntica (mesma `ToasterProps`) |
| Animação | CSS `@keyframes arbor-toast-in` | `Animated.parallel(translateY + opacity)` | Sem compartilhamento direto (motion engine futuro unifica — out of scope) |
| Gesture-to-dismiss | — (web tem hover-pause + click-close) | `PanResponder` swipe horizontal | Por plataforma, via convenção UX |
| Live region | `aria-live` + `aria-atomic` | `accessibilityLiveRegion` + `AccessibilityInfo.announceForAccessibility` | Semanticamente equivalente |

**Surface area pública (consumidor):** 100% idêntica — `useToast()`, `<Toaster />`, `Toast.*` se compõem do mesmo jeito nas duas plataformas.

---

## 5. Impacto em DX

- **Zero diff de uso.** Código consumidor migra para `arbor-ds/native` sem alteração de chamada:

  ```tsx
  import { Toaster, useToast } from 'arbor-ds/native';

  function Screen() {
    const { toast } = useToast();
    return (
      <View style={{ flex: 1 }}>
        <Toaster placement="bottom-center" />
        <Button onClick={() => toast({ title: 'Salvo', tone: 'success' })}>Salvar</Button>
      </View>
    );
  }
  ```

- Playground Expo (fase 17) ganha Toast funcional, fechando paridade do roteiro de demo.
- Documentação Storybook não muda (RNW renderiza a versão `.native` quando rodando no playground mobile, e a web no Storybook).
- API symmetric do `Portal` (`mode` cross-platform, no-op em web) ajuda quem implementar Tooltip/Popover depois — copia o pattern.

---

## 6. Acessibilidade e performance

### A11y

- **Web (sem mudança):** `role="status"` + `aria-live` + `aria-atomic` continuam.
- **Native:**
  - `accessibilityRole="alert"` na raiz do Toast.
  - `accessibilityLiveRegion="polite"` (ou `"assertive"` para `tone="critical"`).
  - `AccessibilityInfo.announceForAccessibility(title + description)` no mount, garantindo iOS (que ignora `accessibilityLiveRegion`).
  - `accessibilityLabel="Fechar"` no botão close (via `Clickable`).
  - Touch target do close: 32×32 hoje na web; em native subimos para **44×44** (alinhado com [TD-016](../TECH_DEBT.md#td-016) WCAG 2.5.5). Ajuste já incluso no código acima.

### Performance

- **Animações com `useNativeDriver: true`** em entrada/saída/spring-back — UI thread, 60fps. Custo equivalente ao Spinner.native (validado em 7.2).
- **Drag em JS thread** (limitação `Animated.event`+ `PanResponder`) — só ativo durante o gesto. Custo aceitável: gesto humano dura <1s e a JS thread está livre nesse momento (sem render disparado).
- **Modal mount/unmount** — RN `Modal` faz mount UIView nativo. Custo perceptível (~30ms cold start no iOS antigo). Mitigação: `Toaster` mantém o `<Portal>` montado enquanto há **qualquer** item; só desmonta quando `items.length === 0`. Se a app dispara muitos toasts em sequência, o Modal não pisca.
- **Bundle size:**
  - Web: 0 KB adicional (não importa native).
  - Native: ~1.5 KB (Toast.native + alteração do Portal).
- **Re-render:** `useSyncExternalStore` já é otimizado — só re-renderiza componentes inscritos. Cada `ToastItemRenderer` é independente; remover um não re-renderiza os outros (key estável).

---

## 7. Plano de execução

Sugerido em **dois PRs** para reduzir blast radius:

### PR 1 — Portal `mode` (sem Toast)

1. Adicionar prop `mode?: 'modal' | 'overlay'` em `Portal` (`portal.tsx` + `portal.native.tsx`).
2. Default `'modal'` — comportamento intacto para Dialog/Drawer/Menu.
3. Atualizar `__tests__/portal.test.tsx` e `portal.native.test.tsx` com 1 caso para `mode="overlay"` (web verifica que default não muda; native verifica `pointerEvents="box-none"` no inner View).
4. `pnpm test` verde.

Riscos do PR 1: praticamente zero. Default preservado, propriedade nova é opt-in.

### PR 2 — Toast.native + interfaces + native.ts

1. Adicionar `@platform shared` em `ToastItem`, `ToastRootProps`, `ToasterProps`.
2. Criar `toast.native.tsx` conforme §3.3.
3. Criar `toast.native.test.tsx` (paridade com web — ver §8 para casos).
4. Adicionar export em `src/native.ts`:
   ```ts
   export { Toast, Toaster } from './components/toast';
   export { useToast } from './components/toast';
   export type {
     ToastTone, ToastPlacement, ToastItem,
     ToastRootProps, ToastTitleProps, ToastDescriptionProps,
     ToastCloseProps, ToasterProps, ToastInput,
   } from './components/toast';
   ```
5. `pnpm test` + `pnpm test:platform-contract --strict`.
6. Atualizar [TD-018](../TECH_DEBT.md#td-018) — sub-onda 7.5 marcada como **Done**. Junto com 7.4 (RFC-0023), TD-018 fecha integralmente.
7. Playground Expo (fase 17): adicionar tela demo com `useToast()` disparando os 5 tons + 6 placements.

### Ordem entre RFC-0023 e este RFC

São **independentes** — Toast.native não depende de ProgressCircle.native e vice-versa. Podem ser implementados em paralelo. A nomeação 7.4/7.5 é cronológica em TD-018, não dependência técnica.

---

## 8. Critérios de aceite

### Portal

- [ ] `Portal` (web + native) aceita `mode?: 'modal' | 'overlay'`, default `'modal'`.
- [ ] `Portal` web é no-op para `mode` (mesmo render que hoje).
- [ ] `Portal` native com `mode="overlay"` aplica `pointerEvents="box-none"` no inner View.
- [ ] `__tests__/portal.test.tsx` e `portal.native.test.tsx` com casos novos.

### Toast.native

- [ ] `toast.native.tsx` criado, segue arquitetura do §3.3.
- [ ] `toast.native.test.tsx` cobre paridade com a suíte web — 9 casos no mínimo:
  1. Renderiza `Toast` standalone com `accessibilityRole="alert"`.
  2. `Toast.Title` renderiza texto.
  3. `Toast.Description` renderiza texto.
  4. `tone="critical"` → `accessibilityLiveRegion="assertive"`.
  5. `tone="success"` → `accessibilityLiveRegion="polite"`.
  6. `Toast.Close` dispara `onClose` ao pressionar.
  7. `useToast().toast()` adiciona item ao store, `Toaster` renderiza.
  8. `duration` finita remove o item após o tempo (jest fake timers).
  9. Pressionar Close remove o item.
- [ ] Smoke test de animação: `Animated.Value` inicial e final batem com `reducedMotion` (mockar `usePrefersReducedMotion`).
- [ ] `AccessibilityInfo.announceForAccessibility` é chamado no mount com título + descrição (mock).
- [ ] `pnpm test:platform-contract --strict` continua verde com Toast como `shared`.
- [ ] `web-only` global cai 1 → 0 (Table fica fora — fora deste RFC).
- [ ] [TD-018](../TECH_DEBT.md#td-018) sub-onda 7.5 marcada **Done**; TD-018 inteira fechada (com RFC-0023 também merge'd).
- [ ] Playground Expo ganha tela `ToastScreen` exercitando os 5 tons e 6 placements.

### Não-regressão

- [ ] Suíte web continua verde (793 → 793, sem novos cases web).
- [ ] Storybook sem regressão visual em `Toast`.
- [ ] Dialog/Drawer/Menu (consumidores do `Portal` em modo default) sem mudança comportamental.

---

## 9. Riscos e mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| `pointerEvents="box-none"` deixa toques passarem **demais** (ex.: clicar no botão close não funciona porque o pai é box-none) | Baixa | Alto | `box-none` repassa toques **apenas em áreas transparentes**; filhos opacos (o card do Toast) ainda capturam. Validar com teste de tap no `<Toast.Close />`. |
| Modal duplo (Dialog aberto + Toast aparece) gera glitch visual no iOS | Média | Médio | Padrão usado por NativeBase/RNUI sem incidente. Validar manualmente no playground Expo. Se ocorrer, fallback é desativar `Toaster` enquanto Dialog está aberto (pode ser tratado em RFC futura, não bloqueia esta). |
| `AccessibilityInfo.announceForAccessibility` não dispara em jest | Alta | Baixo | Mockar `AccessibilityInfo` no `setup.native.ts`; validar via `expect(mock).toHaveBeenCalledWith(...)`. Em runtime real é estável. |
| `PanResponder` interfere com `ScrollView` ancestral (gesto disputado) | Média | Médio | `onMoveShouldSetPanResponder` exige `dx > 8` antes de capturar — gestos verticais (scroll) não disparam. Convenção bem testada (vide `react-native-snap-carousel`, etc.). |
| `Animated.event` com `useNativeDriver: false` no drag pode perder frames em apps pesados | Baixa | Médio | Aceitável para gesto curto. Migrar para Reanimated é trivial se virar problema (escopo futuro). |
| Storybook RNW (`react-native-web`) trata `Modal` diferente — Toast pode quebrar visualmente | Média | Baixo | RNW mapeia `Modal` para um `<div>` overlay full-screen; `pointerEvents="box-none"` é suportado. Validar via `storybook` antes do merge. |

---

## 10. Notas de implementação

### Por que não unificar a animação web com `Animated`

A web hoje usa CSS `@keyframes` injetada via `<style>`. RN não tem keyframes em runtime. Unificar exigiria:

1. Web migrar para `Animated` (que `react-native-web` mapeia para CSS), ou
2. Native migrar para CSS keyframes via RNW polyfill (não funciona em RN cru).

Ambos os caminhos pertencem a um RFC dedicado de motion engine cross-platform, junto com Spinner/Skeleton/ProgressCircle (todos reimplementam o mesmo loop manualmente — sintoma do mesmo problema). RFC-0023 §"Cruzamento" registra essa pendência.

### Alinhamento com RFC-0023

- Ambos consomem `Animated` built-in (sem Reanimated).
- Ambos respeitam `usePrefersReducedMotion()`.
- Ambos preservam interfaces compartilhadas com cast em `.native.tsx` quando necessário.
- Conjuntos disjuntos de risco: ProgressCircle precisa de `react-native-svg` (já paga via Lucide). Toast não precisa de nada além do core RN.

### Por que `Toaster` mantém o Portal montado entre toasts

`<Portal mode="overlay">` envolve um `Modal`. Mount/unmount de Modal RN tem custo (~30ms iOS antigo). Se desmontássemos o Portal a cada `items.length === 0`, e o app disparar 3 toasts em sequência rápida, teríamos 3 Modal mounts.

Hoje a implementação faz o `if (items.length === 0) return null;` — desmonta o Portal completamente. Para o tráfego típico (1–2 toasts esporádicos) isso é fine. Se virar problema em produção, otimização é trocar para um state interno `keepMounted` que mantém o Portal por ~500ms após o último toast sair. **Reservado para refinamento — não bloqueia o RFC.**

### Cruzamento com R6-G

Esta RFC estabelece o precedente arquitetural de Portal não-modal em native. R6-G (overlays Dialog/Drawer/Tooltip/Popover/Menu) usa o mesmo Portal:

- **Dialog / Drawer / Menu**: continuam usando `<Portal>` (default `mode="modal"`) — comportamento bloqueante é desejado.
- **Tooltip / Popover**: passam a usar `<Portal mode="overlay">` para não bloquear toques fora do âncora.

Quando R6-G abrir formalmente, esta RFC já terá pavimentado o caminho. Não é necessário antecipar Tooltip/Popover aqui.

### Cleanup futuro (não-escopo)

- Mover `HTMLAttributes` heritage de `ToastRootProps`/`ToastTitleProps`/etc. para tipos cross-platform — RFC dedicada (mesma janela de Button/Tag).
- Engine unificada de motion (CSS keyframe ↔ Animated) — RFC dedicada cobrindo Spinner/Skeleton/ProgressCircle/Toast simultaneamente.
- `keepMounted` opcional no `Toaster` para reduzir mount churn — refinamento se virar gargalo.
