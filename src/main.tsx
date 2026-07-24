import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ImpressumPage } from './components/legal/ImpressumPage.tsx'
import { DatenschutzPage } from './components/legal/DatenschutzPage.tsx'
import { NotFoundPage } from './components/NotFoundPage.tsx'
import './components/legal/legal.css'

const path = window.location.pathname.replace(/\/$/, '')
const hashRoutes: Record<string, string> = {
  '/about': '#about',
  '/projects': '#selected-work',
  '/contact': '#kontakt',
  '/hiring': '#kontakt',
  '/case-studies': '#selected-work',
  '/case-studies/configurator-live': '#selected-work',
  '/case-studies/portfolio-authority-relaunch': '#selected-work',
}

let Root
if (path === '' || hashRoutes[path]) {
  if (hashRoutes[path]) {
    window.history.replaceState(null, '', `/${hashRoutes[path]}`)
  }
  Root = App
} else if (path === '/impressum') {
  Root = ImpressumPage
} else if (path === '/datenschutz') {
  Root = DatenschutzPage
} else if (path === '/resume') {
  window.location.replace('/yves-simon-schenker-cv.pdf')
  Root = App
} else {
  Root = NotFoundPage
}

document.title =
  path === '/impressum'
    ? 'Impressum — Yves Simon Schenker (Ivo)'
    : path === '/datenschutz'
      ? 'Datenschutzerklärung — Yves Simon Schenker (Ivo)'
      : path === '/resume'
        ? 'Lebenslauf — Yves Simon Schenker (Ivo)'
        : path && !hashRoutes[path]
          ? '404 — ivo-tech Portfolio'
          : 'Yves Simon Schenker (Ivo) — Full-Stack Developer mit Frontend-Fokus'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
