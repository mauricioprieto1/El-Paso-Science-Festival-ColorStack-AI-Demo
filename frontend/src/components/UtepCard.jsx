export default function UtepCard({ utep }) {
  return (
    <div className="bg-utep-card border border-utep-orange/50 rounded-2xl p-5 backdrop-blur-lg shadow-[0_0_30px_rgba(255,102,0,0.08)] animate-[slide-up_0.5s_ease-out]">
      <div className="text-[10px] font-bold tracking-[3px] uppercase text-utep-orange mb-4">
        🏫 UTEP Connection
      </div>

      {/* Header: icon + college/dept */}
      <div className="flex items-start gap-3.5 mb-4 min-h-14">
        <span className="text-4xl leading-none shrink-0 drop-shadow-[0_0_8px_rgba(255,102,0,0.4)]">
          {utep.icon}
        </span>
        <div className="flex-1">
          <div className="text-[11px] font-bold tracking-widest uppercase text-utep-orange leading-none mb-1">
            {utep.college}
          </div>
          <div className="font-heading text-2xl tracking-wider text-white leading-tight">
            {utep.department}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-utep-orange to-transparent opacity-30 my-4" />

      {/* Explanation */}
      <p className="text-[13px] leading-relaxed text-white/80 mb-3.5">
        {utep.explanation}
      </p>

      {/* Fun fact block */}
      <div className="bg-utep-orange/8 border-l-3 border-utep-orange rounded-r-lg px-3.5 py-2.5">
        <div className="text-[9px] font-bold tracking-[3px] uppercase text-utep-orange mb-1">
          🌟 Did You Know?
        </div>
        <div className="text-xs leading-relaxed text-white/70">
          {utep.fun_fact}
        </div>
      </div>
    </div>
  );
}
