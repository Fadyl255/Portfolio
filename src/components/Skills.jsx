import { Compass, Database, Languages, ShieldCheck, Sparkles, Wrench } from 'lucide-react'
import { usePreferences } from '../context/Preferences.jsx'
import { Reveal, Section, SectionTitle } from './ui.jsx'

const ICONS = {
  security: ShieldCheck,
  data: Database,
  tools: Wrench,
  method: Sparkles,
  languages: Languages,
  interests: Compass,
}

export default function Skills() {
  const { t } = usePreferences()
  const s = t.skills

  return (
    <Section id="skills" labelledBy="skills-title" className="border-t border-line">
      <SectionTitle id="skills-title" title={s.title} subtitle={s.subtitle} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {s.cards.map((card, i) => {
          const Icon = ICONS[card.id]
          return (
            <Reveal key={card.id} delay={(i % 3) * 90} className="card flex flex-col items-center px-6 pb-8 pt-8 text-center transition-transform duration-300 hover:-translate-y-1">
              <span className="grid h-20 w-20 place-items-center rounded-full border-[5px] border-navy text-navy dark:border-bright dark:text-bright">
                <Icon size={30} strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-lg font-medium uppercase tracking-wide">{card.title}</h3>

              {card.items && (
                <ul className="mt-4 space-y-1.5 text-[15px] text-muted">
                  {card.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}

              {card.chips && (
                <ul className="mt-4 flex flex-wrap justify-center gap-2">
                  {card.chips.map((c) => (
                    <li key={c} className="rounded bg-accent-soft px-2.5 py-1 text-[13px] font-medium text-accent">
                      {c}
                    </li>
                  ))}
                </ul>
              )}

              {card.pairs && (
                <dl className="mt-4 w-full max-w-[220px] space-y-2 text-[15px]">
                  {card.pairs.map(([name, level]) => (
                    <div key={name} className="flex justify-between border-b border-line pb-2">
                      <dt className="font-semibold">{name}</dt>
                      <dd className="text-muted">{level}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
