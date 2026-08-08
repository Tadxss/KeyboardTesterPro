export function getIsMac() {
  return navigator.platform.includes('Mac');
}

export function buildKeyboardLayouts(isMac) {
  return {
    qwerty: [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
      ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
      ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
      [
        'Ctrl',
        isMac ? 'Option' : 'Alt',
        'Space',
        isMac ? 'Cmd' : 'Win',
        isMac ? 'Option' : 'Alt',
        'Ctrl',
      ],
      ['ArrowUp'],
      ['ArrowLeft', 'ArrowDown', 'ArrowRight'],
    ],
    numpad: [
      ['NumLock', '/', '*', '-'],
      ['7', '8', '9', '+'],
      ['4', '5', '6'],
      ['1', '2', '3', 'Enter'],
      ['0', '.'],
    ],
  };
}

export function buildSpecialKeys(isMac) {
  return {
    ' ': 'Space',
    Control: 'Ctrl',
    Meta: isMac ? 'Cmd' : 'Win',
    OS: isMac ? 'Cmd' : 'Win',
    ArrowUp: '↑',
    ArrowDown: '↓',
    ArrowLeft: '←',
    ArrowRight: '→',
    Escape: 'Esc',
    Delete: 'Del',
    Backspace: '⌫',
    Tab: '⇥',
    CapsLock: '⇪',
    Enter: '⏎',
    Shift: '⇧',
    Alt: isMac ? 'Option' : 'Alt',
    AltGraph: 'AltGr',
    ContextMenu: 'Menu',
    PrintScreen: 'PrtSc',
    ScrollLock: 'ScrLk',
    Pause: 'Pause',
    Insert: 'Ins',
    Home: 'Home',
    End: 'End',
    PageUp: 'PgUp',
    PageDown: 'PgDn',
    F1: 'F1',
    F2: 'F2',
    F3: 'F3',
    F4: 'F4',
    F5: 'F5',
    F6: 'F6',
    F7: 'F7',
    F8: 'F8',
    F9: 'F9',
    F10: 'F10',
    F11: 'F11',
    F12: 'F12',
    NumLock: 'NumLk',
    NumpadDivide: '/',
    NumpadMultiply: '*',
    NumpadSubtract: '-',
    NumpadAdd: '+',
    NumpadEnter: 'Enter',
    NumpadDecimal: '.',
    Numpad0: '0',
    Numpad1: '1',
    Numpad2: '2',
    Numpad3: '3',
    Numpad4: '4',
    Numpad5: '5',
    Numpad6: '6',
    Numpad7: '7',
    Numpad8: '8',
    Numpad9: '9',
    MediaPlayPause: '⏯',
    MediaStop: '⏹',
    MediaTrackNext: '⏭',
    MediaTrackPrevious: '⏮',
    AudioVolumeUp: '🔊',
    AudioVolumeDown: '🔉',
    AudioVolumeMute: '🔇',
  };
}

export function getKeyDisplay(key, specialKeys) {
  return specialKeys[key] || key;
}

/** Derive the normalized/display key for a keydown event, plus whether it's a numpad key. */
export function normalizeKeyDown(event, isMac, specialKeys) {
  const key = event.key;
  const code = event.code;

  let normalizedKey = key;
  let displayKey = key;

  if (isMac) {
    if (key === 'Meta') {
      normalizedKey = 'Cmd';
      displayKey = 'Cmd';
    } else if (key === 'Alt') {
      normalizedKey = 'Option';
      displayKey = 'Option';
    } else if (key === 'Control') {
      normalizedKey = 'Ctrl';
      displayKey = 'Ctrl';
    }
  } else {
    if (key === 'Meta' || key === 'OS') {
      normalizedKey = 'Win';
      displayKey = 'Win';
    } else if (key === 'Control') {
      normalizedKey = 'Ctrl';
      displayKey = 'Ctrl';
    }
  }

  if (key === ' ') {
    normalizedKey = 'Space';
    displayKey = 'Space';
  }

  const isNumpad = code.startsWith('Numpad');
  if (isNumpad) {
    normalizedKey = code.replace('Numpad', '');
    displayKey = specialKeys[code] || normalizedKey;
  }

  return { normalizedKey, displayKey, isNumpad };
}

