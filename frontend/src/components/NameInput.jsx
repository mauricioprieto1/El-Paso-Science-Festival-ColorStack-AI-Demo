export default function NameInput({ name, onChange }) {
  return (
    <input
      type="text"
      maxLength={30}
      placeholder="Your name (optional)"
      value={name}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent border-b border-white/10 px-1 py-1.5 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-utep-orange/50 transition-colors w-full"
    />
  );
}
