import { renderHook, act } from '@testing-library/react-native';
import { useControllableState } from '../use-controllable-state';

describe('useControllableState', () => {
  it('uncontrolled: starts with defaultValue', () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 'initial' }),
    );
    expect(result.current[0]).toBe('initial');
  });

  it('uncontrolled: updates internal state on setValue', () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 'a' }),
    );
    act(() => result.current[1]('b'));
    expect(result.current[0]).toBe('b');
  });

  it('controlled: uses provided value and ignores setter for state', () => {
    const { result } = renderHook(() =>
      useControllableState({ value: 'controlled', defaultValue: 'default' }),
    );
    expect(result.current[0]).toBe('controlled');
    act(() => result.current[1]('new'));
    expect(result.current[0]).toBe('controlled');
  });

  it('calls onChange in uncontrolled mode', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 'a', onChange }),
    );
    act(() => result.current[1]('b'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('calls onChange in controlled mode', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useControllableState({ value: 'x', defaultValue: 'a', onChange }),
    );
    act(() => result.current[1]('y'));
    expect(onChange).toHaveBeenCalledWith('y');
  });
});
