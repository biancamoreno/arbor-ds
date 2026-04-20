import { render, screen, act } from '@testing-library/react';
import { Presence } from '../presence/presence';

describe('Presence', () => {
  it('mounts children when present=true', () => {
    render(
      <Presence present>
        <div data-testid="content">hello</div>
      </Presence>,
    );
    expect(screen.getByTestId('content')).toBeTruthy();
  });

  it('does not mount children when present=false', () => {
    render(
      <Presence present={false}>
        <div data-testid="content">hello</div>
      </Presence>,
    );
    expect(screen.queryByTestId('content')).toBeNull();
  });

  it('unmounts immediately when present becomes false and no animation', () => {
    const { rerender } = render(
      <Presence present>
        <div data-testid="content">hello</div>
      </Presence>,
    );

    act(() => {
      rerender(
        <Presence present={false}>
          <div data-testid="content">hello</div>
        </Presence>,
      );
    });

    expect(screen.queryByTestId('content')).toBeNull();
  });

  it('stays mounted during exit animation and unmounts after animationend', () => {
    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      animationName: 'fadeOut',
      animationDuration: '0.3s',
    } as CSSStyleDeclaration);

    const { rerender } = render(
      <Presence present>
        <div data-testid="content">hello</div>
      </Presence>,
    );

    act(() => {
      rerender(
        <Presence present={false}>
          <div data-testid="content">hello</div>
        </Presence>,
      );
    });

    const node = screen.getByTestId('content');
    expect(node).toBeTruthy();

    act(() => {
      node.dispatchEvent(new Event('animationend'));
    });

    expect(screen.queryByTestId('content')).toBeNull();

    jest.restoreAllMocks();
  });
});
