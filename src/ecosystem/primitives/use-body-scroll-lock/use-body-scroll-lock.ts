import { useEffect } from 'react';

/**
 * @platform web
 *
 * Trava o scroll do `<body>` enquanto algum overlay modal está aberto. Mecânica:
 * - salva o valor original de `overflow` antes de aplicar `hidden`;
 * - restaura no cleanup;
 * - conta referências para suportar múltiplos overlays simultâneos sem
 *   conflito (último a fechar restaura).
 *
 * Consumido por Dialog, Drawer e qualquer outro overlay modal que precise
 * impedir scroll de fundo enquanto aberto.
 *
 * Em ambiente sem `document` (SSR) é no-op silencioso.
 */
let lockCount = 0;
let originalOverflow: string | null = null;

export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    if (typeof document === 'undefined' || !document.body) return;

    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0 && document.body) {
        document.body.style.overflow = originalOverflow ?? '';
        originalOverflow = null;
      }
    };
  }, [active]);
}
