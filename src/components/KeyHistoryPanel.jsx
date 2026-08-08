export default function KeyHistoryPanel({ keyHistory, settings, getKeyDisplay }) {
  const recent = keyHistory.slice(-20).reverse();

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-2xl">
      <h3 className="text-xl font-semibold text-emerald-400 mb-4">Key History</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {recent.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-200 bg-slate-600 px-2 py-1 rounded text-sm">
                {getKeyDisplay(entry.key)}
              </span>
              {settings.showKeyCode && <span className="text-slate-400 text-sm">{entry.code}</span>}
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
  );
}
