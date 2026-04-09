export default function NameInput({ name, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="artistName"
        className="text-[11px] tracking-widest uppercase text-utep-text-dim whitespace-nowrap"
      >
        Your Name
      </label>
      <input
        id="artistName"
        type="text"
        maxLength={30}
        placeholder="Anonymous Artist"
        value={name}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-utep-glass border border-utep-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-utep-text-dim/60 outline-none focus:border-utep-orange transition-colors"
      />
    </div>
  );
}
