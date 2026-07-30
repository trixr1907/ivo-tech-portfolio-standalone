#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
# setup-animations.sh — SOTA Animation Upgrade für ivo-tech-portfolio
#
# Ausführung:  bash setup-animations.sh
# Vorher:      cd in dein Projekt-Root (wo package.json liegt)
# ═══════════════════════════════════════════════════════════════════════
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}┌─────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│  ivo-tech · SOTA Animation Upgrade      │${NC}"
echo -e "${CYAN}│  Magnetic Cards · Staggered Reveals     │${NC}"
echo -e "${CYAN}│  Spring Modals · Animated Border Glow   │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────┘${NC}"
echo ""

# ── Prüfe ob wir im Projekt-Root sind ───────────────────────────
if [ ! -f "package.json" ]; then
  echo -e "${RED}✗ package.json nicht gefunden. Bitte aus dem Projekt-Root ausführen.${NC}"
  exit 1
fi

# ── Backup bestehender Dateien ───────────────────────────────────
BACKUP_DIR=".animation-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

for f in src/components/showcase/ProjectCard.tsx src/components/showcase/ProjectModal.tsx src/App.tsx src/components/showcase/Showcase.tsx; do
  if [ -f "$f" ]; then
    mkdir -p "$BACKUP_DIR/$(dirname "$f")"
    cp "$f" "$BACKUP_DIR/$f"
  fi
done
echo -e "${GREEN}✓ Backup erstellt in ${BACKUP_DIR}${NC}"

# ── Verzeichnisse anlegen ────────────────────────────────────────
mkdir -p src/styles
mkdir -p src/hooks
echo -e "${GREEN}✓ Ordner src/styles/ und src/hooks/ angelegt${NC}"

# ── Datei 1/7: animation-system.css ──────────────────────────────
cat > src/styles/animation-system.css << 'ENDOFFILE'
/* ═══════════════════════════════════════════════════════════════════════════
   ivo-tech · SOTA Animation & Motion System
   Premium Micro-Interactions, Staggered Reveals, Glass Morphism
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Core easing curves ──────────────────────────────────────────── */
:root {
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-in-out-smooth: cubic-bezier(0.45, 0, 0.25, 1);
  --ease-spring: cubic-bezier(0.22, 1.36, 0.36, 1.08);
  --ease-fade: cubic-bezier(0.4, 0, 0.2, 1);

  --dur-instant: 120ms;
  --dur-fast: 200ms;
  --dur-base: 350ms;
  --dur-slow: 550ms;
  --dur-reveal: 700ms;

  --stagger-xs: 60ms;
  --stagger-sm: 90ms;
  --stagger-md: 120ms;
}

/* ── Reduced motion ──────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ── Keyframe library ────────────────────────────────────────────── */

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 183, 255, 0.4); }
  50%      { box-shadow: 0 0 0 8px rgba(0, 183, 255, 0); }
}

@keyframes shimmer {
  0%   { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(200%) skewX(-12deg); }
}

@keyframes borderGlow {
  0%   { --border-angle: 0deg; }
  100% { --border-angle: 360deg; }
}

@property --border-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

/* ── Staggered children ──────────────────────────────────────────── */
.animate-stagger > * {
  opacity: 0;
  animation: fadeUp var(--dur-reveal) var(--ease-out-expo) forwards;
}
.animate-stagger > *:nth-child(1) { animation-delay: 0ms; }
.animate-stagger > *:nth-child(2) { animation-delay: var(--stagger-xs); }
.animate-stagger > *:nth-child(3) { animation-delay: calc(var(--stagger-xs) * 2); }
.animate-stagger > *:nth-child(4) { animation-delay: calc(var(--stagger-xs) * 3); }
.animate-stagger > *:nth-child(5) { animation-delay: calc(var(--stagger-xs) * 4); }
.animate-stagger > *:nth-child(6) { animation-delay: calc(var(--stagger-xs) * 5); }

/* ── Scroll-triggered reveal ─────────────────────────────────────── */
.animate-reveal {
  opacity: 0;
  transform: translateY(32px);
  transition:
    opacity var(--dur-reveal) var(--ease-out-expo),
    transform var(--dur-reveal) var(--ease-out-expo);
}
.animate-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Premium glass surface ───────────────────────────────────────── */
.glass-premium {
  position: relative;
  isolation: isolate;
}
.glass-premium::before {
  content: '';
  position: absolute;
  inset: -1px;
  z-index: -1;
  border-radius: inherit;
  background: conic-gradient(
    from var(--border-angle, 0deg),
    transparent 20%,
    rgba(0, 183, 255, 0.28) 40%,
    rgba(123, 231, 255, 0.18) 60%,
    transparent 80%
  );
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-fade);
}
.glass-premium:hover::before,
.glass-premium:focus-within::before {
  opacity: 1;
  animation: borderGlow 6s linear infinite;
}

