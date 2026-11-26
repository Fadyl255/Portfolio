import { Award, GraduationCap, Network } from 'lucide-react'
import { usePreferences } from '../context/Preferences.jsx'
import { Reveal, Section } from './ui.jsx'

function Entry({ item, ongoingLabel }) {
  return (
    <li className="relative flex flex-col gap-1.5 rounded-xl border border-line bg-elev p-5 transition-colors hover:border-accent/40 sm:flex-row sm:gap-4">
      <span className="shrink-0 pt-0.5 font-mono text-xs text-subtle sm:w-40">{item.period}</span>
      <div className="min-w-0">
        <h4 className="font-semibold leading-snug">
          {item.title}
          {item.ongoing && (
            <span className="ml-2 inline-flex translate-y-[-1px] items-center rounded-full bg-emerald-500/10 px-2 py-0.5 align-middle text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {ongoingLabel}
            </span>
          )}
        </h4>
        <p className="mt-1 text-sm text-muted">{item.school}</p>
      </div>
    </li>
  )
}

export default function Education() {
  const { t } = usePreferences()
  const e = t.education

  return (
    <Section id="education" eyebrow={e.eyebrow} title={e.title}>
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted">
            <GraduationCap size={17} className="text-accent" />
            {e.degreesTitle}
          </h3>
          <ol className="space-y-3">
            {e.degrees.map((d) => (
              <Entry key={d.title} item={d} ongoingLabel={e.ongoing} />
            ))}
          </ol>
        </Reveal>

        <div className="space-y-8">
          <Reveal delay={100}>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted">
              <Network size={17} className="text-accent" />
              {e.extraTitle}
            </h3>
            <ol className="space-y-3">
              {e.extra.map((d) => (
                <Entry key={d.title} item={d} ongoingLabel={e.ongoing} />
              ))}
            </ol>
          </Reveal>

          {/* Affiché uniquement si des certifications sont renseignées dans content.js */}
          {e.certifications.length > 0 && (
            <Reveal delay={160}>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted">
                <Award size={17} className="text-accent" />
                {e.certificationsTitle}
              </h3>
              <ol className="space-y-3">
                {e.certifications.map((d) => (
                  <Entry key={d.title} item={d} ongoingLabel={e.ongoing} />
                ))}
              </ol>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  )
}
