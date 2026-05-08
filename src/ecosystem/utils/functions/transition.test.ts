import { transition } from './transition';

describe('transition()', () => {
  it('retorna string CSS para uma prop com defaults', () => {
    expect(transition('opacity')).toBe('opacity 160ms cubic-bezier(0.16, 1, 0.3, 1)');
  });

  it('aceita duration personalizado', () => {
    expect(transition('color', 'fast')).toBe('color 120ms cubic-bezier(0.16, 1, 0.3, 1)');
  });

  it('aceita duration e easing personalizados', () => {
    expect(transition('transform', 'slow', 'decelerate')).toBe(
      'transform 240ms cubic-bezier(0.22, 1, 0.36, 1)',
    );
  });

  it('aceita array de props e retorna lista separada por vírgula', () => {
    expect(transition(['background-color', 'color'], 'fast', 'standard')).toBe(
      'background-color 120ms cubic-bezier(0.16, 1, 0.3, 1), color 120ms cubic-bezier(0.16, 1, 0.3, 1)',
    );
  });

  it('cobre todos os valores de duration', () => {
    expect(transition('opacity', 'instant')).toContain('50ms');
    expect(transition('opacity', 'fast')).toContain('120ms');
    expect(transition('opacity', 'normal')).toContain('160ms');
    expect(transition('opacity', 'slow')).toContain('240ms');
    expect(transition('opacity', 'slower')).toContain('500ms');
  });

  it('cobre todos os valores de easing', () => {
    expect(transition('opacity', 'normal', 'standard')).toContain('cubic-bezier(0.16, 1, 0.3, 1)');
    expect(transition('opacity', 'normal', 'decelerate')).toContain('cubic-bezier(0.22, 1, 0.36, 1)');
    expect(transition('opacity', 'normal', 'accelerate')).toContain('cubic-bezier(0.4, 0.0, 1, 1)');
    expect(transition('opacity', 'normal', 'sharp')).toContain('cubic-bezier(0.4, 0.0, 0.6, 1)');
  });
});
