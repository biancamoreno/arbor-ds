# Testes — Arbor DS

> Como testar componentes do design system em web e React Native, e como o ambiente de testes é configurado.

A suite Jest roda **dois projects independentes** (RFC-0016, 2026-04-25):

| Project | Resolver | Test env | Casos cobertos | Naming |
|---|---|---|---|---|
| `web` | atual (alias `react-native` → `react-native-web`) | `jsdom` | tudo `*.test.tsx` que **não termina em** `.native.test.tsx` | `*.test.tsx`, `*.spec.tsx` |
| `native` | preset `jest-expo` (entende sufixos `.native.tsx`) | `node` (RN env do preset) | `*.native.test.tsx` + arquivos `.native.tsx` carregados via resolver | `*.native.test.tsx` |

O comando `pnpm test` executa os dois projects e mantém a saída segregada (`PASS web ...` / `PASS native ...`).

---

## Comandos

```bash
pnpm test                              # web + native
pnpm test -- --selectProjects web      # só web
pnpm test -- --selectProjects native   # só native
pnpm test -- field.native              # filtra por padrão de arquivo
pnpm test -- --watch                   # modo watch
pnpm test:platform-contract            # valida .native.tsx ↔ .native.test.tsx
```

---

## Estrutura de arquivos

```
jest.config.cjs                  # multi-project root
jest.config.web.cjs              # project "web"
jest.config.native.cjs           # project "native" (preset jest-expo)
jest.setup.cjs                   # setup web (matchMedia mock)
jest.setup.native.cjs            # setup native (workaround winter + native-mocks)
test/
  styleMock.cjs                  # mock de imports CSS na web
  native-mocks.cjs               # mocks RN-only compartilhados no project native
```

---

## Convenção de naming

- `*.test.tsx` — teste **web**. Roda em jsdom. Pode importar `.native.tsx` indiretamente via RNW alias.
- `*.native.test.tsx` — teste **native**. Roda em jest-expo. Importa o componente sem caminho explícito; o resolver pega `.native.tsx`.

Não usar `*.web.test.tsx` — web é o default; a assimetria reflete que web é a plataforma majoritária.

---

## Onde testar

| Característica do componente | Onde testar |
|---|---|
| Re-render só de estilo (delega 100% a `ArborTransform`) | Web é suficiente; native opcional |
| Lógica RN-específica (gestos, animação, `Pressable`, `accessibilityRole`/`State`) | **Obrigatório** `.native.test.tsx` |
| Compound Field-aware com a11y (`Field`, `Checkbox`, `Switch`, `RadioCard`, `Select`) | **Obrigatório** ambos — paridade de contrato |
| Divergência arquitetural deliberada (ex.: `fab.native.tsx` hoje) | **Obrigatório** `.native.test.tsx` para travar a divergência até a unificação |

`scripts/check-platform-contract.js` falha CI se um `.native.tsx` existir sem `.native.test.tsx` irmão.

---

## Princípios de redação

- **Comportamentais, não snapshot.** Visual regression em RN é problema de Storybook native, fora do escopo do unit.
- **Asserções por intenção pública.** `getByLabelText('Nome')`, `getByRole('checkbox')`, `node.props.accessibilityState.disabled` — nunca por id interno gerado.
- **Sem mocks do styled-system.** Se o teste falhar porque o styled-system mudou, é exatamente o sinal que a suite native quer dar.
- **Coverage off-by-default no project native** até estabilizar — jest-expo coverage é flaky e gera ruído.

### Padrão de wrapper

Componentes que dependem de tema (qualquer um que renderize `ArborTransform`, `Box`, `Flex`, `Text`) precisam de `<ArborProvider>`:

```tsx
import { render, screen } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

render(<MyComponent />, { wrapper: Wrapper });
```

Primitives da camada `ecosystem/primitives/*` que renderizam só `View`/`Modal` direto não exigem o provider.

### Queries comuns (RNTL)

| Intenção | Query |
|---|---|
| Texto visível | `screen.getByText('Inbox')` |
| Componente com role explícito | `screen.getByRole('checkbox')` |
| Wrapper com `accessibilityLabel` | `screen.getByLabelText('notifications')` |
| Múltiplos matches por label (ex.: SVG do Lucide) | `screen.getAllByLabelText('add')[0]` |
| Acesso a um componente RN específico | `screen.UNSAFE_getByType(RNSwitch)` (último recurso) |
| Disparo de evento | `fireEvent.press(node)`, `fireEvent(node, 'valueChange', true)` |

---

## Mocks padronizados

Quando entra uma dependência RN-only (`react-native-reanimated`, `react-native-gesture-handler`, etc.), centralize o `jest.mock(...)` em [`test/native-mocks.cjs`](../test/native-mocks.cjs) e mantenha `transformIgnorePatterns` em `jest.config.native.cjs` alinhado.

Não duplicar mocks por arquivo — facilita o drift e sobrecarrega cada teste.

---

## Workaround conhecido — pre-resolução de globals da Expo

`jest.setup.native.cjs` força a resolução dos lazy globals da Expo (`__ExpoImportMetaRegistry`, `TextDecoder`, `URL`, `URLSearchParams`, `structuredClone`, etc.) **durante o setup-after-env**.

### Por que existe

`jest-expo` registra getters lazy em `globalThis` via `expo/src/winter`. Sob pnpm, qualquer acesso a esses getters **após o teste** (em teardown, GC ou cleanup interno do RNTL) dispara `require()` em um módulo que `jest-runtime` rejeita com `ReferenceError: You are trying to import a file outside of the scope of the test code` — porque `Runtime.isInsideTestCode === false` na fase de teardown.

Resolver os getters em `setupFilesAfterEnv` (quando `isInsideTestCode === undefined`, **antes** dos testes) substitui cada getter por valor estático. Acessos posteriores em teardown viram leitura de propriedade simples e não chamam `require`.

### Quando revisitar

- Atualização de `jest-expo` ou `expo`: confirmar que a lista de globals em `jest.setup.native.cjs` continua cobrindo o que o preset registra (procure `install('...')` em `expo/src/winter/runtime.native.ts`).
- Migração para `node-linker=hoisted` ou `shamefully-hoist=true` no `.npmrc`: o problema some, e o workaround pode ser removido.

---

## Estratégia de cases compartilhados (futuro)

Para compounds com contrato paritário (Field, Checkbox, Switch), o plano é expor factory de cases comportamentais em `test/contracts/`:

```ts
// test/contracts/field.contract.ts
export function fieldContract({ render }: { render: (ui: ReactElement) => RenderResult }) {
  return {
    rendersLabel: () => { /* assertions agnósticas de plataforma */ },
    propagatesDisabled: () => { /* ... */ },
  };
}
```

Web e native importam a mesma factory e executam em renderers diferentes. Reduz drift de cobertura sem forçar uniformidade onde a plataforma diverge legitimamente (eventos, props a11y).

A adoção é incremental — começa quando aparecer dobra de teste real entre web e native.

---

## Referências

- RFC-0016 — Ambiente de testes cross-platform
- TD-013 — Resolved (2026-04-25); ver [`docs/TECH_DEBT.md`](TECH_DEBT.md)
- TD-009 — Field.native em divergência (parity gaps documentados em `field.native.test.tsx` via `describe.skip`)
