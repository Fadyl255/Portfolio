import { useEffect, useRef, useState } from 'react'

/** Fait apparaître son contenu en douceur lorsqu'il entre dans l'écran. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Enveloppe commune des sections : ancre, numéro et titre. */
export function Section({ id, eyebrow, title, intro, children, className = '' }) {
  return (
    <section id={id} className={`relative py-14 sm:py-20 ${className}`} aria-labelledby={`${id}-title`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-8 sm:mb-12">
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm text-accent">{eyebrow}.</span>
            <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h2>
            <span className="hidden h-px flex-1 bg-line sm:block" aria-hidden="true" />
          </div>
          {intro && <p className="mt-4 max-w-2xl text-muted">{intro}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}

export function Chip({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-line bg-soft px-3 py-1 text-xs font-medium text-muted ${className}`}
    >
      {children}
    </span>
  )
}

export function Card({ className = '', children }) {
  return (
    <div
      className={`rounded-2xl border border-line bg-elev p-6 transition-colors duration-300 hover:border-accent/40 ${className}`}
    >
      {children}
    </div>
  )
}
