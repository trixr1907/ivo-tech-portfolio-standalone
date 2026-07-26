# ivo-tech Portfolio — Kimi Code Projekt-Instruktionen

## Scope
- Arbeitsverzeichnis: `/home/ivo/projects/ivo-tech-portfolio-standalone`
- Branch: aktueller Feature-Branch (nicht `main` ohne Freigabe wechseln)
- Vercel-Projekt: `ivo-tech-portfolio-standalone` → Preview: `https://ivo-tech-portfolio-standalone.vercel.app`

## Architektur (NICHT ÄNDERN ohne ausdrückliche Anfrage)
- **React 19 + TypeScript 6 (strict) + Vite 8**
- **Client-seitige Hash-SPA** — KEIN React Router, KEIN SSR, KEIN Next.js einführen
- Motion 12 (Framer Motion) + Three.js 0.185 für UI und 3D-Hero
- GSAP, Lenis, Supabase gehören NICHT zur Runtime
- Playwright Component Testing (12 Test-Cases aus 11 `test()`-Blöcken — einer parametrisiert über 2 Viewports — in 3 Spec-Dateien `src/**/*.spec.tsx`)

## Commands
```bash
npm run dev -- --host 127.0.0.1   # Dev Server
npm run build                      # Production Build (tsc + vite)
npm test                           # Playwright Component Tests
npm run lint                       # ESLint
npm run format                     # Prettier
npm run qa:a11y                    # Pa11y Accessibility
npm run qa:lighthouse:mobile       # Lighthouse Mobile
npm run qa:lighthouse:desktop      # Lighthouse Desktop
```

## Design-Strategie: "Precision Engineering"

### Ziel
Das Portfolio auf High-End-Niveau heben — visuell, technisch, strategisch.
Nicht "gut" — sondern **überlegen**.

### Was NICHT erlaubt ist
- ❌ Custom Cursor (Dot + Ring) → entfernen
- ❌ Grid-Background mit Radial-Mask → entfernen  
- ❌ Partikel-Effekte und Neon-Glows → entfernen
- ❌ Fade-In-Animationen → durch Reveal/Mask ersetzen
- ❌ Standard Tech-Badge-Listen → durch typografische Inszenierung ersetzen
- ❌ Generische Portfolio-Patterns (Floating Header mit Blur, Scroll-Progress-Bar)
- ❌ MeshBackground Canvas → durch statische, präzisere Lösung ersetzen

### Was ERLAUBT ist
- ✅ Großzügiger Whitespace (die Seite atmet)
- ✅ Reveal-Animationen via `clipPath: inset()` (bestehendes `Reveal.tsx` Pattern)
- ✅ Daten als Design-Element (Metriken typografisch inszeniert)
- ✅ Subtile Hover-States die Handwerk zeigen
- ✅ `prefers-reduced-motion` IMMER respektieren
- ✅ Syne als Display-Font (behalten)

### Farb-System (finalisiert)
- **Aktion = Electric Lime** (--accent: #C8FF00): Buttons, Links, Fokus, Auswahl, Eyebrows, Kicker, Labels
- **Atmosphäre = Cyan** (--cyan: #5ab7e8, #00B7FF): Glows, Gradienten, dekorative Tiefe, Modal-Hintergründe, Loader
- Diese Arbeitsteilung ist bewusst und final. Keine weitere Migration der Cyan-Glows.
- --cyan Variable bleibt dauerhaft bestehen.

### Vorgehen: Audit → Strategie → Umsetzung
1. **Audit**: Schonungslos ehrlich — was ist schwach, generisch, austauschbar?
2. **Strategie**: Visuelle Richtung, Navigationslogik, Interaktionsprinzipien
3. **Struktur**: Komponenten-Architektur optimieren
4. **Layout**: Spacing, Grid, Proportionen
5. **Interaktionen**: Hover, Reveal, Transitions
6. **Feinschliff**: Typography, Farben, Details
7. **Performance**: Bundle, Ladezeiten, Lighthouse

## Projekt-Struktur
```
src/
  App.tsx              → Root Component (Hash-Routing)
  App.css              → Design Tokens + Global Styles
  relaunch.css         → Section-spezifische Styles
  main.tsx             → Entry Point + einfaches Routing
  components/
    Hero3DLogo.tsx     → Three.js 9-Facet Emblem (lazy loaded)
    ErrorBoundary.tsx  → Fallback für 3D-Elemente
    NotFoundPage.tsx   → 404-Seite
    relaunch/
      RelaunchSections.tsx → About, Craft, Lab, Contact, Footer
    showcase/
      Showcase.tsx     → Projekt-Index
      ProjectCard.tsx  → Einzelne Projekt-Card
      ProjectModal.tsx → Case Study Modal (vollständige Tiefe)
    ui/
      Loader.tsx       → Loading Screen
      MagButton.tsx    → Magnetic Button (behalten)
      Reveal.tsx       → Reveal-Animation (behalten, Kern-Pattern)
      SectionTitle.tsx → Section H2 mit Word-Stagger (behalten)
      SplitTitle.tsx   → Hero Title mit Line-Stagger (behalten)
      LazySectionFallback.tsx → Suspense Fallback
    legal/
      ImpressumPage.tsx, DatenschutzPage.tsx
  data/
    projects.ts        → Projekt-Daten (GOALS, Event Hub, DLD)
    homeData.ts        → Lab-Items Daten
public/
  brand/               → Logos, 3D-Assets (GLB), Projekt-Cover
  fonts/               → Self-hosted Syne (woff2)
  yves-simon-schenker-cv.pdf
```

## Working Rules
- **Vor jedem Edit**: relevante Dateien LESEN
- **Minimale Changes**: keine spekulativen Features
- **Dark premium identity** bewahren — aber von generisch zu präzise migrieren
- **Responsive**: Mobile-first, 320px bis 1920px+
- **Reduced-Motion**: `useReducedMotion()` Hook nutzen, statische Fallbacks
- **Progressive Enhancement**: 3D-Hero hat Fallback, WebGL-Detection
- **Code Comments**: Englisch
- **User-facing Copy**: Deutsch
- **Keine Secrets**: keine .env, Tokens, Credentials committen
- **Keine Production-Dependencies** ohne Erklärung und Freigabe hinzufügen
- **Nicht committen oder deployen** ohne ausdrückliche Anfrage

## Verification Gate (nach jeder Änderung)
```bash
npm run lint
npm test
npm run build
git diff --check
```

Für Release/Deployment zusätzlich:
```bash
npm run qa:lighthouse:mobile
npm run qa:lighthouse:desktop
npm run qa:a11y
```

## Performance Budget
- **Lighthouse Performance**: ≥ 90 (Mobile + Desktop)
- **Lighthouse Accessibility**: 100
- **Lighthouse Best Practices**: 100
- **Lighthouse SEO**: 100
- QA-Scripts nutzen Port `4174` mit `--strictPort`

## Git & Vercel Safety
- Vor Änderungen: `pwd`, `git status --short --branch`, `git remote -v`
- Feature-Branch für nicht-triviale Arbeit
- Diff kontrollieren vor Commit
- `vercel deploy` für Preview, `vercel deploy --prod` nur nach Freigabe
- Domain `ivo-tech.com` NICHT automatisch umstellen
