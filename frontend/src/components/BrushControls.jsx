const SIZES = [
  { label: 'S', value: 8 },
  { label: 'M', value: 14 },
  { label: 'L', value: 22 },
];

export default function BrushControls({ brushSize, onBrushChange, onClear, onGuess, loading, cooldown, hasDrawing }) {
  return (
    <div className="flex items-center gap-2">
      {/* Brush sizes */}
      <div className="flex gap-1">
        {SIZES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onBrushChange(value)}
            className={`w-7 h-7 rounded-md text-xs flex items-center justify-center transition-all cursor-pointer ${
              brushSize === value
                ? 'bg-utep-orange/20 text-utep-orange'
                : 'bg-white/5 text-white/30 hover:text-white/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-white/10" />

      {/* Clear */}
      <button
        onClick={onClear}
        className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-all cursor-pointer"
      >
        Clear
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Guess button */}
      <button
        onClick={onGuess}
        disabled={loading || cooldown > 0 || !hasDrawing}
        className="px-5 py-2 rounded-xl bg-utep-orange text-white text-sm font-semibold cursor-pointer transition-all shadow-[0_2px_12px_rgba(255,102,0,0.3)] hover:bg-utep-orange-light hover:-translate-y-px active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
      >
        {loading ? 'Thinking...' : cooldown > 0 ? `Wait ${cooldown}s` : 'What Did I Draw?'}
      </button>
    </div>
  );
}
