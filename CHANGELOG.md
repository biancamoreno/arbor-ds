# arbor-ds

## Unreleased

### Added

- **`Alert`, `Tooltip` e `Avatar` ganham API plana** seguindo o mesmo pattern de `Checkbox`/`Radio`. Sem breaking — `.Root` preservado em todos para layouts não-triviais.
  - **Alert:**
    ```tsx
    // Antes (compound)
    <Alert tone="warning">
      <Alert.Icon />
      <Alert.Title>Atenção</Alert.Title>
      <Alert.Description>Sessão expira em 5min.</Alert.Description>
      <Alert.Close onClick={dismiss} />
    </Alert>
    // Agora (plano)
    <Alert tone="warning" title="Atenção" description="Sessão expira em 5min." onClose={dismiss} />
    ```
    Props novas: `title?`, `description?`, `icon?` (override do ícone tone-default), `onClose?` (presença renderiza botão `X`), `closeLabel?`. Quando `onClose` é definido, o botão de fechamento é renderizado; quando undefined, é omitido. `AlertRootProps.children` virou opcional. Novo tipo `AlertProps`.
  - **Tooltip:**
    ```tsx
    // Antes (compound)
    <Tooltip.Root>
      <Tooltip.Trigger><IconButton icon="Trash" /></Tooltip.Trigger>
      <Tooltip.Content>Excluir item</Tooltip.Content>
    </Tooltip.Root>
    // Agora (plano)
    <Tooltip label="Excluir item"><IconButton icon="Trash" /></Tooltip>
    ```
    Pattern alinhado Mantine/Chakra (children = trigger, `label` = content). Props novas: `label?`, `placement?`, `maxWidth?`. No modo plano `children` é o trigger direto (cloneElement com handlers). Novo tipo `TooltipProps`.
  - **Avatar:**
    ```tsx
    // Antes (compound)
    <Avatar size="medium">
      <Avatar.Image src={user.photo} alt={user.name} />
      <Avatar.Fallback>{initials(user.name)}</Avatar.Fallback>
    </Avatar>
    // Agora (plano)
    <Avatar src={user.photo} alt={user.name} fallback={initials(user.name)} />
    ```
    Props novas: `src?`, `alt?`, `fallback?` (aceita `ReactNode` — string para iniciais ou `<Icon/>` para ícone genérico), `fallbackDelayMs?`. `AvatarRootProps.children` virou opcional. Novo tipo `AvatarProps`. Em ambas plataformas (`.tsx` e `.native.tsx`).
  - **Pattern canônico estabelecido:** `usesFlatApi = qualquer-prop-plana !== undefined || (sem children quando apropriado)`. Sem detecção mágica — prop discrimina, não introspecção de tipos. Cada wrapper preserva `displayName` correto (`Component` vs `Component.Root`). Stories ganharam variações `FlatAPI` e `AdvancedCompound` para documentar os dois modos.
  - **+10 testes smoke** cobrindo renders auto, omissão condicional, click forward e fallback compound. Suite 1122 → 1132.

- **`Checkbox` e `Radio` ganham API plana** com props `label?: ReactNode` e `description?: ReactNode` — atalho declarativo para o caso comum (98%) sem precisar compor `Root` + `Indicator` + `Label`. Sem breaking: o compound `Checkbox.Root` / `Radio.Root` continua disponível para layouts não-triviais (Label antes do Indicator, descrição com ícone embutido, integração custom com Field).
  - **Antes (compound obrigatório):**
    ```tsx
    <Checkbox.Root checked={c} onCheckedChange={setC}>
      <Checkbox.Indicator />
      <Checkbox.Label>Aceito os termos</Checkbox.Label>
    </Checkbox.Root>
    ```
  - **Agora (atalho plano):**
    ```tsx
    <Checkbox label="Aceito os termos" checked={c} onCheckedChange={setC} />
    <Radio value="pro" label="Plano Pro" description="R$ 49/mês" />
    ```
  - **Roteamento:** `Checkbox`/`Radio` top-level são wrappers que decidem em runtime — se `label` ou `description` é definido, renderizam `Root + Indicator + Label/Description` automaticamente; se ambos são `undefined`, modo compound puro (passa children direto). Sem ambiguidade nem detecção mágica (a prop discrimina, não os children).
  - **Tipo novo exportado:** `CheckboxProps` e `RadioProps` (extends `Root` sem `children` obrigatório + label/description opcionais). `CheckboxRootProps.children` virou opcional (`children?: ReactNode`) para suportar o caminho sem children (`<Checkbox aria-label="x" />` renderiza só o indicador).
  - **Stories reescritas:** Default/Checked/Indeterminate/Sizes/Disabled/Invalid/WithDescription/Variants/TriState/Group migrados para API plana; nova story `AdvancedCompound` demonstra `.Root` para casos não-triviais.
  - **Naming alinhado Mantine** (`label`/`description` props) — denominador-comum com Chakra, Vuetify, Naive UI.
  - **Sem alteração em a11y:** input nativo continua escondido no Root; foco/teclado/role/`aria-*` field-aware idênticos.

- **`Checkbox` e `Radio` ganham prop `variant: 'outline' | 'filled'`** (default `'outline'`, sem breaking). Permite escolher o tratamento visual do indicador no estado idle sem editar tema:
  - `'outline'` (default): caixa/círculo transparente sobre `surface.default` — comportamento atual.
  - `'filled'`: caixa/círculo com `background.subtle` (off-white quente) preenchendo o indicador no idle — mais "tactile" sobre fundos brancos. No Checkbox o estado `checked` continua preenchendo com `interactive.default`; no Radio o `checked` volta para `surface.default` para o dot brand-solid contrastar.
  - **Tokens novos** em `tokens/components/{checkbox,radio}.ts`: `colors.indicator.background.{outline,filled,checked}` (radio também ganha `checked` agora, antes era string única). Override completo via `createTheme({ components: { checkbox: { colors: { indicator: { background: { filled: 'background.muted' } } } } } })`.
  - **Recipes** (`base-theme.ts`): novo axis `variant: 'outline' | 'filled'` em `checkbox` e `radio` (`defaultVariants.variant: 'outline'`). State `checked` permanece com maior precedência — bg do variant é sobrescrito quando checked.
  - **Naming:** `filled` alinhado com Mantine/Chakra/Vuetify/Naive UI/Element Plus/PrimeReact (maior denominador comum na comunidade); preserva `solid`/`subtle` para semântica de tone (Tag/Badge/Chip) sem colisão.
  - **Storybook:** novo case `Variants` em ambos componentes mostrando outline vs filled lado a lado nos três estados (idle/checked/indeterminate para Checkbox; idle/checked para Radio).

