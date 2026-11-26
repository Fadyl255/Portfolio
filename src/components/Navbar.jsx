import { useEffect, useState } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { usePreferences } from '../context/Preferences.jsx'
import { profile } from '../content/content.js'

const SECTIONS = ['about', 'skills', 'experience', 'projects', 'education', 'cv', 'contact']

function LangSwitch({ className = '' }) {
  const { lang, setLang, t } = usePreferences()
  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={`inline-flex rounded-full border border-line bg-soft p-0.5 font-mono text-xs ${className}`}
    >
      {['fr', 'en'].map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
            lang === l ? 'bg-accent text-accent-fg' : 'text-muted hover:text-fg'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

function ThemeButton() {
  const { theme, toggleTheme, t } = usePreferences()
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t.nav.theme}
      title={t.nav.theme}
      className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent/50 hover:text-fg"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

export default function Navbar() {
  const { t } = usePreferences()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Met en évidence la section visible
  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Bloque le défilement quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'border-b border-line bg-bg/85 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg"
      >
        {t.nav.skip}
      </a>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="group flex items-center gap-2.5" aria-label={profile.fullName}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-fg font-mono text-sm font-semibold text-bg transition-transform group-hover:-rotate-3">
            FE
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:block">{profile.fullName}</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {SECTIONS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? 'true' : undefined}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  active === id ? 'text-accent' : 'text-muted hover:text-fg'
                }`}
              >
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LangSwitch />
          <ThemeButton />
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-fg lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.close : t.nav.menu}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <div
        id="mobile-menu"
        className={`overflow-hidden transition-[max-height,opacity] duration-300 lg:hidden ${
          open ? 'max-h-[80vh] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <ul className="mx-auto max-w-6xl space-y-1 px-4 pb-6 pt-2 sm:px-6">
          {SECTIONS.map((id, i) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-base transition-colors hover:bg-soft ${
                  active === id ? 'text-accent' : 'text-fg'
                }`}
              >
                <span className="font-mono text-xs text-accent">0{i + 1}.</span>
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
