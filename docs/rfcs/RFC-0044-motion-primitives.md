# RFC-0044 — Motion Primitives: `<Animate>` + presets

**Status:** Draft
**Autora:** Bia (com co-autoria de design system architect)
**Data:** 2026-05-15
**Bloqueia:** Migração coletiva de animação em Tabs / Accordion / Toast / Carousel / Modal / Drawer / Tooltip / Skeleton / Spinner
**Depende de:** RFC-0040 PR2 (component tokens emitidos via CSS vars), `transition()`/`useTransition()` (já existem), `usePrefersReducedMotion` (web + native, já existem)
**Insere em sequência:** Pode rodar paralelo aos PCV restantes; ideal entregar antes da v1.0 para evitar churn em consumidores

---

## 1. Diagnóstico

### 1.1. Sintoma

Cada componente do Arbor-DS implementa motion direto via `transition()` + inline `style.transition` (web) ou `Animated.timing` (native). O resultado:

- **Web**: 40+ ocorrências de `transition: ...` inline ou em recipes, cada uma decidindo `props`/`duration`/`easing` separado.
- **Native**: 12+ ocorrências de `Animated.timing` com `duration`/`easing` hardcoded (mesmo após PCV-28 ter centralizado o `STANDARD_EASING` em Tabs).
- **Reduced-motion**: cada componente trata sozinho — Spinner, Skeleton, Tabs, Carousel, Toast, ProgressCircle. Padrão repetido mas não centralizado.
- **Presets de personalidade** (`motion: 'minimal' | 'normal' | 'expressive'`): hoje só afetam `motion.duration.*` e `motion.easing.*` em tokens, mas componentes que querem "fade in" vs "scale in" não têm vocabulário compartilhado — cada um implementa do zero.

### 1.2. Por que importa agora

- **Direcional "sutil/sóbrio"** (gravado na skill) precisa de uma forma de aplicar default em escala — sem um componente helper, cada PCV repete a régua manualmente.
- **Multi-produto via tema**: produto que ative `presets.motion: 'expressive'` espera que TODAS as animações do DS ganhem mais expressão. Hoje só duração/easing mudam — o vocabulário de "fade" vs "slide" vs "scale" não escala via tema.
- **Pré-v1**: introduzir um primitive depois do v1 é breaking para quem consome motion por API alternativa. Janela de calibração aberta.
- **DX**: consumidor que monta empty state ou onboarding ilustrativo deveria poder usar `<Animate preset="fade-in">` sem aprender `Animated.timing` ou string CSS — o DS provê o motor.

### 1.3. Risco se não fizer

- 36 PCVs continuam com motion ad-hoc; calibração de "sutil/sóbrio" fica dependente de revisão por componente.
- Quando o produto B (violet) pedir motion `expressive`, a propagação fica parcial — só duração muda; presets de animação ficam congelados.
- Cada `*.native.tsx` reimplementa o mesmo padrão `Animated.parallel + usePrefersReducedMotion + setValue em test mode`.

---

## 2. Direção recomendada

**Componente declarativo `<Animate>` + hook `useAnimatePreset`**, alimentados por tokens themables `motion.presets.*` e parametrizados por `preset`/`trigger`/`duration`/`easing`/`delay`. Web usa CSS transitions/keyframes; native usa `Animated.timing` + interpolations. Paridade de API; degradação automática sob `prefers-reduced-motion`.

### 2.1. Princípios

1. **Mesmo vocabulário web e native** — `<Animate preset="fade-in">` produz o mesmo efeito visual em ambas plataformas; consumidor não precisa saber qual está renderizando.
2. **Themable em camadas** — `motion.presets.*` é primitiva nova; recipes referenciam por string; produto override via `createTheme()`.
3. **Reduced-motion centralizado** — `<Animate>` consulta `usePrefersReducedMotion` internamente. Componentes consumidores não tocam.
4. **API mínima** — `preset`, `trigger`, `duration`, `easing`, `delay`. Sem `from`/`to` cru (escape hatch via `useAnimatePreset` hook).
5. **Composição limpa** — `<Animate>` envolve qualquer children, sem requerer ref. Para casos avançados (Animated.Value compartilhado entre componentes), `useAnimatePreset` retorna props.
6. **Default "sutil/sóbrio"** — presets canônicos usam motion tokens `normal` (160ms) + `standard` easing. Produtos override via `presets.motion`.

