import { useEffect, useState } from 'react'
import { ChevronDown, FileText, Mail } from 'lucide-react'
import { usePreferences } from '../context/Preferences.jsx'
import { profile } from '../content/content.js'

/** Effet machine à écrire : tape, attend, efface, passe à la phrase suivante. */
function useTyped(phrases) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Repart de zéro quand la langue change
  useEffect(() => {
    setIndex(0)
    setText('')
    setDeleting(false)
  }, [phrases])

  useEffect(() => {
    if (reduce) return
    const full = phrases[index % phrases.length]
    let delay = deleting ? 35 : 70
    if (!deleting && text === full) delay = 2200
    if (deleting && text === '') delay = 350
    const id = setTimeout(() => {
      if (!deleting && text === full) setDeleting(true)
      else if (deleting && text === '') {
        setDeleting(false)
        setIndex((i) => i + 1)
      } else setText(full.slice(0, text.length + (deleting ? -1 : 1)))
    }, delay)
    return () => clearTimeout(id)
  }, [text, deleting, index, phrases, reduce])

  return reduce ? phrases[0] : text
}

export default function Hero() {
  const { t } = usePreferences()
  const h = t.hero
  const typed = useTyped(h.typed)

  return (
    <section id="top" className="hero-bg relative flex min-h-[100svh] items-center justify-center overflow-hidden text-white">
      {/* Fond animé : halos de couleur et traînées lumineuses */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="hero-blob drift-a left-[-10%] top-[5%] h-[55vh] w-[55vh] bg-[#1d3fd1]" />
        <div className="hero-blob drift-b right-[-8%] top-[20%] h-[50vh] w-[50vh] bg-[#6b21c8]" />
        <div className="hero-blob drift-c bottom-[-15%] left-[30%] h-[45vh] w-[45vh] bg-[#0e7490]" />
        <div className="hero-blob drift-b bottom-[10%] left-[2%] h-[25vh] w-[25vh] bg-[#be185d] opacity-30" />
        {[
          ['18%', '#60a5fa', '0s'],
          ['32%', '#a78bfa', '2.5s'],
          ['47%', '#38bdf8', '5s'],
          ['63%', '#818cf8', '1.2s'],
          ['76%', '#22d3ee', '6.5s'],
          ['88%', '#c084fc', '3.8s'],
        ].map(([top, color, delay]) => (
          <span
            key={top}
            className="streak"
            style={{ top, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, animationDelay: delay }}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)]" />
      </div>

      <div className="relative px-4 pb-16 pt-24 text-center">
        <h1 className="fade-up text-[2.6rem] font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl" style={{ '--delay': '100ms' }}>
          {profile.firstName} {profile.lastName}
        </h1>
        <p className="fade-up mt-4 min-h-[2.2em] text-xl font-semibold text-white/90 sm:text-3xl" style={{ '--delay': '250ms' }} aria-label={h.typed.join(' · ')}>
          <span aria-hidden="true">
            {typed}
            <span className="caret" />
          </span>
        </p>

        <div className="fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ '--delay': '450ms' }}>
          <a
            href="#cv"
            className="gradient-btn inline-flex w-60 items-center justify-center gap-2 rounded px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white sm:w-auto"
          >
            <FileText size={16} />
            {h.ctaCv}
          </a>
          <a
            href="#contact"
            className="inline-flex w-60 items-center justify-center gap-2 rounded border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black sm:w-auto"
          >
            <Mail size={16} />
            {h.ctaContact}
          </a>
        </div>
      </div>

      <a
        href="#profile"
        aria-label={h.scroll}
        className="bounce-soft absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 transition-colors hover:text-white"
      >
        <ChevronDown size={30} />
      </a>
    </section>
  )
}
