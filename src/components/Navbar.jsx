import { useEffect, useState } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { usePreferences } from '../context/Preferences.jsx'

const SECTIONS = ['profile', 'skills', 'projects', 'cv', 'contact']

function LangSwitch() {
  const { lang, setLang, t } = usePreferences()
  return (
    <div role="group" aria-label={t.nav.language} className="inline-flex rounded-full border border-white/20 p-0.5 text-xs font-semibold">
      {['fr', 'en'].map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
            lang === l ? 'bg-white text-black' : 'text-white/70 hover:text-white'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export default function Navbar() {
  const { t, theme, toggleTheme } = usePreferences()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  // Met en évidence la section visible
  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Menu mobile : bloque le défilement, se ferme avec Échap
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black/95 text-white backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-black"
      >
        {t.nav.skip}
      </a>
      <nav className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="text-xl font-bold uppercase tracking-wide">
          {t.nav.brand}
        </a>

        <div className="flex items-center gap-6">
          <ul className="hidden items-center gap-7 md:flex">
            {SECTIONS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? 'true' : undefined}
                  className={`text-[13px] font-bold uppercase tracking-wide transition-colors ${
                    active === id ? 'text-bright' : 'text-white hover:text-bright'
                  }`}
                >
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <LangSwitch />
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t.nav.theme}
              title={t.nav.theme}
              className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition-colors hover:text-white"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.close : t.nav.menu}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-white/10 transition-[max-height,opacity] duration-300 md:hidden ${
          open ? 'max-h-96 opacity-100' : 'pointer-events-none max-h-0 border-transparent opacity-0'
        }`}
      >
        <ul className="px-4 py-3">
          {SECTIONS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className={`block py-3 text-sm font-bold uppercase tracking-wide ${active === id ? 'text-bright' : 'text-white'}`}
              >
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
