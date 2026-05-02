import { render } from '@testing-library/react';
import { Icon } from './icon';

describe('Icon', () => {
  it('renders svg for a valid name', () => {
    const { container } = render(<Icon name="Check" />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('returns null for an invalid name', () => {
    const { container } = render(<Icon name={'NonExistentIcon1234' as never} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies aria-hidden when decorative (default)', () => {
    const { container } = render(<Icon name="Check" decorative />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies aria-hidden when decorative is omitted (default behavior)', () => {
    const { container } = render(<Icon name="Check" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('does not apply aria-hidden when not decorative', () => {
    const { container } = render(<Icon name="Check" decorative={false} aria-label="Check icon" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBeNull();
  });

  it('applies aria-label when decorative=false', () => {
    const { container } = render(<Icon name="Check" decorative={false} aria-label="Confirmar" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-label')).toBe('Confirmar');
  });

  it('resolves semantic size token "md" to 20px (default)', () => {
    const { container } = render(<Icon name="Check" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('20');
    expect(svg?.getAttribute('height')).toBe('20');
  });

  it('resolves semantic size token "xs" to 12px', () => {
    const { container } = render(<Icon name="Check" size="xsmall" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('12');
  });

  it('resolves semantic size token "hero" to 48px', () => {
    const { container } = render(<Icon name="Check" size="hero" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('48');
  });

  it('aceita number como escape hatch para size', () => {
    const { container } = render(<Icon name="Check" size={32} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('32');
    expect(svg?.getAttribute('height')).toBe('32');
  });

  it('propagates color prop', () => {
    const { container } = render(<Icon name="Check" color="#ff0000" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('stroke')).toBe('#ff0000');
  });

  it('propagates strokeWidth prop', () => {
    const { container } = render(<Icon name="Check" strokeWidth={2} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('stroke-width')).toBe('2');
  });

  it('renders a different icon by name', () => {
    const { container: c1 } = render(<Icon name="Check" />);
    const { container: c2 } = render(<Icon name="X" />);
    const svg1 = c1.querySelector('svg')?.innerHTML;
    const svg2 = c2.querySelector('svg')?.innerHTML;
    expect(svg1).not.toBe(svg2);
  });
});
