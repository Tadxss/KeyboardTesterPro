import { Download, Keyboard, Pause, Play, RotateCcw, Target, Timer, Zap } from 'lucide-react';
import ModeSelector from './ModeSelector';

export default function ControlPanel({
  testModes,
  testMode,
  currentMode,
  onSelectMode,
  isRecording,
  onStart,
  onStop,
  onReset,
  onExport,
  keyHistoryCount,
  showNumpad,
  onToggleNumpad,
  elapsedTime,
  formatTime,
}) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ModeSelector
            testModes={testModes}
            testMode={testMode}
            currentModeName={currentMode.name}
            onSelect={onSelectMode}
          />

          <button
            onClick={isRecording ? onStop : onStart}
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
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold transition-all text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          {currentMode.showExport && (
            <button
              onClick={onExport}
              disabled={keyHistoryCount === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-semibold transition-all text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}

          <button
            onClick={onToggleNumpad}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              showNumpad
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            {showNumpad ? 'Hide Numpad' : 'Show Numpad'}
          </button>
        </div>

        {currentMode.showAdvancedMetrics && (
          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="font-mono text-sm">{keyHistoryCount} keys</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="font-mono text-sm">
                {elapsedTime > 0 ? Math.round((keyHistoryCount / elapsedTime) * 60000) : 0} KPM
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