### Fixed

- **`Checkbox` e `Radio` variant `filled` agora é visualmente distinto de `outline`.** O alias `colors.indicator.background.filled` em `tokens/components/{checkbox,radio}.ts` apontava para `background.subtle` (`#FAFAF9`) — 1 byte por canal de diferença para `surface.default` (`#FFFFFF`), imperceptível em indicadores de 16–20px. Migrado para `background.muted` (`sandstone[10]` = `#F2F2F0`), alinhamento com o `filled` de Mantine/Chakra (cinza tactile sobre fundo branco). Recipe e componente intactos — só o ponteiro do alias mudou; override via `createTheme({ components: { checkbox: { colors: { indicator: { background: { filled: '...' } } } } } })` continua propagando.

- **`Checkbox` e `Radio`: borda do indicador era invisível** — recipes declaravam `borderWidth` + `borderColor` mas não `borderStyle`, então o browser defaultava para `border-style: none` e ignorava silenciosamente width+color (CSS exige os 3). Outras 14 recipes do projeto (Input/Switch/Card/Button/etc) já declaravam `borderStyle: 'solid'` explicitamente; Checkbox e Radio eram exceção. Restaura a affordance visual no estado idle.

### Breaking

- **RFC-0042 PCV-18 — `Radio` stripped-down (drop do resíduo de RadioCard) + novo slot `dot` themable + touch target via recipe (Camada 5 RFC-0042 3/4).** Pré-v1.
  - **Anatomia visual mudou.** Radio default deixa de carregar moldura ao redor da linha inteira + highlight de fundo quando selecionado (visual de "card selecionado" residual da RFC-0021 que removeu o RadioCard). Default agora é radio clássico: indicador circular bordado à esquerda + Label/Description à direita + gap entre eles. Sem border na linha, sem `backgroundColor: brand.bgElement` no row. Para o pattern de card selecionável use `<Card interactive><Radio /></Card>`.
  - **Recipe `radio`:** `slots` `['root','control','indicator','label','description']` → `['root','control','indicator','dot','label','description']`. Novo slot `dot` (o ponto interno do indicador quando checked) consome `$radio.indicator.dotSize` e `$radio.colors.indicator.dot` — antes era um `<Box width={10} height={10} borderRadius="full" backgroundColor={ctx.checked ? 'brand.solid' : 'transparent'}>` literal dentro do componente, agora é totalmente themable. Slot `control` reduzido a `display: flex / alignItems: flex-start / gap`: sem border, sem bg, sem padding, sem `width: 100%`, sem `justifyContent: 'space-between'`. Variant `size` deixa de tocar `control.padding` (não há mais padding); só muda `label.fontSize`. Slot `indicator` ganha `transition: transition(['border-color'], 'fast')` (antes essa transição vivia no `control`). Slot `root` ganha `position: relative` + overlay `_before` com `width/height: $radio.minTouch` (WCAG 2.5.5 touch target, pattern Checkbox/Switch/Field) e `borderRadius: 'small'` (anel de foco visível).
  - **Tokens `radio.ts`:** removidos `borderRadius` (root), `borderWidth` (root), `padding.{small,medium,large}`, `colors.control.*` (`border.default/checked/invalid` + `background.default/checked`). Adicionados `minTouch: 'touchTarget.minimum'`, `indicator.dotSize: '10px'`, `colors.indicator.dot: 'brand.solid'`, `colors.indicator.border.invalid: 'feedback.critical.solid'`. `colors.indicator.background` deixa de ser objeto (`{ default: ... }`) e passa a ser string única (`'surface.default'`) — não havia variação de bg por estado, só o subobjeto duplicava sem necessidade.
  - **`radio.tsx`:** `useTransition` removida (a recipe assume todas as transitions). Indicator agora renderiza `<Flex as="span" {...slots.indicator}><Box as="span" {...slots.dot} /></Flex>` — literais `width={10}`/`height={10}`/`backgroundColor`/`transition` deletados. Input hidden ganha o mesmo escape de hidden do Checkbox (`width/height: 1px / margin: -1px / overflow: hidden`) — mais robusto que `position: absolute / opacity: 0` para evitar leitor de tela ignorar.
  - **`radio.native.tsx`:** espelha — Indicator consome `slots.dot`; literais `brand.solid`/`transparent`/`width:10`/`height:10` deletados.
  - **API pública intacta** (`RadioRootProps` sem mudança). **API quebrada:** `RadioIndicatorProps` deixa de aceitar `style?: React.CSSProperties` — Indicator é decorativo, não aceita props (override do tema substitui).
  - **Tests:** 1 teste ajustado (Theming override agora valida `indicator.borderRadius: 'huge'` → 32px, em vez de `control.borderRadius` que perdeu efeito visual com strip). 1 teste ajustado (size diferencia `label.fontSize`, não `control.padding`; selector trocou para `getByText('Label').className`). Suite 1113/1113 mantida (sem regressão).
  - **Stories padrão PCV:** Default / Checked / WithDescription / Sizes / Group (controlled real com state) / Disabled (3 estados) / Invalid (via `<Field invalid>`) / Theming (override `components.radio.colors.indicator.dot` + border + recipe `indicator.borderRadius: 'small'` para demo de identidade alternativa).

