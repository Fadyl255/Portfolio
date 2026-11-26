import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Download, ExternalLink, LoaderCircle } from 'lucide-react'
import { usePreferences } from '../context/Preferences.jsx'
import { profile } from '../content/content.js'
import { Reveal, Section, SectionTitle } from './ui.jsx'

const CvViewer = lazy(() => import('./CvViewer.jsx'))

export default function CvSection() {
  const { t, lang } = usePreferences()
  const c = t.cv
  // La version affichée suit la langue du site, mais peut être changée librement
  const [version, setVersion] = useState(lang)
  useEffect(() => setVersion(lang), [lang])

  // La visionneuse (lourde) n'est chargée qu'à l'approche de la section
  const zoneRef = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = zoneRef.current
    if (!el || !('IntersectionObserver' in window)) return setNear(true)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const file = profile.cv[version]
  const outline =
    'inline-flex items-center justify-center gap-2 rounded border border-line bg-elev px-4 py-2.5 text-sm font-semibold transition-colors hover:border-bright hover:text-accent'

  return (
    <Section id="cv" labelledBy="cv-title" className="border-t border-line">
      <SectionTitle id="cv-title" title={c.title} subtitle={c.subtitle} />
      <Reveal className="card p-4 sm:p-6">
        {/* Commandes */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-wide text-muted">{c.version}</span>
            <div role="tablist" aria-label={c.version} className="inline-flex rounded border border-line p-1">
              {[
                ['fr', 'Français'],
                ['en', 'English'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={version === key}
                  onClick={() => setVersion(key)}
                  className={`rounded-sm px-4 py-1.5 text-sm font-semibold transition-colors ${
                    version === key ? 'bg-navy text-white' : 'text-muted hover:text-fg'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <a href={profile.cv.fr} download={profile.cvFileName.fr} className={outline}>
              <Download size={15} />
              <span className="sm:hidden">FR</span>
              <span className="hidden sm:inline">{c.downloadFr}</span>
            </a>
            <a href={profile.cv.en} download={profile.cvFileName.en} className={outline}>
              <Download size={15} />
              <span className="sm:hidden">EN</span>
              <span className="hidden sm:inline">{c.downloadEn}</span>
            </a>
            <a
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-btn col-span-2 inline-flex items-center justify-center gap-2 rounded px-4 py-2.5 text-sm font-semibold text-white"
            >
              <ExternalLink size={15} />
              {c.open}
            </a>
          </div>
        </div>

        <div ref={zoneRef}>
          {near ? (
            <Suspense fallback={<ViewerPlaceholder text={c.loading} />}>
              <CvViewer key={file} file={file} labels={c} />
            </Suspense>
          ) : (
            <ViewerPlaceholder text={c.loading} />
          )}
        </div>
      </Reveal>
    </Section>
  )
}

function ViewerPlaceholder({ text }) {
  return (
    <div className="grid h-[320px] place-items-center rounded border border-line text-sm text-muted sm:h-[70vh]">
      <span className="flex items-center gap-2">
        <LoaderCircle className="animate-spin text-accent" size={20} />
        {text}
      </span>
    </div>
  )
}
