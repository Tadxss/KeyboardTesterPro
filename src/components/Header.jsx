import { Keyboard } from 'lucide-react';

export default function Header({ description, isMac }) {
  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Keyboard className="w-7 h-7 text-emerald-400" />
          <div className="text-left">
            <h1 className="text-xl font-bold text-white leading-tight">Free Keyboard Tester</h1>
            <p className="text-xs text-slate-400">{description}</p>
          </div>
        </div>
        <div className="text-xs text-slate-500">
          {isMac ? 'macOS' : 'Windows/Linux'} · {isMac ? 'Mac' : 'PC'} layout
        </div>
      </div>
    </header>
  );
}