- **RFC-0042 PCV-17 — `Checkbox` com indicator customizado cross-platform via `<Icon>` (R6-J fechada) + touch target via recipe + `_focusVisibleWithin` no root (Camada 5 RFC-0042 2/4).** Pré-v1.
  - **R6-J fechada — glifo cross-platform unificado.** Web não consome mais `accentColor` (chrome do user agent, divergente entre Chrome/Firefox/Safari/Windows). Native não usa mais `Box` de 10×2px rotacionado −45° (visual era um traço diagonal, não um ✓ real). Os dois lados agora renderizam `<Icon name="Check" />` ou `<Icon name="Minus" />` (indeterminate) consumindo o `iconMap` curado (RFC-0028). Glifo idêntico em web/iOS/Android. Resolve HR6-8/HR6-9 documentadas em `docs/reviews/_followups.md`.
  - **`checkbox.tsx`:** estrutura migrou para o pattern do Radio — `<input type="checkbox">` (visualmente escondido por `opacity:0` + `width/height: 1px` + `pointerEvents: none`) fica no Root como filho da `<label>`; `Checkbox.Indicator` agora é uma `<span>` decorativa que consome `useSlotRecipe('checkbox', { size, state })` e renderiza o glifo Lucide condicionalmente. `useTheme()` removido (não há mais `accentColor` para alimentar). `inputRef` interno mantém o efeito de `el.indeterminate = true` para `aria-checked="mixed"` automático do browser.
  - **`checkbox.native.tsx`:** `CheckboxIndicator` consome o mesmo slot recipe + `<Icon>` (paridade total com web). `accessibilityState.checked` aceita `'mixed'` quando `indeterminate` (suporte explícito a tri-state para leitor de tela).
  - **Recipe `checkbox`:** `_focusVisible` migrado de `indicator` para `_focusVisibleWithin` no `root` — anel agora circunda a label inteira quando o input escondido recebe foco do teclado (TD-014 reforçada). Slot `indicator` ganha `color: '$checkbox.colors.indicator.mark'` (consumido por `<Icon color="currentColor">`) e `transition` via `transition()` para suavizar a mudança border/bg em hover/checked. `root` ganha `position: relative` + overlay `_before` com `width/height: $checkbox.minTouch` (WCAG 2.5.5 touch target, pattern Switch/Field/FAB).
  - **Tokens `checkbox.ts`:** ganha `minTouch: 'touchTarget.minimum'`, `mark: { size: { small: 'xsmall', medium: 'small', large: 'small' } }` e `colors.indicator.mark: 'text.inverse'` (texto branco sobre bg `interactive.default` quando checked — mesmo pattern do Button primary). Override completo via `createTheme({ components: { checkbox: { colors: { indicator: { background: { checked: 'feedback.success.solid' }, border: { checked: 'feedback.success.solid' } } } } } })` propaga para o CSS sem editar recipe.
  - **API pública intacta.** `CheckboxRootProps` (`checked`/`defaultChecked`/`onCheckedChange`/`disabled`/`indeterminate`/`size`/`name`/`value`/`id`) sem mudança. **API quebrada:** `CheckboxIndicatorProps` deixa de herdar `InputHTMLAttributes` — `Indicator` virou span decorativa, não aceita mais `ref`/`style`/`aria-*`/`data-testid`. Quem precisava dessas props move para `Checkbox.Root`. Pré-v1, sem alias legacy (precedente TD-012).
  - **Tests:** 17/17 verdes (web — antes 14) + 6/6 verdes (native — antes 5). Novos: `renders Check icon when checked`, `renders Minus icon when indeterminate`, `renders no glyph in idle state`, focus rule agora valida `:has(:focus-visible)` no root (não mais `:focus-visible` no input), `accessibilityState.checked === 'mixed'` em native indeterminate. Suite global 1113/1113 (de 1104 antes).
  - **Stories reescritas em padrão PCV:** Default / Checked / Indeterminate / Sizes / WithDescription / Disabled (× 3 estados, inclui indeterminate-disabled) / Invalid (via `<Field invalid>`) / TriState (Select-All real com array de items controlados) / Theming (override `components.checkbox.colors.indicator.background.checked: 'feedback.success.solid'` + `recipes.checkbox.base.indicator.borderRadius: 'huge'`).

