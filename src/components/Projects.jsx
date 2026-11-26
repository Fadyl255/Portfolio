import { useRef, useState } from 'react'
import {
  ArrowUpRight,
  ChartColumn,
  CirclePlus,
  ClipboardList,
  Database,
  Factory,
  Lock,
  Monitor,
  Network,
  ShieldCheck,
  UserCheck,
  Workflow,
  X,
} from 'lucide-react'
import { usePreferences } from '../context/Preferences.jsx'
import { profile } from '../content/content.js'
import { GithubIcon } from './BrandIcons.jsx'
import { Reveal, Section, SectionTitle } from './ui.jsx'

/** Illustration à plat de chaque projet (icônes composées sur fond clair). */
function Cover({ id, className = '' }) {
  const tile = 'absolute grid place-items-center rounded-xl shadow-md'
  const art = {
    lab: (
      <>
        <span className={`${tile} left-1/2 top-1/2 h-24 w-32 -translate-x-1/2 -translate-y-1/2 bg-[#3a4a8c] text-white`}>
          <Monitor size={58} strokeWidth={1.4} />
        </span>
        <span className={`${tile} left-[58%] top-[52%] h-12 w-12 rounded-full bg-[#f6c544] text-[#1d2230]`}>
          <ShieldCheck size={26} />
        </span>
        <span className={`${tile} left-[22%] top-[22%] h-10 w-10 bg-white text-[#1cb3d9]`}>
          <Network size={20} />
        </span>
        <span className={`${tile} right-[20%] top-[18%] h-9 w-9 rounded-full bg-[#e2557b] text-white`}>
          <Lock size={16} />
        </span>
      </>
    ),
    erp: (
      <>
        <span className={`${tile} left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 bg-[#1cb3d9] text-white`}>
          <Database size={50} strokeWidth={1.4} />
        </span>
        <span className={`${tile} left-[20%] top-[30%] h-14 w-14 bg-[#3a4a8c] text-white`}>
          <Factory size={28} />
        </span>
        <span className={`${tile} right-[18%] top-[48%] h-14 w-14 bg-white text-[#e2557b]`}>
          <ChartColumn size={28} />
        </span>
      </>
    ),
    app: (
      <>
        <span className={`${tile} left-1/2 top-1/2 h-28 w-24 -translate-x-1/2 -translate-y-1/2 bg-white text-[#3a4a8c]`}>
          <ClipboardList size={50} strokeWidth={1.4} />
        </span>
        <span className={`${tile} left-[18%] top-[22%] h-14 w-14 rounded-full bg-[#f6c544] text-[#1d2230]`}>
          <UserCheck size={26} />
        </span>
        <span className={`${tile} right-[18%] top-[55%] h-14 w-14 bg-[#1cb3d9] text-white`}>
          <Workflow size={26} />
        </span>
      </>
    ),
  }
  return (
    <div className={`relative overflow-hidden bg-cover ${className}`} aria-hidden="true">
      <span className="absolute left-4 top-4 h-2.5 w-2.5 rounded-full bg-[#f6c544]" />
      <span className="absolute left-4 top-8 h-2.5 w-2.5 rounded-full bg-[#3a4a8c]" />
      <span className="absolute bottom-6 right-8 h-16 w-16 rounded-full bg-[#1cb3d9]/10" />
      {art[id]}
    </div>
  )
}

export default function Projects() {
  const { t } = usePreferences()
  const p = t.projects
  const dialogRef = useRef(null)
  const [openId, setOpenId] = useState(null)
  const current = p.items.find((i) => i.id === openId)

  const open = (id) => {
    setOpenId(id)
    dialogRef.current?.showModal()
  }
  const close = () => dialogRef.current?.close()

  return (
    <Section id="projects" labelledBy="projects-title" className="border-t border-line">
      <SectionTitle id="projects-title" title={p.title} subtitle={p.subtitle} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {p.items.map((proj, i) => (
          <Reveal key={proj.id} delay={i * 90}>
            <button
              type="button"
              onClick={() => open(proj.id)}
              className="card group block h-full w-full overflow-hidden text-left transition-transform duration-300 hover:-translate-y-1"
              aria-haspopup="dialog"
            >
              <Cover id={proj.id} className="h-48 transition-transform duration-500 group-hover:scale-[1.03]" />
              <div className="flex items-start justify-between gap-4 p-5">
                <div>
                  <h3 className="text-lg font-medium leading-snug">{proj.title}</h3>
                  <p className="mt-1 text-sm text-accent">{proj.category} /</p>
                </div>
                <CirclePlus size={30} strokeWidth={1.5} className="shrink-0 text-bright transition-transform group-hover:rotate-90" />
                <span className="sr-only">{p.details}</span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10">
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="gradient-btn flex items-center justify-center gap-2 rounded px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
        >
          <GithubIcon size={16} />
          {p.githubCta}
        </a>
      </Reveal>

      {/* Fiche détaillée d'un projet */}
      <dialog
        ref={dialogRef}
        onClose={() => setOpenId(null)}
        onClick={(e) => e.target === dialogRef.current && close()}
        aria-labelledby="project-dialog-title"
        className="m-auto w-[min(680px,calc(100%-2rem))] max-h-[90vh] overflow-hidden rounded-md bg-elev p-0 text-fg shadow-2xl"
      >
        {current && (
          <div className="max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <Cover id={current.id} className="h-44" />
              <button
                type="button"
                onClick={close}
                aria-label={p.close}
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white hover:bg-black"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-sm font-medium text-accent">{current.context}</p>
              <h3 id="project-dialog-title" className="mt-1 text-2xl font-semibold">
                {current.title}
              </h3>

              <dl className="mt-5 space-y-4 text-[15px] leading-relaxed">
                <div>
                  <dt className="font-semibold uppercase tracking-wide text-sm">{p.objective}</dt>
                  <dd className="mt-1 text-muted">{current.objective}</dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-wide text-sm">{p.role}</dt>
                  <dd className="mt-1 text-muted">{current.role}</dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-wide text-sm">{p.done}</dt>
                  <dd>
                    <ul className="mt-1 list-disc space-y-1.5 pl-5 text-muted marker:text-bright">
                      {current.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-wide text-sm">{p.stack}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {current.stack.map((s) => (
                      <span key={s} className="rounded bg-accent-soft px-2.5 py-1 text-[13px] font-medium text-accent">
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              {current.link && (
                <a
                  href={current.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gradient-btn mt-6 inline-flex items-center gap-2 rounded px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {current.title}
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>
        )}
      </dialog>
    </Section>
  )
}
