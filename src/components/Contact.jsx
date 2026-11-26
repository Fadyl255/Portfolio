import { useState } from 'react'
import { Check, Copy, LoaderCircle, Mail, MapPin, Phone, Send } from 'lucide-react'
import { usePreferences } from '../context/Preferences.jsx'
import { profile } from '../content/content.js'
import { GithubIcon, LinkedinIcon } from './BrandIcons.jsx'
import { CardTitle, Reveal, Section } from './ui.jsx'

const EMPTY = { name: '', email: '', subject: '', message: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function encode(data) {
  return new URLSearchParams(data).toString()
}

export default function Contact() {
  const { t } = usePreferences()
  const c = t.contact
  const f = c.form
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | mailto | error
  const [copied, setCopied] = useState(false)

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
    setErrors((er) => ({ ...er, [e.target.name]: undefined }))
  }

  const validate = () => {
    const er = {}
    if (!values.name.trim()) er.name = f.required
    if (!values.email.trim()) er.email = f.required
    else if (!EMAIL_RE.test(values.email.trim())) er.email = f.invalidEmail
    if (!values.message.trim()) er.message = f.required
    setErrors(er)
    return Object.keys(er).length === 0
  }

  // Solution de repli : ouvre la messagerie du visiteur avec le message pré-rempli
  const openMailto = () => {
    const subject = values.subject.trim() || `Portfolio — ${values.name.trim()}`
    const body = `${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setStatus('mailto')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (e.target.elements['bot-field']?.value) return
    if (!validate()) return

    // En développement local, Netlify Forms n'existe pas : on passe par l'e-mail
    if (!import.meta.env.PROD) {
      openMailto()
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...values }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('success')
      setValues(EMPTY)
    } catch {
      // Hébergement sans Netlify Forms (ex. Vercel) : repli sur l'e-mail
      openMailto()
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* presse-papiers indisponible */
    }
  }

  const input =
    'w-full rounded border border-line bg-bg px-4 py-3 text-sm text-fg placeholder:text-subtle transition-colors focus:border-bright focus:outline-none focus:ring-2 focus:ring-bright/20'

  return (
    <Section id="contact" labelledBy="contact-title" className="border-t border-line">
      <Reveal className="card grid gap-12 p-6 sm:p-10 lg:grid-cols-[1.25fr_1fr]">
        {/* Formulaire */}
        <div>
          <CardTitle as="h2">
            <span id="contact-title">{c.title}</span>
          </CardTitle>
          <p className="mt-4 text-muted">{c.intro}</p>

          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={onSubmit}
            noValidate
            className="mt-6"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>
                Ne pas remplir : <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="name" label={f.name} error={errors.name}>
                <input id="name" name="name" type="text" autoComplete="name" placeholder={f.namePh} value={values.name} onChange={onChange} className={input} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
              </Field>
              <Field id="email" label={f.email} error={errors.email}>
                <input id="email" name="email" type="email" autoComplete="email" placeholder={f.emailPh} value={values.email} onChange={onChange} className={input} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
              </Field>
            </div>
            <div className="mt-4">
              <Field id="subject" label={f.subject}>
                <input id="subject" name="subject" type="text" placeholder={f.subjectPh} value={values.subject} onChange={onChange} className={input} />
              </Field>
            </div>
            <div className="mt-4">
              <Field id="message" label={f.message} error={errors.message}>
                <textarea id="message" name="message" rows={5} placeholder={f.messagePh} value={values.message} onChange={onChange} className={`${input} resize-y`} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} />
              </Field>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex items-center justify-center gap-2 rounded bg-fg px-8 py-3 text-sm font-semibold uppercase tracking-wide text-bg transition-opacity hover:opacity-85 disabled:opacity-60"
              >
                {status === 'sending' ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
                {status === 'sending' ? f.sending : f.send}
              </button>
              <p role="status" aria-live="polite" className="text-sm">
                {status === 'success' && <span className="text-emerald-600 dark:text-emerald-400">{f.success}</span>}
                {status === 'mailto' && <span className="text-muted">{f.mailto}</span>}
                {status === 'error' && <span className="text-red-500">{f.error}</span>}
              </p>
            </div>
          </form>
        </div>

        {/* Coordonnées et réseaux */}
        <div>
          <CardTitle>{c.details}</CardTitle>
          <ul className="mt-6 space-y-4">
            <li className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-bright" />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-subtle">{c.email}</p>
                <div className="flex items-center gap-1">
                  <a href={`mailto:${profile.email}`} className="truncate font-medium hover:text-accent">
                    {profile.email}
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded text-muted transition-colors hover:bg-soft hover:text-fg"
                    aria-label={copied ? c.copied : c.copy}
                    title={copied ? c.copied : c.copy}
                  >
                    {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone size={18} className="mt-0.5 shrink-0 text-bright" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-subtle">{c.phone}</p>
                <a href={profile.phoneHref} className="font-medium hover:text-accent">
                  {profile.phone}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-bright" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-subtle">{c.location}</p>
                <p className="font-medium">{c.locationValue}</p>
              </div>
            </li>
          </ul>

          <CardTitle className="mt-10">{c.social}</CardTitle>
          <div className="mt-6 space-y-3">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-btn flex items-center justify-center gap-2 rounded px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white"
            >
              LinkedIn
              <LinkedinIcon size={16} />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-btn flex items-center justify-center gap-2 rounded px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white"
            >
              GitHub
              <GithubIcon size={16} />
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