/* ── Premium focus ring ──────────────────────────────────────────── */
.focus-ring:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(5, 7, 11, 0.95),
    0 0 0 5px rgba(0, 183, 255, 0.55);
}
ENDOFFILE
echo -e "${GREEN}✓ 1/7  src/styles/animation-system.css${NC}"

# ── Datei 2/7: showcase-animations.css ────────────────────────────
cat > src/components/showcase/showcase-animations.css << 'ENDOFFILE'
/* ═══════════════════════════════════════════════════════════════════════════
   showcase-animations.css — SOTA Card + Modal Micro-Animations
   Lädt NACH showcase.css und überschreibt Animations-relevante Styles.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Card entrance ───────────────────────────────────────────────── */
.project-card {
  opacity: 0;
  transform: translateY(32px);
  transition:
    opacity var(--dur-reveal) var(--ease-out-expo),
    transform var(--dur-reveal) var(--ease-out-expo);
}
.project-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Button: premium hover ───────────────────────────────────────── */
.project-card__button {
  border: 1px solid rgba(255, 255, 255, 0.055) !important;
  transition:
    transform var(--dur-base) var(--ease-out-expo),
    border-color var(--dur-base) var(--ease-out-expo),
    box-shadow var(--dur-base) var(--ease-out-expo),
    background var(--dur-fast) var(--ease-fade) !important;
}

.project-card__button:hover {
  transform: translateY(-6px) !important;
  border-color: rgba(0, 183, 255, 0.25) !important;
  background:
    radial-gradient(circle at 82% 0%, rgba(0, 183, 255, 0.18), transparent 44%),
    linear-gradient(145deg, rgba(220, 230, 242, 0.065), rgba(220, 230, 242, 0.018)),
    rgba(11, 17, 28, 0.96) !important;
  box-shadow:
    0 32px 100px rgba(0, 0, 0, 0.4),
    0 0 70px rgba(0, 183, 255, 0.07) !important;
}

.project-card__button:focus-visible {
  outline: none !important;
  transform: translateY(-2px) !important;
  border-color: rgba(0, 183, 255, 0.55) !important;
  box-shadow:
    0 0 0 3px rgba(5, 7, 11, 0.9),
    0 0 0 5px rgba(0, 183, 255, 0.5),
    0 16px 60px rgba(0, 0, 0, 0.3) !important;
}

/* ── Media: 3-Layer Overlay ──────────────────────────────────────── */

/* Layer 0 — image */
.project-card__media img {
  filter: saturate(0.84) contrast(1.06) brightness(0.88) !important;
  transform: scale(1.015) !important;
  transition:
    transform var(--dur-slow) var(--ease-out-expo),
    filter var(--dur-slow) var(--ease-out-expo) !important;
}

.project-card__button:hover .project-card__media img,
.project-card__button:focus-visible .project-card__media img {
  filter: saturate(1) contrast(1.08) brightness(1.02) !important;
  transform: scale(1.055) !important;
}

/* Layer 1 — Scrim (Lesbarkeitsanker) */
.project-card__media::after {
  background:
    linear-gradient(180deg,
      rgba(5, 7, 11, 0.05) 0%,
      transparent 28%,
      rgba(5, 7, 11, 0.72) 78%,
      rgba(5, 7, 11, 0.88) 100%
    ),
    linear-gradient(90deg,
      rgba(0, 183, 255, 0.06) 0%,
      transparent 25%,
      transparent 75%,
      rgba(123, 231, 255, 0.06) 100%
    ) !important;
  transition: opacity var(--dur-base) var(--ease-fade) !important;
}

.project-card__button:hover .project-card__media::after {
  background:
    linear-gradient(180deg,
      rgba(5, 7, 11, 0.02) 0%,
      transparent 30%,
      rgba(5, 7, 11, 0.58) 78%,
      rgba(5, 7, 11, 0.75) 100%
    ),
    linear-gradient(90deg,
      rgba(0, 183, 255, 0.1) 0%,
      transparent 25%,
      transparent 75%,
      rgba(123, 231, 255, 0.1) 100%
    ) !important;
}

