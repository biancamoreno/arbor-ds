import { render } from '@testing-library/react';
import { Icon } from './icon';

const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

afterEach(() => consoleSpy.mockClear());
afterAll(() => consoleSpy.mockRestore());

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

  it('warns in dev when decorative=false and aria-label is missing', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    render(<Icon name="Check" decorative={false} />);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('decorative=false requires aria-label'),
    );
    process.env.NODE_ENV = originalEnv;
  });

  it('propagates size prop', () => {
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
