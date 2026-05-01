import { useRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DismissableLayer } from '../dismissable-layer/dismissable-layer';

describe('DismissableLayer', () => {
  it('calls onDismiss on Escape key', () => {
    const onDismiss = jest.fn();
    render(
      <DismissableLayer onDismiss={onDismiss}>
        <div>content</div>
      </DismissableLayer>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss on pointer down outside layer', () => {
    const onDismiss = jest.fn();
    render(
      <div data-testid="outside">
        <DismissableLayer onDismiss={onDismiss}>
          <div data-testid="inside">content</div>
        </DismissableLayer>
      </div>,
    );
    fireEvent.pointerDown(screen.getByTestId('outside'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not call onDismiss on pointer down inside layer', () => {
    const onDismiss = jest.fn();
    render(
      <DismissableLayer onDismiss={onDismiss}>
        <div data-testid="inside">content</div>
      </DismissableLayer>,
    );
    fireEvent.pointerDown(screen.getByTestId('inside'));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('does not call onDismiss on Escape when disableEscapeKey=true', () => {
    const onDismiss = jest.fn();
    render(
      <DismissableLayer onDismiss={onDismiss} disableEscapeKey>
        <div>content</div>
      </DismissableLayer>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('does not call onDismiss on outside click when disableOutsideClick=true', () => {
    const onDismiss = jest.fn();
    render(
      <div data-testid="outside">
        <DismissableLayer onDismiss={onDismiss} disableOutsideClick>
          <div>content</div>
        </DismissableLayer>
      </div>,
    );
    fireEvent.pointerDown(screen.getByTestId('outside'));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('does not call onDismiss on pointer down inside excludeRef', () => {
    const onDismiss = jest.fn();
    function Subject() {
      const triggerRef = useRef<HTMLButtonElement>(null);
      return (
        <div>
          <button ref={triggerRef} data-testid="trigger">
            trigger
          </button>
          <DismissableLayer onDismiss={onDismiss} excludeRef={triggerRef}>
            <div>content</div>
          </DismissableLayer>
        </div>
      );
    }
    render(<Subject />);
    fireEvent.pointerDown(screen.getByTestId('trigger'));
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
