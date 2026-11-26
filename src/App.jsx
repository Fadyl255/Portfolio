import { ArrowUp } from 'lucide-react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Experience from './components/Experience.jsx'
import Projects from './components/Projects.jsx'
import Education from './components/Education.jsx'
import CvSection from './components/CvSection.jsx'
import Contact from './components/Contact.jsx'
import { usePreferences } from './context/Preferences.jsx'
import { profile } from './content/content.js'
import { GithubIcon, LinkedinIcon } from './components/BrandIcons.jsx'

export default function App() {
  const { t } = usePreferences()
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <CvSection />
        <Contact />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-subtle sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {profile.fullName}. {t.footer.rights}
          </p>
          <div className="flex items-center gap-4">
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-fg">
              <LinkedinIcon size={17} />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-fg">
              <GithubIcon size={17} />
            </a>
            <a href="#top" className="inline-flex items-center gap-1 hover:text-fg">
              <ArrowUp size={15} />
              {t.footer.top}
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
