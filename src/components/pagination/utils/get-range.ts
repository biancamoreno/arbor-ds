/**
 * Item exibido na lista de paginação. Páginas são `number`; os dois sentinelas
 * representam blocos comprimidos (ellipsis) antes ou depois do range central.
 * Separar `start` e `end` permite que o consumidor diferencie click handlers
 * (ex: pular para "boundary + 1" vs "boundary - 1").
 */
export type PaginationRangeItem = number | 'ellipsis-start' | 'ellipsis-end';

export type GetRangeOptions = {
  /** 1-indexed. */
  page: number;
  /** Total de páginas. */
  count: number;
  /** Páginas ao redor da current. Default `1`. */
  siblings?: number;
  /** Páginas fixas em cada extremidade (1ª e última). Default `1`. */
  boundaries?: number;
};

/**
 * Algoritmo padrão MUI/shadcn de range com ellipsis.
 *
 * Garante que o range completo (`boundary + ellipsis + siblings + current +
 * siblings + ellipsis + boundary`) seja exibido. Quando há overlap (poucas
 * páginas ou current perto da borda), expande para o intervalo contínuo em
 * vez de inserir ellipsis vazio.
 *
 * @example
 * getRange({ page: 5, count: 20, siblings: 1, boundaries: 1 })
 * // → [1, 'ellipsis-start', 4, 5, 6, 'ellipsis-end', 20]
 *
 * @example
 * getRange({ page: 1, count: 5 })
 * // → [1, 2, 3, 4, 5]   // sem ellipsis quando cabe
 */
export function getRange({
  page,
  count,
  siblings = 1,
  boundaries = 1,
}: GetRangeOptions): PaginationRangeItem[] {
  if (count <= 0) return [];
  const clampedPage = Math.max(1, Math.min(page, count));

  // Itens totais visíveis quando há ellipsis dos dois lados:
  // boundaries + ellipsis-start + siblings + current + siblings + ellipsis-end + boundaries
  const totalItems = boundaries * 2 + siblings * 2 + 3;

  if (count <= totalItems) {
    return range(1, count);
  }

  const leftSiblingStart  = Math.max(clampedPage - siblings, boundaries + 1);
  const rightSiblingEnd   = Math.min(clampedPage + siblings, count - boundaries);

  const showLeftEllipsis  = leftSiblingStart > boundaries + 2;
  const showRightEllipsis = rightSiblingEnd  < count - boundaries - 1;

  const items: PaginationRangeItem[] = [];

  // Boundary inicial.
  items.push(...range(1, boundaries));

  if (!showLeftEllipsis) {
    // Expande o range esquerdo: junta boundary + segmento central.
    items.push(...range(boundaries + 1, leftSiblingStart - 1));
  } else {
    items.push('ellipsis-start');
  }

  items.push(...range(leftSiblingStart, rightSiblingEnd));

  if (!showRightEllipsis) {
    items.push(...range(rightSiblingEnd + 1, count - boundaries));
  } else {
    items.push('ellipsis-end');
  }

  // Boundary final.
  items.push(...range(count - boundaries + 1, count));

  return items;
}

function range(start: number, end: number): number[] {
  if (end < start) return [];
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}