/** Derive the normalized key for a keyup event. */
export function normalizeKeyUp(event, isMac) {
  const key = event.key;
  const code = event.code;

  let normalizedKey = key;

  if (isMac) {
    if (key === 'Meta') normalizedKey = 'Cmd';
    else if (key === 'Alt') normalizedKey = 'Option';
    else if (key === 'Control') normalizedKey = 'Ctrl';
  } else {
    if (key === 'Meta' || key === 'OS') normalizedKey = 'Win';
    else if (key === 'Control') normalizedKey = 'Ctrl';
  }

  if (key === ' ') normalizedKey = 'Space';
  if (code.startsWith('Numpad')) normalizedKey = code.replace('Numpad', '');

  return normalizedKey;
}

export function getKeyClassName(key, pressedKeys, isMac) {
  const baseClass =
    'flex items-center justify-center border-2 rounded-lg font-mono text-sm transition-all duration-75 select-none';

  const keyVariants = [key, key.toLowerCase(), key.toUpperCase()];

  if (isMac) {
    if (key === 'Option' || key === 'Alt') keyVariants.push('Alt', 'Option');
    if (key === 'Cmd' || key === 'Meta') keyVariants.push('Cmd', 'Meta', '⌘');
    if (key === 'Ctrl' || key === 'Control') keyVariants.push('Ctrl', 'Control', '⌃');
    if (key === 'Shift') keyVariants.push('Shift', '⇧');
  } else {
    if (key === 'Alt') keyVariants.push('Alt');
    if (key === 'Win' || key === 'Meta') keyVariants.push('Win', 'Meta', 'OS');
    if (key === 'Ctrl' || key === 'Control') keyVariants.push('Ctrl', 'Control');
  }

  if (key === 'Space' || key === ' ') keyVariants.push('Space', ' ');
  if (key.startsWith('Arrow')) keyVariants.push(key);
  if (key === 'NumpadDivide' || key === '/') keyVariants.push('NumpadDivide', '/');
  if (key === 'NumpadMultiply' || key === '*') keyVariants.push('NumpadMultiply', '*');
  if (key === 'NumpadSubtract' || key === '-') keyVariants.push('NumpadSubtract', '-');
  if (key === 'NumpadAdd' || key === '+') keyVariants.push('NumpadAdd', '+');
  if (key === 'NumpadEnter' || key === 'Enter') keyVariants.push('NumpadEnter', 'Enter');
  if (key === 'NumpadDecimal' || key === '.') keyVariants.push('NumpadDecimal', '.');
  if (key.match(/^Numpad[0-9]$/)) {
    const num = key.replace('Numpad', '');
    keyVariants.push(`Numpad${num}`, num);
  }

  const isPressed = keyVariants.some(
    (variant) =>
      pressedKeys.has(variant) ||
      Array.from(pressedKeys).some(
        (pressedKey) => pressedKey === variant || pressedKey.toLowerCase() === variant.toLowerCase()
      )
  );

  if (isPressed) {
    return `${baseClass} bg-emerald-500 border-emerald-400 text-white shadow-lg transform scale-95`;
  }
  return `${baseClass} bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600`;
}

export function getKeyWidth(key, showNumpad) {
  switch (key) {
    case 'Backspace':
      return 'w-20';
    case 'Tab':
      return 'w-16';
    case 'CapsLock':
      return 'w-20';
    case 'Enter':
      return 'w-20';
    case 'Shift':
      return 'w-24';
    case 'Space':
      return 'w-96';
    case 'Ctrl':
    case 'Alt':
    case 'Option':
    case 'Cmd':
    case 'Win':
      return 'w-16';
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      return 'w-12';
    case 'NumLock':
    case 'NumpadDivide':
    case 'NumpadMultiply':
    case 'NumpadSubtract':
      return 'w-12';
    case 'NumpadAdd':
    case 'NumpadEnter':
      return 'w-12 h-24';
    case '0':
      return showNumpad ? 'w-24' : 'w-12';
    default:
      return 'w-12';
  }
}

export function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

export function buildExportPayload({ testMode, elapsedTime, keyHistory, keyStats }) {
  return {
    testMode,
    duration: elapsedTime,
    keyHistory,
    keyStats,
    timestamp: new Date().toISOString(),
    totalKeys: keyHistory.length,
  };
}

export function downloadJson(content, filename) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
