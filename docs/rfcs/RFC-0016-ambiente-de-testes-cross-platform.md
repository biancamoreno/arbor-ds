# RFC-0016 — Ambiente de testes cross-platform

**Status**: Draft
**Autores**: @bia
**Data**: 2026-04-24
**PR**: (a abrir)

**Origem**: TD-013 · referenciada por TD-004, TD-005, TD-009

---

## Motivação

O Jest do projeto roda exclusivamente contra o entrypoint web (jsdom + alias `react-native` → `react-native-web`). Os 13 arquivos `.native.tsx` hoje no `src/` têm **zero cobertura executável** — são revisados por leitura, não por execução.

### Inventário atual

```
src/ecosystem/primitives/portal/portal.native.tsx
src/ecosystem/primitives/focus-scope/focus-scope.native.tsx
src/ecosystem/primitives/dismissable-layer/dismissable-layer.native.tsx
src/components/nav-bar/core/nav-bar.native.tsx
src/components/tab-bar/core/tab-bar.native.tsx
src/components/core/text/core/text.native.tsx
src/components/core/image/core/image.native.tsx
src/components/core/grid/core/grid.native.tsx
src/components/core/icon/core/icon.native.tsx
src/components/fab/core/fab.native.tsx
src/components/field/core/field.native.tsx
src/components/checkbox/core/checkbox.native.tsx
src/components/switch/core/switch.native.tsx
```

### Por que importa agora

TD-013 é **prerequisito de fechamento** para um cluster de dívidas:

- **TD-009** (Field.native unificado) — sem suite native, não há critério para validar paridade com a versão web.
- **TD-005** (theming hardcoded em `fab.native`) — fix exige asserção de "tokens consumidos", impossível sem render assertable.
- **TD-004** (abstração `Clickable` cross-platform) — refactor de N arquivos `.native.tsx` sem rede de proteção é inviável.
- **R6 native** (Checkbox/Radio/Switch já têm `.native.tsx`; Select virá) — quanto mais entra sem trava, maior a fila de débito.

Cada `.native.tsx` adicionado sem teste **aumenta superfície sem custo aparente**. O sintoma só aparece quando alguém roda em device, fora do CI. Esse é o tipo de drift que vale evitar antes do release público.

### O que o repo já tem (e nunca foi conectado)

1. `jest.config.cjs` já aliasea `react-native` → `react-native-web` via `moduleNameMapper`. Para `.native.tsx` que **não tocam APIs RN-only**, RNW basicamente já cobre — falta só o resolver pegar o sufixo de arquivo.
2. `package.json` já lista como devDependencies: `jest-expo`, `@testing-library/react-native`, `@testing-library/jest-native`, `react-test-renderer`. Alguém tentou setup antes; ficou pelo meio.
3. `jest-expo` traz preset com Metro-like resolver (entende `.native.{ts,tsx,js,jsx}`) e `testEnvironment: 'node'`.

A infra está **80% montada**. A questão é decidir **arquitetura**, não introduzir dependência nova.

---

## Proposta

Adotar **jest-projects (multi-project)** com dois projects independentes:

| Project | Resolver | Test env | Casos cobertos | Naming |
|---|---|---|---|---|
| `web` | atual (RN→RNW alias) | `jsdom` | tudo `*.test.tsx` que **não termina em** `.native.test.tsx` | `*.test.tsx`, `*.spec.tsx` |
| `native` | preset `jest-expo` (entende sufixos `.native.tsx`) | `node` | tudo `*.native.test.tsx` + arquivos `.native.tsx` carregados via resolver | `*.native.test.tsx` |

`pnpm test` continua sendo o comando único e roda os dois projects. CI atual continua funcionando — adiciona uma matriz vazia, populada incrementalmente.

### Princípio arquitetural

> RNW é o **default barato**; jest-expo é o **real para quando importa**.

A escolha do alvo **não é binária por componente** — é por *arquivo de teste*. Componentes triviais (re-render só de estilo) podem viver só do project web via RNW alias; componentes com lógica RN-específica recebem `*.native.test.tsx` no project native.

### Layout de arquivos

