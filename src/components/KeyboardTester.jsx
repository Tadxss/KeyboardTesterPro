/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Download, Settings, Keyboard, Timer, Target, Zap, ChevronDown, Code, Heart, Mail } from 'lucide-react';
import BuyMeACoffee from './BuyMeACoffee';
import ContactModal from './ContactModal';

const KeyboardTester = () => {
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [keyHistory, setKeyHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [testMode, setTestMode] = useState('basic');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [keyStats, setKeyStats] = useState({});
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showNumpad, setShowNumpad] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [settings, setSettings] = useState({
    showKeyCode: true,
    showTimestamp: true,
    highlightDuration: 200,
    soundEnabled: false
  });
  const intervalRef = useRef(null);

  // Test mode configurations
  const testModes = useMemo(() => ({
    basic: {
        name: 'Basic',
        description: 'Simple keyboard testing - just visual feedback',
        showStats: false,
        showHistory: false,
        showExport: false,
        showAdvancedMetrics: false
    },
    pro: {
        name: 'Professional',
        description: 'Complete testing suite with statistics and analysis',
        showStats: true,
        showHistory: true,
        showExport: true,
        showAdvancedMetrics: true
    }
  }), []);

  // Standard keyboard layouts with cross-platform support
  const keyboardLayouts = {
    qwerty: [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
      ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
      ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
      [
        navigator.platform.includes('Mac') ? 'Ctrl' : 'Ctrl',
        navigator.platform.includes('Mac') ? 'Option' : 'Alt',
        'Space',
        navigator.platform.includes('Mac') ? 'Cmd' : 'Win',
        navigator.platform.includes('Mac') ? 'Option' : 'Alt',
        'Ctrl'
      ],
      ['ArrowUp'],
      ['ArrowLeft', 'ArrowDown', 'ArrowRight']
    ],
    numpad: [
      ['NumLock', '/', '*', '-'],
      ['7', '8', '9', '+'],
      ['4', '5', '6'],
      ['1', '2', '3', 'Enter'],
      ['0', '.']
    ]
  };

  const specialKeys = useMemo(() => ({
    ' ': 'Space',
    'Control': 'Ctrl',
    'Meta': navigator.platform.includes('Mac') ? 'Cmd' : 'Win',
    'OS': navigator.platform.includes('Mac') ? 'Cmd' : 'Win',
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    'Escape': 'Esc',
    'Delete': 'Del',
    'Backspace': '⌫',
    'Tab': '⇥',
    'CapsLock': '⇪',
    'Enter': '⏎',
    'Shift': '⇧',
    'Alt': navigator.platform.includes('Mac') ? 'Option' : 'Alt',
    'AltGraph': 'AltGr',
    'ContextMenu': 'Menu',
    'PrintScreen': 'PrtSc',
    'ScrollLock': 'ScrLk',
    'Pause': 'Pause',
    'Insert': 'Ins',
    'Home': 'Home',
    'End': 'End',
    'PageUp': 'PgUp',
    'PageDown': 'PgDn',
    'F1': 'F1', 'F2': 'F2', 'F3': 'F3', 'F4': 'F4',
    'F5': 'F5', 'F6': 'F6', 'F7': 'F7', 'F8': 'F8',
    'F9': 'F9', 'F10': 'F10', 'F11': 'F11', 'F12': 'F12',
    'NumLock': 'NumLk',
    'NumpadDivide': '/',
    'NumpadMultiply': '*',
    'NumpadSubtract': '-',
    'NumpadAdd': '+',
    'NumpadEnter': 'Enter',
    'NumpadDecimal': '.',
    'Numpad0': '0', 'Numpad1': '1', 'Numpad2': '2', 'Numpad3': '3',
    'Numpad4': '4', 'Numpad5': '5', 'Numpad6': '6', 'Numpad7': '7',
    'Numpad8': '8', 'Numpad9': '9',
    'MediaPlayPause': '⏯',
    'MediaStop': '⏹',
    'MediaTrackNext': '⏭',
    'MediaTrackPrevious': '⏮',
    'AudioVolumeUp': '🔊',
    'AudioVolumeDown': '🔉',
    'AudioVolumeMute': '🔇'
  }), []);

  const getKeyDisplay = (key) => specialKeys[key] || key;

  const handleKeyDown = useCallback((event) => {
    const key = event.key;
    const code = event.code;
    const timestamp = Date.now();
    
    // Handle platform-specific key mapping for Mac
    let normalizedKey = key;
    let displayKey = key;
    
    if (navigator.platform.includes('Mac')) {
      // Mac-specific key normalization
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
      // Windows/Linux key normalization
      if (key === 'Meta' || key === 'OS') {
        normalizedKey = 'Win';
        displayKey = 'Win';
      } else if (key === 'Control') {
        normalizedKey = 'Ctrl';
        displayKey = 'Ctrl';
      }
    }
    
    // Special handling for Space key
    if (key === ' ') {
      normalizedKey = 'Space';
      displayKey = 'Space';
    }

    if (code.startsWith('Numpad')) {
      normalizedKey = code.replace('Numpad', '');
      displayKey = specialKeys[code] || normalizedKey;
      setShowNumpad(true);
    }

    // Prevent default behavior to avoid unwanted actions (like scrolling with spacebar)
    // Only allow default behavior for certain keys that need it
    const allowDefaultKeys = ['F5', 'F11', 'F12']; // Keys that should keep their default behavior
    if (!allowDefaultKeys.includes(key)) {
      event.preventDefault();
    }

    if (!pressedKeys.has(normalizedKey)) {
      setPressedKeys(prev => new Set(prev).add(normalizedKey));
      
      const keyData = {
        key: displayKey,
        normalizedKey: normalizedKey,
        originalKey: key,
        code,
        timestamp,
        type: 'keydown',
        platform: navigator.platform,
        id: Math.random().toString(36).substr(2, 9)
      };

      // Only record history and stats in pro mode
      if (isRecording && testModes[testMode].showHistory) {
        setKeyHistory(prev => [...prev, keyData]);
      }

      if (testModes[testMode].showStats) {
        setKeyStats(prev => ({
          ...prev,
          [normalizedKey]: {
            count: (prev[normalizedKey]?.count || 0) + 1,
            lastPressed: timestamp,
            code: code
          }
        }));
      }

      // Auto-remove highlight after duration
      setTimeout(() => {
        setPressedKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(normalizedKey);
          return newSet;
        });
      }, settings.highlightDuration);
    }
  }, [pressedKeys, isRecording, settings.highlightDuration, testMode, testModes, specialKeys]);

  const handleKeyUp = useCallback((event) => {
    const key = event.key;
    const code = event.code;
    
    // Handle platform-specific key mapping for key up events
    let normalizedKey = key;
    
    if (navigator.platform.includes('Mac')) {
      if (key === 'Meta') {
        normalizedKey = 'Cmd';
      } else if (key === 'Alt') {
        normalizedKey = 'Option';
      } else if (key === 'Control') {
        normalizedKey = 'Ctrl';
      }
    } else {
      if (key === 'Meta' || key === 'OS') {
        normalizedKey = 'Win';
      } else if (key === 'Control') {
        normalizedKey = 'Ctrl';
      }
    }
    
    // Special handling for Space key
    if (key === ' ') {
      normalizedKey = 'Space';
    }

    // Handle numpad keys
    if (code.startsWith('Numpad')) {
      normalizedKey = code.replace('Numpad', '');
    }

    // Remove from pressed keys on key up for modifier keys and space
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(normalizedKey);
      return newSet;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (isRecording && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRecording, startTime]);

  const startRecording = () => {
    setIsRecording(true);
    setStartTime(Date.now());
    setKeyHistory([]);
    setKeyStats({});
  };

  const stopRecording = () => {
    setIsRecording(false);
    setStartTime(null);
    clearInterval(intervalRef.current);
  };

  const resetTest = () => {
    setIsRecording(false);
    setStartTime(null);
    setElapsedTime(0);
    setKeyHistory([]);
    setKeyStats({});
    setPressedKeys(new Set());
    clearInterval(intervalRef.current);
  };

  const exportResults = () => {
    const results = {
      testMode,
      duration: elapsedTime,
      keyHistory,
      keyStats,
      timestamp: new Date().toISOString(),
      totalKeys: keyHistory.length
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keyboard-test-${testMode}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const getKeyClassName = (key) => {
    const baseClass = "flex items-center justify-center border-2 rounded-lg font-mono text-sm transition-all duration-75 select-none";
    
    // Check for pressed state with comprehensive key mapping
    let isPressed = false;
    const keyVariants = [
      key,
      key.toLowerCase(),
      key.toUpperCase(),
      getKeyDisplay(key)
    ];
    
    // Add comprehensive platform-specific variants for Mac
    if (navigator.platform.includes('Mac')) {
      if (key === 'Option' || key === 'Alt') {
        keyVariants.push('Alt', 'Option');
      }
      if (key === 'Cmd' || key === 'Meta') {
        keyVariants.push('Cmd', 'Meta', '⌘');
      }
      if (key === 'Ctrl' || key === 'Control') {
        keyVariants.push('Ctrl', 'Control', '⌃');
      }
      if (key === 'Shift') {
        keyVariants.push('Shift', '⇧');
      }
    } else {
      // Windows/Linux variants
      if (key === 'Alt') {
        keyVariants.push('Alt');
      }
      if (key === 'Win' || key === 'Meta') {
        keyVariants.push('Win', 'Meta', 'OS');
      }
      if (key === 'Ctrl' || key === 'Control') {
        keyVariants.push('Ctrl', 'Control');
      }
    }
    
    // Special handling for Space key
    if (key === 'Space' || key === ' ') {
      keyVariants.push('Space', ' ');
    }
    
    // Special handling for Arrow keys
    if (key.startsWith('Arrow')) {
      keyVariants.push(key, getKeyDisplay(key));
    }
    
    // Special handling for Numpad keys
    if (key === 'NumpadDivide' || key === '/') {
      keyVariants.push('NumpadDivide', '/');
    }
    if (key === 'NumpadMultiply' || key === '*') {
      keyVariants.push('NumpadMultiply', '*');
    }
    if (key === 'NumpadSubtract' || key === '-') {
      keyVariants.push('NumpadSubtract', '-');
    }
    if (key === 'NumpadAdd' || key === '+') {
      keyVariants.push('NumpadAdd', '+');
    }
    if (key === 'NumpadEnter' || key === 'Enter') {
      keyVariants.push('NumpadEnter', 'Enter');
    }
    if (key === 'NumpadDecimal' || key === '.') {
      keyVariants.push('NumpadDecimal', '.');
    }
    if (key.match(/^Numpad[0-9]$/)) {
      const num = key.replace('Numpad', '');
      keyVariants.push(`Numpad${num}`, num);
    }
    
    // Check if any variant is currently pressed
    isPressed = keyVariants.some(variant => 
      pressedKeys.has(variant) || 
      Array.from(pressedKeys).some(pressedKey => 
        pressedKey === variant || 
        pressedKey.toLowerCase() === variant.toLowerCase()
      )
    );
    
    if (isPressed) {
      return `${baseClass} bg-emerald-500 border-emerald-400 text-white shadow-lg transform scale-95`;
    }
    
    return `${baseClass} bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600`;
  };

  const getKeyWidth = (key) => {
    switch (key) {
      case 'Backspace': return 'w-20';
      case 'Tab': return 'w-16';
      case 'CapsLock': return 'w-20';
      case 'Enter': return 'w-20';
      case 'Shift': return 'w-24';
      case 'Space': return 'w-96';
      case 'Ctrl':
      case 'Alt':
      case 'Option':
      case 'Cmd':
      case 'Win': return 'w-16';
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight': return 'w-12';
      case 'NumLock':
      case 'NumpadDivide':
      case 'NumpadMultiply':
      case 'NumpadSubtract': return 'w-12';
      case 'NumpadAdd':
      case 'NumpadEnter': return 'w-12 h-24';
      case '0': return showNumpad ? 'w-24' : 'w-12';
      default: return 'w-12';
    }
  };

  const currentMode = testModes[testMode];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Sticky Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard className="w-7 h-7 text-emerald-400" />
            <div className="text-left">
              <h1 className="text-xl font-bold text-white leading-tight">Keyboard Tester Pro</h1>
              <p className="text-xs text-slate-400">{currentMode.description}</p>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            {navigator.platform.includes('Mac') ? 'macOS' : 'Windows/Linux'} · {navigator.platform.includes('Mac') ? 'Mac' : 'PC'} layout
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-5 space-y-4">

          {/* Control Panel */}
          <div className="bg-slate-800 rounded-xl p-4 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Test Mode Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowModeDropdown(!showModeDropdown)}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold transition-all text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    {currentMode.name} Mode
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showModeDropdown && (
                    <div className="absolute top-full left-0 mt-2 bg-slate-700 rounded-lg shadow-xl z-50 min-w-[200px]">
                      {Object.entries(testModes).map(([key, mode]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setTestMode(key);
                            setShowModeDropdown(false);
                            resetTest(); // Reset test when changing modes
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-slate-600 transition-all ${
                            testMode === key ? 'bg-emerald-600 text-white' : 'text-slate-200'
                          } ${key === 'basic' ? 'rounded-t-lg' : ''} ${key === 'pro' ? 'rounded-b-lg' : ''}`}
                        >
                          <div className="font-semibold">{mode.name}</div>
                          <div className="text-sm opacity-75">{mode.description}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                    isRecording 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isRecording ? 'Stop Test' : 'Start Test'}
                </button>
                
                <button
                  onClick={resetTest}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold transition-all text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>

                {currentMode.showExport && (
                  <button
                    onClick={exportResults}
                    disabled={keyHistory.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-semibold transition-all text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                )}

                <button
                  onClick={() => setShowNumpad(!showNumpad)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                    showNumpad ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  <Keyboard className="w-4 h-4" />
                  {showNumpad ? 'Hide Numpad' : 'Show Numpad'}
                </button>
              </div>

              {/* Metrics - only shown in Pro mode */}
              {currentMode.showAdvancedMetrics && (
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Timer className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="font-mono text-sm">{keyHistory.length} keys</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="font-mono text-sm">
                      {elapsedTime > 0 ? Math.round((keyHistory.length / elapsedTime) * 60000) : 0} KPM
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Virtual Keyboard */}
          <div className="bg-slate-800 rounded-xl p-5 shadow-2xl">
            <h2 className="text-base font-semibold text-emerald-400 mb-3 text-center">
              Virtual Keyboard
            </h2>
            
            {/* Show either main keyboard or numpad, not both */}
            {!showNumpad ? (
              /* Main Keyboard */
              <div className="flex flex-col items-center gap-1.5 font-mono mb-3">
                {keyboardLayouts.qwerty.map((row, rowIndex) => (
                  <div key={rowIndex} className={`flex gap-1 ${rowIndex >= 5 ? 'justify-center' : ''}`}>
                    {row.map((key, keyIndex) => (
                      <div
                        key={`${rowIndex}-${keyIndex}`}
                        className={`${getKeyClassName(key)} ${getKeyWidth(key)} h-12 ${
                          rowIndex === 5 ? 'mt-4' : rowIndex === 6 ? 'mt-1' : ''
                        }`}
                      >
                        {getKeyDisplay(key)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="grid grid-cols-4 gap-2 font-mono w-fit">
                  {/* First row */}
                  <div className={`${getKeyClassName('NumLock')} w-12 h-12`}>NumLk</div>
                  <div className={`${getKeyClassName('/')} w-12 h-12`}>/</div>
                  <div className={`${getKeyClassName('*')} w-12 h-12`}>*</div>
                  <div className={`${getKeyClassName('-')} w-12 h-12`}>-</div>
                  
                  {/* Second row */}
                  <div className={`${getKeyClassName('7')} w-12 h-12`}>7</div>
                  <div className={`${getKeyClassName('8')} w-12 h-12`}>8</div>
                  <div className={`${getKeyClassName('9')} w-12 h-12`}>9</div>
                  <div className={`${getKeyClassName('+')} w-12 h-26 row-span-2`}>+</div>
                  
                  {/* Third row */}
                  <div className={`${getKeyClassName('4')} w-12 h-12`}>4</div>
                  <div className={`${getKeyClassName('5')} w-12 h-12`}>5</div>
                  <div className={`${getKeyClassName('6')} w-12 h-12`}>6</div>
                  
                  {/* Fourth row */}
                  <div className={`${getKeyClassName('1')} w-12 h-12`}>1</div>
                  <div className={`${getKeyClassName('2')} w-12 h-12`}>2</div>
                  <div className={`${getKeyClassName('3')} w-12 h-12`}>3</div>
                  <div className={`${getKeyClassName('Enter')} w-12 h-26 row-span-2`}>⏎</div>
                  
                  {/* Fifth row */}
                  <div className={`${getKeyClassName('0')} w-26 col-span-2 mr-0 h-12`}>0</div>
                  <div className={`${getKeyClassName('.')} w-12 h-12`}>.</div>
                </div>
              </div>
            )}

            <div className="text-center mt-4 text-slate-400 text-sm">
              {testMode === 'basic' ? 'Press any key to see it light up!' : 'Arrow keys are positioned separately for better visibility'}
            </div>
          </div>

          {/* Statistics and History - Only shown in Pro mode after starting test */}
          {currentMode.showStats && currentMode.showHistory && (startTime || keyHistory.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Key Statistics */}
              <div className="bg-slate-800 rounded-xl p-6 shadow-2xl">
                <h3 className="text-xl font-semibold text-emerald-400 mb-4">Key Statistics</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {Object.entries(keyStats)
                    .sort(([,a], [,b]) => b.count - a.count)
                    .map(([key, stats]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <span className="font-mono text-slate-200">{getKeyDisplay(key)}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-emerald-400 font-semibold">{stats.count}x</span>
                          <span className="text-slate-400 text-sm">
                            {new Date(stats.lastPressed).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  {Object.keys(keyStats).length === 0 && (
                    <p className="text-slate-400 text-center py-8">Start typing to see key statistics</p>
                  )}
                </div>
              </div>

              {/* Key History */}
              <div className="bg-slate-800 rounded-xl p-6 shadow-2xl">
                <h3 className="text-xl font-semibold text-emerald-400 mb-4">Key History</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {keyHistory.slice(-20).reverse().map((entry, index) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-200 bg-slate-600 px-2 py-1 rounded text-sm">
                          {getKeyDisplay(entry.key)}
                        </span>
                        {settings.showKeyCode && (
                          <span className="text-slate-400 text-sm">{entry.code}</span>
                        )}
                      </div>
                      {settings.showTimestamp && (
                        <span className="text-slate-400 text-sm">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  ))}
                  {keyHistory.length === 0 && (
                    <p className="text-slate-400 text-center py-8">Key presses will appear here</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-slate-800 rounded-xl p-5 shadow-2xl">          
            <h3 className="text-base font-semibold text-emerald-400 mb-3">Instructions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
              <div>
                <h4 className="font-semibold text-slate-200 mb-2">How to Test:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Select your preferred test mode</li>
                  <li>• Click "Start Test" to begin {currentMode.showHistory ? 'recording' : ''}</li>
                  <li>• Press any keys on your keyboard</li>
                  <li>• Watch the virtual keyboard light up</li>
                  {currentMode.showStats && <li>• Monitor your typing statistics</li>}
                  {currentMode.showExport && <li>• Export results when finished</li>}
                  <li>• Toggle numpad visibility as needed</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 mb-2">Test Modes:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <span className="text-emerald-400">Basic:</span> Simple visual testing only</li>
                  <li>• <span className="text-blue-400">Professional:</span> Full analytics & export</li>
                  <li>• Cross-platform key detection</li>
                  <li>• {navigator.platform.includes('Mac') ? '⌘ Cmd' : '🪟 Win'} key support</li>
                  <li>• All modifier and function keys</li>
                  <li>• Full numpad support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 mb-2">Features:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Real-time key detection</li>
                  <li>• Visual feedback on virtual keyboard</li>
                  {currentMode.showStats && <li>• Detailed statistics and history</li>}
                  {currentMode.showExport && <li>• Export test results (JSON)</li>}
                  <li>• Mac & Windows keyboard layouts</li>
                  <li>• Full numpad testing support</li>
                  <li>• No page scrolling during tests</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Collab CTA */}
          <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-pink-900/20 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div>
              <p className="text-white font-semibold text-base">👋 Got an idea or need a developer?</p>
              <p className="text-slate-400 text-sm mt-0.5">I'm open to freelance work, collaborations, and full-time opportunities.</p>
            </div>
            <button
              onClick={() => setShowContact(true)}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-900/40 transition-all"
            >
              <Mail className="w-4 h-4" />
              Get in Touch
            </button>
          </div>

          <BuyMeACoffee />
        </main>

      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 mt-8">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Developer Info */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Code className="w-5 h-5 text-emerald-400" />
                <span className="text-lg font-semibold text-slate-200">Developed by</span>
              </div>
              <a href="https://daryltadeo.netlify.app" target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-emerald-400 mb-2 hover:text-emerald-300 transition-colors inline-block">Daryl John Tadeo</a>
              <p className="text-slate-400 text-sm">Full Stack Developer & UI/UX Enthusiast</p>
            </div>

            {/* Technologies Used */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-lg font-semibold text-slate-200">Built with</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">React</span>
                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">JavaScript</span>
                <span className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-medium">Tailwind CSS</span>
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">Lucide Icons</span>
                <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">HTML5</span>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium">Vite</span>
                <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">Netlify</span>
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">Google Analytics</span>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-2 mb-3">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-lg font-semibold text-slate-200">Made with Care</span>
              </div>
              <p className="text-slate-400 text-sm mb-2">
                © {new Date().getFullYear()} Daryl John Tadeo
              </p>
              <p className="text-slate-500 text-xs">
                Cross-platform keyboard testing made simple
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-slate-400 text-sm">
                Professional keyboard testing tool with real-time analytics and cross-platform support
              </div>
              <div className="text-slate-500 text-xs">
                Version 1.0 • Optimized for {navigator.platform.includes('Mac') ? 'macOS' : 'Windows/Linux'}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KeyboardTester;