/* Layer 2 — Shimmer sweep */
.project-card__button:hover .project-card__media::before {
  content: '' !important;
  position: absolute !important;
  z-index: 3 !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: linear-gradient(
    90deg,
    transparent 30%,
    rgba(255, 255, 255, 0.03) 42%,
    rgba(255, 255, 255, 0.07) 50%,
    rgba(255, 255, 255, 0.03) 58%,
    transparent 70%
  ) !important;
  pointer-events: none !important;
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  color: transparent !important;
  font: 0/0 a !important;
  letter-spacing: 0 !important;
  backdrop-filter: none !important;
  animation: shimmer 0.85s var(--ease-in-out-smooth) forwards !important;
}

/* ── Status Badge ────────────────────────────────────────────────── */
.project-card__status {
  z-index: 4 !important;
  transition:
    transform var(--dur-base) var(--ease-out-expo),
    border-color var(--dur-base) var(--ease-out-expo),
    background var(--dur-base) var(--ease-fade),
    box-shadow var(--dur-base) var(--ease-fade) !important;
}

.project-card__button:hover .project-card__status {
  transform: translateY(-3px) !important;
  border-color: rgba(0, 183, 255, 0.5) !important;
  background: rgba(5, 7, 11, 0.82) !important;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(0, 183, 255, 0.12) !important;
}

/* ── Index number ────────────────────────────────────────────────── */
.project-card__index {
  transition:
    color var(--dur-base) var(--ease-fade),
    transform var(--dur-base) var(--ease-out-expo) !important;
}
.project-card:hover .project-card__index {
  color: rgba(243, 240, 232, 0.2) !important;
  transform: translateX(8px) !important;
}

/* ── Body ────────────────────────────────────────────────────────── */
.project-card__body {
  transition: background var(--dur-base) var(--ease-fade) !important;
}
.project-card__button:hover .project-card__body {
  background:
    radial-gradient(circle at 100% 0%, rgba(123, 231, 255, 0.12), transparent 28%),
    rgba(14, 18, 24, 0.42) !important;
}

/* Staggered children */
.project-card__eyebrow,
.project-card__title,
.project-card__problem,
.project-card__facts {
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity var(--dur-fast) var(--ease-fade),
    transform var(--dur-fast) var(--ease-out-expo);
}
.project-card.is-visible .project-card__eyebrow { opacity: 1; transform: translateY(0); transition-delay: 80ms; }
.project-card.is-visible .project-card__title   { opacity: 1; transform: translateY(0); transition-delay: 130ms; }
.project-card.is-visible .project-card__problem { opacity: 1; transform: translateY(0); transition-delay: 190ms; }
.project-card.is-visible .project-card__facts   { opacity: 1; transform: translateY(0); transition-delay: 240ms; }

.project-card__button:hover .project-card__facts {
  border-color: rgba(123, 231, 255, 0.22) !important;
  background: rgba(0, 183, 255, 0.055) !important;
}

/* ── Accent seam ─────────────────────────────────────────────────── */
.project-card__body::before {
  content: '';
  position: absolute;
  top: 1.5rem;
  bottom: 1.5rem;
  left: 0;
  width: 2px;
  background: linear-gradient(180deg, transparent, var(--accent) 40%, var(--accent) 60%, transparent);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform var(--dur-base) var(--ease-out-expo);
}
.project-card:hover .project-card__body::before,
.project-card:focus-within .project-card__body::before {
  transform: scaleY(1);
}

/* ── CTA ─────────────────────────────────────────────────────────── */
.project-card__cta {
  position: relative !important;
  overflow: hidden !important;
  transition:
    color var(--dur-fast) var(--ease-fade),
    border-color var(--dur-fast) var(--ease-fade),
    background var(--dur-fast) var(--ease-fade),
    transform var(--dur-fast) var(--ease-spring) !important;
}
.project-card__cta::before {
  content: '' !important;
  position: absolute !important;
  inset: 0 !important;
  z-index: -1 !important;
  background: linear-gradient(120deg, rgba(0, 183, 255, 0.18), rgba(123, 231, 255, 0.08)) !important;
  opacity: 0 !important;
  transition: opacity var(--dur-fast) var(--ease-fade) !important;
}
.project-card__button:hover .project-card__cta::before { opacity: 1 !important; }
.project-card__button:hover .project-card__cta {
  transform: translateY(-1px) !important;
  border-color: rgba(123, 231, 255, 0.45) !important;
}
.project-card__cta svg,
.project-card__cta--more svg {
  transition: transform var(--dur-base) var(--ease-out-expo) !important;
}
.project-card__button:hover .project-card__cta svg {
  transform: translateX(4px) translateY(-1px) !important;
}
.project-card__cta--more:hover svg { transform: translateX(6px) !important; }
.project-card__cta--more {
  transition:
    color var(--dur-fast) var(--ease-fade),
    transform var(--dur-fast) var(--ease-spring) !important;
}
.project-card__cta--more:hover {
  color: var(--white) !important;
  transform: translateX(4px) !important;
}

