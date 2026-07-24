# Codex project instructions

## Scope

- Work only in `/home/ivo/projects/ivo-tech-portfolio-standalone`.
- This is the standalone portfolio repository. Do not read from or modify `/home/ivo/projects/webseite` or `/home/ivo/projects/ivo-tech-website` unless the user explicitly asks for a comparison.
- The current branch is `main`. The repository has no Git remote by design.
- The separate Vercel project is `ivo-tech-portfolio-standalone`; its stable preview URL is `https://ivo-tech-portfolio-standalone.vercel.app`.

## Project facts

- React 19 + TypeScript + Vite 8.
- Motion and Three.js are used for the interface and 3D hero. GSAP, Lenis and Supabase are not runtime dependencies.
- The site is a client-side hash SPA. Do not introduce React Router or a server-rendered architecture without an explicit request.
- The public positioning is: Yves Simon Schenker (Ivo), Full-Stack Developer mit Frontend-Fokus, Mannheim/Rhein-Neckar, open to suitable remote and hybrid roles.
- Featured work: GOALS Optimizer, Event Management Hub and DLD 3D-Konfigurator. Use only claims and links already evidenced in the repository.
- The CV is `public/yves-simon-schenker-cv.pdf`.

## Working rules

- Read the relevant files before editing. Keep changes minimal and avoid speculative features.
- Preserve the dark premium visual identity, responsive behavior, reduced-motion fallback and progressive enhancement of the 3D hero.
- Keep public GLB/glTF metadata free of local paths, build data, QA data and debug data.
- Do not add secrets, `.env` files, tokens, credentials or connection strings.
- Do not change the `ivo-tech.com` domain, Vercel project linkage, or production deployment target without explicit user approval.
- Do not add a production dependency without explaining why and asking first.
- Do not run `npm audit fix --force`; investigate dependency changes deliberately.
- Do not commit or deploy unless the user explicitly asks for that action.
- Code comments must be in English. User-facing copy is German unless the existing content requires otherwise.

## Verification gate

After JavaScript, TypeScript, CSS, content or asset changes, run:

```bash
npm run lint
npm test
npm run build
git diff --check
npm audit --omit=dev
```

For a release or deployment, also run the configured Lighthouse and accessibility gates when their tools are available:

```bash
npm run qa:lighthouse:mobile
npm run qa:lighthouse:desktop
npm run qa:a11y
```

The QA scripts use `127.0.0.1:4174` and fail if another preview already occupies that port. Verify the preview source before visual QA.

## Git and Vercel safety

Before edits, verify: `pwd`, `git status --short --branch`, and `git remote -v`.
Use a feature branch for non-trivial work. Inspect the staged diff before committing.
For Vercel, use `vercel deploy` for a preview and `vercel deploy --prod` only after explicit approval and a green verification gate.