### 2.2. O que NÃO está no escopo

- Substituir Reanimated/Lottie — `<Animate>` é o jeito do DS, não engine de animação geral.
- Animações gesturais (drag, swipe) — fora de escopo; consumidor traz Reanimated se precisar.
- Springs com overshoot grande — direcional sóbrio veta no default. Preset opcional `bouncy` pode entrar mas fora do padrão.

---

## 3. API proposta

### 3.1. Componente `<Animate>`

```tsx
<Animate preset="fade-in" duration="normal">
  <Card>...</Card>
</Animate>

<Animate preset="slide-in-bottom" trigger="enter" delay="fast">
  <Toast>...</Toast>
</Animate>

<Animate preset="scale-in" trigger="open" when={open}>
  <Popover>...</Popover>
</Animate>
```

**Props:**

```ts
export interface AnimateProps {
  /**
   * Preset canônico. Define o que anima (transform/opacity/etc.) e a curva.
   * Themable via `motion.presets.{preset}`.
   */
  preset: MotionPreset;

  /**
   * Quando disparar. Default: `'enter'` (na montagem).
   * - `'enter'`: dispara uma vez quando o componente monta.
   * - `'open'`: dispara quando `when={true}`, reverte quando `when={false}`.
   * - `'always'`: sempre aplica o estado final (sem trigger explícito).
   */
  trigger?: 'enter' | 'open' | 'always';

  /** Controla `trigger='open'`. Ignorado em outros triggers. */
  when?: boolean;

  /** Override de duração (alias do motion token). Default: preset. */
  duration?: MotionDuration;

  /** Override de easing. Default: preset. */
  easing?: MotionEasing;

  /** Atraso antes do trigger (alias do motion token). Default: 0. */
  delay?: MotionDuration;

  /** Conteúdo a animar. */
  children: ReactNode;

  /** Callback ao terminar a animação. */
  onComplete?: () => void;
}

export type MotionPreset =
  | 'fade-in' | 'fade-out'
  | 'slide-in-top' | 'slide-in-bottom' | 'slide-in-left' | 'slide-in-right'
  | 'slide-out-top' | 'slide-out-bottom' | 'slide-out-left' | 'slide-out-right'
  | 'scale-in' | 'scale-out'
  | 'collapse-in' | 'collapse-out';
```

### 3.2. Hook `useAnimatePreset`

Para casos onde `<Animate>` wrapper não cabe (animação que coordena multiple elements, valores compartilhados, ou refs específicas):

```tsx
const { style, isReady } = useAnimatePreset('fade-in', {
  trigger: 'enter',
  duration: 'normal',
  delay: 'fast',
});

return <div style={style}>...</div>;
// ou em native:
return <Animated.View style={style}>...</Animated.View>;
```

### 3.3. Tokens themables: `motion.presets.*`

```ts
motion: {
  duration: { instant, fast, normal, slow, slower },     // existente
  easing: { standard, decelerate, accelerate, sharp },    // existente
  presets: {                                              // NOVO
    'fade-in':       { properties: ['opacity'],                          duration: 'normal', easing: 'standard', from: { opacity: 0 } },
    'fade-out':      { properties: ['opacity'],                          duration: 'normal', easing: 'standard', to:   { opacity: 0 } },
    'slide-in-bottom': { properties: ['transform','opacity'],            duration: 'normal', easing: 'decelerate', from: { transform: 'translateY(8px)', opacity: 0 } },
    'scale-in':      { properties: ['transform','opacity'],              duration: 'normal', easing: 'standard',  from: { transform: 'scale(0.95)',    opacity: 0 } },
    'collapse-in':   { properties: ['height','opacity'],                 duration: 'normal', easing: 'standard',  from: { height: 0, opacity: 0 } },
    // ...
  },
}
```

Override via `createTheme()`:

```ts
createTheme(themeLight, {
  motion: {
    presets: {
      'fade-in': { duration: 'fast' },                    // override só uma key
      'slide-in-bottom': { from: { transform: 'translateY(16px)' } }, // mais expressivo
    },
  },
});
```