- **RFC-0042 PCV-16 — `Switch` com geometria derivada do tema + overlay de touch target migrado para recipe + `track.checked` alinhado com `brand.solid` (Camada 5 RFC-0042 iniciada 1/4).** Pré-v1.
  - **Bug fix SW-1 — geometria não duplica mais.** O `trackGeometry` literal dentro de `switch.tsx` (`{ small: { width: 36, thumb: 16, padding: 2 }, ... }`) duplicava os tokens `switchToken.track.size` + `thumb.size` + `track.padding`. Override de `createTheme({ components: { switch: { track: { size: { medium: { width: '60px' } } } } } })` movia a faixa CSS mas o JS continuava calculando `translateX` com o valor antigo — thumb parava fora do lugar. Agora o componente lê `theme.components.switch.track.size[size].width`, `thumb.size[size]` e `track.padding` em runtime (parseFloat para o cálculo numérico do `translateX`); a única fonte da verdade é o tema.
  - **`tokens/components/switch.ts`:** ganhou `track.minTouch: 'touchTarget.minimum'` (alias semantic). Cor `colors.track.checked` migrou de `'interactive.default'` → `'brand.solid'` (SW-3: alinhamento com Radio dentro da família Form atoms — visualmente é a mesma cor hoje, mas semanticamente o switch ativo deixa de depender do alias intermediário `interactive.default`).
  - **Recipe `switch` (base-theme.ts):** slot `track` agora carrega `position: 'relative'` + `_before` com `minWidth/minHeight: '$switch.track.minTouch'` (padrão estabelecido por `carousel.indicator`). O overlay invisível `44×44` para WCAG 2.5.5 (TD-016) deixa de ser definido inline no componente — vira contrato themable.
  - **`switch.tsx`:** consome `usePrefersReducedMotion()` e injeta `style={{ transition: 'none' }}` no thumb quando reduced — antes a transição rodava sem ressalva, ignorando a preferência do usuário. Remove `style={{ boxSizing: 'border-box' }}` redundante e `_before` inline (agora vem da recipe).
  - **`switch.native.tsx`:** alinha `trackOnColor` para `theme.colors.brand.solid` (espelha a calibração SW-3 do web). Demais limitações da `<RNSwitch>` (geometria fixa, sem reduced-motion, sem propagação de recipe) ficam registradas como **TD-045** (resolução pós-v1 via implementação custom `Animated.View` + `Pressable`).
  - **API pública intacta.** `SwitchRootProps` (`checked`/`defaultChecked`/`onCheckedChange`/`disabled`/`size`/`name`/`value`/`aria-*`) sem mudança. Field-aware preservado.
  - **Tests:** 28/28 verdes (web) + 4/4 verdes (native). Nenhum teste alterado — comportamento idêntico.
  - **Stories reescritas em padrão PCV:** Default / Anatomia / Sizes / States (idle/checked/disabled/disabled-checked/invalid-via-Field) / Controlled (modo escuro) / WithLabel / InsideField / Theming (override `components.switch.colors.track.checked` → `feedback.success.solid`).

- **RFC-0042 PCV-15 — `ProgressCircle` migrado para tokens + `size` virou SP-1 + TD-041 fechada em native (Camada 4 RFC-0042 fechada 5/5).** Pré-v1, sem aliases legacy (precedente TD-012).
  - **`size: number` → `size: 'small'|'medium'|'large'`.** API pública migra de pixel-livre para vocabulário SP-1 (paridade com `ProgressBar`). Resolve diâmetro via `theme.components.progressCircle.size.{size}` (24/48/64 default). Sem backward-compat numérico — consumidores devem trocar `size={48}` por `size="medium"`. Para tamanhos arbitrários, override via `createTheme({ components: { progressCircle: { size: { medium: 56 } } } })`.
  - **`strokeWidth` agora tem default por size.** Era `4` fixo independente de size; agora resolve via `theme.components.progressCircle.strokeWidth.{size}` (3/4/6 default). Prop `strokeWidth` permanece como escape numérico para override pontual.
  - **Novo `tokens/components/progress-circle.ts`:** `track.color`, `size.{small,medium,large}`, `strokeWidth.{small,medium,large}`, `indeterminate.{duration,offsetRatio}`. Antes tudo era literal no componente (defaults `48`/`4`, `0.75` offset hardcoded, `1.2s` duration na animation string). Produto consumidor pode redefinir via `createTheme`.
  - **TD-041 ramificação ProgressCircle fechada.** `progress-circle.native.tsx` consome `usePrefersReducedMotion()`: quando true, congela rotação (offset estável, sem `Animated.loop`) preservando `accessibilityState.busy` para leitores de tela. Duração agora resolve via token (default `1200ms`, override por createTheme). Pattern idêntico a Spinner/Skeleton/Carousel (PCV-4/PCV-5/TD-032).
  - **`internal/colors.ts` deletado.** Era wrapper trivial sobre `getFeedbackToneColor` (3 linhas). Componente web e native importam direto de `foundations`. Reduz superfície de código sem perda.
  - **API pública restante intacta.** `progress`/`indeterminate`/`tone`/`label`/`style`/`testID` mantidos. Subset `Exclude<FeedbackTone, 'neutral'>` preservado.
  - **Tests:** 2 testes ajustados (`size={64}` → `size="large"`; valor numérico esperado idêntico via resolução de token). 1 teste novo (`size="small" → 24px`). Stories reescritas em padrão PCV (Anatomia / Default / Tones / Sizes / Complete / Indeterminate / LiveProgress).
  - **TD-041 status:** 4/4 fechadas — Spinner (PCV-4) ✅, Skeleton (PCV-5) ✅, ProgressCircle (PCV-15) ✅, **Toast (PCV-25) pendente** (única ramificação restante; resta para Camada 7 PCV-25).
  - **Camada 4 RFC-0042 fechada 5/5:** Badge / Chip / Avatar / ProgressBar / ProgressCircle todos com slot recipe + tokens + paridade native + stories padrão PCV.