```
jest.config.cjs                  # multi-project root (NOVO)
jest.config.web.cjs              # project "web" (config atual movida)
jest.config.native.cjs           # project "native" (jest-expo)
jest.setup.cjs                   # web setup atual (matchMedia mock)
jest.setup.native.cjs            # NOVO: native setup (RN module mocks)
test/
  styleMock.cjs                  # já existe
  native-mocks.cjs               # NOVO: mocks padrão (animação/gestos)
  contracts/                     # NOVO (opcional): factories de cases compartilhados
```

### `jest.config.cjs` (root)

```js
module.exports = {
  projects: [
    '<rootDir>/jest.config.web.cjs',
    '<rootDir>/jest.config.native.cjs',
  ],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/index.ts'],
};
```

### `jest.config.web.cjs`

Idêntico ao atual, com **um ajuste**: `testPathIgnorePatterns: ['\\.native\\.test\\.[tj]sx?$']` para que o web project não tente rodar testes native em jsdom.

```js
module.exports = {
  displayName: 'web',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^react-native-web$': 'react-native-web',
    '\\.(css)$': '<rootDir>/test/styleMock.cjs',
  },
  testMatch: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
  testPathIgnorePatterns: ['\\.native\\.test\\.[tj]sx?$'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.config.jest.cjs' }],
  },
  transformIgnorePatterns: ['/node_modules/(?!react-native-web)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEach: ['<rootDir>/jest.setup.cjs'],
};
```

### `jest.config.native.cjs`

```js
module.exports = {
  displayName: 'native',
  preset: 'jest-expo',
  testMatch: ['**/*.native.test.{ts,tsx}'],
  moduleFileExtensions: ['native.ts', 'native.tsx', 'ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEach: ['<rootDir>/jest.setup.native.cjs'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-expo|react-native|@react-native|expo(nent)?|@expo|react-native-svg|lucide-react-native)/)',
  ],
};
```

### Convenção de naming

- **`*.test.tsx`** — teste web. Roda em jsdom. Pode importar `.native.tsx` indiretamente via RNW alias.
- **`*.native.test.tsx`** — teste native. Roda em jest-expo. Importa o componente sem caminho explícito; o resolver pega `.native.tsx`.
- **Não usar** `*.web.test.tsx` — web é o default; assimetria reflete que web é a plataforma majoritária.

### Critério para escolher onde testar

A documentar em `CONTRIBUTING.md`:

| Característica do componente | Onde testar |
|---|---|
| Re-render só de estilo (`text.native.tsx`, `image.native.tsx`) | Web é suficiente (RNW alias cobre) |
| Lógica RN-específica (gestos, animação nativa, `Pressable`, `accessibilityRole`) | **Obrigatório** `.native.test.tsx` |
| Compound Field-aware com a11y (`field.native.tsx`, `checkbox.native.tsx`, `switch.native.tsx`) | **Obrigatório** ambos — paridade de contrato |
| Hardcoded por divergência arquitetural deliberada (`fab.native.tsx`, hoje) | **Obrigatório** `.native.test.tsx` para travar a divergência até TD-004 |

### Exemplo — `field.native.test.tsx`

```tsx
import { render } from '@testing-library/react-native';
import { Field } from '../field';

describe('Field.native', () => {
  it('conecta Label ao Control via accessibilityLabelledBy', () => {
    const { getByA11yLabel } = render(
      <Field id="name">
        <Field.Label>Nome</Field.Label>
        <Field.Control>
          <TextInput />
        </Field.Control>
      </Field>
    );
    expect(getByA11yLabel('Nome')).toBeTruthy();
  });

  it('omite accessibilityDescribedBy quando Description ausente', () => {
    const { getByA11yLabel } = render(
      <Field id="name">
        <Field.Label>Nome</Field.Label>
        <Field.Control>
          <TextInput />
        </Field.Control>
      </Field>
    );
    expect(getByA11yLabel('Nome').props.accessibilityDescribedBy).toBeUndefined();
  });
});
```

### Estratégia de cases compartilhados (opcional)

Para compounds com contrato paritário (Field, Checkbox, Switch), expor factory de cases comportamentais:

```ts
// test/contracts/field.contract.ts
export function fieldContract({ render }: { render: (ui: ReactElement) => RenderResult }) {
  return {
    rendersLabel: () => { /* assertions agnósticas de plataforma */ },
    propagatesDisabled: () => { /* ... */ },
  };
}
```

Web e native importam a mesma factory, executam em renderers diferentes. **Reduz drift de cobertura** sem forçar uniformidade onde a plataforma diverge legitimamente (eventos, props a11y).

