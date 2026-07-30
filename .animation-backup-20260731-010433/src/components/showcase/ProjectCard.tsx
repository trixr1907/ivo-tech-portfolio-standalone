import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../../data/projects'

type ProjectCardProps = {
  project: Project
  index: number
  onOpen: (project: Project) => void
}

export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const isPrimary = project.id === 'goals-optimizer'
  const metrics = project.impact ?? project.signals ?? []

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness: 300, damping: 28 })
  const springY = useSpring(mouseY, { stiffness: 300, damping: 28 })

  const rotateX = useTransform(springY, [0, 1], [3, -3])
  const rotateY = useTransform(springX, [0, 1], [-3, 3])
  const glareBg = useTransform(
    springX,
    (x) => `radial-gradient(circle at ${Math.round(x * 100)}% 50%, rgba(255,255,255,0.07) 0%, transparent 55%)`,
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      mouseX.set((e.clientX - rect.left) / rect.width)
      mouseY.set((e.clientY - rect.top) / rect.height)
    },
    [mouseX, mouseY],
  )

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }, [mouseX, mouseY])

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.article
      ref={cardRef}
      id={`project-${project.id}`}
      className={`project-card relaunch-project-card${isPrimary ? ' relaunch-project-card--primary' : ''}${isVisible ? ' is-visible' : ''}`}
      initial={false}
    >
      <motion.button
        type="button"
        className="project-card__button"
        onClick={() => onOpen(project)}
        aria-label={`${project.title} Case Study öffnen`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          perspective: 1200,
        }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <span className="project-card__media">
          <img
            className={project.id === 'dld-3d-configurator' ? 'project-card__media--portrait' : undefined}
            src={project.cover}
            alt={`${project.title} — Produktansicht`}
            width={1440}
            height={project.id === 'dld-3d-configurator' ? 2337 : project.id === 'event-hub' ? 577 : 900}
            sizes="(max-width: 760px) 100vw, 50vw"
            loading={index === 1 ? 'eager' : 'lazy'}
            fetchPriority={index === 1 ? 'high' : 'auto'}
            decoding="async"
          />
          <motion.span
            aria-hidden="true"
            style={{
              position: 'absolute',
              zIndex: 2,
              inset: 0,
              background: glareBg,
              opacity: 0,
              pointerEvents: 'none',
            }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <span className="project-card__index">0{index}</span>
          <span className={`project-card__status${project.status === 'lab-prototype' ? ' project-card__status--lab' : ''}`}>
            {isPrimary ? 'Primärer Case' : 'Case Study'}
          </span>
        </span>
        <span className="project-card__body">
          <span className="project-card__eyebrow">{project.facts[2]?.value ?? 'Selected Work'}</span>
          <span className="project-card__title">{project.title}</span>
          <span className="project-card__problem">{project.problem}</span>
          <span className="project-card__facts" aria-label="Projektkurzprofil">
            {project.facts.slice(0, 2).map((fact) => (
              <span key={fact.label}>
                <strong>{fact.label}</strong>
                {fact.value}
              </span>
            ))}
          </span>
        </span>
      </motion.button>

      <div className="project-card__editorial">
        {metrics.length > 0 && (
          <div className="project-card__metrics" aria-label="Kennzahlen">
            {metrics.map((metric) => (
              <div key={metric.label} className="project-card__metric">
                <span className="project-card__metric-value">{metric.value}</span>
                <span className="project-card__metric-label">{metric.label}</span>
              </div>
            ))}
          </div>
        )}
        {project.architecture ? (
          <div className="project-card__arch">
            <h3 className="project-card__arch-title">System Schema</h3>
            <ol className="project-card__arch-list">
              {project.architecture.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        ) : null}
        <div className="project-card__highlights">
          {project.highlights.map((highlight) => (
            <p key={highlight} className="project-card__highlight">{highlight}</p>
          ))}
        </div>
        <button type="button" className="project-card__cta project-card__cta--more" onClick={() => onOpen(project)}>
          Mehr Tiefe im Case <ArrowUpRight size={15} aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  )
}