/* ── Metric cards ────────────────────────────────────────────────── */
.project-card__metric { transition: background var(--dur-fast) var(--ease-fade) !important; }
.project-card__metric:hover { background: rgba(16, 21, 28, 0.95) !important; }
.project-card__highlight { transition: background var(--dur-fast) var(--ease-fade) !important; }
.project-card__highlight:hover { background: rgba(18, 23, 29, 0.98) !important; }

/* ══════════════════════════════════════════════════════════════════════
   MODAL
   ══════════════════════════════════════════════════════════════════════ */

.project-modal__dialog::before {
  content: '';
  position: absolute;
  inset: -1px;
  z-index: -1;
  border-radius: inherit;
  padding: 1px;
  background: conic-gradient(
    from var(--border-angle, 0deg),
    transparent 15%,
    rgba(0, 183, 255, 0.22) 35%,
    rgba(123, 231, 255, 0.14) 55%,
    transparent 85%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  animation: borderGlow 8s linear infinite;
  transition: opacity var(--dur-slow) var(--ease-fade);
  pointer-events: none;
}
.project-modal.is-open .project-modal__dialog::before { opacity: 1; }

.project-modal__close:hover,
.project-modal__close:focus-visible {
  transform: translateY(-2px) rotate(90deg) !important;
}

.project-modal__toc button {
  position: relative !important;
  overflow: hidden !important;
  transition:
    color 160ms ease, border-color 160ms ease,
    background 160ms ease, transform 160ms var(--ease-spring) !important;
}
.project-modal__toc button::before {
  content: '' !important;
  position: absolute !important;
  inset: 0 !important;
  background: rgba(123, 231, 255, 0.18) !important;
  opacity: 0 !important;
  transition: opacity 160ms ease !important;
}
.project-modal__toc button:hover,
.project-modal__toc button:focus-visible {
  transform: translateY(-1px) !important;
  outline: none !important;
}
.project-modal__toc button:hover::before,
.project-modal__toc button:focus-visible::before { opacity: 1 !important; }

.project-modal__shots figure {
  transition:
    transform var(--dur-fast) var(--ease-out-expo),
    background var(--dur-fast) var(--ease-fade),
    box-shadow var(--dur-fast) var(--ease-fade) !important;
}
.project-modal__shots figure:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.4) !important;
}
.project-modal__shots figure:focus-visible {
  outline: 2px solid rgba(123, 231, 255, 0.8) !important;
  outline-offset: 3px !important;
  transform: translateY(-4px) !important;
}

.project-modal__links a {
  position: relative !important;
  overflow: hidden !important;
  transition:
    transform var(--dur-fast) var(--ease-spring),
    box-shadow var(--dur-fast) var(--ease-fade) !important;
}
.project-modal__links a::after {
  content: '' !important;
  position: absolute !important;
  inset: 0 !important;
  background: linear-gradient(130deg, rgba(255, 255, 255, 0.3), transparent) !important;
  opacity: 0 !important;
  transition: opacity var(--dur-fast) var(--ease-fade) !important;
}
.project-modal__links a:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 12px 30px rgba(0, 183, 255, 0.25) !important;
}
.project-modal__links a:hover::after { opacity: 1 !important; }

.relaunch-project-card .project-card__button:hover {
  transform: none !important;
  box-shadow: none !important;
}

@media (max-width: 760px) {
  .project-card__body::before { display: none !important; }
}
ENDOFFILE
echo -e "${GREEN}✓ 2/7  src/components/showcase/showcase-animations.css${NC}"

# ── Datei 3/7: useScrollReveal.ts ─────────────────────────────────
cat > src/hooks/useScrollReveal.ts << 'ENDOFFILE'
import { useEffect, useRef, useState, type RefObject } from 'react'

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: {
    threshold?: number
    rootMargin?: string
    once?: boolean
  } = {},
): [RefObject<T | null>, boolean] {
  const { threshold = 0.1, rootMargin = '0px 0px -40px 0px', once = true } = options
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, isVisible]
}
ENDOFFILE
echo -e "${GREEN}✓ 3/7  src/hooks/useScrollReveal.ts${NC}"