A adoção de contratos é **incremental** — começa por Field e expande conforme aparecer dobra de teste.

---

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **Só RNW (alias atual, expandir resolver)** | Nunca pega `.native.tsx` real; nunca valida `accessibilityRole`/`accessibilityLabelledBy`; nunca expõe gaps de bridge. Vira teatro de cobertura. Falha barulhenta para componentes Field-aware. |
| **Só jest-expo (preset único)** | Força runtime mais lento e mocks mais pesados em compounds que só re-renderizam estilo. Fricção desnecessária para `text.native.tsx`. Quebraria a suite web atual sem ganho proporcional. |
| **Detox/Maestro E2E em device** | Resolve problema diferente (E2E de produto, não unit de componente). Custo de CI proibitivo. Fora de escopo. |
| **Suite duplicada (mesmo arquivo, alvos diferentes)** | Multiplica custo de manutenção sem ganho — duplicação manual sempre drifta. Factory de contracts (proposta) cobre a parte agnóstica sem duplicar arquivos. |
| **Adiar até TD-004 ser resolvido** | Inverte a dependência: TD-004 precisa de TD-013 para ser refatorado com segurança. Esperar é regredir. |

---

## Impactos e trade-offs

- **Breaking change?** Não. Suite web atual continua idêntica; adiciona project paralelo.
- **Impacto em bundle size**: zero (devDeps já instaladas; nada vaza para `dist/`).
- **Impacto em performance de CI**: estimativa **+30–60 s** na primeira rodada (jest-expo resolver). Paralelizável dentro do mesmo job. Aceitável.
- **Impacto em DX**:
  - **Ganho:** refactor seguro de primitives; PR review com trava executável; onboarding cross-platform via testes lê-se como documentação.
  - **Custo:** mocks padronizados de RN modules (`react-native-reanimated`, `react-native-gesture-handler` se entrarem) precisam viver em `test/native-mocks.cjs`. Centralizar desde o início evita cada teste reimplementar.
- **Impacto em acessibilidade**: **destrava** validação real de a11y native. Hoje TD-009 é "comprovado por inspeção" — vira teste após TD-013. `@testing-library/jest-native` matchers (`toHaveAccessibilityValue`, `toBeDisabled`, etc.) ficam disponíveis sem custo adicional.
- **Codemod necessário?** Não.

### Riscos identificados

| Risco | Mitigação |
|---|---|
| `jest-expo` pinned a versão específica do RN (0.84.x atual). Atualizar RN exige sincronizar `jest-expo`. | Documentar em `docs/TESTING.md` o pareamento. Aceitar custo. |
| `transformIgnorePatterns` em `jest-expo` precisa cobrir libs RN-only que entrarem (ex: futuro `react-native-reanimated`). | Lista mantida na própria config; revisão obrigatória ao adicionar dependência native. |
| `react-test-renderer@19.1.1` pinned (peerDep de `@testing-library/react-native`) pode conflitar com major do React no futuro. | Acompanhar release notes de `@testing-library/react-native`; desbloqueio é coordenado. |
| Coverage agregado entre projects pode ficar ruidoso. | `coverage` desativado por default no project native até estabilizar. |

---

## Critérios de aceite

- [ ] `jest.config.cjs` raiz com `projects: [web, native]` mergeado.
- [ ] `jest.config.web.cjs` extraído (config atual movida sem mudança de comportamento).
- [ ] `jest.config.native.cjs` criado com preset `jest-expo`.
- [ ] `jest.setup.native.cjs` criado (vazio com placeholder ou com mocks iniciais).
- [ ] `test/native-mocks.cjs` criado.
- [ ] `pnpm test` executa ambos os projects com saída segregada (`PASS web ...`, `PASS native ...`).
- [ ] Smoke test (`*.native.test.tsx` mínimo) provando que o project native está conectado e executa em CI.
- [ ] CI executa native suite em PRs (sem job adicional — usa o mesmo `pnpm test`).
- [ ] ≥ 1 `.native.test.tsx` por arquivo `.native.tsx` existente (13/13).
- [ ] `field.native.test.tsx` cobre registry de slots, mapping de a11y (`accessibilityLabelledBy`/`accessibilityDescribedBy`), e paridade com web onde aplicável.
- [ ] `CONTRIBUTING.md` documenta convenção de naming + critério "onde testar".
- [ ] `docs/TESTING.md` criado documentando mocks padronizados + comandos.
- [ ] `scripts/check-platform-contract.js` estendido para validar paridade `.native.tsx` ↔ `.native.test.tsx` para componentes da categoria 2/3 da tabela.
- [ ] `docs/TECH_DEBT.md`: TD-013 marcado **Resolved** + desbloqueios anotados em TD-005, TD-009 (TD-004 mantém RFC própria).

