import { useEffect, useRef } from 'react';

const BAR_STYLES = ['bg-utep-orange', 'bg-utep-orange/50', 'bg-utep-orange/25'];

export default function ResultCard({ guesses }) {
  const itemRefs = useRef([]);

  useEffect(() => {
    // Animate bars in sequence
    guesses.forEach((_, i) => {
      setTimeout(() => {
        const el = itemRefs.current[i];
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'translateX(0)';
          const bar = el.querySelector('[data-bar]');
          if (bar) bar.style.width = bar.dataset.target;
        }
      }, i * 150 + 50);
    });
  }, [guesses]);

  return (
    <div className="bg-utep-card border border-utep-border rounded-2xl p-5 backdrop-blur-lg animate-[slide-up_0.4s_ease-out]">
      <div className="text-[10px] font-bold tracking-[3px] uppercase text-utep-orange mb-4">
        🤖 AI Top Guesses
      </div>

      <div className="flex flex-col gap-2.5">
        {guesses.map((g, i) => {
          const pct = Math.round(g.confidence * 100);
          return (
            <div
              key={i}
              ref={(el) => (itemRefs.current[i] = el)}
              className="flex items-center gap-3 opacity-0 translate-x-4 transition-all duration-400"
            >
              <span className="font-mono text-[11px] text-utep-text-dim w-5 shrink-0">
                #{i + 1}
              </span>
              <span className={`text-[15px] flex-1 capitalize ${i === 0 ? 'font-bold text-white' : 'font-medium text-utep-text-dim'}`}>
                {g.label}
              </span>
              <div className="w-20 h-1.5 bg-white/8 rounded-full overflow-hidden shrink-0">
                <div
                  data-bar
                  data-target={`${pct}%`}
                  className={`h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] w-0 ${BAR_STYLES[i]}`}
                />
              </div>
              <span className="font-mono text-[11px] text-utep-text-dim w-9 text-right shrink-0">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
