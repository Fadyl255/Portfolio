import { FileText, MapPin } from 'lucide-react'
import { usePreferences } from '../context/Preferences.jsx'
import { CardTitle, Reveal, Section } from './ui.jsx'
import photo from '../assets/photo.jpg'

/** Frise verticale : un point cyan par étape. */
function Timeline({ items, render }) {
  return (
    <ol className="relative ml-2 mt-6 space-y-7 border-l border-line pl-7">
      {items.map((item, i) => (
        <li key={i} className="relative">
          <span
            className="absolute -left-[37px] top-0.5 h-[18px] w-[18px] rounded-full border-[3px] border-bright bg-elev"
            aria-hidden="true"
          />
          {render(item)}
        </li>
      ))}
    </ol>
  )
}

export default function Profile() {
  const { t } = usePreferences()
  const p = t.profile

  return (
    <Section id="profile" labelledBy="profile-title">
      <Reveal className="card p-6 sm:p-10">
        {/* Photo + présentation */}
        <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12">
          <div className="mx-auto w-full max-w-[340px] md:max-w-none">
            <img
              src={photo}
              alt={p.photoAlt}
              width="520"
              height="520"
              className="aspect-square w-full rounded-md object-cover"
            />
            <div className="mt-5 space-y-2 text-center text-sm font-semibold">
              <p className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                {p.status}
              </p>
              <p className="flex items-center justify-center gap-1.5 font-medium text-muted">
                <MapPin size={15} className="text-accent" />
                {p.location}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <CardTitle as="h2" center>
              <span id="profile-title">{p.title}</span>
            </CardTitle>
            <div className="mt-6 space-y-4 text-center leading-relaxed text-muted sm:text-[1.05rem]">
              {p.paragraphs.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </div>
        </div>

        <hr className="my-10 border-line" />

        {/* Expériences | Formations */}
        <div className="grid gap-12 md:grid-cols-2 md:gap-10">
          <div>
            <CardTitle>{p.experienceTitle}</CardTitle>
            <Timeline
              items={t.experience}
              render={(e) => (
                <>
                  <p className="text-sm font-semibold">{e.company}</p>
                  <p className="text-sm text-subtle">{e.period}</p>
                  <h4 className="mt-2 border-b border-line pb-2 text-lg font-medium">{e.role}</h4>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted marker:text-bright">
                    {e.tasks.map((task) => (
                      <li key={task}>{task}</li>
                    ))}
                  </ul>
                </>
              )}
            />
          </div>

          <div>
            <CardTitle>{p.educationTitle}</CardTitle>
            <Timeline
              items={t.education}
              render={(e) => (
                <>
                  <p className="text-sm font-semibold">{e.school}</p>
                  <p className="text-sm text-subtle">
                    {e.period}
                    {e.ongoing && (
                      <span className="ml-2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {p.ongoing}
                      </span>
                    )}
                  </p>
                  <h4 className="mt-2 text-lg font-medium leading-snug">{e.title}</h4>
                </>
              )}
            />

            {/* Affiché uniquement si des certifications sont renseignées dans content.js */}
            {t.certifications.length > 0 && (
              <div className="mt-10">
                <CardTitle>{t.certificationsTitle}</CardTitle>
                <Timeline
                  items={t.certifications}
                  render={(e) => (
                    <>
                      <p className="text-sm font-semibold">{e.school}</p>
                      <p className="text-sm text-subtle">{e.period}</p>
                      <h4 className="mt-2 text-lg font-medium leading-snug">{e.title}</h4>
                    </>
                  )}
                />
              </div>
            )}
          </div>
        </div>

        <a
          href="#cv"
          className="gradient-btn mt-12 flex items-center justify-center gap-2 rounded px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
        >
          {p.cvButton}
          <FileText size={16} />
        </a>
      </Reveal>
    </Section>
  )
}
