import { Briefcase, Calendar, MapPin } from 'lucide-react'
import { usePreferences } from '../context/Preferences.jsx'
import { Chip, Reveal, Section } from './ui.jsx'

export default function Experience() {
  const { t } = usePreferences()
  const e = t.experience

  return (
    <Section id="experience" eyebrow={e.eyebrow} title={e.title}>
      <ol className="relative space-y-8 border-l border-line pl-6 sm:pl-10">
        {e.items.map((item, i) => (
          <Reveal as="li" key={item.company} delay={i * 100} className="relative">
            <span
              className="absolute -left-[33px] top-6 grid h-4 w-4 place-items-center rounded-full border-2 border-accent bg-bg sm:-left-[49px]"
              aria-hidden="true"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </span>

            <article className="rounded-2xl border border-line bg-elev p-6 transition-colors hover:border-accent/40 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold sm:text-xl">{item.role}</h3>
                  <p className="mt-1 flex items-center gap-2 font-medium text-accent">
                    <Briefcase size={15} />
                    {item.company}
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-subtle sm:flex-col sm:items-end">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} />
                    {item.period}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} />
                    {item.location}
                  </span>
                </div>
              </div>

              <ul className="mt-5 space-y-2.5">
                {item.tasks.map((task) => (
                  <li key={task} className="flex gap-3 text-sm leading-relaxed text-muted sm:text-base">
                    <span className="mt-2.5 h-1 w-3 shrink-0 rounded-full bg-accent/60" aria-hidden="true" />
                    {task}
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-line pt-4">
                <p className="mb-2 font-mono text-xs uppercase tracking-wider text-subtle">{e.acquired}</p>
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
