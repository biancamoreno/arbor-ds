import { useEffect } from 'react';

/**
 * Salva o foco atual no mount e o restaura no unmount — sem injetar elemento
 * extra no DOM. Diferente de `<FocusScope restoreFocus>`, que envolve children
 * num `<div tabIndex={-1}>` (quebra a árvore semântica de `role="menu"`,
 * `role="listbox"`, etc.).
 *
 * Use quando precisar de "voltar o foco para onde estava" sem adicionar
 * wrapper visual ou semântico.
 *
 * @example
 * function Menu() {
 *   useRestoreFocus();
 *   return <div role="menu">{children}</div>;
 * }
 */
export function useRestoreFocus(active: boolean = true): void {
  useEffect(() => {
    if (!active) return;
    const saved = document.activeElement as HTMLElement | null;
    return () => {
      saved?.focus?.();
    };
  }, [active]);
}
