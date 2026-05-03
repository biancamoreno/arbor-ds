import { systemBlockForwardProp } from './system';

describe('systemBlockForwardProp', () => {
  it('forwarda HTML attributes arbitrários no web', () => {
    expect(systemBlockForwardProp('aria-label', 'web')).toBe(true);
    expect(systemBlockForwardProp('id', 'web')).toBe(true);
    expect(systemBlockForwardProp('tabIndex', 'web')).toBe(true);
  });

  it('bloqueia style props no web', () => {
    expect(systemBlockForwardProp('padding', 'web')).toBe(false);
    expect(systemBlockForwardProp('backgroundColor', 'web')).toBe(false);
  });

  it('inert é forwarded no web (HTML Baseline 2024)', () => {
    expect(systemBlockForwardProp('inert', 'web')).toBe(true);
  });

  it('inert é bloqueado no native (atributo HTML sem equivalente em View)', () => {
    expect(systemBlockForwardProp('inert', 'native')).toBe(false);
  });

  it('accessibilityElementsHidden é bloqueado no web mas forwarded no native', () => {
    expect(systemBlockForwardProp('accessibilityElementsHidden', 'web')).toBe(false);
    expect(systemBlockForwardProp('accessibilityElementsHidden', 'native')).toBe(true);
  });
});
