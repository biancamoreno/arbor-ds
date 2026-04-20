import { render, screen, fireEvent } from '@testing-library/react';
import { FocusScope } from '../focus-scope/focus-scope';

describe('FocusScope', () => {
  it('auto focuses first focusable element when autoFocus=true', () => {
    render(
      <FocusScope autoFocus>
        <button data-testid="first">first</button>
        <button data-testid="second">second</button>
      </FocusScope>,
    );
    expect(document.activeElement).toBe(screen.getByTestId('first'));
  });

  it('traps Tab from last element back to first when trapped=true', () => {
    render(
      <FocusScope trapped>
        <button data-testid="first">first</button>
        <button data-testid="last">last</button>
      </FocusScope>,
    );

    screen.getByTestId('last').focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });
    expect(document.activeElement).toBe(screen.getByTestId('first'));
  });

  it('traps Shift+Tab from first element back to last when trapped=true', () => {
    render(
      <FocusScope trapped>
        <button data-testid="first">first</button>
        <button data-testid="last">last</button>
      </FocusScope>,
    );

    screen.getByTestId('first').focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(screen.getByTestId('last'));
  });

  it('restores focus to previous element on unmount when restoreFocus=true', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const { unmount } = render(
      <FocusScope restoreFocus>
        <button>inner</button>
      </FocusScope>,
    );

    unmount();
    expect(document.activeElement).toBe(trigger);
    document.body.removeChild(trigger);
  });

  it('does not trap focus when trapped=false', () => {
    render(
      <FocusScope>
        <button data-testid="only">only</button>
      </FocusScope>,
    );

    screen.getByTestId('only').focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).not.toBeNull();
  });
});
