import { useState } from 'react';

function GalleryCard({ drawing }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="bg-utep-card border border-utep-border rounded-xl overflow-hidden cursor-pointer transition-all hover:border-utep-orange/40 hover:shadow-[0_0_20px_rgba(255,102,0,0.08)]"
    >
      {/* Drawing thumbnail */}
      <div className="aspect-square bg-white">
        <img
          src={`data:image/png;base64,${drawing.image_b64}`}
          alt={drawing.top_guess}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-white capitalize truncate">
            {drawing.top_guess}
          </span>
          <span className="text-[10px] text-utep-text-dim">
            {new Date(drawing.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="text-xs text-utep-text-dim truncate">
          by {drawing.name}
        </div>
        {drawing.department && (
          <div className="mt-1.5 inline-block text-[9px] font-bold tracking-wider uppercase bg-utep-orange/15 text-utep-orange px-2 py-0.5 rounded-full">
            {drawing.department}
          </div>
        )}

        {/* Expanded detail */}
        {expanded && drawing.explanation && (
          <div className="mt-3 pt-3 border-t border-utep-border">
            <p className="text-xs text-white/70 leading-relaxed mb-2">
              {drawing.explanation}
            </p>
            {drawing.fun_fact && (
              <div className="bg-utep-orange/8 border-l-2 border-utep-orange rounded-r px-2 py-1.5">
                <div className="text-[8px] font-bold tracking-widest uppercase text-utep-orange mb-0.5">
                  Fun Fact
                </div>
                <div className="text-[11px] text-white/60 leading-relaxed">
                  {drawing.fun_fact}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GalleryGrid({ drawings }) {
  if (!drawings.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-40">
        <span className="text-5xl animate-[float_4s_ease-in-out_infinite]">🎨</span>
        <span className="text-sm text-utep-text-dim text-center">
          No drawings yet! Be the first to draw something.
        </span>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="grid w-fit grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {drawings.map((d) => (
          <GalleryCard key={d.id} drawing={d} />
        ))}
      </div>
    </div>
  );
}
