# Universo Maria adoption support

Analysis date: 2026-04-21

## Objective

Identify what `arbor-ds` must stabilize or add before `universo-maria` can adopt it pragmatically, without losing the product visual identity or forcing domain components into the design system.

Inputs reviewed:

- `C:\Users\henri\OneDrive\Projetos\universo-maria\docs\arbor-ds-adoption-analysis.md`
- `universo-maria` app structure, global CSS, Tailwind tokens, page layout, and local components
- `arbor-ds` package exports, build config, theme, styled-system, core primitives, and candidate components
- `arbor-ds` restructuring references from the architect skill

## Current reality in arbor-ds

The catalog is broader than the Universo Maria analysis assumed in a few places:

- `Icon`, `ButtonGroup`, `FAB`, `NavBar`, `Dialog`, `Popover`, behavior primitives, and `Empty` already exist in the current tree.
- `src/ecosystem/index.ts` no longer exports `playground`.
- `testID` is no longer in `system.blocked.ts`.
- `createBreakpoints` has moved to `foundations/breakpoints`.

However, the consumer blockers are still real:

- `dist/` currently contains JS files only. No `.d.ts` files were found for `components`, `foundations`, `ecosystem`, or `native`.
- `package.json` declares `types` only for `./native`, but `dist/native.d.ts` is missing.
- The root, `./foundations`, and `./ecosystem` exports have no `types` condition.
- `README.md` still documents `import { Box, Button, Text } from 'arbor-ds/components'`, but `package.json` does not expose `./components`.
- `pnpm.cmd exec tsc -p tsconfig.app.json --noEmit` currently fails.
- `foundations` still imports ecosystem concepts through `base-theme.ts` and `theme/types.ts` because component recipes depend on styled-system types/builders.
- Main package exports still mix web-only and shared components. That is acceptable for Universo Maria because it is web-only, but must be documented honestly.

## Universo Maria needs

`universo-maria` is a static Next.js pages-router app with Tailwind, React 19 RC, Zustand, Keen Slider, and React Icons.

Its design language is product-specific:

- dark spatial background: `#0c0f1b`
- raised dark surfaces: `#14182a`
- translucent panels: `rgba(255,255,255,0.12)`
- primary action accent: amber `#faac48`
- category/accent green: `#53906b` and hover `#7ceaa7`
- body font: Clear Sans
- title/display font: League Spartan
- rounded pill search, rounded cards, compact profile cards, horizontal category selection, and central empty/error states
- brand social icons from `react-icons`, which should remain app-owned
- galaxy/star backgrounds in header/footer, which should remain product-owned

The app should not move these domain components into `arbor-ds`:

- `Header`
- `Footer`
- `ProfileCard`
- `ProfilesDisplay`
- category data/mosaic
- search, pagination, and service/store logic

They can consume DS primitives once the DS contracts below are stable.

## Desired target

For this project, `arbor-ds` should provide:

- a typed package that can be consumed by a strict TypeScript Next app
- stable web entrypoints and honest platform classification
- theme extension that can express Universo Maria colors and fonts without product-specific code in the DS
- low-risk replacements for `Button`, `Spinner`, `Skeleton`, `Card`, `Avatar`, `Tooltip`, and eventually `Drawer`
- a production-ready `SearchInput` because search is central to the app UX
- a generic `HorizontalScroller` or equivalent for category browsing, not a product-specific categories component
- a generic `EmptyState`, not only inline `Alert` or null `Empty`
- optional `IconLink` or action-link primitive for icon-only anchors
- a documented strategy for static Next rendering and CSS injection so DS layout primitives do not cause avoidable first-paint layout shifts

## Smallest pragmatic delta

### P0: Package and type contract

This is the first adoption blocker.

Work:

