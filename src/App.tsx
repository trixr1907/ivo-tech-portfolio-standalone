import { lazy, Suspense, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import './App.css'
import './relaunch.css'
import './styles/animation-system.css'

import { ErrorBoundary } from './components/ErrorBoundary'
import { Loader } from './components/ui/Loader'
import { MagButton } from './components/ui/MagButton'
import { CountUp } from './components/ui/CountUp'
import { Cursor } from './components/ui/Cursor'
import { SplitTitle } from './components/ui/SplitTitle'
import { Showcase } from './components/showcase/Showcase'
import { AboutSection, CraftSection, LabSection, ContactSection, RelaunchFooter } from './components/relaunch/RelaunchSections'

const Hero3DLogo = lazy(() => import('./components/Hero3DLogo'))
const COMPACT_HERO_QUERY = '(max-width: 960px), (hover: none), (pointer: coarse)'
const HERO_3D_FALLBACK_SRC = '/brand/logos/ivo-tech-logo-icon.svg'

const navItems = [
  { label: 'Über mich', href: '#about' },
  { label: 'Work', href: '#selected-work' },
  { label: 'Craft', href: '#craft' },
  { label: 'Lab', href: '#lab' },
  { label: 'Kontakt', href: '#kontakt' },
]

/* Live clock: ticking Mannheim time as a living header detail (aria-hidden,
   screen readers get no value from a clock that changes every second) */
function LiveClock() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setTime(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  const formatted = new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Europe/Berlin',
  }).format(time)
  return (
    <span className="h-clock" aria-hidden="true">
      <span className="h-clock-city">Mannheim</span>
      <b className="h-clock-time">{formatted}</b>
    </span>
  )
}

