import { Check, Database, Languages, ShieldCheck, Sparkles, Wrench } from 'lucide-react'
import { usePreferences } from '../context/Preferences.jsx'
import { Card, Reveal, Section } from './ui.jsx'

const GROUP_ICONS = { security: ShieldCheck, data: Database }

export default function Skills() {
  const { t } = usePreferences()
  const s = t.skills

  return (
    <Section id="skills" eyebrow={s.eyebrow} title={s.title} intro={s.intro} className="bg-soft/40">
      <div className="grid gap-4 md:grid-cols-2">
        {s.groups.map((g, gi) => {
          const Icon = GROUP_ICONS[g.id]
          return (
            <Reveal key={g.id} delay={gi * 100}>
              <Card className="h-full">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                    <Icon size={20} />
                  </span>
                  <h3 className="text-lg font-semibold">{g.title}</h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {g.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted sm:text-base">
                      <Check size={16} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          )
        })}
      </div>

      <Reveal delay={80} className="mt-4">
        <Card>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Wrench size={17} className="text-accent" />
            {s.toolsTitle}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {s.tools.map((tool) => (
              <li
                key={tool}
                className="rounded-lg border border-line bg-soft px-3 py-1.5 font-mono text-xs text-fg transition-colors hover:border-accent/50 hover:text-accent"
              >
                {tool}
              </li>
            ))}
          </ul>
        </Card>
      </Reveal>

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Reveal delay={120}>
          <Card className="h-full">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles size={17} className="text-accent" />
              {s.softTitle}
            </h3>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {s.soft.map((item) => (
                <div key={item.title} className="rounded-xl border border-line p-4">
                  <dt className="text-sm font-semibold">{item.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">{item.text}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </Reveal>
        <Reveal delay={180}>
          <Card className="h-full">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Languages size={17} className="text-accent" />
              {s.languagesTitle}
            </h3>
            <dl className="mt-4 space-y-3">
              {s.languages.map((l) => (
                <div key={l.name} className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
                  <dt className="font-medium">{l.name}</dt>
                  <dd className="text-sm text-muted">{l.level}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </Reveal>
      </div>
    </Section>
  )
}
