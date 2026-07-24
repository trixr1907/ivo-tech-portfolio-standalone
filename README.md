# ivo-tech Portfolio — Standalone

Eigenständiges persönliches Portfolio von **Yves Simon Schenker (Ivo)** — Full-Stack Developer mit Frontend-Fokus aus Mannheim/Rhein-Neckar.

## Live preview

- Standalone-Vercel-URL: https://ivo-tech-portfolio-standalone.vercel.app
- Die bestehende Domain https://ivo-tech.com bleibt unverändert und ist nicht mit diesem Projekt verbunden.

## Inhalt

Die Seite zeigt Ivo als Person und Entwickler mit:

- persönlichem Hero und Portrait
- About-Bereich mit CV-Link
- GOALS Optimizer als primärem Software-Case
- Event Management Hub und DLD 3D-Konfigurator als weitere belegte Cases
- konkreten Arbeitsweise-Belegen
- Craft-in-motion-Video mit Poster und Reduced-Motion-Fallback
- Impressum und Datenschutzerklärung

## Stack

- React 19
- TypeScript 6 (strict)
- Vite 8
- Three.js 0.185 + three-stdlib
- Motion 12
- Lucide React
- Playwright Component Testing
- ESLint 10 + Prettier 3
- Vercel

GSAP, Lenis und Supabase gehören nicht zur Runtime dieses Portfolios. Die Seite ist eine clientseitige Hash-SPA mit statischen Assets.

## Voraussetzungen

- Node.js 22 bis 24
- npm 10 oder neuer
- Chromium für Playwright- und Lighthouse-Prüfungen

## Lokale Entwicklung

```bash
cd /home/ivo/projects/ivo-tech-portfolio-standalone
npm ci
npm run dev -- --host 127.0.0.1
```

Production-Build und Preview:

```bash
npm run build
npm run preview:qa
```

`preview:qa` verwendet absichtlich Port `4174` mit `--strictPort`. Ist dieser Port belegt, zuerst den fremden Preview-Prozess beenden oder für eine manuelle Ansicht einen anderen Port verwenden:

```bash
npm run preview -- --host 127.0.0.1 --port 4176 --strictPort
```

## QA

Standard-Gate nach Änderungen:

```bash
npm run lint
npm test
npm run build
git diff --check
npm audit --omit=dev
```

Zusätzliche Gates:

```bash
npm run qa:a11y
npm run qa:lighthouse:mobile
npm run qa:lighthouse:desktop
```

Die Component-/UX-Suite umfasst aktuell 12 Tests. Lighthouse verwendet das installierte Playwright-Chromium über `CHROME_PATH`. Pa11y kann in restriktiven Umgebungen durch den lokalen Ausführungsschutz blockiert werden; in diesem Fall den Blocker dokumentieren und keine erfundenen Ergebnisse melden.

## Codex CLI

Codex ist ein lokales Werkzeug und arbeitet ausschließlich in diesem Repository. Das Repo ist absichtlich ohne Git-Remote.

Direktstart (empfohlen):

```bash
codex-portfolio
```

Der Starter wechselt automatisch nach `/home/ivo/projects/ivo-tech-portfolio-standalone` und verwendet `workspace-write` mit Freigaben `on-request`.

Alternativ manuell:

```bash
cd /home/ivo/projects/ivo-tech-portfolio-standalone
codex --sandbox workspace-write --ask-for-approval on-request
```

Einmalig prüfen:

```bash
codex --cd /home/ivo/projects/ivo-tech-portfolio-standalone \
  --sandbox workspace-write \
  --ask-for-approval on-request \
  "Lies AGENTS.md und fasse die aktiven Projektregeln zusammen. Ändere nichts."
```

Vor jeder Aufgabe:

```bash
pwd
git status --short --branch
git remote -v
```

Codex soll vor Änderungen die relevanten Dateien lesen, keine neuen Production-Dependencies ohne Rückfrage hinzufügen und nicht committen oder deployen, solange dies nicht ausdrücklich beauftragt wurde.

## Git

Der Standalone-Verlauf beginnt mit einem unabhängigen Root-Commit und enthält keine Historie der früheren Portfolio-Repositories. Den aktuellen Stand zeigt:

```bash
git log -1 --oneline
```

Für größere Änderungen:

```bash
git switch -c feat/kurze-beschreibung
```

Nach der Prüfung den Diff kontrollieren:

```bash
git diff --check
git status
git diff --staged
```

## Vercel

Die lokale `.vercel/`-Verknüpfung gehört zum separaten Projekt `ivo-tech-portfolio-standalone` und wird nicht committed.

Preview:

```bash
vercel deploy
```

Production nur nach ausdrücklicher Freigabe:

```bash
vercel deploy --prod
```

Die Domain `ivo-tech.com` darf dabei nicht automatisch umgestellt werden.

## Struktur

```text
src/
  components/   UI, Legal, Relaunch und Showcase
  data/         Home- und Projektdaten
public/
  brand/        Logos, 3D- und Projekt-Assets
  images/       Portrait und weitere lokale Bilder
  media/        Video und Poster
  yves-simon-schenker-cv.pdf
```

## Kontakt und Links

- Portfolio: https://ivo-tech-portfolio-standalone.vercel.app
- GitHub-Profil: https://github.com/trixr1907
- Kontakt: contact@ivo-tech.com