function App() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scrollProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const [compactHero, setCompactHero] = useState(() => window.matchMedia(COMPACT_HERO_QUERY).matches)
  const [loaded, setLoaded] = useState(compactHero)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [canvasReady, setCanvasReady] = useState(false)
  const heroStageRef = useRef<HTMLDivElement>(null)
  const heroVisualRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const enableHero3D = !compactHero && !reduceMotion

  useEffect(() => {
    const query = window.matchMedia(COMPACT_HERO_QUERY)
    const update = () => setCompactHero(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  // Delegated card spotlight: one passive listener sets --mx/--my on the hovered card
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const card = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        '.principle-card, .lab-relaunch-card, .relaunch-project-card',
      )
      if (!card) return
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`)
      card.style.setProperty('--my', `${event.clientY - rect.top}px`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    if (!loaded) return
    const onScroll = () => {
      setScrolled(window.scrollY > 48)
      // Drive the 9-facet disassembly: full explode after ~1.2 viewports of scroll.
      const hero = heroSectionRef.current
      if (hero) {
        const progress = Math.min(Math.max(window.scrollY / (window.innerHeight * 1.2), 0), 1)
        hero.dispatchEvent(new CustomEvent('hero-sequence-progress', { detail: progress }))
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const initialHash = window.location.hash
    if (initialHash) {
      window.setTimeout(() => {
        document.getElementById(initialHash.slice(1))?.scrollIntoView({ behavior: 'auto', block: 'start' })
      }, 0)
    }
    return () => window.removeEventListener('scroll', onScroll)
  }, [loaded])

  useEffect(() => {
    if (!loaded) return
    const ids = ['about', 'selected-work', 'craft', 'lab', 'kontakt']
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection('#' + entry.target.id)
        }
      },
      { rootMargin: '-38% 0px -55% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [loaded])

  useEffect(() => {
    if (!loaded || !enableHero3D || canvasReady) return
    const stage = heroStageRef.current
    if (!stage) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setCanvasReady(true)
      observer.disconnect()
    }, { threshold: 0.01 })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [loaded, enableHero3D, canvasReady])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    const menuTrigger = burgerRef.current
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const focusable = mobileMenuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    focusable?.[0]?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMobileMenuOpen(false)
        return
      }
      if (event.key !== 'Tab' || !focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      menuTrigger?.focus()
    }
  }, [mobileMenuOpen])

  const scrollTo = (href: string) => {
    const id = href.slice(1)
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    setMobileMenuOpen(false)
    window.history.pushState(null, '', href)
  }

  const handleNavClick = (event: ReactMouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    event.preventDefault()
    scrollTo(href)
  }

  return (
    <>
      <AnimatePresence mode="wait">{!loaded && <Loader key="loader" onDone={() => setLoaded(true)} />}</AnimatePresence>
      {loaded && (
        <>
          <a className="skip-link" href="#content">Direkt zum Inhalt</a>
          <Cursor />
          <motion.div className="scroll-progress" style={{ scaleX: scrollProgress }} aria-hidden="true" />

          <motion.header
            className={`site-header ${scrolled ? 'scrolled' : ''}`}
            initial={reduceMotion ? false : { y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Navigation"
          >
            <a className="h-brand" href="#top" aria-label="ivo-tech Portfolio von Yves Simon Schenker" onClick={(event) => handleNavClick(event, '#top')}>
              <img src="/brand/logos/ivo-tech-logo-master.svg" alt="ivo-tech" width={140} height={31} fetchPriority="high" />
            </a>
            <nav className="h-nav" aria-label="Hauptnavigation">
              {navItems.map(({ label, href }, index) => (
                <a key={href} href={href} className={`h-link${activeSection === href ? ' is-active' : ''}`} aria-current={activeSection === href ? 'true' : undefined} onClick={(event) => handleNavClick(event, href)}>
                  <span className="h-link-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  {label}
                </a>
              ))}
            </nav>
            <div className="h-right">
              <LiveClock />
              <span className="h-status"><span className="pulse-dot" /> Online</span>
              <MagButton className="h-btn" href="mailto:contact@ivo-tech.com">Kontakt <ArrowUpRight size={14} /></MagButton>
              <button
                ref={burgerRef}
                className="h-burger"
                aria-label={mobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMobileMenuOpen((value) => !value)}
              >
                <span className="h-burger-bar" /><span className="h-burger-bar" /><span className="h-burger-bar" />
              </button>
            </div>
          </motion.header>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                ref={mobileMenuRef}
                id="mobile-menu"
                className="mobile-menu"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-menu-title"
              >
                <h2 id="mobile-menu-title" className="sr-only">Mobile Navigation</h2>
                <nav>
                  {navItems.map(({ label, href }) => (
                    <a key={href} href={href} className="mobile-menu-link" onClick={(event) => handleNavClick(event, href)}>{label}</a>
                  ))}
                  <a href="mailto:contact@ivo-tech.com" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>Kontakt aufnehmen</a>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>

          <main id="content">
            <section ref={heroSectionRef} className="hero relaunch-hero" id="top" aria-labelledby="hero-h">
              <div className="hero-edge-label" aria-hidden="true">Ivo-Tech · Mannheim</div>
              <div className="relaunch-shell hero-grid">
                <motion.div className="hero-copy" initial={compactHero || reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}>
                  <div className="hero-eyebrow">
                    <span>
                      Yves Simon Schenker (Ivo) · Full-Stack Developer mit Frontend-Fokus
                      <span className="sr-only">Full-Stack Development / Frontend Craft</span>
                    </span>
                    <span className="hero-eyebrow-location">Mannheim/Rhein-Neckar · Remote &amp; Hybrid</span>
                  </div>
                  <SplitTitle lines={['Ich baue,', 'was bleibt.']} immediate={compactHero} />
                  <p className="hero-sub">Ich entwickle produktionsreife Webapplikationen — vom belastbaren System bis zum präzisen Interface und stabilen Live-Betrieb.</p>
                  <div className="hero-proof" aria-label="Kennzahlen">
                    <div className="hero-proof-item">
                      <span className="hero-proof-value"><CountUp value={4} /></span>
                      <span className="hero-proof-label">Live-Systeme</span>
                    </div>
                    <div className="hero-proof-item">
                      <span className="hero-proof-value"><CountUp value={15} /></span>
                      <span className="hero-proof-label">Component Tests</span>
                    </div>
                    <div className="hero-proof-item">
                      <span className="hero-proof-value"><CountUp value={408} /></span>
                      <span className="hero-proof-label">GOALS Tests</span>
                    </div>
                  </div>
                  <div className="hero-ctas">
                    <MagButton className="btn-primary" href="#selected-work" onClick={(event) => handleNavClick(event, '#selected-work')}>Projekte ansehen <ArrowUpRight size={16} /></MagButton>
                    <MagButton className="btn-ghost" href="/yves-simon-schenker-cv.pdf" download>Lebenslauf</MagButton>
                    <MagButton className="btn-ghost" href="mailto:contact@ivo-tech.com">Kontakt</MagButton>
                  </div>
                  <div className="hero-meta"><span>Offen für passende Remote- und Hybrid-Rollen</span><span><ArrowDown size={14} aria-hidden="true" /> Scrollen</span></div>
                </motion.div>

                <motion.div ref={heroVisualRef} className="hero-visual" initial={compactHero || reduceMotion ? false : { opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} aria-label="ivo-tech 9-Facet-Emblem">
                  <div className="hero-visual-grid" aria-hidden="true" />
                  <div className="hero-visual-beam" aria-hidden="true" />
                  <div className="hero-visual-readout hero-visual-readout--top" aria-hidden="true">
                    <span>Neun Teile</span><b>Ein System</b>
                  </div>
                  <div className="hv-webgl-stage" ref={heroStageRef}>
                    <ErrorBoundary fallback={<img className="hv-fallback" src={HERO_3D_FALLBACK_SRC} alt="ivo-tech Logo" width={246} height={149} />}>
                      {enableHero3D ? (
                        <Suspense fallback={<img className="hv-emblem hero-3d-fallback-image" src={HERO_3D_FALLBACK_SRC} alt="ivo-tech Logo" width={246} height={149} fetchPriority="high" />}>
                          {canvasReady && <Hero3DLogo fallbackSrc={HERO_3D_FALLBACK_SRC} alt="ivo-tech 9-Facet-Emblem aus mattem Werkzeugstahl" />}
                        </Suspense>
                      ) : (
                        <div className="hero-3d-logo hero-3d-logo--fallback" role="img" aria-label="ivo-tech 9-Facet-Emblem" data-mode="fallback">
                          <img className="hv-emblem hero-3d-fallback-image" src={HERO_3D_FALLBACK_SRC} alt="" aria-hidden="true" width={246} height={149} fetchPriority="high" />
                        </div>
                      )}
                    </ErrorBoundary>
                  </div>
                  <div className="hero-object-caption"><span>Das ivo-tech Emblem</span><span>Folgt dem Zeiger</span></div>
                </motion.div>
              </div>
            </section>

            <AboutSection />

            <section className="principle-marquee" aria-hidden="true">
              <div className="principle-marquee-track">
                {[0, 1].map((group) => (
                  <span className="principle-marquee-group" key={group}>
                    Präzision <i>✦</i> Stabilität <i>✦</i> Craft <i>✦</i> Systemtiefe <i>✦</i> Tests <i>✦</i> Security <i>✦</i> Performance <i>✦</i> Klarheit <i>✦</i>
                  </span>
                ))}
              </div>
            </section>

            <Suspense fallback={<div className="section-loading">Selected Work wird geladen …</div>}><Showcase /></Suspense>
            <CraftSection />
            <LabSection />
            <ContactSection />
          </main>
          <RelaunchFooter />
        </>
      )}
    </>
  )
}

export default App
