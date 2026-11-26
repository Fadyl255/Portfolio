import { ArrowUpRight, Database, FlaskConical, Workflow } from 'lucide-react'
import { usePreferences } from '../context/Preferences.jsx'
import { profile } from '../content/content.js'
import { GithubIcon } from './BrandIcons.jsx'
import { Reveal, Section } from './ui.jsx'

const ICONS = { lab: FlaskConical, erp: Database, app: Workflow }

export default function Projects() {
  const { t } = usePreferences()
  const p = t.projects
  const [featured, ...others] = p.items

  return (
    <Section id="projects" eyebrow={p.eyebrow} title={p.title} intro={p.intro} className="bg-soft/40">
      {/* Projet principal : le laboratoire */}
      <Reveal>
        <ProjectCard project={featured} labels={p} featured />
      </Reveal>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {others.map((proj, i) => (
          <Reveal key={proj.id} delay={i * 100}>
            <ProjectCard project={proj} labels={p} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8 text-center">
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-elev px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
        >
          <GithubIcon size={16} />
          {p.githubCta}
          <ArrowUpRight size={15} />
        </a>
      </Reveal>
    </Section>
  )
}

function ProjectCard({ project, labels, featured = false }) {
  const Icon = ICONS[project.id] ?? FlaskConical
  return (
    <article
      className={`group relative h-full overflow-hidden rounded-2xl border border-line bg-elev p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 sm:p-8 ${
        featured ? 'lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-10' : ''
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent">
            <Icon size={21} />
          </span>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent"
              aria-label={project.title}
            >
              <ArrowUpRight size={20} />
            </a>
          )}
        </div>
        <p className="mt-5 font-mono text-xs text-accent">{project.tag}</p>
        <h3 className={`mt-2 font-semibold tracking-tight ${featured ? 'text-2xl' : 'text-xl'}`}>{project.title}</h3>

        <dl className="mt-4 space-y-3 text-sm leading-relaxed">
          <div>
            <dt className="font-semibold text-fg">{labels.objective}</dt>
            <dd className="text-muted">{project.objective}</dd>
          </div>
          <div>
            <dt className="font-semibold text-fg">{labels.role}</dt>
            <dd className="text-muted">{project.role}</dd>
          </div>
        </dl>
      </div>

      <div className={featured ? 'mt-6 lg:mt-0' : 'mt-5'}>
        {featured && (
          <ul className="space-y-3 rounded-xl border border-line bg-soft/60 p-5 font-mono text-[13px] leading-relaxed text-muted">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span className="text-accent" aria-hidden="true">
                  ›
                </span>
                <span className="font-sans text-sm">{h}</span>
              </li>
            ))}
          </ul>
        )}
        <div className={featured ? 'mt-5' : ''}>
          <p className="sr-only">{labels.stack}</p>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li key={s} className="rounded-md bg-accent-soft px-2.5 py-1 font-mono text-xs text-accent">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}