Combinado com `presets.motion: 'expressive'`, o consumidor ganha *amplificação coordenada* sem editar componentes.

---

## 4. Implementação

### 4.1. Web

CSS transitions + keyframes. `<Animate>` aplica:

- `trigger='enter'`: monta no estado `from`, faz `requestAnimationFrame` para forçar layout, transiciona para o estado final.
- `trigger='open'` quando `when` muda: alterna entre estados.
- `prefers-reduced-motion`: degrada para `opacity 0→1` (preset universal) — nunca anima transform/height.

### 4.2. Native

`Animated.Value`. `<Animate>` aplica:

- `trigger='enter'`: `Animated.timing` da `from` config até final no mount.
- `trigger='open'`: `Animated.timing` em ambas direções.
- `prefers-reduced-motion`: `setValue` direto (sem timing).

### 4.3. Resolução do preset

```ts
function resolvePreset(theme: ArborTheme, preset: MotionPreset, overrides: AnimateProps) {
  const base = theme.motion.presets[preset];
  return {
    properties: base.properties,
    duration: theme.motion.duration[overrides.duration ?? base.duration],
    easing: theme.motion.easing[overrides.easing ?? base.easing],
    from: base.from,
    to: base.to,
  };
}
```

---

## 5. Plano de migração

### 5.1. PR-1: foundations + helpers

- Tokens `motion.presets.*` no atlas.
- Hook `useAnimatePreset` (web + native).
- Componente `<Animate>` (web + native).
- Testes unitários.
- Documentação (Storybook).

### 5.2. PR-2: migração oportuna nos PCVs em andamento

Tabs já entregou indicator deslizante manual. PCV-29 Tooltip e seguintes podem nascer usando `<Animate>`.

### 5.3. PR-3 (opt-in, pós-v1): refactor coletivo

Modal/Drawer/Toast/Accordion/Carousel/Skeleton/Spinner/Tabs migram para `<Animate>`. Cada um é PCV independente — bypass se motion já estiver calibrado.

---

## 6. Critérios de qualidade

- [ ] Web + native paridade visual em todos os presets canônicos
- [ ] `prefers-reduced-motion` degrada automaticamente (sem cada consumidor tratar)
- [ ] `createTheme({ motion: { presets: {...} } })` propaga para web E native
- [ ] Bundle delta < 2KB gzip
- [ ] 90% de cobertura nos presets canônicos
- [ ] CHANGELOG documenta presets e override por tema
- [ ] Skill recebe seção "Motion primitives — quando usar `<Animate>` vs `transition()` vs `Animated.timing` direto"

---

## 7. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| **API muito ampla vira footgun** | Lista canônica curta (10-12 presets). Custom motion exige RFC-extending. |
| **Performance: re-render por trigger** | `useMemo` no resolve do preset; `useNativeDriver: true` quando possível (opacity/transform). |
| **CSS keyframes não permitem theme overrides em runtime** | Solução: usar CSS transitions de `from → to` via state change (mount com `from`, raf, troca pra final). Sem `@keyframes`. |
| **Native sem CSS transitions** | `Animated.timing` + `interpolate` — equivalente conceitual; código separado mas API pública igual. |
| **Migração de componentes existentes é churn** | Opt-in, PR-3 fica como TD pós-v1. Componentes individualmente mantêm transition direto até serem revisitados. |

---

## 8. Não-objetivos

- Não substitui Reanimated, Lottie, Framer Motion.
- Não é motor de gesture (drag, swipe).
- Não cobre choreografia complexa (timeline com keyframes multi-step).
- Não acopla a `react-spring` ou similar — implementação interna mínima.

---

## 9. Decisão pendente

Antes de PR-1:
- [ ] Confirmar lista canônica de presets (10-12) com a usuária.
- [ ] Definir se `slide-in-{dir}` aceita parâmetro de distância via tema (vs hardcoded `8px`).
- [ ] Definir se `<Animate>` aceita `className`/`style` pass-through ou exige wrapper isolado.

RFC-0044 fica em Draft até a usuária aprovar para PR-1.
