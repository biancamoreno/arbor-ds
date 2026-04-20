import { render, screen } from '@testing-library/react';
import { Portal } from '../portal/portal';

describe('Portal', () => {
  it('renders children in document.body by default', () => {
    render(<Portal><div data-testid="portal-child">content</div></Portal>);
    expect(document.body.contains(screen.getByTestId('portal-child'))).toBe(true);
  });

  it('renders children in a custom container', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    render(
      <Portal container={container}>
        <div data-testid="custom-child">content</div>
      </Portal>,
    );

    expect(container.contains(screen.getByTestId('custom-child'))).toBe(true);
    document.body.removeChild(container);
  });

  it('renders children outside the component tree parent', () => {
    const { container: renderContainer } = render(
      <div data-testid="parent">
        <Portal>
          <div data-testid="portal-child">teleported</div>
        </Portal>
      </div>,
    );

    const parent = screen.getByTestId('parent');
    const child = screen.getByTestId('portal-child');

    expect(parent.contains(child)).toBe(false);
    expect(document.body.contains(child)).toBe(true);
    expect(document.body.contains(renderContainer)).toBe(true);
  });
});
