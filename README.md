# arbor-ds

Arbor é um design system raiz, modular e sem dependência de libs de UI prontas. Ele fornece os mecanismos fundamentais de tokens, tema e renderização tipada para criar interfaces altamente personalizáveis por produto.

## Arquitetura

### Foundations

Base semântica do design system.

- `tokens`: tokens primitivos e semânticos (cores, spacing, tipografia, z-index, etc.).
- `theme`: composição de tema (`baseTheme` + tokens), `themeLight` e `createTheme` para overrides.
- `types`: `ArborTheme` consolida a tipagem esperada pelos componentes e pelo provider.

### Ecosystem

Camada de infraestrutura e utilitários.

- `styled-system`: motor interno de estilo que mapeia props tipadas e pseudo-props para CSS.
- `core`: `ArborTransform` e `createStyledComponent` fazem a ponte entre props e renderização.
- `provider`: `ArborProvider` aplica o tema via contexto próprio.
- `utils`: utilitários e pequenos componentes (ex.: iteradores de texto, tap state).

### Components

Catálogo de UI baseado no `ArborTransform`.

- `core`: blocos essenciais (Box, Flex, Grid, Text, Image, Spacer, etc.).
- `button`: componente de botão com interfaces próprias.

### Patterns e Templates

Composições de nível mais alto para acelerar telas e fluxos (ex.: header, form-field, login-screen).

## Como usar o pacote publicado

### Instalação

```
pnpm add arbor-ds
```

> O Arbor depende apenas de `react` e `react-dom`. Garanta versões compatíveis no seu projeto.

### Configuração do provider e tema

Crie um tema derivado do `themeLight` e aplique com o `ArborProvider`:

```tsx
import { ArborProvider } from 'arbor-ds/ecosystem';
import { createTheme, themeLight } from 'arbor-ds/foundations';

const theme = createTheme(themeLight, {
  colors: {
    brand: {
      500: '#2F6FED',
    },
  },
});

export function App() {
  return (
    <ArborProvider theme={theme}>
      {/* sua aplicação */}
    </ArborProvider>
  );
}
```

### Usando componentes

```tsx
import { Box, Text, Button } from 'arbor-ds/components';

export function Hero() {
  return (
    <Box padding="24px" backgroundColor="neutral.100">
      <Text as="h1" variant="title1">Olá, Arbor</Text>
      <Button size="md" variant="primary">Começar</Button>
    </Box>
  );
}
```

### Criando componentes próprios

Quando precisar de um componente customizado, use `ArborTransform` para manter tipagem e props de estilo:

```tsx
import { ArborTransform } from 'arbor-ds/ecosystem';

export function Badge(props: { label: string }) {
  return (
    <ArborTransform as="span" padding="4px 8px" borderRadius="8px">
      {props.label}
    </ArborTransform>
  );
}
```

## API principal (exports)

- `arbor-ds/foundations`: tokens, tema (`themeLight`, `createTheme`, `ArborTheme`).
- `arbor-ds/ecosystem`: provider, motor de estilo e utilitários (`ArborProvider`, `ArborTransform`).
- `arbor-ds/components`: componentes core e `Button`.
