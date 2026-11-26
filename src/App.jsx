import { ArrowUp } from 'lucide-react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Profile from './components/Profile.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import CvSection from './components/CvSection.jsx'
import Contact from './components/Contact.jsx'
import { usePreferences } from './context/Preferences.jsx'
import { profile } from './content/content.js'

export default function App() {
  const { t } = usePreferences()
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Profile />
        <Skills />
        <Projects />
        <CvSection />
        <Contact />
      </main>
      <footer className="bg-black text-white/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} <strong className="text-white">{profile.fullName}</strong> — Portfolio. {t.footer.rights}
          </p>
          <a href="#top" className="inline-flex items-center gap-1 hover:text-white">
            <ArrowUp size={15} />
            {t.footer.top}
          </a>
        </div>
      </footer>
    </>
  )
}
