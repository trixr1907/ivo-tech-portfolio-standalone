import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../../data/projects'

type ProjectCardProps = {
  project: Project
  index: number
  onOpen: (project: Project) => void
}

export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const isPrimary = project.id === 'goals-optimizer'
  // Editorial metric bar: prefer impact, fall back to signals — both carry { value, label }
  const metrics = project.impact ?? project.signals ?? []

  return (
    <article
      id={`project-${project.id}`}
      className={`project-card relaunch-project-card${isPrimary ? ' relaunch-project-card--primary' : ''}`}
    >
      <button type="button" className="project-card__button" onClick={() => onOpen(project)} aria-label={`${project.title} Case Study öffnen`}>
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
          <span className="project-card__index">0{index}</span>
          <span className="project-card__status">{isPrimary ? 'Primärer Case' : 'Case Study'}</span>
        </span>
        <span className="project-card__body">
          <span className="project-card__eyebrow">{project.facts[2]?.value ?? 'Selected Work'}</span>
          <span className="project-card__title">{project.title}</span>
          <span className="project-card__problem">{project.problem}</span>
          <span className="project-card__facts" aria-label="Projektkurzprofil">
            {project.facts.slice(0, 2).map((fact) => (
              <span key={fact.label}><strong>{fact.label}</strong>{fact.value}</span>
            ))}
          </span>
        </span>
      </button>

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
              {project.architecture.map((item) => <li key={item}>{item}</li>)}
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
    </article>
  )
}
