import { transition } from './transition';

describe('transition()', () => {
  it('retorna string CSS para uma prop com defaults', () => {
    expect(transition('opacity')).toBe('opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)');
  });

  it('aceita duration personalizado', () => {
    expect(transition('color', 'fast')).toBe('color 100ms cubic-bezier(0.4, 0.0, 0.2, 1)');
  });

  it('aceita duration e easing personalizados', () => {
    expect(transition('transform', 'slow', 'decelerate')).toBe(
      'transform 300ms cubic-bezier(0.0, 0.0, 0.2, 1)',
    );
  });

  it('aceita array de props e retorna lista separada por vírgula', () => {
    expect(transition(['background-color', 'color'], 'fast', 'standard')).toBe(
      'background-color 100ms cubic-bezier(0.4, 0.0, 0.2, 1), color 100ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    );
  });

  it('cobre todos os valores de duration', () => {
    expect(transition('opacity', 'instant')).toContain('50ms');
    expect(transition('opacity', 'fast')).toContain('100ms');
    expect(transition('opacity', 'normal')).toContain('200ms');
    expect(transition('opacity', 'slow')).toContain('300ms');
    expect(transition('opacity', 'slower')).toContain('500ms');
  });

  it('cobre todos os valores de easing', () => {
    expect(transition('opacity', 'normal', 'standard')).toContain('cubic-bezier(0.4, 0.0, 0.2, 1)');
    expect(transition('opacity', 'normal', 'decelerate')).toContain('cubic-bezier(0.0, 0.0, 0.2, 1)');
    expect(transition('opacity', 'normal', 'accelerate')).toContain('cubic-bezier(0.4, 0.0, 1, 1)');
    expect(transition('opacity', 'normal', 'sharp')).toContain('cubic-bezier(0.4, 0.0, 0.6, 1)');
  });
});
