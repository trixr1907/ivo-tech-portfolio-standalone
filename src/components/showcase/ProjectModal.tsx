import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Project } from '../../data/projects'

type ProjectModalProps = {
  project: Project
  onClose: () => void
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.28, ease: [0.19, 1, 0.22, 1] as const } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const, delay: 0.05 } },
}

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 24 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 380, damping: 32, mass: 0.9 },
  },
  exit: {
    opacity: 0, scale: 0.96, y: 12,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
  },
}

const lightboxOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.16 } },
}

const lightboxImg = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 400, damping: 28 } },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.16 } },
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null)
  const [activeToc, setActiveToc] = useState<string>('overview')

  useEffect(() => {
    const prevActive = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const scrollY = window.scrollY
    const prevHO = document.documentElement.style.overflow
    const prevBO = document.body.style.overflow

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setLightbox((c) => { if (c) return null; onClose(); return c })
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const els = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((e) => !e.hasAttribute('disabled') && e.offsetParent !== null)
      if (!els.length) return
      const [first, last] = [els[0], els[els.length - 1]]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.documentElement.style.overflow = prevHO
      document.body.style.overflow = prevBO
      window.scrollTo(0, scrollY)
      ;(prevActive as HTMLElement)?.focus()
    }
  }, [onClose])

  const tocSections = useMemo(() => [
    { id: 'overview', label: 'Überblick' },
    project.signals ? { id: 'signals', label: 'Signale' } : null,
    project.architecture ? { id: 'architecture', label: 'Architektur' } : null,
    project.fileStates ? { id: 'flächen', label: 'Flächen' } : null,
    { id: 'highlights', label: 'Highlights' },
    project.trustChecks || project.impact ? { id: 'trust', label: 'Betrieb' } : null,
    { id: 'gallery', label: 'Screens' },
  ].filter((s): s is { id: string; label: string } => s !== null), [project])

  useEffect(() => {
    const body = bodyRef.current; if (!body) return
    const targets = tocSections
      .map((s) => body.querySelector<HTMLElement>(`[data-toc-section="${s.id}"]`))
      .filter((e): e is HTMLElement => e !== null)
    if (!targets.length) return
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) {
        const id = e.target.getAttribute('data-toc-section'); if (id) setActiveToc(id)
      }
    }, { root: body, rootMargin: '-18% 0px -70% 0px' })
    targets.forEach((t) => obs.observe(t))
    return () => obs.disconnect()
  }, [tocSections])

  useEffect(() => {
    bodyRef.current
      ?.querySelector<HTMLElement>(`.project-modal__toc [data-toc-target="${activeToc}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activeToc])

  const scrollToSection = useCallback((id: string) => {
    bodyRef.current?.querySelector<HTMLElement>(`[data-toc-section="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const hasLinks = Boolean(project.links.demo || project.links.client || project.links.repo)
  const panelLabel = project.status === 'lab-prototype'
    ? 'Lab Prototype'
    : project.status === 'client-project'
      ? 'Kundenprojekt'
      : 'Live Demo'
  const screenshotLabel = project.status === 'lab-prototype'
    ? 'Lab Prototype Screenshot'
    : project.status === 'client-project'
      ? 'Projekt-Screenshot'
      : 'Live Demo Screenshot'

  return (
    <AnimatePresence>
      <motion.div ref={modalRef} key="modal" className="project-modal is-open" role="presentation"
        variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
        <motion.div ref={dialogRef} className="project-modal__dialog" role="dialog" aria-modal="true"
          aria-labelledby={`${project.id}-modal-title`}
          variants={dialogVariants} initial="hidden" animate="visible" exit="exit"
          onMouseDown={(e) => e.stopPropagation()}>
          <button ref={closeButtonRef} type="button" className="project-modal__close" onClick={onClose} aria-label="Schliessen">×</button>
          <div className="project-modal__body" ref={bodyRef}>
            <nav className="project-modal__toc" aria-label="Case-Study-Inhalt">
              {tocSections.map((s) => (
                <button key={s.id} type="button" data-toc-target={s.id} className={activeToc === s.id ? 'is-active' : undefined}
                  onClick={() => scrollToSection(s.id)}>{s.label}</button>
              ))}
            </nav>
            <header className="project-modal__hero">
              <div className="project-modal__hero-media"
                style={{ '--modal-panel-label': `'${panelLabel}'` } as React.CSSProperties}>
                <img src={project.cover} alt={`${project.title} — Projekt Cover`} loading="lazy" decoding="async" />
              </div>
              <div className="project-modal__hero-copy">
                <span className="project-modal__eyebrow">Project Case Study</span>
                <h2 id={`${project.id}-modal-title`}>{project.title}</h2>
                <p className="project-modal__tagline">{project.tagline}</p>
                <p className="project-modal__problem">{project.problem}</p>
                <div className="project-modal__tags" aria-label="Technologien">
                  {project.tags.map((tag) => (<span key={tag}>{tag}</span>))}
                </div>
              </div>
            </header>
            <div className="project-modal__overview" data-toc-section="overview" aria-label="Projektübersicht">
              <section><span>01</span><h3>Was gebaut</h3><p>{project.overview.built}</p></section>
              <section><span>02</span><h3>Herausforderung</h3><p>{project.overview.challenge}</p></section>
              <section><span>03</span><h3>Rolle</h3><p>{project.overview.role}</p></section>
            </div>
            {project.signals ? (
              <section className="project-modal__signals" data-toc-section="signals" aria-label="Projekt-Signale">
                {project.signals.map((s) => (<article key={s.label}><span>{s.label}</span><strong>{s.value}</strong><p>{s.text}</p></article>))}
              </section>) : null}
            {project.architecture ? (
              <section className="project-modal__architecture" data-toc-section="architecture" aria-labelledby={`${project.id}-architecture`}>
                <div><span className="project-modal__eyebrow">System Schema</span><h3 id={`${project.id}-architecture`}>Vom Browser bis zur Fertigungslogik</h3></div>
                <ol>{project.architecture.map((item) => (<li key={item}>{item}</li>))}</ol>
              </section>) : null}
            {project.fileStates ? (
              <section className="project-modal__file-states" data-toc-section="flächen" aria-labelledby={`${project.id}-file-states`}>
                <div className="project-modal__section-head"><span className="project-modal__eyebrow">Frontend · Admin · Support</span><h3 id={`${project.id}-file-states`}>Drei Oberflächen für ein Produkt</h3></div>
                <div className="project-modal__file-grid">
                  {project.fileStates.map((s) => (<article key={s.format}><span>{s.mode}</span><strong>{s.format}</strong><p>{s.text}</p></article>))}
                </div>
              </section>) : null}
            <section className="project-modal__highlights" data-toc-section="highlights" aria-labelledby={`${project.id}-highlights`}>
              <div><span className="project-modal__eyebrow">System Highlights</span><h3 id={`${project.id}-highlights`}>Warum es mehr als CRUD ist</h3></div>
              <ol>{project.highlights.map((h) => (<li key={h}>{h}</li>))}</ol>
            </section>
            {project.trustChecks || project.impact ? (
              <section className="project-modal__trust" data-toc-section="trust" aria-labelledby={`${project.id}-trust`}>
                <div><span className="project-modal__eyebrow">Betrieb & Wirkung</span><h3 id={`${project.id}-trust`}>Kontrolle vor der Bestellung</h3></div>
                {project.trustChecks ? (<ul className="project-modal__trust-list">{project.trustChecks.map((c) => (<li key={c}>{c}</li>))}</ul>) : null}
                {project.impact ? (<dl className="project-modal__impact">{project.impact.map((m) => (<div key={m.label}><dt>{m.value}</dt><dd>{m.label}</dd></div>))}</dl>) : null}
              </section>) : null}
            <section className="project-modal__gallery" data-toc-section="gallery" aria-labelledby={`${project.id}-gallery`}>
              <div className="project-modal__section-head"><span className="project-modal__eyebrow">Screenshots</span><h3 id={`${project.id}-gallery`}>Projekt-Screens</h3></div>
              <div className="project-modal__shots">
                {project.screenshots.map((sc) => (
                  <figure key={sc.src} role="button" tabIndex={0} aria-label={`Screenshot vergrößern: ${sc.caption}`}
                    onClick={() => setLightbox(sc)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLightbox(sc) } }}>
                    <img src={sc.src} alt={sc.caption} loading="lazy" decoding="async" />
                    <figcaption><span className="project-modal__shot-label">{screenshotLabel}</span>{sc.caption}</figcaption>
                  </figure>))}
              </div>
            </section>
            <footer className="project-modal__footer">
              {project.result ? <p className="project-modal__result">{project.result}</p> : null}
              {hasLinks ? (
                <div className="project-modal__links">
                  {project.links.demo ? (<a href={project.links.demo} target="_blank" rel="noopener noreferrer">Live Demo öffnen ↗</a>) : null}
                  {project.links.client ? (<a href={project.links.client} target="_blank" rel="noopener noreferrer">Kundenseite öffnen ↗</a>) : null}
                  {project.links.repo ? (<a href={project.links.repo} target="_blank" rel="noopener noreferrer">Repository öffnen ↗</a>) : null}
                </div>) : (<p>{project.status === 'lab-prototype' ? 'Lab Prototype — kein öffentliches Deployment.' : 'Live-Demo und Repository folgen.'}</p>)}
            </footer>
          </div>
        </motion.div>
        <AnimatePresence>
          {lightbox && (
            <motion.div className="project-lightbox" role="dialog" aria-modal="true" aria-label={`Screenshot: ${lightbox.caption}`}
              variants={lightboxOverlay} initial="hidden" animate="visible" exit="exit"
              onClick={() => setLightbox(null)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLightbox(null) }}>
              <motion.figure variants={lightboxImg} initial="hidden" animate="visible" exit="exit">
                <img src={lightbox.src} alt={lightbox.caption} />
                <figcaption>{lightbox.caption} — Klicken zum Schließen</figcaption>
              </motion.figure>
            </motion.div>)}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
