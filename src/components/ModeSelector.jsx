import { useState } from 'react';
import { ChevronDown, Settings } from 'lucide-react';

export default function ModeSelector({ testModes, testMode, currentModeName, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold transition-all text-sm"
      >
        <Settings className="w-4 h-4" />
        {currentModeName} Mode
        <ChevronDown className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-slate-700 rounded-lg shadow-xl z-50 min-w-[200px]">
          {Object.entries(testModes).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => {
                onSelect(key);
                setIsOpen(false);
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
  );
}
