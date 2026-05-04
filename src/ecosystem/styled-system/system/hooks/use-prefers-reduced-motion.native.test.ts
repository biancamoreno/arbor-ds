import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { usePrefersReducedMotion } from './use-prefers-reduced-motion.native';

describe('usePrefersReducedMotion (native)', () => {
  let listeners: Array<(v: boolean) => void> = [];
  const removeMock = jest.fn();

  beforeEach(() => {
    listeners = [];
    removeMock.mockClear();
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockImplementation(((event: string, handler: (v: boolean) => void) => {
        if (event === 'reduceMotionChanged') {
          listeners.push(handler);
        }
        return { remove: removeMock };
      }) as unknown as typeof AccessibilityInfo.addEventListener);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('retorna false por default quando reduce motion está desativado', async () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    await waitFor(() => expect(result.current).toBe(false));
  });

  it('retorna true quando AccessibilityInfo.isReduceMotionEnabled resolve true', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    await waitFor(() => expect(result.current).toBe(true));
  });

  it('reage a "reduceMotionChanged" em runtime', async () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    await waitFor(() => expect(result.current).toBe(false));

    act(() => {
      listeners.forEach((cb) => cb(true));
    });
    expect(result.current).toBe(true);

    act(() => {
      listeners.forEach((cb) => cb(false));
    });
    expect(result.current).toBe(false);
  });

  it('remove listener no unmount', async () => {
    const { unmount } = renderHook(() => usePrefersReducedMotion());
    await waitFor(() => expect(listeners.length).toBe(1));
    unmount();
    expect(removeMock).toHaveBeenCalled();
  });
});
