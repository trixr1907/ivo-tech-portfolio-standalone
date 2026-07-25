import { ArrowUpRight, Bot, Cpu, Home, ShieldCheck, Sparkles, Terminal, Zap } from 'lucide-react'
import { labItems } from '../../data/homeData'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'
import { MagButton } from '../ui/MagButton'

const principles = [
  {
    icon: Sparkles,
    label: '01 · Problem schneiden',
    title: 'Unklare Anforderungen werden entscheidbar.',
    text: 'Ich verdichte Daten, Risiken und Nutzerziele zu einem belastbaren ersten Produktweg.',
    proof: 'GOALS Optimizer · live mit 371 Tests',
    href: '#project-goals-optimizer',
  },
  {
    icon: ShieldCheck,
    label: '02 · System verbinden',
    title: 'Interface, Logik und Betrieb zusammen denken.',
    text: 'Datenmodell, Rechte, Fehlerfälle und Oberfläche greifen als ein nachvollziehbares System ineinander.',
    proof: 'Event Hub · RLS, Audit-Trail und Edge Functions',
    href: '#project-event-hub',
  },
  {
    icon: Zap,
    label: '03 · Realität prüfen',
    title: 'Nicht nur bauen. Im echten Betrieb verifizieren.',
    text: 'Tests, sichtbare Systemzustände und reale Nutzung entscheiden, ob eine Lösung dauerhaft trägt.',
    proof: 'DLD 3D · live im produktiven Shop',
    href: '#project-dld-3d-configurator',
  },
]

const labIcons = [Bot, Home, Cpu, Terminal]

