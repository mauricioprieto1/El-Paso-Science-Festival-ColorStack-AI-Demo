const SIZES = [
  { label: 'S', value: 8 },
  { label: 'M', value: 14 },
  { label: 'L', value: 22 },
];

export default function BrushControls({ brushSize, onBrushChange, onClear, onGuess, loading, cooldown, hasDrawing }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Brush size row */}
      <div className="flex items-center gap-2.5">
        <span className="text-[11px] tracking-widest uppercase text-utep-text-dim whitespace-nowrap">
          Brush
        </span>
        {SIZES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onBrushChange(value)}
            className={`w-8 h-8 rounded-lg border text-sm flex items-center justify-center transition-all cursor-pointer ${
              brushSize === value
                ? 'bg-utep-orange/15 border-utep-orange text-utep-orange'
                : 'bg-utep-glass border-utep-border text-white hover:bg-utep-orange/10 hover:border-utep-orange hover:text-utep-orange'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onClear}
          className="flex-1 py-3.5 px-5 rounded-xl bg-utep-glass border border-utep-border text-utep-text-dim font-bold text-sm tracking-wide cursor-pointer transition-all hover:bg-utep-orange/8 hover:border-utep-orange/40 hover:text-utep-orange-light flex items-center justify-center gap-2"
        >
          🗑 Clear
        </button>
        <button
          onClick={onGuess}
          disabled={loading || cooldown > 0 || !hasDrawing}
          className="flex-[2] py-3.5 px-5 rounded-xl bg-utep-orange text-white font-bold text-sm tracking-wide cursor-pointer transition-all shadow-[0_4px_20px_rgba(255,102,0,0.4)] hover:bg-utep-orange-light hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(255,102,0,0.5)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
        >
          {loading ? (
            '⏳ Analyzing...'
          ) : cooldown > 0 ? (
            `⏳ Wait ${cooldown}s`
          ) : (
            '🔍 What Did I Draw?'
          )}
        </button>
      </div>
    </div>
  );
}
