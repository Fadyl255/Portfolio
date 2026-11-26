import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { content } from '../content/content.js'

const PreferencesContext = createContext(null)

function read(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* stockage indisponible : on ignore */
  }
}

function initialLang() {
  const saved = read('lang')
  if (saved === 'fr' || saved === 'en') return saved
  const nav = (navigator.language || 'fr').toLowerCase()
  return nav.startsWith('en') ? 'en' : 'fr'
}

export function PreferencesProvider({ children }) {
  const [lang, setLang] = useState(initialLang)
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )

  useEffect(() => {
    const t = content[lang]
    document.documentElement.lang = lang
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    write('lang', lang)
  }, [lang])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#07111f' : '#f7f9fc')
  }, [theme])

  const toggleLang = useCallback(() => setLang((l) => (l === 'fr' ? 'en' : 'fr')), [])
  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      write('theme', next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, theme, toggleTheme, t: content[lang] }),
    [lang, theme, toggleLang, toggleTheme],
  )
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences doit être utilisé dans PreferencesProvider')
  return ctx
}
