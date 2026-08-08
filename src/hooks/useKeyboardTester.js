import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { testModes } from '../data/testModes';
import {
  buildExportPayload,
  buildKeyboardLayouts,
  buildSpecialKeys,
  downloadJson,
  formatTime,
  getIsMac,
  getKeyClassName,
  getKeyDisplay,
  getKeyWidth,
  normalizeKeyDown,
  normalizeKeyUp,
} from '../lib/keyboard';

/**
 * @param {boolean} active - when false (e.g. the contact modal is open), keyboard capture is suppressed.
 */
export function useKeyboardTester(active = true) {
  const isMac = useMemo(() => getIsMac(), []);
  const specialKeys = useMemo(() => buildSpecialKeys(isMac), [isMac]);
  const keyboardLayouts = useMemo(() => buildKeyboardLayouts(isMac), [isMac]);

  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [keyHistory, setKeyHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [testMode, setTestMode] = useState('basic');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [keyStats, setKeyStats] = useState({});
  const [showNumpad, setShowNumpad] = useState(false);
  const [settings] = useState({
    showKeyCode: true,
    showTimestamp: true,
    highlightDuration: 200,
    soundEnabled: false,
  });
  const intervalRef = useRef(null);

  const handleKeyDown = useCallback(
    (event) => {
      if (!active) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const timestamp = Date.now();
      const { normalizedKey, displayKey, isNumpad } = normalizeKeyDown(event, isMac, specialKeys);
      if (isNumpad) setShowNumpad(true);

      const allowDefaultKeys = ['F5', 'F11', 'F12'];
      if (!allowDefaultKeys.includes(event.key)) {
        event.preventDefault();
      }

      if (!pressedKeys.has(normalizedKey)) {
        setPressedKeys((prev) => new Set(prev).add(normalizedKey));

        const keyData = {
          key: displayKey,
          normalizedKey,
          originalKey: event.key,
          code: event.code,
          timestamp,
          type: 'keydown',
          platform: navigator.platform,
          id: Math.random().toString(36).substr(2, 9),
        };

        if (isRecording && testModes[testMode].showHistory) {
          setKeyHistory((prev) => [...prev, keyData]);
        }

        if (testModes[testMode].showStats) {
          setKeyStats((prev) => ({
            ...prev,
            [normalizedKey]: {
              count: (prev[normalizedKey]?.count || 0) + 1,
              lastPressed: timestamp,
              code: event.code,
            },
          }));
        }

        setTimeout(() => {
          setPressedKeys((prev) => {
            const newSet = new Set(prev);
            newSet.delete(normalizedKey);
            return newSet;
          });
        }, settings.highlightDuration);
      }
    },
    [active, pressedKeys, isRecording, settings.highlightDuration, testMode, isMac, specialKeys]
  );

  const handleKeyUp = useCallback(
    (event) => {
      if (!active) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const normalizedKey = normalizeKeyUp(event, isMac);
      setPressedKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(normalizedKey);
        return newSet;
      });
    },
    [active, isMac]
  );

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

  const selectTestMode = (mode) => {
    setTestMode(mode);
    resetTest();
  };

  const toggleNumpad = () => setShowNumpad((prev) => !prev);

  const exportResults = () => {
    const payload = buildExportPayload({ testMode, elapsedTime, keyHistory, keyStats });
    downloadJson(JSON.stringify(payload, null, 2), `keyboard-test-${testMode}-${Date.now()}.json`);
  };

  const getKeyDisplayBound = useCallback((key) => getKeyDisplay(key, specialKeys), [specialKeys]);
  const getKeyClassNameBound = useCallback(
    (key) => getKeyClassName(key, pressedKeys, isMac),
    [pressedKeys, isMac]
  );
  const getKeyWidthBound = useCallback((key) => getKeyWidth(key, showNumpad), [showNumpad]);

  return {
    isMac,
    keyboardLayouts,
    pressedKeys,
    keyHistory,
    isRecording,
    testMode,
    elapsedTime,
    keyStats,
    showNumpad,
    settings,
    testModes,
    currentMode: testModes[testMode],
    selectTestMode,
    toggleNumpad,
    startRecording,
    stopRecording,
    resetTest,
    exportResults,
    getKeyDisplay: getKeyDisplayBound,
    getKeyClassName: getKeyClassNameBound,
    getKeyWidth: getKeyWidthBound,
    formatTime,
  };
}
