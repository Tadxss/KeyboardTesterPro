export default function KeyStatistics({ keyStats, getKeyDisplay }) {
  const entries = Object.entries(keyStats).sort(([, a], [, b]) => b.count - a.count);

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-2xl">
      <h3 className="text-xl font-semibold text-emerald-400 mb-4">Key Statistics</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {entries.map(([key, stats]) => (
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
        {entries.length === 0 && (
          <p className="text-slate-400 text-center py-8">Start typing to see key statistics</p>
        )}
      </div>
    </div>
  );
}
