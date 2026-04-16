import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-5 py-2.5 border-b border-white/5 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-utep-orange flex items-center justify-center font-heading text-sm text-white">
          UT
        </div>
        <span className="font-heading text-base tracking-widest text-white/90 leading-none">
          UTEP Draw AI
        </span>
        <span className="hidden sm:inline text-[9px] tracking-[2px] uppercase text-white/30 ml-1">
          ColorStack · El Paso Science Festival
        </span>
      </div>

      <nav className="flex items-center gap-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-[11px] font-medium tracking-wider uppercase transition-colors ${
              isActive ? 'text-utep-orange' : 'text-white/30 hover:text-white/60'
            }`
          }
        >
          Draw
        </NavLink>
        <NavLink
          to="/gallery"
          className={({ isActive }) =>
            `text-[11px] font-medium tracking-wider uppercase transition-colors ${
              isActive ? 'text-utep-orange' : 'text-white/30 hover:text-white/60'
            }`
          }
        >
          Gallery
        </NavLink>
      </nav>
    </header>
  )
}
