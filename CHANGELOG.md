# arbor-ds

## Unreleased

### Added

- **RFC-0034 PR2.C — `Carousel` `orientation: 'vertical'`:** novo prop `orientation?: 'horizontal' | 'vertical'` (default `'horizontal'`) em `<Carousel>`. Web troca `scroll-snap-type` para o eixo Y, calcula altura do slide em vez de largura, e mapeia `ArrowUp`/`ArrowDown` no Tabs pattern; `tablist` ganha `aria-orientation="vertical"`. Native passa `horizontal={false}` à `FlatList` interna e dimensiona o slide via `height` + `marginBottom`. Recipe `carousel` ganhou variant `orientation`. Indicators continuam dispostos horizontalmente (convenção visual, decisão deliberada). Em vertical web o consumidor define a altura do `Carousel.Content` — sem default mágico, alinhado com Embla/Swiper.
- **RFC-0034 PR2.D — `Carousel` `lazy?: boolean`:** novo prop opt-in para virtualização leve. Web: items fora da janela expandida (`rootMargin: 200px`) renderizam placeholder vazio; quando entram, montam children e permanecem montados (sticky — preserva estado de form/video/IO). Cria um segundo `IntersectionObserver` apenas quando `lazy=true`. Native: aplica defaults `windowSize: 3` + `removeClippedSubviews: true` na `FlatList`; `nativeListProps` continua o escape hatch para sobrescrever. Princípio Embla — virtualização é opt-in, não default.
- Stories `VerticalOrientation` e `LazyMounting` (esta com snapshot dos índices montados).
- TD-035 (RFC-0034 v1) marcada **Resolved**.

### Breaking

- **RFC-0031 (SP-1):** props `size`/`padding` de componentes normalizadas para o vocabulário `xsmall | small | medium | large | xlarge`, alinhando-se à camada de primitivos (`spacing`, `borderRadius`, `fontSize`, `iconSize`). Antes: `xs | sm | md | lg | xl`. Afetadas: `Avatar`, `Badge`, `Button`, `Card.padding`, `Checkbox`, `Chip`, `Counter`, `Dialog`, `Drawer`, `FloatingActionButton`, `Field`/`TextInput`/`TextArea`, `ProgressBar`, `Radio`, `Select`, `Switch`, `Tabs`, `Spinner` (consistência interna). Tokens de densidade `sizes.control.{sm,md,lg}` e `sizes.dialog.{sm,md,lg}` renomeados para `{small,medium,large}`. Sem aliases legacy nem janela de transição (precedente TD-012).

## 1.0.0

Primeiro release estável do Arbor-DS. Design system cross-platform, tipado e themable, pronto para sustentar múltiplos produtos sobre a mesma base — Web, iOS e Android.

### Foundations

- Tokens em três camadas (`primitives` → `semantics` → `components`) cobrindo cor, tipografia, espaçamento, raios, sombras, motion, foco, densidade e z-index.
- Camada de **brand alias** (`brand.{primary,secondary,accent,onPrimary,onSecondary}`) e helper `createBrandPalette()` para consolidar identidade num ponto único.
- `motion` themable (`duration`/`easing`) com helpers `transition()` (estático) e `useTransition()` (runtime-aware).
- `focus.ring` desacoplado de `interactive.default` — produtos podem definir cor de foco própria sem arrastar a cor interativa.
- Tokens de densidade (`sizes.control`, `sizes.dialog`) consumidos por recipes para variações compactas/confortáveis sem mexer em primitives.

### Theming multi-produto

- `ArborTheme` é interface **estrutural aberta** (`BaseTheme & { mode: string; colors: ThemeColors }`) — admite produtos arbitrários sem alteração no DS.
- `createTheme(base, override)` permite que um produto ajuste cor, tipografia, raios, sombras, motion e densidade sem editar nenhum arquivo da biblioteca.
- Lint anti-literal (`pnpm test:no-color-literal`) impede regressão para `#hex`/`rgba(...)` em código de runtime.
- Matriz de testes produto × componente garante que overrides propagam por toda a árvore.

### Cross-platform completo

- 100% das ~35 famílias de componentes têm implementação Web (`*.tsx`) **e** native (`*.native.tsx`), com paridade de API e de testes.
- Inventário web-only zero — `pnpm test:platform-contract --strict` verde sem warnings.
- Engine de estilo (`ArborTransform`) compartilhada entre plataformas, com adapters por plataforma quando necessário.
- `react-native-svg` formalizada como peerDependency para suporte a `Icon` e `ProgressCircle` em RN.

### Acessibilidade como contrato

- Foco visível (WCAG 2.4.7) garantido via `_focusVisibleWithin` na engine.
- Touch target (WCAG 2.5.5, 44×44) garantido via `minHeight` + overlay `::before` em todos os controles interativos.
- Combobox WAI-ARIA-compliant em `Select` (activedescendant, type-ahead diacrítico-aware, navegação por teclado completa).
- Overlays (`Dialog`, `Drawer`, `Popover`, `Menu`, `Tooltip`) renderizados via `Portal` + `DismissableLayer` para escapar de ancestrais com `overflow: hidden`.

### Componentes

Layout: `Box`, `Flex`, `Grid`, `Container`, `Center`, `Square`, `Circle`, `Spacer`, `Clickable`, `Image`, `Icon`, `Text`.

Forms: `Field` (compound), `TextInput`, `TextArea`, `Counter`, `Checkbox`, `Radio`, `Switch`, `Select`, `FileUpload`.

Overlays: `Dialog`, `Drawer`, `Tooltip`, `Popover`, `Menu`, `Toast`/`Toaster`.

Conteúdo: `Card`, `Avatar`, `Chip`, `Tag`, `Badge`, `Alert`, `Skeleton`, `Spinner`, `ProgressBar`, `ProgressCircle`, `Accordion`.

Navegação: `NavBar` (top app bar), `TabBar` (bottom), `Tabs`, `Breadcrumb`, `Pagination`, `Button`, `IconButton`, `ButtonGroup`, `FloatingActionButton`.

Dados: `Table` (com slots `Head`/`Row`/`Cell`/`Section`).

### Tooling

- Build em duas saídas (ES + CJS) com emissão de `.d.ts` via `vite-plugin-dts` para todos os entry points (`.`, `./native`, `./foundations`, `./ecosystem`).
- Suíte Jest multi-project (web + native) com 910/910 testes verdes.
- Storybook 10 com 100% dos componentes documentados, showcase de tematização multi-produto e toolbar para alternar entre `Light`/`Dark`/`Product B`.
- Governança: changesets, commitlint + husky, size-limit, dependency-cruiser, RFCs versionadas, `docs/TECH_DEBT.md` formal.

### Pacote npm

- `package.json` com `exports` map cobrindo `import`/`require`/`types` em cada entry.
- `files` field restringindo o tarball a `dist`, `README`, `LICENSE` e `CHANGELOG`.
- Dependências de runtime zero — apenas peerDependencies (`react`, `react-dom`, `react-native`, `react-native-svg`, `react-native-web`, `lucide-react`, `lucide-react-native`).

---

### Initial stable release

- Initial stable release — design system cross-platform com styled-system, temas, tokens semânticos, form components, overlays, navegação, feedback, e documentação viva via Storybook.