# ── Datei 4/7: App.tsx Patch (eine Import-Zeile) ─────────────────
# Fügt import './styles/animation-system.css' nach import './relaunch.css' ein
if grep -q "animation-system.css" src/App.tsx; then
  echo -e "${CYAN}  → App.tsx bereits gepatcht, überspringe${NC}"
else
  sed -i "s|^import './relaunch.css'|import './relaunch.css'\nimport './styles/animation-system.css'|" src/App.tsx
  echo -e "${GREEN}✓ 4/7  src/App.tsx (+1 Import)${NC}"
fi

# ── Datei 5/7: Showcase.tsx Patch (eine Import-Zeile) ─────────────
if grep -q "showcase-animations.css" src/components/showcase/Showcase.tsx; then
  echo -e "${CYAN}  → Showcase.tsx bereits gepatcht, überspringe${NC}"
else
  sed -i "s|^import './showcase.css'|import './showcase.css'\nimport './showcase-animations.css'|" src/components/showcase/Showcase.tsx
  echo -e "${GREEN}✓ 5/7  src/components/showcase/Showcase.tsx (+1 Import)${NC}"
fi

# ── Datei 6/7: ProjectCard.tsx (komplett ersetzen) ────────────────
cat > src/components/showcase/ProjectCard.tsx << 'ENDOFFILE'
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
ENDOFFILE
echo -e "${GREEN}✓ 6/7  src/components/showcase/ProjectCard.tsx${NC}"

# ── Datei 7/7: ProjectModal.tsx (komplett ersetzen) ───────────────
cat > src/components/showcase/ProjectModal.tsx << 'ENDOFFILE'
import { useCallback, useEffect, useRef, useState } from 'react'
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

  const tocSections = [
    { id: 'overview', label: 'Überblick' },
    project.signals ? { id: 'signals', label: 'Signale' } : null,
    project.architecture ? { id: 'architecture', label: 'Architektur' } : null,
    project.fileStates ? { id: 'flächen', label: 'Flächen' } : null,
    { id: 'highlights', label: 'Highlights' },
    project.trustChecks || project.impact ? { id: 'trust', label: 'Betrieb' } : null,
    { id: 'gallery', label: 'Screens' },
  ].filter((s): s is { id: string; label: string } => s !== null)

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
  }, [])

  const scrollToSection = useCallback((id: string) => {
    bodyRef.current?.querySelector<HTMLElement>(`[data-toc-section="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const hasLinks = Boolean(project.links.demo || project.links.repo)

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
                <button key={s.id} type="button" className={activeToc === s.id ? 'is-active' : undefined}
                  onClick={() => scrollToSection(s.id)}>{s.label}</button>
              ))}
            </nav>
            <header className="project-modal__hero">
              <div className="project-modal__hero-media"
                style={{ '--modal-panel-label': `'${project.status === 'lab-prototype' ? 'Lab Prototype' : 'Live Demo'}'` } as React.CSSProperties}>
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
                    <figcaption><span className="project-modal__shot-label">{project.status === 'lab-prototype' ? 'Lab Prototype Screenshot' : 'Live Demo Screenshot'}</span>{sc.caption}</figcaption>
                  </figure>))}
              </div>
            </section>
            <footer className="project-modal__footer">
              {project.result ? <p className="project-modal__result">{project.result}</p> : null}
              {hasLinks ? (
                <div className="project-modal__links">
                  {project.links.demo ? (<a href={project.links.demo} target="_blank" rel="noopener noreferrer">Live Demo öffnen ↗</a>) : null}
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
ENDOFFILE
echo -e "${GREEN}✓ 7/7  src/components/showcase/ProjectModal.tsx${NC}"

# ── Fertig ────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}┌─────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│  ✅  Alle 7 Dateien installiert!         │${NC}"
echo -e "${CYAN}│  Backup: ${BACKUP_DIR}  │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────┘${NC}"
echo ""
echo -e "Nächster Schritt:"
echo -e "  ${GREEN}npm run build${NC}     → TypeScript + Vite prüfen"
echo -e "  ${GREEN}npm run dev${NC}       → lokal testen"
echo -e "  ${GREEN}git add -A && git commit -m 'SOTA Animation Upgrade' && git push${NC}"
echo ""
