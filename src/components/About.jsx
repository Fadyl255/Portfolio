import { Compass, GraduationCap, Heart, Target } from 'lucide-react'
import { usePreferences } from '../context/Preferences.jsx'
import { Card, Chip, Reveal, Section } from './ui.jsx'

export default function About() {
  const { t } = usePreferences()
  const a = t.about

  return (
    <Section id="about" eyebrow={a.eyebrow} title={a.title}>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <div className="space-y-5 text-base leading-relaxed text-muted sm:text-lg">
          {a.paragraphs.map((p, i) => (
            <Reveal as="p" key={i} delay={i * 80}>
              {p}
            </Reveal>
          ))}
        </div>

        <div className="space-y-4">
          <Reveal delay={80}>
            <Card>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Target size={17} className="text-accent" />
                {a.goalTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{a.goal}</p>
            </Card>
          </Reveal>

          <Reveal delay={140}>
            <Card>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <GraduationCap size={17} className="text-accent" />
                {a.educationTitle}
              </h3>
              <ul className="mt-2 space-y-2 text-sm text-muted">
                {a.education.map((e) => (
                  <li key={e} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {e}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>

          <Reveal delay={200}>
            <Card>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Compass size={17} className="text-accent" />
                {a.interestsTitle}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {a.interests.map((i) => (
                  <Chip key={i} className="border-accent/30 bg-accent-soft text-accent">
                    {i}
                  </Chip>
                ))}
              </div>
              <h3 className="mt-5 flex items-center gap-2 text-sm font-semibold">
                <Heart size={17} className="text-accent" />
                {a.personalTitle}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {a.personal.map((i) => (
                  <Chip key={i}>{i}</Chip>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
