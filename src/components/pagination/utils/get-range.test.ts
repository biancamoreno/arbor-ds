import { getRange } from './get-range';

describe('getRange', () => {
  it('retorna [] quando count <= 0', () => {
    expect(getRange({ page: 1, count: 0 })).toEqual([]);
  });

  it('retorna intervalo completo sem ellipsis quando cabe', () => {
    expect(getRange({ page: 1, count: 5 })).toEqual([1, 2, 3, 4, 5]);
    expect(getRange({ page: 3, count: 7, siblings: 1, boundaries: 1 })).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('insere ellipsis em ambos os lados quando current está no meio', () => {
    expect(getRange({ page: 10, count: 20, siblings: 1, boundaries: 1 })).toEqual([
      1, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 20,
    ]);
  });

  it('expande à esquerda quando current está perto do início', () => {
    expect(getRange({ page: 2, count: 20, siblings: 1, boundaries: 1 })).toEqual([
      1, 2, 3, 'ellipsis-end', 20,
    ]);
  });

  it('expande à direita quando current está perto do fim', () => {
    expect(getRange({ page: 19, count: 20, siblings: 1, boundaries: 1 })).toEqual([
      1, 'ellipsis-start', 18, 19, 20,
    ]);
  });

  it('respeita siblings maior', () => {
    expect(getRange({ page: 10, count: 20, siblings: 2, boundaries: 1 })).toEqual([
      1, 'ellipsis-start', 8, 9, 10, 11, 12, 'ellipsis-end', 20,
    ]);
  });

  it('respeita boundaries maior', () => {
    expect(getRange({ page: 10, count: 20, siblings: 1, boundaries: 2 })).toEqual([
      1, 2, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 19, 20,
    ]);
  });

  it('clampa page fora do range', () => {
    expect(getRange({ page: 99, count: 5 })).toEqual([1, 2, 3, 4, 5]);
    expect(getRange({ page: -1, count: 5 })).toEqual([1, 2, 3, 4, 5]);
  });
});