- Add declaration generation for library builds.
- Publish `.d.ts` for `.` / `./foundations` / `./ecosystem` / `./native`.
- Add `types` conditions to every package export.
- Either fix README examples to import components from `arbor-ds`, or intentionally add `./components`. Prefer fixing README first because root already represents components.
- Add a small consumer smoke test or fixture that imports from:
  - `arbor-ds`
  - `arbor-ds/foundations`
  - `arbor-ds/ecosystem`

Definition of done:

- `dist/components.d.ts`, `dist/foundations.d.ts`, `dist/ecosystem.d.ts`, and `dist/native.d.ts` exist.
- A strict TS consumer can import `Button`, `ArborProvider`, `createTheme`, and `themeDark` without implicit `any`.

### P1: Restore architectural boundaries enough for theming

This supports the restructuring plan and keeps the theme consumable as a foundation.

Work:

- Remove `foundations -> ecosystem` imports from `theme/base-theme.ts`.
- Remove `foundations -> ecosystem` imports from `theme/types.ts`.
- Make recipe config types pure data in `foundations`, or move recipe builder usage out of base theme construction.
- Keep `defineRecipe` / `defineSlotRecipe` as ecosystem runtime helpers, not a foundation dependency.

Definition of done:

- `src/foundations` can be imported without pulling `src/ecosystem`.
- Theme component config is serializable data.

### P2: Make the current quality gates viable

Current typecheck failures directly affect package reliability.

Observed failure groups:

- `IconProps` does not accept `style`, but `Button` and `Accordion` pass `style` into `Icon`.
- `IconName` is PascalCase from Lucide, while stories/tests use kebab/lowercase names such as `plus`, `home`, and `shopping-cart`.
- `SpinnerProps` extends `SVGAttributes<SVGSVGElement>`, but `Spinner` renders a `span`.
- Storybook stories with required `children` props miss `args`.
- Some unused locals/imports remain.

Work:

- Decide and document the icon name contract: PascalCase strict, or normalized user-facing names.
- Fix internal call sites and stories/tests to match that contract.
- Correct DOM prop types such as `SpinnerProps`.
- Make `IconProps` support valid SVG props needed by current components.

Definition of done:

- `pnpm.cmd exec tsc -p tsconfig.app.json --noEmit` passes or has only explicitly documented non-package story debt.

### P3: Theme for Universo Maria without product coupling

Do not add a `universo-maria` theme to the library. Add the contracts and docs that make it easy to build one in the app.

Work:

- Document a `createTheme(themeDark, ...)` mapping for:
  - `background.default = #0c0f1b`
  - `surface.default/raised = #14182a`
  - translucent panel color for module/search surfaces
  - `brand.base = #faac48`
  - category accent green as either `brand.subtle/soft` or a semantic `status`/`interactive` override
  - `fonts.sans = Clear Sans`
  - optional title recipe using League Spartan
- Ensure `theme.recipes.text` can express title/display variants with a distinct font family.
- Ensure button, input/search, card, chip/tag, drawer, and empty-state styling can be theme-driven instead of hardcoded.

Definition of done:

- A consumer can reproduce the current UM visual hierarchy without forking DS components.

### P4: Low-risk replacement components

These should be usable before larger UX migration.

Work:

- `Spinner`: fix prop typing, keep localized default label configurable.
- `Skeleton`: avoid DOM mutation during render; move keyframes/global animation to provider or an insertion-safe mechanism.
- `Button`: add the adoption conveniences needed by UM:
  - `fullWidth`
  - loading state already exists as `loading`; document local `isLoading -> loading` migration
  - clear variant mapping from local `outline` to DS `secondary` or future `outline`
- `Card`: keep compound API; ensure border radius/background/padding can match compact UM modules and profile cards.
- `Avatar`: suitable for profile images, but document that brand/product image behavior remains app-owned.
- `Tooltip`: acceptable for icon-only controls, but should expose typed slot props.

Definition of done:

- UM can replace local `Spinner`, `Skeleton`, and the "Ver mais" `Button` first with minimal visual regression.

### P5: Header/menu support

