import { ArrowRight, FileText, MapPin } from 'lucide-react'
import { usePreferences } from '../context/Preferences.jsx'
import { profile } from '../content/content.js'
import { GithubIcon, LinkedinIcon } from './BrandIcons.jsx'
import photo from '../assets/photo.jpg'

export default function Hero() {
  const { t } = usePreferences()
  const h = t.hero

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20">
      {/* Décor */}
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(closest-side, var(--glow), transparent)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.35fr_1fr] lg:gap-16 lg:px-8">
        <div className="order-2 lg:order-1">
          <p className="fade-up inline-flex items-center gap-2 rounded-full border border-line bg-elev/70 px-3 py-1.5 text-xs text-muted" style={{ '--delay': '0ms' }}>
            <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            {h.status}
          </p>

          <p className="fade-up mt-6 font-mono text-sm text-accent" style={{ '--delay': '80ms' }}>
            {h.greeting}
          </p>
          <h1 className="fade-up mt-2 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl" style={{ '--delay': '140ms' }}>
            {profile.firstName}{' '}
            <span className="text-muted">{profile.lastName}</span>
          </h1>

          <p className="fade-up mt-5 text-lg font-medium sm:text-xl" style={{ '--delay': '220ms' }}>
            {h.title} <span className="text-subtle">·</span>{' '}
            <span className="text-accent">{h.subtitle}</span>
          </p>

          <p className="fade-up mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg" style={{ '--delay': '300ms' }}>
            {h.pitch}
          </p>

          <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ '--delay': '380ms' }}>
            <a
              href="#cv"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg shadow-lg shadow-accent/20 transition-transform hover:-translate-y-0.5"
            >
              <FileText size={17} />
              {h.ctaCv}
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-line bg-elev px-6 py-3 text-sm font-semibold transition-colors hover:border-accent/50"
            >
              {h.ctaContact}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="fade-up mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted" style={{ '--delay': '460ms' }}>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} className="text-accent" />
              {h.location}
            </span>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-fg">
              <LinkedinIcon size={15} />
              LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-fg">
              <GithubIcon size={15} />
              GitHub
            </a>
          </div>
        </div>

        {/* Photo */}
        <div className="fade-up order-1 w-full lg:order-2" style={{ '--delay': '120ms' }}>
          <div className="relative mx-auto w-40 sm:w-64 lg:mr-0 lg:w-[360px]">
            <div className="absolute -inset-2 rounded-[2rem] border border-accent/25 lg:-inset-3" aria-hidden="true" />
            <div className="absolute -bottom-4 -right-4 hidden h-24 w-24 rounded-2xl border border-line bg-grid lg:block" aria-hidden="true" />
            <div className="relative aspect-square overflow-hidden rounded-[1.6rem] border border-line bg-soft shadow-2xl shadow-black/20">
              <img
                src={photo}
                alt={h.photoAlt}
                width="520"
                height="520"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
