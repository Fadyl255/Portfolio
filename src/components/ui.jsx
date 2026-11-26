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
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
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

/** Grand titre centré en majuscules, souligné d'une barre cyan. */
export function SectionTitle({ id, title, subtitle }) {
  return (
    <Reveal className="mb-12 text-center sm:mb-14">
      <h2 id={id} className="text-3xl font-bold uppercase tracking-wide sm:text-[2.6rem]">
        {title}
      </h2>
      {subtitle && <p className="mx-auto mt-3 max-w-xl text-sm text-muted sm:text-base">{subtitle}</p>}
      <span className="mx-auto mt-5 block h-1 w-10 rounded-full bg-bright" aria-hidden="true" />
    </Reveal>
  )
}

/** Titre de bloc à l'intérieur d'une carte, souligné à gauche. */
export function CardTitle({ as: Tag = 'h3', children, center = false, className = '' }) {
  return (
    <Tag className={`text-xl font-medium sm:text-2xl ${center ? 'text-center' : ''} ${className}`}>
      {children}
      <span className={`mt-2 block h-0.5 w-14 bg-bright ${center ? 'mx-auto' : ''}`} aria-hidden="true" />
    </Tag>
  )
}

/** Section avec fond, espacement et largeur communs. */
export function Section({ id, className = '', children, labelledBy }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative py-16 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}