export function AboutSection() {
  return (
    <section id="about" className="relaunch-section about-relaunch-section" aria-labelledby="about-heading">
      <div className="relaunch-shell about-relaunch-grid">
        <Reveal className="about-relaunch-portrait">
          <img
            src="/images/about/ivo-portrait.webp"
            alt="Portrait von Ivo"
            width={800}
            height={800}
            loading="lazy"
            decoding="async"
          />
        </Reveal>
        <Reveal className="about-relaunch-copy" delay={0.06}>
          <div className="relaunch-kicker-row">
            <span className="relaunch-kicker">Über mich</span>
            <span className="relaunch-index">— 01</span>
          </div>
          <p className="about-relaunch-name">Yves Simon Schenker <span>(Ivo)</span></p>
          <SectionTitle
            id="about-heading"
            lines={[
              { text: 'Ich bin Ivo.' },
              { text: 'Entwickler mit Frontend-Fokus.', em: true },
            ]}
          />
          <p className="relaunch-lead">
            Ich entwickle Webanwendungen mit einem starken Blick für Frontend-Qualität — und genug
            Full-Stack-Tiefe, damit Datenmodell, Rechte, Fehlerfälle und Betrieb nicht an der Oberfläche enden.
            Aus Mannheim/Rhein-Neckar und offen für passende Remote- und Hybrid-Rollen.
          </p>
          <dl className="about-proof-strip" aria-label="Nachweise in Kürze">
            <div><dt>Systeme live</dt><dd>3 Produkte im produktiven Betrieb</dd></div>
            <div><dt>Verifiziert</dt><dd>371 Tests im GOALS Optimizer</dd></div>
            <div><dt>Standort</dt><dd>Mannheim · Remote &amp; Hybrid</dd></div>
          </dl>
          <p className="about-stack-line">React · TypeScript · Vite · Three.js · Motion · Vitest · Playwright</p>
          <div className="about-relaunch-actions">
            <MagButton className="btn-ghost" href="/yves-simon-schenker-cv.pdf" download>
              Lebenslauf <ArrowUpRight size={14} aria-hidden="true" />
            </MagButton>
            <MagButton className="btn-ghost" href="mailto:contact@ivo-tech.com">
              Kontakt
            </MagButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function CraftSection() {
  return (
    <section id="craft" className="relaunch-section craft-section" aria-labelledby="craft-heading">
      <div className="relaunch-shell">
        <Reveal className="relaunch-section-head">
          <div className="relaunch-kicker-row">
            <span className="relaunch-kicker">How I work</span>
            <span className="relaunch-index">— 03</span>
          </div>
          <SectionTitle
            id="craft-heading"
            lines={[
              { text: 'Vom ersten Signal' },
              { text: 'bis zum stabilen Betrieb.', em: true },
            ]}
          />
          <p className="relaunch-lead">
            Gute Produkte entstehen dort, wo Interface, Logik und Betrieb gemeinsam gedacht werden.
            Ich verbinde Frontend-Craft mit belastbarer Full-Stack-Arbeit — vom ersten sichtbaren Prototyp bis zum
            System, das im Alltag nicht im Weg steht.
          </p>
        </Reveal>

        <div className="principles-grid">
          {principles.map(({ icon: Icon, label, title, text, proof, href }, index) => (
            <Reveal key={label} delay={index * 0.05} className="principle-card">
              <div className="principle-card__top">
                <div className="principle-icon"><Icon size={20} aria-hidden="true" /></div>
                <span className="principle-label">{label}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <a className="principle-proof" href={href}>
                Belegt durch {proof} <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </Reveal>
          ))}
        </div>

        <p className="craft-stack-line">React · TypeScript · Vite · Three.js · Motion · Playwright</p>
      </div>
    </section>
  )
}

export function LabSection() {
  return (
    <section id="lab" className="relaunch-section lab-relaunch-section" aria-labelledby="lab-heading">
      <div className="relaunch-shell">
        <Reveal className="relaunch-section-head compact-head">
          <div className="relaunch-kicker-row">
            <span className="relaunch-kicker">Lab notes</span>
            <span className="relaunch-index">— 04</span>
          </div>
          <SectionTitle id="lab-heading" lines={[{ text: 'Was ich nebenbei' }, { text: 'in Systeme übersetze.', em: true }]} />
          <p className="relaunch-lead">
            Vier Felder, ein roter Faden: Technik wird dann interessant, wenn sie konkrete Abläufe vereinfacht,
            sichtbar macht oder dauerhaft verlässlich laufen kann.
          </p>
        </Reveal>

        <div className="lab-relaunch-grid">
          {labItems.map((item, index) => {
            const Icon = labIcons[index]
            return (
              <Reveal key={item.title} delay={index * 0.04} className="lab-relaunch-card">
                <div className="lab-relaunch-top">
                  <span className="lab-relaunch-num">{item.num}</span>
                </div>
                <div className="lab-relaunch-icon" aria-hidden="true"><Icon size={18} /></div>
                <span className="lab-relaunch-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <span className="lab-relaunch-kicker">{item.kicker}</span>
                <p>{item.text}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ContactSection() {
  return (
    <section id="kontakt" className="relaunch-section contact-relaunch-section" aria-labelledby="contact-heading">
      <div className="relaunch-shell">
        <Reveal className="contact-relaunch-card">
          <div className="relaunch-kicker-row">
            <span className="relaunch-kicker">Kontakt</span>
            <span className="relaunch-index">— 05</span>
          </div>
          <SectionTitle
            id="contact-heading"
            lines={[{ text: 'Ein Projekt, eine Rolle,' }, { text: 'eine konkrete Frage?', em: true }]}
          />
          <p>
            Ich bin offen für Remote- und Hybrid-Rollen als Full-Stack Developer mit Frontend-Fokus.
            Schreib mir, worum es geht — du bekommst eine ehrliche Antwort, kein Formular-Blabla.
          </p>
          <div className="contact-relaunch-actions">
            <MagButton className="btn-primary" href="mailto:contact@ivo-tech.com">
              Schreib mir <ArrowUpRight size={16} aria-hidden="true" />
            </MagButton>
            <MagButton className="btn-ghost" href="/yves-simon-schenker-cv.pdf" download>
              Lebenslauf
            </MagButton>
            <MagButton className="btn-ghost" href="https://github.com/trixr1907" target="_blank" rel="noreferrer">
              GitHub
            </MagButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function RelaunchFooter() {
  return (
    <footer className="relaunch-footer">
      <div className="relaunch-shell relaunch-footer-inner">
        <img
          src="/brand/logos/ivo-tech-logo-master.svg"
          alt="ivo-tech"
          width={118}
          height={26}
          loading="lazy"
          decoding="async"
        />
        <p>Yves Simon Schenker (Ivo) · Full-Stack Developer mit Frontend-Fokus · Mannheim · {new Date().getFullYear()}</p>
        <nav aria-label="Footer">
          <a href="#top">Top</a>
          <a href="#selected-work">Projekte</a>
          <a href="#kontakt">Kontakt</a>
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
        </nav>
      </div>
    </footer>
  )
}
