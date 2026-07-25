import { useCallback, useEffect, useRef, useState } from 'react'
import type React from 'react'
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

const modalReviewFixStyles = `
  .project-modal {
    padding: clamp(1rem, 2.4vw, 2rem);
    background:
      radial-gradient(circle at 50% 6%, rgba(0, 183, 255, 0.12), transparent 38%),
      rgba(1, 3, 7, 0.94);
    backdrop-filter: blur(18px) saturate(1.28);
    -webkit-backdrop-filter: blur(18px) saturate(1.28);
  }

  .project-modal__dialog {
    display: flex;
    flex-direction: column;
    max-height: 88vh;
    overflow: hidden;
    padding-bottom: 0;
    border: 1px solid rgba(123, 231, 255, 0.2);
    box-shadow:
      0 34px 110px rgba(0, 0, 0, 0.72),
      0 0 0 1px rgba(255, 255, 255, 0.035),
      0 0 70px rgba(0, 183, 255, 0.14);
  }

  .project-modal__hero {
    grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  }

  .project-modal__body {
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
    padding-bottom: 3.5rem;
  }

  .project-modal__body::-webkit-scrollbar {
    width: 10px;
  }

  .project-modal__body::-webkit-scrollbar-track {
    background: rgba(5, 7, 11, 0.78);
  }

  .project-modal__body::-webkit-scrollbar-thumb {
    border: 2px solid rgba(5, 7, 11, 0.78);
    border-radius: 999px;
    background: rgba(123, 231, 255, 0.48);
  }

  .project-modal__hero-media {
    position: relative;
    min-height: clamp(300px, 42vh, 400px);
    border: 1px solid rgba(220, 230, 242, 0.1);
    background:
      linear-gradient(180deg, rgba(220, 230, 242, 0.04), rgba(5, 7, 11, 0.72)),
      rgba(5, 7, 11, 0.9);
  }

  .project-modal__hero-media::after {
    content: var(--modal-panel-label, 'Live Demo');
    position: absolute;
    left: 1rem;
    bottom: 1rem;
    border: 1px solid rgba(123, 231, 255, 0.26);
    border-radius: 999px;
    padding: 0.34rem 0.65rem;
    color: rgba(123, 231, 255, 0.86);
    background: rgba(5, 7, 11, 0.72);
    font: 800 0.64rem/1 var(--font-display);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    backdrop-filter: blur(10px);
  }

  .project-modal__hero-copy {
    gap: 0.82rem;
    justify-content: start;
    padding: clamp(1.5rem, 3vw, 2.5rem);
    padding-top: clamp(4.25rem, 6vw, 5.25rem);
    padding-right: clamp(6.5rem, 10vw, 8rem);
  }

  .project-modal__hero-copy h2 {
    font-size: clamp(2.15rem, 4.1vw, 4.45rem);
  }

  .project-modal__tagline,
  .project-modal__problem {
    line-height: 1.56;
  }

  .project-modal__close {
    position: absolute;
    top: clamp(1.7rem, 3.2vw, 2.35rem);
    left: auto;
    right: clamp(1.7rem, 3.2vw, 2.35rem);
    z-index: 10;
    width: 52px;
    height: 52px;
    min-width: 52px;
    min-height: 52px;
    margin: 0;
    border: 1px solid rgba(123, 231, 255, 0.82);
    border-radius: 999px;
    color: #ffffff;
    background:
      radial-gradient(circle at 35% 25%, rgba(123, 231, 255, 0.34), transparent 44%),
      linear-gradient(135deg, rgba(22, 42, 56, 0.98), rgba(5, 7, 11, 0.98));
    font-size: 1.65rem;
    font-weight: 800;
    line-height: 1;
    text-shadow: 0 0 16px rgba(123, 231, 255, 0.72);
    box-shadow:
      0 0 0 1px rgba(0, 183, 255, 0.3),
      0 18px 52px rgba(0, 0, 0, 0.62),
      0 0 42px rgba(0, 183, 255, 0.32);
    transition: border-color 180ms ease, color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
  }

  .project-modal__close:hover,
  .project-modal__close:focus-visible {
    border-color: rgba(123, 231, 255, 0.95);
    color: var(--cyan);
    transform: translateY(-1px);
    box-shadow:
      0 0 0 3px rgba(0, 183, 255, 0.18),
      0 18px 54px rgba(0, 0, 0, 0.5),
      0 0 34px rgba(0, 183, 255, 0.28);
    outline: none;
  }

  .project-modal__shots figure {
    border: 1px solid rgba(220, 230, 242, 0.08);
    background:
      linear-gradient(180deg, rgba(220, 230, 242, 0.035), rgba(5, 7, 11, 0.94)),
      rgba(5, 7, 11, 0.92);
  }

  .project-modal__shots figcaption {
    display: grid;
    gap: 0.55rem;
    color: rgba(220, 230, 242, 0.66);
  }

  .project-modal__shot-label {
    width: max-content;
    border: 1px solid rgba(123, 231, 255, 0.22);
    border-radius: 999px;
    padding: 0.28rem 0.55rem;
    color: rgba(123, 231, 255, 0.82);
    background: rgba(0, 183, 255, 0.06);
    font: 800 0.62rem/1 var(--font-display);
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .project-modal__toc {
    position: sticky;
    /* site header occupies the top ~90px of the viewport — keep the TOC below it */
    top: 92px;
    z-index: 8;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding: 0.65rem clamp(1.5rem, 3vw, 2.5rem);
    border-block: 1px solid rgba(220, 230, 242, 0.09);
    background: rgba(5, 7, 11, 0.86);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .project-modal__toc button {
    border: 1px solid rgba(220, 230, 242, 0.14);
    border-radius: 999px;
    padding: 0.34rem 0.72rem;
    color: rgba(220, 230, 242, 0.68);
    background: transparent;
    font: 700 0.66rem/1 var(--font-display);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 160ms ease, border-color 160ms ease, background 160ms ease;
  }

  .project-modal__toc button:hover,
  .project-modal__toc button:focus-visible {
    color: var(--cyan);
    border-color: rgba(123, 231, 255, 0.55);
    outline: none;
  }

  .project-modal__toc button.is-active {
    color: #05070b;
    border-color: rgba(123, 231, 255, 0.9);
    background: rgba(123, 231, 255, 0.9);
  }

  .project-modal__shots figure {
    cursor: zoom-in;
  }

  .project-modal__shots figure:focus-visible {
    outline: 2px solid rgba(123, 231, 255, 0.8);
    outline-offset: 3px;
  }

  .project-lightbox {
    position: fixed;
    inset: 0;
    z-index: 10;
    display: grid;
    place-items: center;
    padding: clamp(1rem, 4vw, 3rem);
    background: rgba(1, 3, 7, 0.96);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    cursor: zoom-out;
  }

  .project-lightbox img {
    max-width: 100%;
    max-height: calc(100svh - 6rem);
    border: 1px solid rgba(220, 230, 242, 0.14);
    border-radius: 14px;
    object-fit: contain;
    box-shadow: 0 40px 120px rgba(0, 0, 0, 0.7);
  }

  .project-lightbox figcaption {
    margin-top: 0.9rem;
    color: rgba(220, 230, 242, 0.74);
    font: 600 0.8rem/1.5 var(--font-display);
    letter-spacing: 0.05em;
    text-align: center;
  }

  @media (max-width: 680px) {
    .project-modal {
      padding: 0;
    }

    .project-modal__dialog {
      max-height: 100svh;
    }

    .project-modal__toc {
      top: 0;
      overflow-x: auto;
      flex-wrap: nowrap;
      scrollbar-width: none;
    }

    .project-modal__toc::-webkit-scrollbar {
      display: none;
    }
  }
`

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null)
  const [activeToc, setActiveToc] = useState<string>('overview')

  useEffect(() => {
    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const scrollY = window.scrollY
    const previousHtmlOverscrollBehavior = document.documentElement.style.overscrollBehavior
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow
    const previousBodyOverscrollBehavior = document.body.style.overscrollBehavior

    document.documentElement.style.overscrollBehavior = 'none'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    closeButtonRef.current?.focus()

    const stopModalScrollPropagation = (event: WheelEvent | TouchEvent) => {
      event.stopPropagation()
    }

    const modalElement = modalRef.current
    modalElement?.addEventListener('wheel', stopModalScrollPropagation, { passive: false })
    modalElement?.addEventListener('touchmove', stopModalScrollPropagation, { passive: false })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setLightbox((current) => {
          if (current) return null
          onClose()
          return current
        })
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusableElements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) => !element.hasAttribute('disabled') && element.offsetParent !== null,
      )
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      modalElement?.removeEventListener('wheel', stopModalScrollPropagation)
      modalElement?.removeEventListener('touchmove', stopModalScrollPropagation)
      document.documentElement.style.overscrollBehavior = previousHtmlOverscrollBehavior
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
      document.body.style.overscrollBehavior = previousBodyOverscrollBehavior
      window.scrollTo(0, scrollY)
      previousActiveElement?.focus()
    }
  }, [onClose])

  const tocSections = [
    { id: 'overview', label: 'Überblick' },
    project.signals ? { id: 'signals', label: 'Signale' } : null,
    project.architecture ? { id: 'architecture', label: 'Architektur' } : null,
    project.fileStates ? { id: 'flächen', label: 'Flächen' } : null,
    { id: 'highlights', label: 'Highlights' },
    project.trustChecks || project.impact ? { id: 'trust', label: 'Betrieb' } : null,
    { id: 'gallery', label: 'Screens' },
  ].filter((section): section is { id: string; label: string } => section !== null)

  useEffect(() => {
    const body = bodyRef.current
    if (!body) return undefined
    const targets = tocSections
      .map((section) => body.querySelector<HTMLElement>(`[data-toc-section="${section.id}"]`))
      .filter((el): el is HTMLElement => el !== null)
    if (targets.length === 0) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-toc-section')
            if (id) setActiveToc(id)
          }
        }
      },
      { root: body, rootMargin: '-18% 0px -70% 0px' },
    )
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollToSection = useCallback((id: string) => {
    bodyRef.current
      ?.querySelector<HTMLElement>(`[data-toc-section="${id}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const hasLinks = Boolean(project.links.demo || project.links.repo)

  return (
    <div ref={modalRef} className="project-modal" role="presentation" onMouseDown={onClose}>
      <style>{modalReviewFixStyles}</style>
      <div
        ref={dialogRef}
        className="project-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${project.id}-modal-title`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button ref={closeButtonRef} type="button" className="project-modal__close" onClick={onClose} aria-label="Schliessen">
          ×
        </button>

        <div ref={bodyRef} className="project-modal__body">
          <nav className="project-modal__toc" aria-label="Case-Study-Inhalt">
            {tocSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={activeToc === section.id ? 'is-active' : undefined}
                onClick={() => scrollToSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>
          <header className="project-modal__hero">
            <div
              className="project-modal__hero-media"
              style={{ '--modal-panel-label': `'${project.status === 'lab-prototype' ? 'Lab Prototype' : 'Live Demo'}'` } as React.CSSProperties}
            >
              <img src={project.cover} alt={`${project.title} — Projekt Cover`} loading="lazy" decoding="async" />
            </div>
            <div className="project-modal__hero-copy">
              <span className="project-modal__eyebrow">Project Case Study</span>
              <h2 id={`${project.id}-modal-title`}>{project.title}</h2>
              <p className="project-modal__tagline">{project.tagline}</p>
              <p className="project-modal__problem">{project.problem}</p>
              <div className="project-modal__tags" aria-label="Technologien">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </header>

          <div className="project-modal__overview" data-toc-section="overview" aria-label="Projektübersicht">
            <section>
              <span>01</span>
              <h3>Was gebaut</h3>
              <p>{project.overview.built}</p>
            </section>
            <section>
              <span>02</span>
              <h3>Herausforderung</h3>
              <p>{project.overview.challenge}</p>
            </section>
            <section>
              <span>03</span>
              <h3>Rolle</h3>
              <p>{project.overview.role}</p>
            </section>
          </div>

          {project.signals ? (
            <section className="project-modal__signals" data-toc-section="signals" aria-label="Projekt-Signale">
              {project.signals.map((signal) => (
                <article key={signal.label}>
                  <span>{signal.label}</span>
                  <strong>{signal.value}</strong>
                  <p>{signal.text}</p>
                </article>
              ))}
            </section>
          ) : null}

          {project.architecture ? (
            <section className="project-modal__architecture" data-toc-section="architecture" aria-labelledby={`${project.id}-architecture`}>
              <div>
                <span className="project-modal__eyebrow">System Schema</span>
                <h3 id={`${project.id}-architecture`}>Vom Browser bis zur Fertigungslogik</h3>
              </div>
              <ol>
                {project.architecture.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
          ) : null}

          {project.fileStates ? (
            <section className="project-modal__file-states" data-toc-section="flächen" aria-labelledby={`${project.id}-file-states`}>
              <div className="project-modal__section-head">
                <span className="project-modal__eyebrow">Frontend · Admin · Support</span>
                <h3 id={`${project.id}-file-states`}>Drei Oberflächen für ein Produkt</h3>
              </div>
              <div className="project-modal__file-grid">
                {project.fileStates.map((state) => (
                  <article key={state.format}>
                    <span>{state.mode}</span>
                    <strong>{state.format}</strong>
                    <p>{state.text}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="project-modal__highlights" data-toc-section="highlights" aria-labelledby={`${project.id}-highlights`}>
            <div>
              <span className="project-modal__eyebrow">System Highlights</span>
              <h3 id={`${project.id}-highlights`}>Warum es mehr als CRUD ist</h3>
            </div>
            <ol>
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ol>
          </section>

          {project.trustChecks || project.impact ? (
            <section className="project-modal__trust" data-toc-section="trust" aria-labelledby={`${project.id}-trust`}>
              <div>
                <span className="project-modal__eyebrow">Betrieb & Wirkung</span>
                <h3 id={`${project.id}-trust`}>Kontrolle vor der Bestellung</h3>
              </div>
              {project.trustChecks ? (
                <ul className="project-modal__trust-list">
                  {project.trustChecks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
              ) : null}
              {project.impact ? (
                <dl className="project-modal__impact">
                  {project.impact.map((metric) => (
                    <div key={metric.label}>
                      <dt>{metric.value}</dt>
                      <dd>{metric.label}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </section>
          ) : null}

          <section className="project-modal__gallery" data-toc-section="gallery" aria-labelledby={`${project.id}-gallery`}>
            <div className="project-modal__section-head">
              <span className="project-modal__eyebrow">Screenshots</span>
              <h3 id={`${project.id}-gallery`}>Projekt-Screens</h3>
            </div>
            <div className="project-modal__shots">
              {project.screenshots.map((screenshot) => (
                <figure
                  key={screenshot.src}
                  role="button"
                  tabIndex={0}
                  aria-label={`Screenshot vergrößern: ${screenshot.caption}`}
                  onClick={() => setLightbox(screenshot)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setLightbox(screenshot)
                    }
                  }}
                >
                  <img src={screenshot.src} alt={screenshot.caption} loading="lazy" decoding="async" />
                  <figcaption>
                    <span className="project-modal__shot-label">{project.status === 'lab-prototype' ? 'Lab Prototype Screenshot' : 'Live Demo Screenshot'}</span>
                    {screenshot.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <footer className="project-modal__footer">
            {project.result ? <p className="project-modal__result">{project.result}</p> : null}
            {hasLinks ? (
              <div className="project-modal__links">
                {project.links.demo ? (
                  <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                    Live Demo öffnen ↗
                  </a>
                ) : null}
                {project.links.repo ? (
                  <a href={project.links.repo} target="_blank" rel="noopener noreferrer">
                    Repository öffnen ↗
                  </a>
                ) : null}
              </div>
            ) : (
              <p>
                {project.status === 'lab-prototype'
                  ? 'Lab Prototype — kein öffentliches Deployment. Das Projekt läuft auf privater Staging-Infrastruktur.'
                  : 'Live-Demo und Repository folgen, sobald der Demo-Fork bereit ist.'}
              </p>
            )}
          </footer>
        </div>
      </div>
      {lightbox ? (
        <div
          className="project-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Screenshot: ${lightbox.caption}`}
          onClick={() => setLightbox(null)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') setLightbox(null)
          }}
        >
          <figure>
            <img src={lightbox.src} alt={lightbox.caption} />
            <figcaption>{lightbox.caption} — Klicken zum Schließen</figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  )
}
