import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useKeyboardTester } from './useKeyboardTester';

function dispatchKeyDown(key, code = key) {
  window.dispatchEvent(
    new KeyboardEvent('keydown', { key, code, bubbles: true, cancelable: true })
  );
}

function dispatchKeyUp(key, code = key) {
  window.dispatchEvent(new KeyboardEvent('keyup', { key, code, bubbles: true, cancelable: true }));
}

describe('useKeyboardTester', () => {
  beforeEach(() => {
    Object.defineProperty(window.navigator, 'platform', { value: 'Win32', configurable: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('lights up a key on keydown and clears it after the highlight duration', async () => {
    const { result } = renderHook(() => useKeyboardTester(true));

    act(() => dispatchKeyDown('a', 'KeyA'));
    expect(result.current.pressedKeys.has('a')).toBe(true);

    await waitFor(() => expect(result.current.pressedKeys.has('a')).toBe(false));
  });

  it('removes the key from pressedKeys on keyup', () => {
    const { result } = renderHook(() => useKeyboardTester(true));

    act(() => dispatchKeyDown('a', 'KeyA'));
    expect(result.current.pressedKeys.has('a')).toBe(true);

    act(() => dispatchKeyUp('a', 'KeyA'));
    expect(result.current.pressedKeys.has('a')).toBe(false);
  });

  it('does not capture key events when inactive (e.g. contact modal open)', () => {
    const { result } = renderHook(() => useKeyboardTester(false));
    act(() => dispatchKeyDown('a', 'KeyA'));
    expect(result.current.pressedKeys.size).toBe(0);
  });

  it('does not record history or stats in basic mode', () => {
    const { result } = renderHook(() => useKeyboardTester(true));
    act(() => result.current.startRecording());
    act(() => dispatchKeyDown('a', 'KeyA'));

    expect(result.current.keyHistory).toHaveLength(0);
    expect(result.current.keyStats).toEqual({});
  });

  it('records history and stats in pro mode while recording', () => {
    const { result } = renderHook(() => useKeyboardTester(true));
    act(() => result.current.selectTestMode('pro'));
    act(() => result.current.startRecording());
    act(() => dispatchKeyDown('a', 'KeyA'));

    expect(result.current.keyHistory).toHaveLength(1);
    expect(result.current.keyStats.a.count).toBe(1);
  });

  it('does not record when pro mode is selected but recording has not started', () => {
    const { result } = renderHook(() => useKeyboardTester(true));
    act(() => result.current.selectTestMode('pro'));
    act(() => dispatchKeyDown('a', 'KeyA'));

    expect(result.current.keyHistory).toHaveLength(0);
  });

  it('resets all test state', () => {
    const { result } = renderHook(() => useKeyboardTester(true));
    act(() => result.current.selectTestMode('pro'));
    act(() => result.current.startRecording());
    act(() => dispatchKeyDown('a', 'KeyA'));

    act(() => result.current.resetTest());

    expect(result.current.isRecording).toBe(false);
    expect(result.current.keyHistory).toHaveLength(0);
    expect(result.current.keyStats).toEqual({});
    expect(result.current.pressedKeys.size).toBe(0);
  });

  it('toggles the numpad visibility', () => {
    const { result } = renderHook(() => useKeyboardTester(true));
    expect(result.current.showNumpad).toBe(false);
    act(() => result.current.toggleNumpad());
    expect(result.current.showNumpad).toBe(true);
  });
});
