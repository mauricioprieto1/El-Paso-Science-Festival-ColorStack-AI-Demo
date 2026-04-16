export default function UtepCard({ utep }) {
  return (
    <div className="animate-[slide-up_0.4s_ease-out]">
      {/* Department header */}
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-2xl leading-none">{utep.icon}</span>
        <div>
          <div className="text-[10px] tracking-wider uppercase text-utep-orange/70">
            {utep.college}
          </div>
          <div className="font-heading text-lg tracking-wide text-white leading-tight">
            {utep.department}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-sm leading-relaxed text-white/60 mb-3">
        {utep.explanation}
      </p>

      {/* Fun fact */}
      <div className="bg-utep-orange/5 border-l-2 border-utep-orange/40 rounded-r-md px-3 py-2">
        <div className="text-[9px] font-semibold tracking-widest uppercase text-utep-orange/60 mb-0.5">
          Fun Fact
        </div>
        <div className="text-xs leading-relaxed text-white/50">
          {utep.fun_fact}
        </div>
      </div>
    </div>
  );
}