- **RFC-0042 PCV-14 — `ProgressBar` migrado para slot recipe + tokens + `.native.tsx` animado (fecha Padrão #1 + #3 e o gap PB-5 de indeterminate-só-em-web).** Pré-v1, sem aliases legacy (precedente TD-012).
  - **Nova recipe `progressBar` (base-theme.ts):** slot recipe `['root', 'fill', 'indeterminate']` com axes `size: small|medium|large` e `tone: brand|info|success|warning|critical`. Anatomia (`position`, `width`, `borderRadius`, `backgroundColor`, `overflow`), altura por size, transition do fill, posicionamento absoluto do indeterminate — tudo via tokens. Tone mapeia `fill.backgroundColor` e `indeterminate.backgroundColor` para `{brand,feedback.success,feedback.warning,feedback.critical,feedback.info}.solid` por alias string.
  - **Novo `tokens/components/progress-bar.ts`:** `borderRadius`, `track.background`, `height.{small,medium,large}`, `indeterminate.{width,duration,easing}`. Antes tudo era literal no componente (`HEIGHT_MAP` JS, animation string hardcoded com cubic-bezier). Produto consumidor pode redefinir duração/easing/cor via `createTheme({ components: { progressBar: ... } })`.
  - **`progress-bar.tsx`:** consome `useSlotRecipe<'root'|'fill'|'indeterminate'>('progressBar', { size, tone })`. Removidos `HEIGHT_MAP`, `getFeedbackToneColor` JS helper, literais de `backgroundColor`/`borderRadius`/`overflow`/`position`. `useTheme` mantido **apenas** para construir a string CSS `animation` (concatenação dinâmica não passa pelo resolver `$`); justificativa documentada.
  - **Novo `progress-bar.native.tsx`:** antes era `@platform shared` mas indeterminate ficava estático em RN (CSS keyframe global não existe em RN — gap PB-5 documentado mas não resolvido). Agora: mede a track via `onLayout`, usa `Animated.loop` + `Animated.timing` com easing `Easing.bezier(0.65, 0.815, 0.735, 0.395)` (mesmo curve do web) animando `translateX` em pixels (RN `interpolate` não aceita outputRange em `%`). Respeita `usePrefersReducedMotion()`: congela faixa no centro (offset 50%) preservando `accessibilityState.busy`. Determinado: usa width percentual sem animação RN (slot fill consome transition do engine).
  - **Tests:** dois testes web brittle removidos (`expect(progressbar.style.height).toBe('4px'|'12px')` — quebravam após migração porque o engine agora emite CSS class em vez de inline style). Substituídos por: smoke render por size + teste novo de contrato (`themeLight.components.progressBar.height.small === '4px'` etc) que valida o token diretamente.
  - **API pública intacta.** `ProgressBarProps` inalterado.
  - **Stories reescritas em padrão PCV:** Anatomia / Default / Tones / Sizes / Complete / Indeterminate / LiveProgress (composição real com progresso simulado + troca de tone para `success` ao completar).

- **RFC-0042 PCV-13 — `Avatar`/`AvatarGroup` migrados para slot recipe + tokens (fecha Padrão #1 de recipe órfã).** Pré-v1, sem aliases legacy (precedente TD-012).
  - **Recipe `avatar` (base-theme):** slots `['root','image','fallback']` → `['root','image','fallback','overflow']`. Novo slot `overflow` carrega anatomia do contador `+N` do `AvatarGroup` (background/color/fontWeight tematizáveis). Ganha axis `shape: 'circle' | 'square'` mapeando para `$avatar.borderRadius.{shape}` em `root` e `overflow`. `base.root.backgroundColor: '$avatar.background'`, `base.fallback.color: '$avatar.fallback.color'`, `base.overflow.{backgroundColor,color}` tokenizados. `fontSize.fallback.{size}` agora **é de fato aplicado** (antes a recipe declarava mas o componente forçava `fontSize="small"` hardcoded — Padrão #1: tokens órfãos resolvidos).
  - **`tokens/components/avatar.ts`:** ganha `borderRadius: { circle: 'full', square: 'small' }`, `background: 'background.subtle'`, `fallback: { color: 'text.secondary' }`, `overflow: { background: 'background.interactive', color: 'text.secondary' }`. Override completo via `createTheme({ components: { avatar: ... } })` — produto pode redefinir cor de placeholder/iniciais/contador sem editar arquivos do DS.
  - **`avatar.tsx`/`avatar.native.tsx`:** consomem `useSlotRecipe<'root' | 'image' | 'fallback' | 'overflow'>('avatar', { size, shape })`. Removidos: `sizeToken` helper local, `borderRadius={shape === 'circle' ? 'full' : 'small'}` literal, `backgroundColor="background.subtle"` literal em Root, `fontSize="small" fontWeight="medium" color="text.secondary"` literais em Fallback, `backgroundColor="background.interactive" fontSize="xsmall" fontWeight="medium" color="text.secondary"` literais no overflow do Group. `useTheme()` mantido **apenas** em `AvatarGroup` para `theme.sizes.avatarOverlap[size]` (overlap negativo não é axis de recipe — decisão consciente, idiomática).
  - **Visual:** fallback agora escala fontSize por size (xsmall → xsmall, medium → sm, large → small, xlarge → md) — antes todos renderizavam com `'small'` fixo. Mais legível em sizes extremos.
  - **API pública intacta.** `AvatarRootProps`, `AvatarImageProps`, `AvatarFallbackProps`, `AvatarGroupProps` sem mudança.
  - **Stories reescritas em padrão PCV:** Anatomia / Default / Sizes / Shapes / FallbackVariants / Group / GroupSizes. Substituições contra Padrão #2: `<div style={{ display: 'flex', gap: 12 }}>` → `<Flex gap="small">`; sizes com índices reais (`img=${i + 30}` em vez de `img=${size.length}` que duplicava fotos); fallback livre com `<Icon name="User" decorative />`; overlines pedagógicos com `Text variant='overline'`.

- **RFC-0042 PCV-12 — `Chip` migrado para recipe-only disabled + base focusVisible no Remove.** Pré-v1, sem aliases legacy (precedente TD-012).
  - **`disabled` agora é axis da recipe `chip`** (antes era literal pós-spread no componente, com `theme.opacity.medium = 0.4`). A recipe ganha variant `disabled: { true, false }` que aplica `cursor: 'not-allowed'` + `opacity: $chip.opacity.disabled` (semantic `opacity.disabled = 0.6`, alinhado com Input/Select/Switch). Visualmente: chips desabilitados ficam um pouco mais legíveis (40% → 60% opacity) e consistentes com o resto do DS.
  - **`Chip.Remove` ganhou `_focusVisible: focusRing` em `base.remove`** — antes a recipe só aplicava em `selectable.true.remove`, e no modo decorativo o `Clickable` interno precisava declarar `_focusVisible` literal duplicado. Agora ambos os modos consomem o mesmo anel via recipe. `padding: 0`, `borderWidth: 0`, `color: 'inherit'`, `cursor: 'pointer'` e `_hover: { backgroundColor: 'background.interactive' }` também migraram para `base.remove` — zera defaults UA do `<button>` e centraliza microfeedback. O componente `chip.tsx`/`chip.native.tsx` ficou sem `useTheme` e sem literais pós-spread (Padrão #9 fechado).
  - **`tokens/components/chip.ts`:** ganha `opacity: { disabled: 'disabled' }` (alias semantic).
  - **Sem mudança em API pública.** Discriminated union `selectable: true|false` (RFC-0033) intacta; `disabled`/`selected`/`tone`/`variant`/`size` mantidos. Comportamento: chip selectable disabled ainda bloqueia `onSelectedChange`; `Chip.Remove` decorativo ainda dispara `onClick` por Space/Enter; nenhum teste alterado (31/31 verdes).
  - **Stories reescritas em padrão PCV:** Anatomia / Default / DecorativeVsSelectable / Variants / Tones / Sizes / WithIconAndRemove / DisabledStates / FilterBar (barra real de filtros toggleable). `Chip.Icon` com `<Icon name="..." decorative />` em todas as ocorrências (Padrão #2 — antes faltava `decorative` em algumas stories).

- **RFC-0042 PCV-11 — `Badge` migrado para slot recipe + tokens; default `variant` mudou de `'subtle'` para `'solid'`.** Pré-v1, sem aliases legacy (precedente TD-012).
  - **Default visual:** `Badge.variant` default `'subtle'` → `'solid'`. Identidade do Badge é indicador denso de alta saliência (contagem/dot sobre Avatar/Icon/IconButton). Consumidores que dependiam de `subtle` por omissão devem passar `variant="subtle"` explicitamente. Padrão simétrico com Tag (default `'outline'`, discreto) e Badge (default `'solid'`, enfático).
  - **API adicionada:** `icon?: ReactNode` — ícone opcional renderizado antes de `children`. Quando presente, slot `icon` da recipe aplica `display: inline-flex` + `flexShrink: 0`. Tipicamente `<Icon name="..." size="xsmall" decorative />`. Permite badge "ícone-puro" (sem children + ícone único) para dot decorativo.
  - **Estrutura interna:** `badge.tsx` migrou de `<Flex as="span">` com `style` inline + helper JS `getBadgeColors` para `<Box as="span">` consumindo slot recipe `useSlotRecipe('badge', { tone, variant, size })`. `useTheme()` e `getFeedbackToneColor` removidos do componente. Override completo via `createTheme({ recipes: { badge: ... }, components: { badge: ... } })`.
  - **Recipe `badge` (base-theme):** promovida de recipe simples para slot recipe com slots `['root', 'label', 'icon']`. Ganha axes `tone` (6 valores) e `variant` (`solid`/`subtle`) + 12 compoundVariants (`tone × variant`) com mapeamento por alias string (`brand.solid`, `feedback.success.text` etc.). Override do tema propaga via cascata.
  - **`tokens/components/badge.ts`:** ganha `gap: 'nano'` (era `gap="4px"` literal) e `borderWidth: 'hairline'` (era `borderWidth={1}` literal). `padding.small.block` 2px literal → `nano` (4); `padding.medium.block` 3px literal → `nano` (4). `padding.{small,medium}.inline` permanecem `micro`/`tiny`. `fontSize.{small,medium}` permanecem ambos `xsmall` (sem hierarquia tipográfica entre sizes — diferenciação só por padding, identidade ultradensa).
  - **Cross-platform:** novo `badge.native.tsx` (antes Badge era `@platform shared` sem implementação dedicada). RN agora envolve children em `<Text>` por construção, evitando string-as-child-of-View. `Badge.Anchor` native usa offsets `top/right -8px` em vez de `transform translate(±50%, ±50%)` (RN não tem porcentagem confiável de translate).

- **RFC-0042 PCV-10 — `Tag` decorativa pura (sem mais comportamento interativo).** Pré-v1, sem aliases legacy (precedente TD-012).
  - **API removida:** `onClick`, `selected`, `disabled`.
  - **API adicionada:** `variant: 'solid' | 'outline'` (default `'outline'`) — substitui `selected` como discriminador visual. Anatomia/cor inalteradas (mesmas 12 compoundVariants `tone × variant`).
  - **Estrutura:** `tag.tsx` web renderiza `<Box as="span">` (era `<Clickable as="button">`); `tag.native.tsx` renderiza `<Box>` + `<Text>` (era `<Clickable.native>`). Sem `aria-pressed`/`accessibilityRole='button'`/`accessibilityState`. Sem foco visível/touch target/microfeedback.
  - **Recipe `tag` (base-theme):** discriminador `selected: true|false` → `variant: solid|outline`; removidos `_focusVisible` e `transition`.
  - **`tokens/components/tag.ts`:** densidade calibrada para badge — `gap: 'micro'` → `'nano'`, `fontSize: 'xsmall'` (10px) → `'sm'` (14px, legível), `padding.inline: 'small'` → `'tiny'`, `padding.block: 'micro'` → `'nano'`, `minHeight: 'touchTarget.minimum'` removido.
  - **Casos interativos:** migrar para `Chip` (`selectable: boolean`, RFC-0033; `Chip.Remove` para botão de remoção). `Chip` é o caminho canônico para "tag clicável/filtrável/selecionável".
  - **Codemod:** consumidores que faziam `<Tag selected onClick={...}>` viram `<Chip selectable onSelectedChange={...}>`. Sem `disabled` em badges decorativos — se for indicador de estado "inativo", use tone diferente (ex.: `tone='neutral'`) ou wrapper opaco.

- **RFC-0041 PR1 — Polish visual default (foundations + Button piloto):** refinamento coordenado em 8 eixos. Pré-v1 sem consumidores externos; sem aliases legacy. Override pelo tema continua trivial (`createTheme(themeLight, { ... })`).
  - **Brand default trocado de `aqua` para `forestGreen`.** Decisão de identidade alusiva ao nome "arbor" (folha viva). `themeLight.colors.brand.solid` agora é `#1C541A` (forestGreen 90, derivado de ForestGreen 70 `#2D8229` que é a face viva da marca). `themeDark` segue simétrico via `makeDarkColorScale`. Primitive `forestGreen` estendida com steps `110` e `120` (derivados linearmente de `100` ↔ preto). Para reverter: `createTheme(themeLight, { colors: { brand: createBrandPalette('#1BA285').light } })`.
  - **Tipografia:** primitive `fontWeight` ganhou `600`; primitive `fontSize` ganhou `40/48/60/72`. Semantic `fontWeight` ganhou `semibold` (= 600); **`bold` agora redireciona para 600** (antes 700) por decisão de identidade contemporânea (Linear/Vercel/Stripe). `extrabold` (= 700) preservado para ênfase máxima. Semantic `fontSize` ganhou `displaySmall/displayMedium/displayLarge/displayHero`.
  - **Sombras multi-layer:** `shadows.{sm,md,lg,xl,cardHover}` migradas de single-layer (cinza puro alpha 0.08–0.20) para stack multi-layer suave (alpha 0.04–0.14). `cardHover` agora é stack idêntico a `lg`. `shadows.brand.*` (tinted) **fica para PR2** — requer infra de resolução brand→rgb que merece atenção dedicada; PR1 usa `shadows.sm` no hover do Button (lift neutro).
  - **Motion snap:** `motion.duration.fast` 100→120ms, `normal` 200→160ms, `slow` 300→240ms; `motion.easing.standard` migrou de `cubic-bezier(0.4, 0, 0.2, 1)` (Material) para `cubic-bezier(0.16, 1, 0.3, 1)` (easeOutQuart, "Linear/Vercel snap"); `decelerate` para easeOutQuint. `usePrefersReducedMotion` continua zerando duration. Testes com `setTimeout(200)` em transições podem ficar flaky — adaptar.
  - **`controlSize` 36/44/52** (era 32/40/48). Touch target WCAG 2.5.5 nativo em `medium` — overlay `::before` deixa de ser necessário em Button/Input/Select; remanescentes (Switch, Counter button) ainda dependem (TD-016 fica parcialmente fechada). Override desktop denso: `createTheme(themeLight, { sizes: { control: { medium: '40px' } } })`.
  - **`background.subtle` agora é `#FAFAF9`** (off-white quente sutil, "premium" Stripe/Notion-style). Cinza neutro antigo (`sandstone[10]`) realocado em `background.muted` (role novo) para casos que precisam dele. `themeDark.background.muted` mapeia em `neutral[110]`.
  - **Foco visível com glow:** `focus.ringGlow` (semantic novo) é `rgba(brand.solid, 0.20)` em light e `0.25` em dark, pré-computado via helper colocal `hexToRgba` (alpha não é runtime-editável; produto que precisa de outra anatomia substitui o role). CSS global do Provider mudou de `outline transparente + box-shadow stack` para `outline sólido + outline-offset + box-shadow glow externo`. Anatomia (largura/offset/raio do glow) **não** é themable — defaults WCAG 2.4.7/2.4.11.
  - **Button piloto:** `tokens.components.button.fontWeight` 'medium' → 'semibold'. Recipe `button` em `base-theme.ts` ganhou `_hover: { opacity: 0.92 }` e `_active: { opacity: 0.8 }` (fade-only, sem deslocamento físico do componente — decisão pós-review). Aplicável só a `<Button>` no PR1; sweep para os demais ~25 componentes vai no PR2.
  - **Storybook:** nova página `Foundations/Polish v1 — Default visual` com showcase do default forestGreen + Button piloto + 12 swatches de brand + display sizes (40/48/60/72). Aprovação destrava PR2.

- **RFC-0041 PR2 — Sweep coletivo (recipes + headings + microinteração):** consolida o polish coordenado nos demais componentes, alinhado com as decisões pós-review do PR1.
  - **Card.interactive migrado para fade-only:** recipe `card` removeu `transform: translateY(-2px)` no `_hover` e `transform: scale(0.99)` no `_active`. Agora consome `_hover: { opacity: 0.92 }` + `_active: { opacity: 0.8 }` (mesmo padrão do Button — sem deslocamento físico do componente). `transition` reduzida a `['opacity']` em `'fast'`. Token `card.shadow.hover` removido (sem consumidor).
  - **Chip.selectable ganhou microfeedback consistente:** recipe `chip` na variante `selectable: true` adicionou `cursor: 'pointer'` + `_hover: { opacity: 0.92 }` + `_active: { opacity: 0.8 }`. Lista de propriedades em `transition` inclui `'opacity'`. Alinhado com Button/Card.
  - **fontWeight semibold em headings/triggers:** `tokens.components.{dialog,drawer,alert,toast}.fontWeight.title` migrados de `'medium'` (500) para `'semibold'` (600). `tokens.components.accordion.trigger.fontWeight` idem. `tokens.components.tabs.trigger.fontWeight.active` idem. `field.label.fontWeight` permanece `'medium'` (decisão consciente — labels de form não são headings).
  - **Stories `MultiProduct`:** `ProductColumn` perdeu borda do `<Box>` wrapper externo (era `borderColor/borderWidth/borderStyle hairline + solid` somando com a borda do `<Card variant="outlined">` aninhado, criando efeito de "borda interna grossa"). Agora wrapper é só superfície (`backgroundColor + borderRadius + padding`) e os Cards delimitam claramente cada bloco de exemplo.
  - **Switch.track.size mantém literal `36px/44px/52px`:** track de switch é anatomia independente do `controlSize`; migração para alias `control.*` traria pouca clareza e exigiria tokens de "track height" novos. Mantido como está.
  - **Sem mudança em API pública.** Todo o sweep continua via tokens/recipes; consumidor não vê diferença além do polish visual.

### Changed

- **Button consome a recipe `button` via `useRecipe`** — antes aplicava `variantStyles` lendo `theme.colors.*` direto e fixava `paddingInline`/`paddingBlock` em px hardcoded local. Agora override via `createTheme({ components: { button: { colors: { primary: { bg: '...' } } } } })` propaga ao CSS renderizado (validado em `component-tokens-cascade.test.tsx`). Mesma raiz de TD-008/RFC-0017 antes do slot recipe vir. Token `button` ganhou variant `danger` (alinhada com a interface) + slot `padding.{block}`. Recipe `button` ganhou cascata completa (`borderColor`, `transition`, `borderStyle`). ButtonGroup `attached` continua colapsando radii via override pontual.

### Breaking

- **RFC-0040 PR1 — Component tokens estruturados + reconciliação `theme.recipes`:** a chave `theme.components` (que carregava recipes desde sempre) foi renomeada para `theme.recipes` para alinhar com o vocabulário que o resto da engine já usa (`useRecipe`, `defineRecipe`, `RecipeConfig`, pasta `recipes/`). A chave `theme.components` agora carrega **tokens de componente** (camada 4 da cascata documentada em `docs/ARCHITECTURE_DIRECTION.md` §2.1).
  - **Override de recipes:** quem usava `createTheme(themeLight, { components: { input: { slots, base, variants } } })` deve passar a usar `createTheme(themeLight, { recipes: { input: { ... } } })`. Sem aliases legacy (precedente TD-012). Codemod aplicado em todas as stories/tests internos.
  - Tipo `ThemeComponents` em `src/foundations/theme/types.ts` renomeado para `ThemeRecipes`.
  - Nova pasta `src/foundations/tokens/components/` com 20 arquivos (input, button, card, field, tabs, dialog, drawer, chip, tag, badge, alert, toast, accordion, carousel, switch, checkbox, radio, select, avatar, tooltip). Cada arquivo expõe um objeto de strings que resolvem em runtime (alias semantic ou referência cruzada). Sem literais de cor/timing — gate `pnpm test:component-tokens-no-literal`.
  - Engine ganha resolver `$<token>.<path>`: recipes em `base-theme.ts` consomem `'$input.padding.medium.inline'` em vez de `'12px'`. Resolver é recursivo — uma string retornada continua sendo resolvida no scale corrente até um valor concreto. Sweep total das 19 recipes — gate `pnpm test:recipe-no-component-literal`.
  - Tokens semantic novos: `sizes.touchTarget = { minimum: '44px', dense: '48px' }` (consolida WCAG 2.5.5 que vivia hardcoded em 5 recipes); `opacity.disabled = 0.6` (eliminou 5 ocorrências literais).
  - **Override de tokens:** `createTheme(themeLight, { components: { input: { borderRadius: 'large' } } })` propaga via cascata — toda recipe que consome `$input.borderRadius` reflete o novo valor. Funciona em web e native. Validado em `src/__tests__/component-tokens-cascade.test.tsx`.
  - **Limitações conhecidas (não bloqueiam release):** `<ArborProvider>` ainda emite só `--arbor-brand` e `--arbor-surface` como CSS vars; emissão completa fica para PR2 da RFC-0040. `Button` componente aplica estilos manualmente em vez de consumir a recipe — override de `components.button.colors.primary.bg` não chega ao CSS hoje (mesma raiz de TD-008/RFC-0017 antes do slot recipe vir; refactor pequeno na fila).

- **RFC-0039 — Paleta com 12 papéis nominais:** cada família themable (`brand`, `gray`, `feedback.{info,success,warning,critical}`) passa a expor uma `ColorScale` de 12 steps (numérico `1..12` + alias nominal Radix-style: `bg/bgSubtle/bgElement/bgElementHover/bgElementActive/borderSubtle/border/borderHover/solid/solidHover/text/textContrast`).
  - Vocabulário antigo (`subtle/soft/base/strong`) **removido sem aliases** (precedente TD-012). Codemod aplicado em todo o repo:
    - `brand.subtle` → `brand.bgElement` · `brand.soft` → `brand.bgElementActive` · `brand.base` → `brand.solid` · `brand.strong` → `brand.solidHover`
    - `feedback.X.subtle` → `feedback.X.bgElement` · `feedback.X.base` → `feedback.X.solid` · `feedback.X.strong` → `feedback.X.solidHover`
  - Campos legados de identidade (`brand.{primary,secondary,accent,onPrimary,onSecondary}`) e tipos `BrandPalette`/`BrandShades` **removidos** — `theme.colors.brand` é agora uma `ColorScale` pura.
  - Calibração visual deliberada: `brand.solid` (= `aqua.90`) é mais escuro/saturado que o antigo `brand.base` (= `aqua.60`). Componentes que usavam `brand.base` para ícone/borda passam a renderizar com tom mais forte. Contraste com texto inverse melhora de AA limítrofe para AAA.
  - **`createBrandPalette('#hex')`** reescrito: nova assinatura recebe a cor `solid` da marca (1 string) e retorna `{ light: ColorScale; dark: ColorScale }` — escala de 12 papéis gerada por interpolação sRGB. Override por step disponível via segundo argumento.
  - **`themeLightColors`/`themeDarkColors`** ganham `gray` (sobre primitive `neutral`) como família themable de 12 papéis.
  - Primitives `emerald`, `red`, `orange`, `neutral` estendidas com steps `110` e `120` (text/textContrast). Script `scripts/extend-palette.js` pode regenerar.
  - Novo gate CI: `pnpm test:contrast` valida pares canônicos WCAG (text/bg AA, textContrast/bg AAA, border/bg AA non-text, text.inverse sobre solid AA) em light + dark. `gray` e `feedback.warning` têm exceções convencionais documentadas no script.
  - Helper `getFeedbackToneColor(theme, tone, slot)` mantém API pública (`'subtle'|'base'|'strong'`) mas mapeia internamente para os papéis canônicos: `subtle → bgElement`, `base → solid`, `strong → text`.

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
