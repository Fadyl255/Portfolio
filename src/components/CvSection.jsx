import { lazy, Suspense, useEffect, useState } from 'react'
import { Download, ExternalLink, LoaderCircle } from 'lucide-react'
import { usePreferences } from '../context/Preferences.jsx'
import { profile } from '../content/content.js'
import { Reveal, Section } from './ui.jsx'

const CvViewer = lazy(() => import('./CvViewer.jsx'))

export default function CvSection() {
  const { t, lang } = usePreferences()
  const c = t.cv
  // La version affichée suit la langue du site, mais peut être changée librement
  const [version, setVersion] = useState(lang)
  useEffect(() => setVersion(lang), [lang])

  const file = profile.cv[version]

  return (
    <Section id="cv" eyebrow={c.eyebrow} title={c.title} intro={c.intro}>
      <Reveal>
        {/* Commandes */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">{c.version}</span>
            <div role="tablist" aria-label={c.version} className="inline-flex rounded-full border border-line bg-elev p-1">
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
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    version === key ? 'bg-accent text-accent-fg' : 'text-muted hover:text-fg'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <a
              href={profile.cv.fr}
              download={profile.cvFileName.fr}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-elev px-4 py-2 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Download size={15} />
              <span className="sm:hidden">FR</span>
              <span className="hidden sm:inline">{c.downloadFr}</span>
            </a>
            <a
              href={profile.cv.en}
              download={profile.cvFileName.en}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-elev px-4 py-2 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Download size={15} />
              <span className="sm:hidden">EN</span>
              <span className="hidden sm:inline">{c.downloadEn}</span>
            </a>
            <a
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition-transform hover:-translate-y-0.5"
            >
              <ExternalLink size={15} />
              {c.open}
            </a>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="grid h-[70vh] min-h-[420px] place-items-center rounded-2xl border border-line bg-elev text-sm text-muted">
              <span className="flex items-center gap-2">
                <LoaderCircle className="animate-spin text-accent" size={20} />
                {c.loading}
              </span>
            </div>
          }
        >
          <CvViewer key={file} file={file} labels={c} />
        </Suspense>
      </Reveal>
    </Section>
  )
}
