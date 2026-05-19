# RFC-0037 — Accordion: API canônica + slot recipe

**Status**: **Draft (2026-05-03)**
**Autores**: arbor-ds-arch
**Data**: 2026-05-03
**Origem**: review R9 (achados AC-Mod-1/2/3, AC-A11y-1/2, AC-Style-1/2/3, AC-Bug-1).

---

## Motivação

Hoje:

```ts
// AccordionProps.ts
interface AccordionRootProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}
```

Quatro problemas:

1. **`value: string | string[]` independente de `type`** (AC-Mod-1) — anti-pattern já normado pela RFC-0033 (Chip-Selectable). Consumidor recebe união e força narrowing.
2. **`extends HTMLAttributes<HTMLDivElement>` / `extends ButtonHTMLAttributes`** em interface `@platform shared` (AC-Mod-2). TD-028.
3. **JSDoc promete `Home`/`End` que não existe** (AC-A11y-1). Só `ArrowUp`/`ArrowDown` implementados.
4. **`@platform native-ready`** (AC-Mod-3) — tag não-canônica.

E meta-problemas:

5. Sem slot recipe — todo styling vive no componente (AC-Style-1/2 + R9-P8).
6. Bug de ordem em `getSortedKeys` (AC-Bug-1) — Map-based registry retorna ordem de registro, não DOM. Itens condicionais quebram a navegação.
7. `aria-disabled` ausente quando `disabled` (AC-A11y-2) — pattern R6 estabelecido.

---

## Proposta

### 1. Discriminated union por `type`

```ts
// AccordionProps.ts
import type { ReactNode, CSSProperties } from 'react';

interface AccordionRootCommonProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

type AccordionRootProps =
  | (AccordionRootCommonProps & {
      type?: 'single';
      value?: string;
      defaultValue?: string;
      onValueChange?: (value: string) => void;
      collapsible?: boolean;          // permite fechar item ativo (single)
    })
  | (AccordionRootCommonProps & {
      type: 'multiple';
      value?: string[];
      defaultValue?: string[];
      onValueChange?: (value: string[]) => void;
    });

interface AccordionItemProps {
  children: ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface AccordionTriggerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

interface AccordionContentProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}
```

**Sem** `HTMLAttributes` / `ButtonHTMLAttributes`. Surface area cross-platform pura.

### 2. Slot recipe

```ts
defineSlotRecipe({
  className: 'accordion',
  slots: ['root', 'item', 'trigger', 'triggerIcon', 'content', 'contentInner'],
  base: {
    root: {
      flexDirection: 'column',
      borderRadius: 'small',
      borderWidth: 1,
      borderColor: 'border.subtle',
      overflow: 'hidden',
    },
    item: {
      borderBottomWidth: 1,
      borderBottomColor: 'border.subtle',
      _last: { borderBottomWidth: 0 },
    },
    trigger: {
      width: '100%',
      paddingX: 'medium',
      paddingY: 'small',
      backgroundColor: 'transparent',
      textAlign: 'left',
      fontWeight: 'medium',
      fontSize: 'small',
      color: 'text.primary',
      cursor: 'pointer',
      transition: '…', // tokens motion
      _disabled: { color: 'text.disabled', cursor: 'not-allowed' },
      _hover: { backgroundColor: 'background.subtle' },
    },
    triggerIcon: {
      transition: '…',
      flexShrink: 0,
    },
    content: {
      display: 'grid',
      overflow: 'hidden',
      gridTemplateRows: '0fr',
      transition: '…',
      _open: { gridTemplateRows: '1fr' },
    },
    contentInner: {
      paddingX: 'medium',
      paddingBottom: 'medium',
    },
  },
});
```

Native versão (`accordion.native.tsx`) consome o mesmo recipe; render do `content` muda (sem CSS grid — `if (!open) return null` + `Animated.height` opcional).

### 3. Home/End teclado (web)

```ts
const handleKeyDown = (e) => {
  if (e.key === 'ArrowDown') { e.preventDefault(); focusNext(value); }
  if (e.key === 'ArrowUp')   { e.preventDefault(); focusPrev(value); }
  if (e.key === 'Home')      { e.preventDefault(); focusFirst(); }
  if (e.key === 'End')       { e.preventDefault(); focusLast(); }
};
```

JSDoc deixa de mentir.

### 4. Ordem do registry: DOM, não registro

```ts
const getSortedKeys = () => {
  const keys = Array.from(triggerRefs.current.keys());
  return keys.sort((a, b) => {
    const refA = triggerRefs.current.get(a)?.current;
    const refB = triggerRefs.current.get(b)?.current;
    if (!refA || !refB) return 0;
    const pos = refA.compareDocumentPosition(refB);
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });
};
```

Custo: O(n log n) por keystroke; n é número de items abertos visíveis (pequeno). Vale a corretude.

### 5. `aria-disabled` redundante

`Clickable` web já encaminha `disabled` para HTML; adicionar `aria-disabled={disabled || undefined}` no Trigger garante anúncio em SR que ignoram `disabled` em `<button>`.

### 6. Limpeza

- `style={{ background: 'none', border: 'none', textAlign: 'left' }}` no Trigger → recipe.
- `style={{ color, fontSize, fontWeight }}` em `accordion.native.tsx` Trigger → recipe + props.
- Tag `@platform native-ready` → `shared`.

---

## Plano de execução

**PR único:**
1. Slot recipe `accordion` em `base-theme`.
2. Atualizar interfaces (discriminated union, sem `HTMLAttributes`/`ButtonHTMLAttributes`, tag `shared`).
3. Reescrever `accordion.tsx` consumindo recipe + Home/End + DOM-order registry + `aria-disabled`.
4. Reescrever `accordion.native.tsx` consumindo recipe.
5. Atualizar context para tipos derivados de discriminated union.
6. Atualizar testes (cobrir Home/End, DOM-order com items condicionais).
7. CONTRIBUTING §Accordion.

---

## Riscos / Trade-offs

| Risco | Mitigação |
|---|---|
| Discriminated union quebra consumidores que usavam `value` polimórfico | Pre-v1; precedente TD-012 |
| `compareDocumentPosition` é DOM-only; native usa Map insertion order | Documentar diferença; em RN trigger registry segue ordem de mount (alinhada à ordem visual em maioria dos casos) |
| Recipe `_open` em CSS grid via `data-state` requer engine entendendo state | Pattern já existente (recipes de Switch/Checkbox); reutilizar |

---

## Critérios de aceite

- [ ] Discriminated union por `type` no `AccordionRootProps`.
- [ ] Interfaces sem `HTMLAttributes`/`ButtonHTMLAttributes`.
- [ ] Slot recipe `accordion` declarado e themable.
- [ ] Home/End teclado implementado (web).
- [ ] DOM-order registry com items condicionais.
- [ ] `aria-disabled` em Trigger quando `disabled`.
- [ ] Tag interface `@platform shared`.
- [ ] `style={{}}` zerado em `accordion.tsx` e `accordion.native.tsx`.
- [ ] Bateria verde (web + native).

---

## Dependências

- Independente das outras RFCs R9.
- Fecha parcialmente **TD-028** (escopo Accordion).