UM's header stays in the app, but DS should support its generic mechanics.

Work:

- Add an `IconLink` or action-link primitive for icon-only anchors.
- Keep brand social glyphs app-owned via `react-icons`; DS should not add brand icon packs now.
- Make `Drawer.Content` more composable:
  - custom width or `style`
  - support for left placement with compact width around 220px
  - themable translucent/glass surface if needed
  - explicit title/label contract

Definition of done:

- UM can keep its header markup but replace the custom fixed side nav mechanics with `Drawer`.

### P6: SearchInput as the first serious UX component

Search is the main workflow, so this should not be migrated until the DS component is mature.

Work:

- Replace textual hardcoded search icon with `Icon name="Search"`.
- Add `clearable`, `onClear`, `clearLabel`, and localized default labels.
- Keep `value`, `onChange`, and `onValueChange` fully controlled.
- Support pill/filled visual shape used by UM.
- Preserve keyboard and mobile behavior.
- Keep debounce in the app, not in DS.

Definition of done:

- UM `SearchBar` can become a thin wrapper around `SearchInput` without changing search behavior.

### P7: New generic layout/product-adjacent components

Add these only after package/types/theme/search are stable.

Work:

- `EmptyState`: visible centered state with icon, title/message, description, and action slots.
- `HorizontalScroller`: generic horizontal item strip for categories:
  - variable item width
  - optional selected value
  - optional nav buttons
  - accessible scroll region
  - no product category data
- `MediaCard` or `ListItem`: optional later. It can help `ProfileCard`, but should not block migration.
- `LoadingOverlay`/`Loadable`: optional later. UM can keep its local `Loadable` until the pattern repeats elsewhere.

Definition of done:

- UM can replace `Feedback` with `EmptyState` and `CategoriesCarousel` mechanics with `HorizontalScroller` while keeping domain data/rendering local.

### P8: Static Next rendering and layout safety

This is important before migrating page layout to DS primitives.

Work:

- Document current CSS injection behavior and SSR/static export tradeoffs.
- Decide whether to support SSR style extraction, a prehydrated stylesheet registry, or a constrained inline-style path for base primitives.
- Add a Next static-export smoke example before recommending broad use of `Box`, `Flex`, `Grid`, `Container`, and `Text` in app shell/layout.
- Fix `Container.maxWidth` key handling before recommending it for UM layout.

Definition of done:

- A statically exported Next page using Arbor layout primitives does not visibly shift or render unstyled during first paint.

## Migration order for Universo Maria

After P0 to P4 are done:

1. Add `ArborProvider` and a UM theme in `pages/_app.tsx`.
2. Replace local `Spinner`.
3. Replace local `Skeleton`.
4. Replace the "Ver mais" `Button`.
5. Compose `Module` with `Card` or `Box` only if static rendering/layout behavior is acceptable.
6. Replace icon-only tooltips/controls where useful.

After P5 and P6:

7. Move header side menu mechanics to `Drawer`.
8. Wrap `SearchBar` around DS `SearchInput`.

After P7:

9. Replace central empty/error `Feedback` with `EmptyState`.
10. Replace category slider mechanics with `HorizontalScroller`, while keeping category state and labels in UM.
11. Refactor `ProfileCard` internally using `Card`, `Avatar`, `Text`, and app-owned brand icons.

## What not to do

- Do not add Universo Maria-specific components to `arbor-ds`.
- Do not add the galaxy/star background to `arbor-ds`; it is product identity.
- Do not add brand icon packs only for this project.
- Do not migrate `ProfileCard`, `Header`, or `Footer` into the DS.
- Do not broaden cross-platform claims for web-only components just because UM only needs web.

## Validation performed

Command:

```bash
pnpm.cmd exec tsc -p tsconfig.app.json --noEmit
```

Result: failed.

Key blocker groups are listed in P2. This confirms that package type stabilization must precede adoption work in a strict TypeScript consumer.

