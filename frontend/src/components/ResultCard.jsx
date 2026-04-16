import { useEffect, useRef } from 'react';

export default function ResultCard({ guesses }) {
  const barsRef = useRef([]);

  useEffect(() => {
    guesses.forEach((_, i) => {
      setTimeout(() => {
        const el = barsRef.current[i];
        if (el) el.style.width = el.dataset.target;
      }, i * 120 + 50);
    });
  }, [guesses]);

  return (
    <div className="flex flex-col gap-2">
      {guesses.map((g, i) => {
        const pct = Math.round(g.confidence * 100);
        const opacity = i === 0 ? 'text-white' : 'text-white/40';
        const barOpacity = i === 0 ? 'bg-utep-orange' : i === 1 ? 'bg-utep-orange/40' : 'bg-utep-orange/20';

        return (
          <div key={i} className="flex items-center gap-2.5">
            <span className={`text-sm capitalize flex-1 ${opacity} ${i === 0 ? 'font-semibold' : ''}`}>
              {g.label}
            </span>
            <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                ref={(el) => (barsRef.current[i] = el)}
                data-target={`${pct}%`}
                className={`h-full rounded-full w-0 transition-[width] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${barOpacity}`}
              />
            </div>
            <span className="text-[11px] text-white/30 font-mono w-8 text-right">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}
