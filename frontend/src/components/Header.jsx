import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-utep-border bg-utep-navy-deep/85 backdrop-blur-lg shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-utep-orange flex items-center justify-center font-heading text-xl text-white shadow-[0_0_20px_var(--color-utep-orange-glow)]">
          UT
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-xl tracking-widest text-white leading-none">
            UTEP Draw AI
          </span>
          <span className="text-[10px] font-medium tracking-[3px] uppercase text-utep-orange leading-snug">
            El Paso Science Festival · ColorStack
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-xs font-bold tracking-widest uppercase transition-colors ${
              isActive ? 'text-utep-orange' : 'text-utep-text-dim hover:text-white'
            }`
          }
        >
          Draw
        </NavLink>
        <NavLink
          to="/gallery"
          className={({ isActive }) =>
            `text-xs font-bold tracking-widest uppercase transition-colors ${
              isActive ? 'text-utep-orange' : 'text-utep-text-dim hover:text-white'
            }`
          }
        >
          Gallery
        </NavLink>

        {/* Live badge */}
        <div className="flex items-center gap-2 bg-utep-glass border border-utep-border rounded-full px-3 py-1.5 text-[11px] font-medium tracking-widest uppercase text-utep-orange-light">
          <div className="w-2 h-2 rounded-full bg-utep-orange animate-[pulse-dot_1.8s_ease-in-out_infinite]" />
          AI Live
        </div>
      </nav>
    </header>
  )
}
