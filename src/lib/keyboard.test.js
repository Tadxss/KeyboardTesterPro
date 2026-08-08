import { describe, expect, it, vi } from 'vitest';
import {
  buildExportPayload,
  buildKeyboardLayouts,
  buildSpecialKeys,
  downloadJson,
  formatTime,
  getKeyClassName,
  getKeyDisplay,
  getKeyWidth,
  normalizeKeyDown,
  normalizeKeyUp,
} from './keyboard';

describe('buildKeyboardLayouts', () => {
  it('labels the modifier row for Mac', () => {
    const { qwerty } = buildKeyboardLayouts(true);
    expect(qwerty[4]).toEqual(['Ctrl', 'Option', 'Space', 'Cmd', 'Option', 'Ctrl']);
  });

  it('labels the modifier row for Windows/Linux', () => {
    const { qwerty } = buildKeyboardLayouts(false);
    expect(qwerty[4]).toEqual(['Ctrl', 'Alt', 'Space', 'Win', 'Alt', 'Ctrl']);
  });

  it('includes a numpad layout regardless of platform', () => {
    const { numpad } = buildKeyboardLayouts(false);
    expect(numpad[0]).toEqual(['NumLock', '/', '*', '-']);
  });
});

describe('buildSpecialKeys', () => {
  it('maps Meta/Alt to Mac labels', () => {
    const specialKeys = buildSpecialKeys(true);
    expect(specialKeys.Meta).toBe('Cmd');
    expect(specialKeys.Alt).toBe('Option');
  });

  it('maps Meta/Alt to Windows labels', () => {
    const specialKeys = buildSpecialKeys(false);
    expect(specialKeys.Meta).toBe('Win');
    expect(specialKeys.Alt).toBe('Alt');
  });

  it('maps arrow keys to glyphs on both platforms', () => {
    expect(buildSpecialKeys(true).ArrowUp).toBe('↑');
    expect(buildSpecialKeys(false).ArrowUp).toBe('↑');
  });
});

describe('getKeyDisplay', () => {
  it('returns the mapped glyph when present', () => {
    expect(getKeyDisplay('Enter', buildSpecialKeys(false))).toBe('⏎');
  });

  it('falls back to the raw key when unmapped', () => {
    expect(getKeyDisplay('A', buildSpecialKeys(false))).toBe('A');
  });
});

describe('normalizeKeyDown', () => {
  it('normalizes Meta to Cmd on Mac', () => {
    const { normalizedKey, displayKey } = normalizeKeyDown(
      { key: 'Meta', code: 'MetaLeft' },
      true,
      buildSpecialKeys(true)
    );
    expect(normalizedKey).toBe('Cmd');
    expect(displayKey).toBe('Cmd');
  });

  it('normalizes Meta to Win on Windows/Linux', () => {
    const { normalizedKey } = normalizeKeyDown(
      { key: 'Meta', code: 'MetaLeft' },
      false,
      buildSpecialKeys(false)
    );
    expect(normalizedKey).toBe('Win');
  });

  it('normalizes the space bar to "Space"', () => {
    const { normalizedKey } = normalizeKeyDown(
      { key: ' ', code: 'Space' },
      false,
      buildSpecialKeys(false)
    );
    expect(normalizedKey).toBe('Space');
  });

  it('flags numpad codes and strips the "Numpad" prefix', () => {
    const specialKeys = buildSpecialKeys(false);
    const { normalizedKey, displayKey, isNumpad } = normalizeKeyDown(
      { key: '7', code: 'Numpad7' },
      false,
      specialKeys
    );
    expect(isNumpad).toBe(true);
    expect(normalizedKey).toBe('7');
    expect(displayKey).toBe('7');
  });
});

describe('normalizeKeyUp', () => {
  it('normalizes Control to Ctrl on both platforms', () => {
    expect(normalizeKeyUp({ key: 'Control', code: 'ControlLeft' }, true)).toBe('Ctrl');
    expect(normalizeKeyUp({ key: 'Control', code: 'ControlLeft' }, false)).toBe('Ctrl');
  });

  it('strips the Numpad prefix from the code', () => {
    expect(normalizeKeyUp({ key: '5', code: 'Numpad5' }, false)).toBe('5');
  });
});

describe('getKeyClassName', () => {
  it('applies the pressed style when the key is in the pressed set', () => {
    const className = getKeyClassName('A', new Set(['A']), false);
    expect(className).toContain('bg-emerald-500');
  });

  it('applies the default style when the key is not pressed', () => {
    const className = getKeyClassName('A', new Set(), false);
    expect(className).toContain('bg-slate-700');
  });

  it('matches Mac Cmd variants regardless of which alias is pressed', () => {
    const className = getKeyClassName('Cmd', new Set(['Meta']), true);
    expect(className).toContain('bg-emerald-500');
  });
});

describe('getKeyWidth', () => {
  it('gives Space a wide class', () => {
    expect(getKeyWidth('Space', false)).toBe('w-96');
  });

  it('widens "0" only when the numpad is shown', () => {
    expect(getKeyWidth('0', true)).toBe('w-24');
    expect(getKeyWidth('0', false)).toBe('w-12');
  });
});

describe('formatTime', () => {
  it('formats milliseconds as mm:ss', () => {
    expect(formatTime(65000)).toBe('01:05');
  });

  it('pads single-digit values', () => {
    expect(formatTime(5000)).toBe('00:05');
  });
});

describe('buildExportPayload', () => {
  it('includes the total key count derived from history length', () => {
    const payload = buildExportPayload({
      testMode: 'pro',
      elapsedTime: 1000,
      keyHistory: [{ key: 'a' }, { key: 'b' }],
      keyStats: {},
    });
    expect(payload.totalKeys).toBe(2);
    expect(payload.testMode).toBe('pro');
  });
});

describe('downloadJson', () => {
  it('creates an object URL, triggers a click, and revokes the URL', () => {
    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();
    globalThis.URL.createObjectURL = createObjectURL;
    globalThis.URL.revokeObjectURL = revokeObjectURL;

    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = (tag) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') el.click = clickSpy;
      return el;
    };

    downloadJson('{"a":1}', 'result.json');

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock');

    document.createElement = originalCreateElement;
  });
});
