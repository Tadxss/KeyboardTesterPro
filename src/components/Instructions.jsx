export default function Instructions({ currentMode, isMac }) {
  return (
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
            <li>
              • <span className="text-emerald-400">Basic:</span> Simple visual testing only
            </li>
            <li>
              • <span className="text-blue-400">Professional:</span> Full analytics & export
            </li>
            <li>• Cross-platform key detection</li>
            <li>• {isMac ? '⌘ Cmd' : '🪟 Win'} key support</li>
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
  );
}
