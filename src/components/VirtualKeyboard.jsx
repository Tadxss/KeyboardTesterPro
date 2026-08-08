export default function VirtualKeyboard({
  keyboardLayouts,
  showNumpad,
  testMode,
  getKeyDisplay,
  getKeyClassName,
  getKeyWidth,
}) {
  return (
    <div className="bg-slate-800 rounded-xl p-5 shadow-2xl">
      <h2 className="text-base font-semibold text-emerald-400 mb-3 text-center">
        Virtual Keyboard
      </h2>

      {!showNumpad ? (
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
            <div className={`${getKeyClassName('NumLock')} w-12 h-12`}>NumLk</div>
            <div className={`${getKeyClassName('/')} w-12 h-12`}>/</div>
            <div className={`${getKeyClassName('*')} w-12 h-12`}>*</div>
            <div className={`${getKeyClassName('-')} w-12 h-12`}>-</div>

            <div className={`${getKeyClassName('7')} w-12 h-12`}>7</div>
            <div className={`${getKeyClassName('8')} w-12 h-12`}>8</div>
            <div className={`${getKeyClassName('9')} w-12 h-12`}>9</div>
            <div className={`${getKeyClassName('+')} w-12 h-26 row-span-2`}>+</div>

            <div className={`${getKeyClassName('4')} w-12 h-12`}>4</div>
            <div className={`${getKeyClassName('5')} w-12 h-12`}>5</div>
            <div className={`${getKeyClassName('6')} w-12 h-12`}>6</div>

            <div className={`${getKeyClassName('1')} w-12 h-12`}>1</div>
            <div className={`${getKeyClassName('2')} w-12 h-12`}>2</div>
            <div className={`${getKeyClassName('3')} w-12 h-12`}>3</div>
            <div className={`${getKeyClassName('Enter')} w-12 h-26 row-span-2`}>⏎</div>

            <div className={`${getKeyClassName('0')} w-26 col-span-2 mr-0 h-12`}>0</div>
            <div className={`${getKeyClassName('.')} w-12 h-12`}>.</div>
          </div>
        </div>
      )}

      <div className="text-center mt-4 text-slate-400 text-sm">
        {testMode === 'basic'
          ? 'Press any key to see it light up!'
          : 'Arrow keys are positioned separately for better visibility'}
      </div>
    </div>
  );
}