---

## Notas de implementação

### Plano de execução em três PRs

PRs independentes — cada um agrega valor sozinho.

#### PR 1 — Infra (zero teste novo, só plumbing)

1. Criar `jest.config.web.cjs` com o conteúdo atual.
2. Criar `jest.config.native.cjs` com preset `jest-expo`.
3. Criar `jest.config.cjs` raiz com `projects: [...]`.
4. Criar `jest.setup.native.cjs` (placeholder).
5. Criar `test/native-mocks.cjs` (placeholder).
6. Adicionar `testPathIgnorePatterns` no project web.
7. Verificar `pnpm test` continua verde (≈540 testes web rodando).
8. **Adicionar 1 smoke test trivial** — `text.native.test.tsx` com 1 case `expect(...).toBeTruthy()` — só para provar que o project native está conectado e o CI executa.

Pode mergear em horas. Destrava qualquer teste native futuro sem replanejar infra.

#### PR 2 — Cobertura mínima (1 teste por `.native.tsx`)

Para cada um dos 13 arquivos, escrever 1 case **comportamental** mínimo. Critério: o teste deve quebrar se alguém remover o componente.

Ordem de prioridade (alto → baixo risco):

1. `field.native.tsx` — 5–10 cases (registry, a11y mapping, slots) → fecha pré-requisito de TD-009.
2. `checkbox.native.tsx`, `switch.native.tsx` — 3–5 cases cada (Field-aware, controlled state).
3. `fab.native.tsx` — 3 cases (variants renderizam, disabled, onPress) → trava divergência até TD-004.
4. `nav-bar.native.tsx`, `tab-bar.native.tsx` — 2–3 cases (slots).
5. Primitives (`text.native.tsx`, `image.native.tsx`, `grid.native.tsx`, `icon.native.tsx`) — 1–2 cases (smoke + prop crítica).
6. Ecosystem primitives (`portal`, `focus-scope`, `dismissable-layer`) — smoke.

#### PR 3 — Governança

1. Atualizar `CONTRIBUTING.md`: tabela "onde testar" + obrigatoriedade de `.native.test.tsx` para componentes da categoria 2/3 da tabela.
2. Criar `docs/TESTING.md` (não existe hoje) com o "como" — comandos, mocks, padrões.
3. Estender `scripts/check-platform-contract.js` para validar paridade `.native.tsx` ↔ `.native.test.tsx`.
4. Atualizar `docs/TECH_DEBT.md` — TD-013 → Resolved + desbloquear TD-005, TD-009.

### Princípios de redação dos testes

- **Comportamentais, não snapshot.** Visual regression em RN é problema de Storybook native (fora do escopo).
- **Asserções por intenção pública**, não por implementação. Ex: `getByA11yLabel('Nome')`, não `getByTestId('field-control-internal')`.
- **Sem mocks de styled-system.** Se o teste falhar porque o styled-system mudou, é exatamente isso que TD-013 quer detectar.
- **Coverage off por padrão** no project native até estabilizar — RN coverage com jest-expo é flaky e gera ruído.

### Evolução futura (fora desta RFC)

- **Mutation testing** (Stryker) em arquivos críticos (`field.native.tsx`) para validar que os testes realmente travam regressões — não só linha coberta.
- **Visual regression cross-platform** via Storybook native + Chromatic ou Loki — outro debate, sem urgência hoje.
- **Detox/Maestro** para E2E em device — sem urgência hoje.

### Dependências entre tarefas

```
PR 1 (infra)
  ├── PR 2 (cobertura mínima) ── desbloqueia TD-005, TD-009
  └── PR 3 (governança) ── pode ir em paralelo a PR 2
```

PR 2 e PR 3 podem ser desenvolvidos em paralelo após PR 1. PR 3 não depende da cobertura de PR 2 — depende só da convenção de naming definida em PR 1.
