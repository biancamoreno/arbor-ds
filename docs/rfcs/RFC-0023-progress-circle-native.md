# RFC-0023 — ProgressCircle.native (paridade visual via `react-native-svg`)

**Status**: Draft
**Autores**: @bia
**Data**: 2026-04-28
**PR**: —

**Origem**: Sub-onda 7.4 da [TD-018](../TECH_DEBT.md#td-018) (feedback indicators web-only). Última sub-onda de R7 junto com 7.5 (Toast.native).

---

## Motivação

`ProgressCircle` hoje é declaradamente cross-platform (sem `@platform` na interface, default = `shared`), mas a implementação real é **web-only de fato**: usa `<svg>`, `<circle>`, `strokeDasharray`/`strokeDashoffset` e `animation: arbor-spin ... infinite` — nenhum desses primitivos existe em React Native cru.

Importar `arbor-ds/native` em um app Expo e renderizar `<ProgressCircle progress={42} />` quebra: `<svg>` não é elemento válido em RN, e o keyframe CSS `arbor-spin` também não existe nesse runtime.

A diretriz cross-platform da memória `feedback_cross_platform_obrigatorio` é explícita: `web-only` é bug. R7 já fechou Spinner/Skeleton/Alert/Badge/ProgressBar nas sub-ondas 7.1–7.3. Faltam 7.4 (este RFC) e 7.5 (Toast).

A trava é arquitetural: arco circular com `strokeLinecap='round'` e progresso arbitrário (0–100) **não tem implementação razoável apenas com `View` + `borderRadius`** em RN. Qualquer caminho que mantenha paridade visual exige primitivos vetoriais — ou seja, `react-native-svg`.

## Proposta

**Caminho (a) reformulado:** implementar `progress-circle.native.tsx` consumindo `react-native-svg`, e formalizar essa biblioteca como `peerDependency` do arbor-ds.

Fato decisivo, validado em `package.json` + `node_modules/lucide-react-native/package.json`:

> `react-native-svg` **já é dependência obrigatória** de qualquer consumidor RN do arbor-ds, porque `lucide-react-native` (hard-dep do projeto, usada em `Icon.native`) o exige como `peerDependency`.

Isto é, o "custo de adicionar `react-native-svg`" é **zero** — já está instalado em todo app RN que consome o DS. O que o RFC formaliza é o que já é verdade na prática, e arruma a localização da dependência em `package.json` (hoje declarada em `dependencies`, o lugar errado).

### Estrutura proposta

```
src/components/progress-circle/
  core/
    progress-circle.tsx              # web (já existe — preservado)
    progress-circle.native.tsx       # NOVO — Svg/Circle + Animated.loop
    progress-circle.test.tsx         # web (já existe)
    progress-circle.native.test.tsx  # NOVO — paridade de testes
    progress-circle.stories.tsx
  interfaces/
    ProgressCircleProps.ts           # alterado: extends ViewProps comum, sem SVGAttributes
  index.ts
```

Re-export já está coberto por `src/native.ts` via Jest project-resolver.

### API

`ProgressCircleProps` precisa **deixar de estender `SVGAttributes<SVGSVGElement>`**, que é DOM-only e vaza tipo no consumo native:

```ts
// interfaces/ProgressCircleProps.ts
import type { CSSProperties, ReactNode } from 'react';

/** @platform shared */
export interface ProgressCircleProps {
  /** Valor de 0 a 100 (ignorado quando indeterminate=true). */
  progress: number;
  /** Quando true, exibe animação de progresso indeterminado. */
  indeterminate?: boolean;
  /** Diâmetro em px (web) / unidades RN (native). Default: 48. */
  size?: number;
  /** Espessura do traço. Default: 4. */
  strokeWidth?: number;
  /** Tom semântico do trace ativo. Default: `brand`. */
  tone?: 'brand' | 'success' | 'warning' | 'critical';
  /** Texto descritivo para leitor de tela. */
  label?: string;
  /** Escape hatch — só é forwardado em web. No-op em native. */
  style?: CSSProperties;
  /** Conteúdo central opcional (futuro: label numérico). Hoje não-renderizado. */
  children?: ReactNode;
  /** Test id (forwardado para `<svg>` web ou `<View>` raiz native). */
  testID?: string;
}
```

Mudança para o consumidor: remoção de `extends SVGAttributes<...>` é **breaking** apenas para quem tipar a prop spread (`...props as SVGAttributes`). Inspeção do repositório: nenhum consumidor faz isso. Para os autores, esta sweep alinha com [RFC-0021](RFC-0021-button-native.md) (decisão de evitar interfaces DOM-acopladas) — exceto que aqui estamos saindo da herança DOM, não mantendo. A sweep é trivial e não há `extends` análogo em outros componentes feedback.

### Implementação native

```tsx
// progress-circle.native.tsx
import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { usePrefersReducedMotion } from '../../../foundations/motion';
import type { ProgressCircleProps } from '../interfaces';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function ProgressCircle({
  progress,
  indeterminate = false,
  size = 48,
  strokeWidth = 4,
  tone = 'brand',
  label,
  testID,
}: ProgressCircleProps) {
  const theme = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const clamped = Math.min(100, Math.max(0, progress));

  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = indeterminate
    ? circumference * 0.75
    : circumference * (1 - clamped / 100);

  const fillColor = {
    brand: theme.colors.brand.base,
    success: theme.colors.feedback.success.base,
    warning: theme.colors.feedback.warning.base,
    critical: theme.colors.feedback.critical.base,
  }[tone];

  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!indeterminate || reducedMotion) return;
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [indeterminate, reducedMotion, rotation]);

  const transform = indeterminate
    ? [{
        rotate: rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      }]
    : [{ rotate: '-90deg' }];

  return (
    <Animated.View
      style={{ width: size, height: size, transform }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={
        indeterminate
          ? undefined
          : { min: 0, max: 100, now: clamped }
      }
      accessibilityState={{ busy: indeterminate || undefined }}
      testID={testID}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme.colors.background.subtle}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={offset}
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
}

ProgressCircle.displayName = 'ProgressCircle';
```

Notas técnicas:

- A animação indeterminada gira o **container** (`Animated.View`), não o `strokeDashoffset` — isso permite `useNativeDriver: true` (transform é suportado no native driver; props de `Svg` não são). Resultado é visualmente idêntico ao web (`transform: rotate(...)`), com 60fps na UI thread.
- O caso determinístico mantém `rotate: -90deg` estático, igual ao web (alinha o início do arco no topo).
- `usePrefersReducedMotion()` já existe (fase 13). Quando ativo: arco indeterminado fica parado em `offset=circumference*0.75` (mostra 25% preenchido) — sinal estático suficiente para sinalizar trabalho em andamento sem motion.

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **(b) `View` + `borderRadius` + máscaras** | Não há solução de uma camada. Implementações reais usam **dois semicírculos rotacionados** + lógica condicional para 0–50% / 50–100%, sem `strokeLinecap='round'` correto, sem espessura uniforme em todos ângulos, e exigem hack de overflow para indeterminado. Custo de implementação **maior** que o caminho SVG, com fidelidade visivelmente inferior. Zero benefício de bundle (RN consumidor já tem `react-native-svg`). |
| **(c) Deprecar em RN, recomendar `ProgressBar`** | Quebra a promessa de paridade do DS. `ProgressCircle` tem casos de uso distintos (botões com loader determinístico, métricas circulares em dashboards, contadores de tempo). Substituir por `ProgressBar` é regressão de produto. Além disso, a única razão técnica para deprecar seria custo de dependência — que **já está paga** via Lucide. |
| **(a-bis) `react-native-svg` como `optionalDependencies` + fallback runtime** | Branching `try/catch require()` em código de produção é frágil, polui bundle web (que não precisa do polyfill) e gera confusão sobre quando o componente "funciona". O RN consumidor sempre terá o módulo, então o fallback é dead code. |
| **`expo-linear-gradient` + conic gradient simulado** | `LinearGradient` não produz conic gradients. Conic gradient real exige `react-native-svg` ou `Skia`. Volta ao caminho (a). |
| **`@shopify/react-native-skia`** | Excelente fidelidade, mas peer dep nova, ~1MB nativa, sem ROI fora deste único componente. Reservar para uso futuro de animações complexas (out of scope). |

## Impactos e trade-offs

- **Breaking change?** Sim, **mínimo**:
  - `ProgressCircleProps` deixa de estender `SVGAttributes<SVGSVGElement>`. Consumidores que faziam spread de props DOM-only (`onMouseEnter`, atributos `data-*` direto, etc.) precisam mover esses atributos para um wrapper. **Sweep no repo confirma zero usos hoje.**
- **Bundle size**:
  - Web: **0 KB** (build não importa o native).
  - Native: **0 KB adicional** — `react-native-svg` já vem via Lucide. O componente em si pesa ~600 B.
- **Performance**:
  - Animação indeterminada usa `useNativeDriver: true` (UI thread). Custo equivalente ao Spinner.native (validado em 7.2).
  - Determinístico não anima — apenas re-renderiza com `strokeDashoffset` novo. Idêntico ao web.
- **DX**:
  - API pública intacta para 100% dos consumidores reais.
  - Exemplo no Storybook (via RNW) continua funcionando — `react-native-web` mapeia `<Svg>`/`<Circle>` para `<svg>`/`<circle>`.
  - Playground Expo passa a ter ProgressCircle real, fechando a paridade visual da fase 17.
- **Acessibilidade**:
  - Web: já correto (`role="progressbar"` + `aria-valuenow/min/max` + `aria-busy`).
  - Native: equivalente via `accessibilityRole="progressbar"` + `accessibilityValue` + `accessibilityState.busy`. iOS/Android leem corretamente.
  - `usePrefersReducedMotion()` respeitado nas duas plataformas.
- **`package.json` cleanup**:
  - Mover `react-native-svg` de `dependencies` → `peerDependencies` (semver `>=13`).
  - Adicionar `peerDependenciesMeta.react-native-svg.optional = false`.
  - `lucide-react-native` segue em `dependencies` (é nosso, não do consumidor) — ele já requer svg como peer, então o consumidor instala uma única vez.

## Critérios de aceite

- [ ] `progress-circle.native.tsx` criado com a implementação acima.
- [ ] `progress-circle.native.test.tsx` criado com paridade do `progress-circle.test.tsx`: render default, `progress` clamping, `indeterminate`, mapping de `tone` (4 cases), `label` em `accessibilityLabel`, `accessibilityValue` correto, `accessibilityState.busy` em indeterminate, `testID` forwardado, `usePrefersReducedMotion` para a animação.
- [ ] `ProgressCircleProps` reescrita sem `extends SVGAttributes`. Tag `@platform shared` explícita.
- [ ] `ProgressCircle.tsx` (web) ajustado se necessário para acomodar nova interface (provavelmente apenas remover spread `...props` ou filtrar).
- [ ] `package.json`: `react-native-svg` movido de `dependencies` → `peerDependencies` (`>=13`); `peerDependenciesMeta` registra que é não-opcional.
- [ ] `pnpm test` verde nas duas suites (web + native).
- [ ] `pnpm test:platform-contract` continua sem warnings — `ProgressCircle` agora é genuinamente shared.
- [ ] [TD-018](../TECH_DEBT.md#td-018) sub-onda 7.4 marcada como **Done**.
- [ ] Storybook do `ProgressCircle` continua renderizando sem regressão (verificar via `pnpm storybook`).
- [ ] Playground Expo (fase 17) ganha tela de demonstração com determinístico + indeterminado nos 4 tons.

## Notas de implementação

### Por que `react-native-svg` em `peerDependencies` e não `dependencies`

Hoje está em `dependencies`, o que é incorreto: força o gerenciador de pacotes a instalar **a versão exata do arbor-ds**, podendo divergir da versão que o consumidor já tem (via Lucide direto, ou outras libs). Isso causa duplicação no bundle native, e em alguns gerenciadores (Yarn PnP, RN com autolinking estrito) **quebra o build**.

Como `peer`, o consumidor é dono da versão única, e nós declaramos a faixa compatível. A migração é segura: nenhum consumidor instalado hoje fica sem o módulo, porque Lucide já o exige.

### Ordem de execução sugerida

1. PR 1 — interface + sweep (sem breaking visível): reescreve `ProgressCircleProps`, ajusta `progress-circle.tsx` web, mantém testes web verdes. **Não toca em native ainda.**
2. PR 2 — implementação native + testes + ajuste `package.json`: cria `.native.tsx`, `.native.test.tsx`, move dep para peer.
3. PR 3 — playground Expo: tela de demo, fechando o ciclo de validação.

Dois PRs separados (interface vs. implementação) porque o passo 1 tem risco zero e libera revisão paralela. Pode-se fundir em um se a janela for curta.

### Riscos e mitigações

- **`react-native-svg` major bump no consumidor** — versão 13–15 testadas; lock-in via `peer >=13` deixa margem. Se o consumidor estiver em v12, recebe warning de install (não erro). Documentar no CONTRIBUTING / README de adoção.
- **Web continua usando `<svg>` direto** — quando R8+ migrar para tokens de animação universal, `progress-circle.tsx` web pode passar a consumir `react-native-svg` via `react-native-web` para unificar a fonte. Fora do escopo deste RFC.
- **Indeterminado em modo reduced motion** — escolha de "arco parado em 75%" é convenção (mesmo padrão do MUI/Radix). Alternativa: pulsar opacidade 1↔0.6 com `Animated.loop` curto. Reservado para refinamento se feedback de usuário exigir.

### Cruzamento com outras dívidas

- Fecha [TD-018](../TECH_DEBT.md#td-018) sub-onda 7.4. Junto com 7.5 (Toast.native), encerra TD-018.
- Não desbloqueia [TD-017](../TECH_DEBT.md#td-017) diretamente (`web-only` restante é apenas Table → RFC-0022).
- Pode informar futura RFC-0024+ sobre estratégia de motion compartilhado (Animated/CSS keyframes), já que ProgressCircle é o segundo componente após Spinner que reimplementa o mesmo loop manualmente.
