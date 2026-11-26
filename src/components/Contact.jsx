import { useState } from 'react'
import { Check, Copy, LoaderCircle, Mail, MapPin, Phone, Send } from 'lucide-react'
import { usePreferences } from '../context/Preferences.jsx'
import { profile } from '../content/content.js'
import { GithubIcon, LinkedinIcon } from './BrandIcons.jsx'
import { Reveal, Section } from './ui.jsx'

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
    'w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-fg placeholder:text-subtle transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'

  return (
    <Section id="contact" eyebrow={c.eyebrow} title={c.title} intro={c.intro} className="bg-soft/40">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Reveal className="space-y-3">
          <div className="flex items-center gap-4 rounded-2xl border border-line bg-elev p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
              <Mail size={19} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-subtle">{c.email}</p>
              <a href={`mailto:${profile.email}`} className="block truncate font-medium hover:text-accent">
                {profile.email}
              </a>
            </div>
            <button
              type="button"
              onClick={copyEmail}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-soft hover:text-fg"
              aria-label={copied ? c.copied : c.copy}
              title={copied ? c.copied : c.copy}
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
          </div>

          <a href={profile.phoneHref} className="flex items-center gap-4 rounded-2xl border border-line bg-elev p-5 transition-colors hover:border-accent/40">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
              <Phone size={19} />
            </span>
            <div>
              <p className="text-xs text-subtle">{c.phone}</p>
              <p className="font-medium">{profile.phone}</p>
            </div>
          </a>

          <div className="flex items-center gap-4 rounded-2xl border border-line bg-elev p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
              <MapPin size={19} />
            </span>
            <div>
              <p className="text-xs text-subtle">{c.location}</p>
              <p className="font-medium">{c.locationValue}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-elev p-4 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent"
            >
              <LinkedinIcon size={17} />
              LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-elev p-4 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent"
            >
              <GithubIcon size={17} />
              GitHub
            </a>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={onSubmit}
            noValidate
            className="rounded-2xl border border-line bg-elev p-6 sm:p-8"
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

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-transform hover:-translate-y-0.5 disabled:opacity-60"
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
        </Reveal>
      </div>
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
